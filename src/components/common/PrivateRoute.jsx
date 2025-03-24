import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/slices/user';

const PrivateRoute = ({ children }) => {
  const userGlobalState = useSelector(selectUser);
  const isAuthenticated = userGlobalState.isAuthenticated;

  // 如果未登录，跳转到登录页
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // 已登录，展示组件
  return children;
};

export default PrivateRoute;