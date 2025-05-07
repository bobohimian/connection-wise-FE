import React from 'react';
import CurveEdge from './CurvedEdge'
import StraightEdge from './StraightEdge'
import PolylineEdge from './PolylineEdge'
import { v4 as uuidv4 } from 'uuid';
const edgeTypes = {
    curvedEdge: CurveEdge,
    straightEdge: StraightEdge,
    polylineEdge: PolylineEdge
}
const defaultEdgeOption = {
    type: 'curvedEdge',
    animated: true
}
const createEdge = (connection) => {
    connection.id = uuidv4()
    connection.data = connection.data || {
        label: ""
    }
    return connection
}
export {
    edgeTypes,
    defaultEdgeOption,
    createEdge
}