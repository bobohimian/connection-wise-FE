import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setAuthenticated, setUserInfo } from '../../store/slices/user';
import apiService from '../../api';
const PrivateRoute = ({ children }) => {

  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const userGlobalState = useSelector(selectUser);
  const isAuthenticated = userGlobalState.isAuthenticated;

  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = (await apiService.checkSession()).data;
        const userInfo = {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
        }
        dispatch(setUserInfo(userInfo));
        dispatch(setAuthenticated(true));
      } catch (error) {
        if (error.isApi) {
          const res = error.response
          console.log(res);
        }
        else{
          console.log(error);
        }
        dispatch(setAuthenticated(false));
      } finally {
        setLoading(false);
      }
    };
    if (!isAuthenticated)
      checkSession();
    else
      setLoading(false);
  }, [dispatch])

  if (loading) {
    return <div className='flex flex-col justify-center items-center h-screen'>
      <h1>Loading...</h1>
    </div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // 已登录，展示组件
  return children;
};

export default PrivateRoute;