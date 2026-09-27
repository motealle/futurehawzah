import type { CSSProperties } from 'react';
import type { Edge, Node } from '@xyflow/react';

type NodePatch = {
  data?: Record<string, unknown>;
  style?: CSSProperties;
};

type EdgePatch = {
  label?: string;
  animated?: boolean;
  data?: Record<string, unknown>;
  style?: CSSProperties;
};

type Props = {
  node: Node | null;
  edge: Edge | null;
  onPatchNode: (id: string, patch: NodePatch) => void;
  onPatchEdge: (id: string, patch: EdgePatch) => void;
};

export default function Inspector({ node, edge, onPatchNode, onPatchEdge }: Props) {
  if (edge) {
    const data = (edge.data ?? {}) as Record<string, unknown>;
    const label = typeof edge.label === 'string' ? edge.label : '';
    const stroke = String(edge.style?.stroke ?? '#b62770');
    const strokeWidth = Number(edge.style?.strokeWidth ?? 2);
    const kind = String(data.kind ?? 'cross');
    const evidence = String(data.evidence ?? '');
    const verified = Boolean(data.verified);

    return (
      <aside className="inspector">
        <span className="inspector__eyebrow">ویرایشگر رابطه</span>
        <h2>{label || 'رابطه بدون برچسب'}</h2>

        <label>
          برچسب رابطه
          <textarea
            value={label}
            rows={3}
            onChange={(event) => onPatchEdge(edge.id, { label: event.target.value })}
          />
        </label>

        <label>
          شاهد / یادداشت پژوهشی
          <textarea
            value={evidence}
            rows={4}
            placeholder="متن شاهد، صفحه منبع یا توضیح اعتبار رابطه"
            onChange={(event) => onPatchEdge(edge.id, { data: { evidence: event.target.value } })}
          />
        </label>

        <div className="inspector__grid">
          <label>
            رنگ خط
            <input
              type="color"
              value={stroke}
              onChange={(event) => onPatchEdge(edge.id, { style: { stroke: event.target.value } })}
            />
          </label>
          <label>
            ضخامت
            <input
              type="number"
              min="1"
              max="12"
              step="0.5"
              value={strokeWidth}
              onChange={(event) => onPatchEdge(edge.id, { style: { strokeWidth: Number(event.target.value) } })}
            />
          </label>
        </div>

        <label>
          نوع رابطه
          <select
            value={kind}
            onChange={(event) => onPatchEdge(edge.id, { data: { kind: event.target.value } })}
          >
            <option value="hierarchy">درون‌خوشه‌ای</option>
            <option value="cross">متقاطع</option>
            <option value="reinforces">تقویت‌کننده</option>
            <option value="inhibits">بازدارنده</option>
            <option value="possible_effect">اثر احتمالی</option>
          </select>
        </label>

        <label className="inspector__check">
          <input
            type="checkbox"
            checked={Boolean(edge.animated)}
            onChange={(event) => onPatchEdge(edge.id, { animated: event.target.checked })}
          />
          <span>حرکت روی خط فعال باشد</span>
        </label>

        <label className="inspector__check">
          <input
            type="checkbox"
            checked={verified}
            onChange={(event) => onPatchEdge(edge.id, { data: { verified: event.target.checked } })}
          />
          <span>رابطه پژوهشی تأیید شده است</span>
        </label>

        <div className="inspector__meta">
          <span>شناسه یال</span>
          <code dir="ltr">{edge.id}</code>
        </div>
      </aside>
    );
  }

  if (!node) {
    return (
      <aside className="inspector inspector--empty">
        <span className="inspector__eyebrow">ویرایشگر</span>
        <h2>یک گره یا رابطه را انتخاب کنید</h2>
        <p>متن، رنگ و اندازه گره‌ها و همچنین برچسب، رنگ و ضخامت رابطه‌ها از اینجا قابل تغییر است.</p>
      </aside>
    );
  }

  const data = node.data as Record<string, unknown>;
  const label = String(data.label ?? '');
  const color = String(data.color ?? '#5060ff');
  const textSize = Number(data.textSize ?? 14);
  const width = Number(node.style?.width ?? 180);
  const height = Number(node.style?.height ?? 72);

  return (
    <aside className="inspector">
      <span className="inspector__eyebrow">ویرایشگر گره</span>
      <h2>{label}</h2>

      <label>
        متن
        <textarea
          value={label}
          rows={3}
          onChange={(event) => onPatchNode(node.id, { data: { label: event.target.value } })}
        />
      </label>

      <div className="inspector__grid">
        <label>
          رنگ
          <input
            type="color"
            value={color}
            onChange={(event) => onPatchNode(node.id, { data: { color: event.target.value } })}
          />
        </label>
        <label>
          اندازه متن
          <input
            type="number"
            min="10"
            max="42"
            value={textSize}
            onChange={(event) => onPatchNode(node.id, { data: { textSize: Number(event.target.value) } })}
          />
        </label>
        <label>
          عرض
          <input
            type="number"
            min="120"
            max="420"
            value={width}
            onChange={(event) => onPatchNode(node.id, { style: { width: Number(event.target.value) } })}
          />
        </label>
        <label>
          ارتفاع
          <input
            type="number"
            min="56"
            max="260"
            value={height}
            onChange={(event) => onPatchNode(node.id, { style: { height: Number(event.target.value) } })}
          />
        </label>
      </div>

      <div className="inspector__meta">
        <span>شناسه گره</span>
        <code dir="ltr">{node.id}</code>
      </div>
    </aside>
  );
}
