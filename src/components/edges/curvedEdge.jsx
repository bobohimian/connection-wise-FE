import { BaseEdge, EdgeLabelRenderer, getBezierPath, useStoreApi } from "@xyflow/react";
export default function CurvedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style = {},
  markerEnd,
  selected
}) {
  const [edgePath, labelX, labelY] = getBezierPath({
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
        stroke: "#4caf50",
        ...style,
        strokeWidth: selected ? 3 : 2,
      }}
      path={edgePath}
    />
    <EdgeLabelRenderer>
      <p
        style={{
          transform: `translate(${labelX}px, ${labelY}px)`,
          fontSize: "12px",
          fontWeight: "bold",
          color: style?.stroke?style.stroke:"#4caf50",
        }}
        className={`absolute -translate-1/2 pointer-events-auto nodrag nopan`}
      >{data?.relationship}</p>
    </EdgeLabelRenderer>
  </>
  );
}