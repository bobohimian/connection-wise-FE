import { getFlowData } from "./flow.service";
import { login,checkSession,logout } from "./login.service";
const apiService = {
    getFlowData,
    login,
    logout,
    checkSession
};
export default apiService;