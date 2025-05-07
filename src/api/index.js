import {
    fetchCanvasList,
    fetchCanvas,
    createCanvas,
    updateCanvas,
    deleteCanvas
} from "./canvas.service.js";

import {
    login,
    checkSession,
    logout,
    register
} from "./user.service.js";

import {
    generateGraph
} from "./ai.service.js"

const apiService = {
    fetchCanvasList,
    fetchCanvas,
    createCanvas,
    updateCanvas,
    deleteCanvas,
    generateGraph,
    login,
    logout,
    checkSession,
    register
};
export default apiService;