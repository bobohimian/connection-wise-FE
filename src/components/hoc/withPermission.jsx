import store from '../../store/index'; // 导入 Redux store

const PERMISSION = {
    VIEW: 'view',
    EDIT: 'edit',// 包含view
    OWNER: 'owner', // 包含view,edit
};
const PERMISSION_LEVEL = {
    [PERMISSION.VIEW]: 1,
    [PERMISSION.EDIT]: 2,
    [PERMISSION.OWNER]: 3,
};
const checkPermission = (requiredPermission) => {
    const currentState = store.getState();
    const currentPermission = currentState.canvas.permission;
    const currentLevel = PERMISSION_LEVEL[currentPermission];
    const requiredLevel = PERMISSION_LEVEL[requiredPermission];
    // console.log(currentLevel, requiredLevel);
    if (currentLevel >= requiredLevel) {
        return true;
    }
    return false;
};
/**
 * 权限控制高阶函数
 * @param {Function} func
 * @param {string} requiredPermission 
 * @returns {Function}
 */
const withPermission = (func, requiredPermission) => {
    if (!Object.values(PERMISSION).includes(requiredPermission))
        throw new Error(`未知权限类型: ${requiredPermission}`);
    return (...args) => {
        if (checkPermission(requiredPermission)) {
            return func(...args);
        }
    };
};
const WithPermissionWrapper = (Component, requiredPermission) => {
    if (!Object.values(PERMISSION).includes(requiredPermission))
        throw new Error(`未知权限类型: ${requiredPermission}`);
    return function PermissionWrapper(props) {
        const hasPermission = checkPermission(requiredPermission);
        console.log(hasPermission);
        if (!hasPermission) {
            return null;
        }
        return <Component {...props} />;
    };
};
export { withPermission, WithPermissionWrapper };