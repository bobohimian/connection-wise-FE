import { BaseEdge, getSmoothStepPath } from '@xyflow/react';

export default function PolylineEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  _markerEnd,
  selected,
}) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <BaseEdge
      id={id}
      style={{
        stroke: '#f44336',
        ...style,
        strokeWidth: selected ? 3 : 2,
      }}
      path={edgePath}
    >
    </BaseEdge>
  );
}