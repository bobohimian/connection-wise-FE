import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import apiService from '../../api/index.js';
import { setUserInfo, setAuthenticated } from '../../store/slices/user.js';
import { useToast } from '../common/toast.jsx';
import Form from '../common/Form';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const formDataRef = useRef({});


  const handleLogin = async (formData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const user = (await apiService.login(formData.username, formData.password)).data;
      const userInfo = {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      };
      dispatch(setUserInfo(userInfo));
      dispatch(setAuthenticated(true));
      navigate('/canvas');
    } catch (error) {
      formDataRef.current = formData;
      if (error.isApi) {
        setError(error.message);
      } else {
        console.error(error);
      }
    } finally {
    }
  };

  const handleRegister = async (formData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setError(null);
    try {
      await apiService.register(formData.username, formData.password, formData.email);
      toast({
        title: 'register successfully',
        description: 'Please login now',
      });
      formDataRef.current = formData;
      setTimeout(() => {
        setIsLogin(true);
      }, 1000);
    } catch (error) {
      if (error.isApi) {
        console.log('注册失败', error);
      } else {
        console.error(error);
      }
    } finally {
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError(null);
  };
  const loginForm = {
    initialValues: {
      username: formDataRef.current.username,
      password: formDataRef.current.password,
    },
    fields: [
      {
        name: 'username',
        label: '用户名',
        type: 'text',
        placeholder: '请输入用户名',
        required: true,
      },
      {
        name: 'password',
        label: '密码',
        type: 'password',
        placeholder: '请输入密码',
        required: true,
      }
    ]
  }
  const registerForm = {
    initialValues: {
      username: formDataRef.current.username,
      password: formDataRef.current.password,
      confirmPassword: '',
      email: '',
    },
    fields: [
      {
        name: 'username',
        label: '用户名',
        type: 'text',
        placeholder: '请输入用户名',
        required: true,
        minLenth: 8,
        maxLength: 24,
      },
      {
        name: 'password',
        label: '密码',
        type: 'password',
        placeholder: '请输入密码',
        required: true,
        minLenth: 8,
        maxLength: 24,
        pattern: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/,
        patternMessage: '仅允许字母和数字，且至少1个字母和数字，总长度8-20',
      },
      {
        name: 'confirmPassword',
        label: '确认密码',
        type: 'password',
        placeholder: '请再次输入密码',
        required: true,
        validate: (value, formData) => {
          if (value !== formData.password) {
            return '两次输入的密码不一致';
          }
          return null;
        }
      },
      {
        name: 'email',
        label: '电子邮箱',
        type: 'email',
        placeholder: '请输入电子邮箱',
        required: true,
        maxLength: 64,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        patternMessage: '请输入有效的电子邮箱地址',
      },
    ]
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-md w-full">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-2">{isLogin ? '欢迎回来' : '创建账户'}</h2>
          <p className="opacity-80">{isLogin ? '请登录以继续访问您的账户' : '请注册一个新账户'}</p>
        </div>
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
        {isLogin ?
          <Form
            key='login-form'
            initialValues={loginForm.initialValues}
            fields={loginForm.fields}
            onSubmit={handleLogin}>
          </Form>
          :
          <Form
            key='register-form'
            initialValues={registerForm.initialValues}
            fields={registerForm.fields}
            onSubmit={handleRegister}
            validateOnChange={false}
            validateOnBlur={false}>
          </Form>
        }

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
