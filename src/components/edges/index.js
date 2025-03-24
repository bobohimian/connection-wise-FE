import CurveEdge from './CurvedEdge'
import StraightEdge from './StraightEdge'
import PolylineEdge from './PolylineEdge' 
import { v4 as uuidv4 } from 'uuid';
export const edgeTypes = {
    curvedEdge: CurveEdge,
    straightEdge: StraightEdge,
    polylineEdge: PolylineEdge
}
export const defaultEdgeOption={
    type: 'curvedEdge',
    animated:true
}
export const createEdge = (connection) => {
    connection.id=uuidv4()
    return connection
}