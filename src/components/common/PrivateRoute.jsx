import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setAuthenticated, setUserInfo } from '../../store/slices/user';
import WebSocketProvider from '../provider/WebSocketProvider';
import apiService from '@/api';
const PrivateRoute = ({ children }) => {
  console.log("render222")
  
  const dispatch = useDispatch();
  const userGlobalState = useSelector(selectUser);
  const isAuthenticated = userGlobalState.isAuthenticated;
  console.log({isAuthenticated})
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("privateRoute")
    const checkSession = async () => {
      try {
        // await new Promise((resolve) => setTimeout(resolve, 2000));
        const user = await apiService.checkSession();
        const userInfo = {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
        }
        console.log({userInfo})
        dispatch(setUserInfo(userInfo));
        dispatch(setAuthenticated(true));
      } catch (error) {
        dispatch(setAuthenticated(false));
        console.log(error)
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
  return (
    <WebSocketProvider >
      {children}
    </WebSocketProvider >
  )
};

export default PrivateRoute;