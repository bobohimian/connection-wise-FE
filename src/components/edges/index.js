import CurveEdge from './curvedEdge'
import StraightEdge from './straightEdge'
import PolylineEdge from './PolylineEdge' 
export const edgeTypes = {
    curvedEdge: CurveEdge,
    straightEdge: StraightEdge,
    polylineEdge: PolylineEdge
}
export const defaultEdgeOption={
    type: 'curvedEdge',
    animated:true
}