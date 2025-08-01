import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@xyflow/react';
import { Label } from './Label';
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
  selected,
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
        stroke: '#4caf50',
        ...style,
        strokeWidth: selected ? 3 : 2,
      }}
      path={edgePath}
      className="cursor-pointer"
      markerEnd={markerEnd}
    />
    <EdgeLabelRenderer>
      <Label
        id={id}
        data={data}
        labelX={labelX}
        labelY={labelY}
        style={style}
      ></Label>
    </EdgeLabelRenderer>
  </>
  );
}