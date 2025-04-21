import { getFlowData } from "./flow.service.js";
import { login,checkSession,logout } from "./login.service.js";
const apiService = {
    getFlowData,
    login,
    logout,
    checkSession
};
export default apiService;