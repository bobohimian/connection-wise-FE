import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    id: null,
    permission: '',
    nodes: [],
    edges: [],
};


const canvasSlice = createSlice({
    name: 'canvas',
    initialState,
    reducers: {
        setCanvasId: (state, action) => {
            state.canvasId = action.payload;
        },
        setCanvas: (state, action) => {
            const { id, permission, nodes, edges } = action.payload;
            state.id = id;
            state.permission = permission;
            state.nodes = nodes;
            state.edges = edges;
        },
        setPermission: (state, action) => {
            state.permission = action.payload;
        },
        clearCanvas: (state) => {
            state.canvasId = null;
            state.permission = '';
        },
    },
});
export const selectCanvas = (state) => state.canvas;
export const { setCanvasId, setPermission, clearCanvas, setCanvas } = canvasSlice.actions;
export default canvasSlice.reducer;
