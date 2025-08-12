import { useSelector } from 'react-redux';
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
export const usePermission = (requiredPermission) => {
    const currentPermission = useSelector(state => state.canvas.permission);
    const currentLevel = PERMISSION_LEVEL[currentPermission] || 0;
    const requiredLevel = PERMISSION_LEVEL[requiredPermission];
    const hasPermission = currentLevel >= requiredLevel;
    return hasPermission;
};
