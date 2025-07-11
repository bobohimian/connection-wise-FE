import { BaseEdge, getStraightPath } from '@xyflow/react';

export default function StraightEdge({
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
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  return (<>
    <BaseEdge
      id={id}
      style={{
        stroke: '#34efff',
        ...style,
        strokeWidth: selected ? 3 : 2,
      }}
      path={edgePath}
    />123
  </>
  );
}