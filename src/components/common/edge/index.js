import { v4 as uuidv4 } from 'uuid';
import CurveEdge from './CurvedEdge';
import PolylineEdge from './PolylineEdge';
import StraightEdge from './StraightEdge';
const edgeTypes = {
  curvedEdge: CurveEdge,
  straightEdge: StraightEdge,
  polylineEdge: PolylineEdge,
};
const defaultEdgeOption = {
  type: 'curvedEdge',
  animated: true,
};
const createEdge = (connection) => {
  connection.id = uuidv4();
  connection.data = connection.data || {
    label: '',
  };
  connection.version=1;
  return connection;
};
export {
  edgeTypes,
  defaultEdgeOption,
  createEdge,
};