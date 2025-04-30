import { fetchCanvasList,fetchCanvas } from "./flow.service.js";
import { login,checkSession,logout } from "./login.service.js";
const apiService = {
    fetchCanvasList,
    fetchCanvas,
    login,
    logout,
    checkSession
};
export default apiService;