import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import apiService from '../../api/index.js';
import { setUserInfo , setAuthenticated } from '../../store/slices/user.js';
import { useToast } from '../common/toast.jsx';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [loading, setLoading] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(true);

  const login = async (provider) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    let userInfo = {};
    switch (provider) {
      case 'password': {
        const user = (await apiService.login(username, password)).data;
        
        userInfo = {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
        };
        dispatch(setUserInfo(userInfo));
        dispatch(setAuthenticated(true));
        break;
      }
      default:
    }
    return;
  };

  const register = async () => {
    try {
      await apiService.register(username, password, email);
    } catch (error) {
      if (error.isApi) {
        console.log('注册失败', error);
      } else {
        console.error(error);
      }
    }
  };

  const handleLogin = async (e, provider) => {
    e.preventDefault();
    setLoading(provider);
    setError(null);
    console.log('使用 ' + provider + ' 登录');
    try {
      await login(provider);
      navigate('/canvas');
    } catch (error) {
      if (error.isApi) {
        setError(error.message);
        console.log('登录失败', error);
      } else {
        console.error(error);
      }
    } finally {
      setLoading(null);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      setError('请填写所有必填字段');
      return;
    }

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('请输入有效的电子邮箱地址');
      return;
    }

    setLoading('register');
    setError(null);

    try {
      await register();
      toast({
        title: 'register successfully',
        description: 'Please login now',
      });
      setTimeout(() => {
        setIsLogin(true);
      }, 1000);
    } catch (error) {
      console.error(error);
      setError('注册失败，请稍后再试');
    } finally {
      setLoading(null);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-md w-full">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-2">{isLogin ? '欢迎回来' : '创建账户'}</h2>
          <p className="opacity-80">{isLogin ? '请登录以继续访问您的账户' : '请注册一个新账户'}</p>
        </div>

        {isLogin ? (
          <form onSubmit={(e) => handleLogin(e, 'password')} className="px-8 flex flex-col space-y-4 mt-4 mb-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md animate-fadeIn">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            <div>
              <label htmlFor="username" className="mb-2 text-sm font-medium text-gray-700">
                用户名
              </label>
              <input
                id="username"
                type="text"
                placeholder="请输入用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full py-3 px-4 border ${error && !username ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`}
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 text-sm font-medium text-gray-700">
                密码
              </label>
              <input
                id="password"
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full py-3 px-4 border ${error && !password ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`}
              />
            </div>
            <button
              type="submit"
              className={`w-full flex items-center justify-center space-x-3 py-3 px-4 bg-indigo-500 rounded-lg text-white font-medium transition-colors hover:bg-indigo-700 ${loading === 'password' ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading === 'password' ? (
                <div className="h-5 w-5 border-2 border-gray-100 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span>登录</span>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="px-8 flex flex-col space-y-4 mt-4 mb-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md animate-fadeIn">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            <div>
              <label htmlFor="register-username" className="mb-2 text-sm font-medium text-gray-700">
                用户名
              </label>
              <input
                id="register-username"
                type="text"
                placeholder="请输入用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full py-3 px-4 border ${error && !username ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`}
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 text-sm font-medium text-gray-700">
                电子邮箱
              </label>
              <input
                id="email"
                type="email"
                placeholder="请输入电子邮箱"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full py-3 px-4 border ${error && !email ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`}
              />
            </div>

            <div>
              <label htmlFor="register-password" className="mb-2 text-sm font-medium text-gray-700">
                密码
              </label>
              <input
                id="register-password"
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full py-3 px-4 border ${error && !password ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`}
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className="mb-2 text-sm font-medium text-gray-700">
                确认密码
              </label>
              <input
                id="confirm-password"
                type="password"
                placeholder="请再次输入密码"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full py-3 px-4 border ${error && !confirmPassword ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`}
              />
            </div>

            <button
              type="submit"
              className={`w-full flex items-center justify-center space-x-3 py-3 px-4 bg-indigo-500 rounded-lg text-white font-medium transition-colors hover:bg-indigo-700 ${loading === 'register' ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading === 'register' ? (
                <div className="h-5 w-5 border-2 border-gray-100 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span>注册</span>
              )}
            </button>
          </form>
        )}

        <div className="px-8 pb-8 text-center">
          <button
            onClick={toggleForm}
            className="text-indigo-600 hover:text-indigo-700 hover:font-extrabold text-sm font-medium transition-colors"
          >
            {isLogin ? '没有账户？点击注册' : '已有账户？点击登录'}
          </button>
        </div>
      </div>
    </div>
  );
}
