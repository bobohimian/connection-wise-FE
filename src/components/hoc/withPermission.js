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
        const currentState = store.getState();
        const currentPermission = currentState.user.permission;
        const currentLevel = PERMISSION_LEVEL[currentPermission];
        const requiredLevel = PERMISSION_LEVEL[requiredPermission];
        if (currentLevel === requiredLevel) {
            return func(...args);
        }
    };
};
export { withPermission };