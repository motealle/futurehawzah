import type { CSSProperties } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

export default function TrendNode({ data, selected }: NodeProps) {
  const level = String(data.level ?? 'trend');
  const color = String(data.color ?? '#5060ff');
  const label = String(data.label ?? '');
  const textSize = Number(data.textSize ?? 14);

  return (
    <div
      className={`trend-node trend-node--${level} ${selected ? 'is-selected' : ''}`}
      style={{ '--node-color': color } as CSSProperties}
    >
      <Handle type="target" position={Position.Top} id="t" className="node-handle" />
      <Handle type="target" position={Position.Left} id="l" className="node-handle" />
      <span className="node-aura" aria-hidden="true" />
      <span className="node-kicker">
        {level === 'core' ? 'هسته' : level === 'macro' ? 'کلان‌روند' : 'روند'}
      </span>
      <strong style={{ fontSize: `${textSize}px` }}>{label}</strong>
      <Handle type="source" position={Position.Right} id="r" className="node-handle" />
      <Handle type="source" position={Position.Bottom} id="b" className="node-handle" />
    </div>
  );
}
