import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  reconnectEdge,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node
} from '@xyflow/react';
import { toPng, toSvg } from 'html-to-image';
import gsap from 'gsap';
import Inspector from './components/Inspector';
import TrendNode from './components/TrendNode';
import { createInitialGraph } from './data/graph';
import { elkLayout } from './lib/layout';

const STORAGE_KEY = 'fsinfo-layout-v0.2';
const VERSION_KEY = 'fsinfo-layout-versions-v0.2';
const MAX_LOCAL_VERSIONS = 10;
const initial = createInitialGraph();

type LayoutSnapshot = {
  version: string;
  savedAt: string;
  nodes: Node[];
  edges: Edge[];
};

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initial.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initial.edges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [showCross, setShowCross] = useState(true);
  const [busy, setBusy] = useState(false);
  const [versionCount, setVersionCount] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const importRef = useRef<HTMLInputElement>(null);
  
  const nodeTypes = useMemo(() => ({ trend: TrendNode }), []);
  const selectedNode = nodes.find((node) => node.id === selectedNodeId) ?? null;
  const selectedEdge = edges.find((edge) => edge.id === selectedEdgeId) ?? null;
  const visibleEdges = useMemo(
    () => edges.filter((edge) => showCross || edge.data?.kind !== 'cross'),
    [edges, showCross]
  );

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as { nodes?: Node[]; edges?: Edge[] };
      if (parsed.nodes?.length) setNodes(parsed.nodes);
      if (parsed.edges?.length) setEdges(parsed.edges);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [setEdges, setNodes]);

  useEffect(() => {
    try {
      const versions = JSON.parse(localStorage.getItem(VERSION_KEY) ?? '[]') as LayoutSnapshot[];
      setVersionCount(Array.isArray(versions) ? versions.length : 0);
    } catch {
      localStorage.removeItem(VERSION_KEY);
      setVersionCount(0);
    }
  }, []);

  useEffect(() => {
    gsap.fromTo(
      '.trend-node--core .node-aura',
      { scale: 0.82, opacity: 0.25 },
      { scale: 1.16, opacity: 0.72, duration: 2.2, repeat: -1, yoyo: true, ease: 'sine.inOut' }
    );
  }, []);

  const patchNode = useCallback(
    (id: string, patch: { data?: Record<string, unknown>; style?: CSSProperties }) => {
      setNodes((current) =>
        current.map((node) =>
          node.id === id
            ? {
                ...node,
                data: { ...node.data, ...(patch.data ?? {}) },
                style: { ...node.style, ...(patch.style ?? {}) }
              }
            : node
        )
      );
    },
    [setNodes]
  );

  const patchEdge = useCallback(
    (id: string, patch: { label?: string; animated?: boolean; data?: Record<string, unknown>; style?: CSSProperties }) => {
      setEdges((current) =>
        current.map((edge) => {
          if (edge.id !== id) return edge;
          return {
            ...edge,
            ...(patch.label !== undefined ? { label: patch.label } : {}),
            ...(patch.animated !== undefined ? { animated: patch.animated } : {}),
            data: { ...(edge.data ?? {}), ...(patch.data ?? {}) },
            style: { ...edge.style, ...(patch.style ?? {}) }
          };
        })
      );
    },
    [setEdges]
  );

  const saveLayout = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: '0.2.0', nodes, edges }));
  }, [edges, nodes]);

  const saveVersion = useCallback(() => {
    let versions: LayoutSnapshot[] = [];
    try {
      const parsed = JSON.parse(localStorage.getItem(VERSION_KEY) ?? '[]') as LayoutSnapshot[];
      versions = Array.isArray(parsed) ? parsed : [];
    } catch {
      versions = [];
    }

    const snapshot: LayoutSnapshot = {
      version: '0.2.0',
      savedAt: new Date().toISOString(),
      nodes,
      edges
    };
    const next = [snapshot, ...versions].slice(0, MAX_LOCAL_VERSIONS);
    localStorage.setItem(VERSION_KEY, JSON.stringify(next));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    setVersionCount(next.length);
  }, [edges, nodes]);

  const restoreLatestVersion = useCallback(() => {
    try {
      const versions = JSON.parse(localStorage.getItem(VERSION_KEY) ?? '[]') as LayoutSnapshot[];
      const latest = Array.isArray(versions) ? versions[0] : undefined;
      if (!latest?.nodes?.length || !latest?.edges?.length) return;
      setNodes(latest.nodes);
      setEdges(latest.edges);
      setSelectedNodeId(null);
      setSelectedEdgeId(null);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(latest));
    } catch {
      localStorage.removeItem(VERSION_KEY);
      setVersionCount(0);
    }
  }, [setEdges, setNodes]);

  const resetLayout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    const fresh = createInitialGraph();
    setNodes(fresh.nodes);
    setEdges(fresh.edges);
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  }, [setEdges, setNodes]);

  const autoArrange = useCallback(async () => {
    setBusy(true);
    try {
      setNodes(await elkLayout(nodes, edges));
    } finally {
      setBusy(false);
    }
  }, [edges, nodes, setNodes]);

  const exportJson = useCallback(() => {
    const blob = new Blob([JSON.stringify({ version: '0.2.0', nodes, edges }, null, 2)], {
      type: 'application/json;charset=utf-8'
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'fsinfo-layout.json';
    link.click();
    URL.revokeObjectURL(link.href);
  }, [edges, nodes]);

  const importJson = useCallback(
    async (file: File) => {
      const parsed = JSON.parse(await file.text()) as { nodes?: Node[]; edges?: Edge[] };
      if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges) || parsed.nodes.length === 0) {
        throw new Error('invalid-layout');
      }
      setNodes(parsed.nodes);
      setEdges(parsed.edges);
      setSelectedNodeId(null);
      setSelectedEdgeId(null);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: '0.2.0', nodes: parsed.nodes, edges: parsed.edges }));
    },
    [setEdges, setNodes]
  );

  const exportSvg = useCallback(async () => {
    if (!stageRef.current) return;
    setBusy(true);
    try {
      const dataUrl = await toSvg(stageRef.current, {
        cacheBust: true,
        backgroundColor: '#f3f3e8'
      });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'fsinfo-map.svg';
      link.click();
    } finally {
      setBusy(false);
    }
  }, []);

  const exportPng = useCallback(async () => {
    if (!stageRef.current) return;
    setBusy(true);
    try {
      const dataUrl = await toPng(stageRef.current, {
        cacheBust: true,
        pixelRatio: 2.5,
        backgroundColor: '#f3f3e8'
      });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'fsinfo-map.png';
      link.click();
    } finally {
      setBusy(false);
    }
  }, []);

  return (
    <main className="app-shell" dir="rtl">
      <header className="hero">
        <div>
          <span className="hero__eyebrow">FSInfo · آینده‌پژوهی تعاملی</span>
          <h1>نقشه کلان‌روندهای آینده حوزه‌های علمیه</h1>
          <p>نسخهٔ اولیهٔ ویرایش‌پذیر؛ موقعیت گره‌ها، متن، رنگ و اندازه قابل اصلاح و ذخیره است.</p>
        </div>
        <div className="hero__status">
          <span className="status-dot" />
          <strong>نسخه 0.2</strong>
          <small>Editable prototype</small>
        </div>
      </header>

      <section className="workspace">
        <div className="graph-card" ref={stageRef}>
          <ReactFlow
            nodes={nodes}
            edges={visibleEdges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={(_, node) => {
              setSelectedNodeId(node.id);
              setSelectedEdgeId(null);
            }}
            onEdgeClick={(_, edge) => {
              setSelectedEdgeId(edge.id);
              setSelectedNodeId(null);
            }}
            onPaneClick={() => {
              setSelectedNodeId(null);
              setSelectedEdgeId(null);
            }}
            fitView
            minZoom={0.08}
            maxZoom={2.2}
            defaultEdgeOptions={{ selectable: true }}
            onReconnect={(oldEdge, newConnection) => {
              setEdges((current) => reconnectEdge(oldEdge, newConnection, current));
            }}
          >
            <Background color="#b9bda7" gap={28} size={0.7} variant={BackgroundVariant.Dots} />
            <MiniMap pannable zoomable className="minimap" />
            <Controls position="bottom-left" />
            <Panel position="top-left" className="map-legend">
              <span><i className="legend-line legend-line--solid" />رابطه درون‌خوشه‌ای</span>
              <span><i className="legend-line legend-line--flow" />اثر متقاطع اولیه</span>
            </Panel>
          </ReactFlow>
        </div>

        <Inspector node={selectedNode} edge={selectedEdge} onPatchNode={patchNode} onPatchEdge={patchEdge} />
      </section>

      <nav className="command-bar" aria-label="ابزارهای ویرایش">
        <button onClick={saveLayout}>ذخیره فوری</button>
        <button onClick={saveVersion}>ذخیره نسخه <span className="version-badge">{versionCount}</span></button>
        <button onClick={restoreLatestVersion} disabled={versionCount === 0}>بازیابی آخرین نسخه</button>
        <button onClick={autoArrange} disabled={busy}>چیدمان خودکار</button>
        <button onClick={() => setShowCross((value) => !value)}>
          {showCross ? 'پنهان‌کردن روابط متقاطع' : 'نمایش روابط متقاطع'}
        </button>
        <button onClick={() => importRef.current?.click()}>ورود JSON</button>
        <input
          ref={importRef}
          className="visually-hidden"
          type="file"
          accept="application/json,.json"
          onChange={async (event) => {
            const file = event.currentTarget.files?.[0];
            if (!file) return;
            try {
              await importJson(file);
            } finally {
              event.currentTarget.value = '';
            }
          }}
        />
        <button onClick={exportJson}>خروجی JSON</button>
        <button onClick={exportSvg} disabled={busy}>خروجی SVG</button>
        <button className="button--primary" onClick={exportPng} disabled={busy}>خروجی PNG</button>
        <button className="button--ghost" onClick={resetLayout}>بازنشانی</button>
      </nav>

      <footer className="app-footer">
        <span>فونت: Sahel / Vazirmatn · نسخه‌های محلی: {versionCount}</span>
        <span>وضعیت داده: taxonomy اولیه؛ روابط متقاطع تا ثبت شاهد و تأیید پژوهشی قطعی نیستند.</span>
      </footer>
    </main>
  );
}
