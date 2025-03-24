"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { setUserInfo } from "../../store/slices/user"
import { setAuthenticated } from "../../store/slices/user"
import { useNavigate } from "react-router-dom"


export default function Login({ children }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(null)

    const login = async (provider) => {
        console.log("使用 " + provider + " 登录")
        return new Promise((resolve) => {
            setTimeout(() => {
                const userInfo = {
                    username: 'chenhong',
                    email: 'bobohemian171@gmail.com',
                    avatar: '',
                    token: 'djheuiqfrj21378rh31br43178243y178'
                }
                dispatch(setAuthenticated(true))
                dispatch(setUserInfo(userInfo))
                resolve()
            }, 1000)
        })
    }

    const handleLogin = async (provider) => {
        setLoading(provider)
        try {
            await login(provider)
            navigate("/canvas")
        } catch (error) {
            console.error("登录失败:", error)
        } finally {
            setLoading(null)
        }
    }

    const handleLogout = async () => {

    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-md w-full">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white text-center">
                    <h2 className="text-3xl font-bold mb-2">欢迎回来</h2>
                    <p className="opacity-80">请登录以继续访问您的账户</p>
                </div>

                <div className="p-8">
                    <div className="space-y-4">
                        <button
                            onClick={() => handleLogin("google")}
                            disabled={loading !== null}
                            className={`w-full flex items-center justify-center space-x-3 py-3 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium transition-colors hover:bg-gray-50 ${loading === "google" ? "opacity-70 cursor-not-allowed" : ""}`}
                        >
                            {loading === "google" ? (
                                <div className="h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    <span>继续使用 Google 登录</span>
                                </>
                            )}
                        </button>

                        <button
                            onClick={() => handleLogin("github")}
                            disabled={loading !== null}
                            className={`w-full flex items-center justify-center space-x-3 py-3 px-4 bg-gray-900 rounded-lg text-white font-medium transition-colors hover:bg-gray-800 ${loading === "github" ? "opacity-70 cursor-not-allowed" : ""}`}
                        >
                            {loading === "github" ? (
                                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="white">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                    <span>继续使用 GitHub 登录</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* <div className="mt-6 text-center text-sm text-gray-500">
                        <p>继续意味着您同意我们的</p>
                        <div className="mt-1">
                            <a href="#" className="text-indigo-600 hover:text-indigo-500">
                                服务条款
                            </a>
                            {" & "}
                            <a href="#" className="text-indigo-600 hover:text-indigo-500">
                                隐私政策
                            </a>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    )
}