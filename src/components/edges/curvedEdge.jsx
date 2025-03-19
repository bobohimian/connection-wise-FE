import { BaseEdge, getBezierPath, useStoreApi } from "@xyflow/react";
export default function CurvedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected
}) {
  const [edgePath] = getBezierPath({
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
        stroke: "#4caf50",
        ...style,
        strokeWidth: selected ? 3 : 2,
      }}
      path={edgePath}
    />
  );
}