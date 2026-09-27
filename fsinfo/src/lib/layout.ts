import ELK from 'elkjs/lib/elk.bundled.js';
import type { Edge, Node } from '@xyflow/react';

const elk = new ELK();

type ElkPosition = {
  id: string;
  x?: number;
  y?: number;
};

export async function elkLayout(nodes: Node[], edges: Edge[]): Promise<Node[]> {
  const graph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': 'RIGHT',
      'elk.spacing.nodeNode': '54',
      'elk.layered.spacing.nodeNodeBetweenLayers': '110',
      'elk.edgeRouting': 'SPLINES',
      'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX'
    },
    children: nodes.map((node) => ({
      id: node.id,
      width: Number(node.style?.width ?? 180),
      height: Number(node.style?.height ?? 72)
    })),
    edges: edges
      .filter((edge) => edge.data?.kind !== 'cross')
      .map((edge) => ({ id: edge.id, sources: [edge.source], targets: [edge.target] }))
  };

  const result = (await elk.layout(graph as never)) as unknown as { children?: ElkPosition[] };
  const lookup = new Map((result.children ?? []).map((item) => [item.id, item]));

  return nodes.map((node) => {
    const item = lookup.get(node.id);
    if (!item) return node;
    return {
      ...node,
      position: {
        x: item.x ?? node.position.x,
        y: item.y ?? node.position.y
      }
    };
  });
}
