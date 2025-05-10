import React, { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectUser } from "../../store/slices/user"
import apiService from "../../api"
import { Share2, MoreVertical, Trash2 } from 'lucide-react'
import IconButton from "../common/IconButton"

export default function CanvasGallery() {
    const userState = useSelector(selectUser)
    const userId = userState?.userInfo?.id
    const [canvasList, setCanvasList] = useState([])
    const [sharedCanvasList, setSharedCanvasList] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSharedLoading, setIsSharedLoading] = useState(true)
    const [activeMenuId, setActiveMenuId] = useState(null)
    const menuRef = useRef(null)

    const fetchData = async () => {
        if (!userId) return

        setIsLoading(true)
        try {
            const data = await apiService.fetchCanvasList(userId)
            // 根据更新时间排序
            const sortedData = [...data].sort(
                (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            )
            setCanvasList(sortedData)
        } catch (error) {
            console.error("Failed to fetch canvas list:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchSharedData = async () => {
        if (!userId) return

        setIsSharedLoading(true)
        try {
            const data = await apiService.fetchSharedCanvasList(userId)
            // 根据更新时间排序
            const sortedData = [...data].sort(
                (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            )
            setSharedCanvasList(sortedData)
        } catch (error) {
            console.error("Failed to fetch shared canvas list:", error)
        } finally {
            setIsSharedLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
        fetchSharedData()
    }, [userId])

    const handleCreateNewCanvas = () => {
        apiService.createCanvas(userId).then((res) => {
            fetchData()
        })
    }
    
    const handleDeleteCanvas = (e, canvasId) => {
        e.preventDefault();
        e.stopPropagation();
        apiService.deleteCanvas(canvasId).then(() => {
            fetchData()
            setActiveMenuId(null)
        }).catch(error => {
            console.error("删除画布失败:", error)
        })
    }
    
    const toggleMenu = (e, canvasId) => {
        e.preventDefault();
        e.stopPropagation();
        setActiveMenuId(activeMenuId === canvasId ? null : canvasId)
    }
    
    // 点击外部关闭菜单
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMenuId(null)
            }
        }
        
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    // Loading skeleton component
    const LoadingSkeleton = () => (
        <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-slate-300 h-10 w-10"></div>
                <div className="flex-1 space-y-6 py-1">
                    <div className="h-2 bg-slate-300 rounded"></div>
                    <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="h-2 bg-slate-300 rounded col-span-2"></div>
                            <div className="h-2 bg-slate-300 rounded col-span-1"></div>
                        </div>
                        <div className="h-2 bg-slate-300 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    )

    // Empty state component
    const EmptyState = ({ message, action, onClick }) => (
        <div onClick={onClick}
            className="text-center py-16 bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300">
            <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">{message}</h3>
            <p className="mt-1 text-sm text-gray-500">{action}</p>
        </div>
    )

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* My Canvases Section */}
                <header className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">我的画布</h1>
                    <p className="text-gray-600">展示最近更新的画布</p>
                </header>

                {isLoading ? (
                    <LoadingSkeleton />
                ) : canvasList.length === 0 ? (
                    <EmptyState 
                        message="No canvases" 
                        action="Get started by creating a new canvas." 
                        onClick={handleCreateNewCanvas} 
                    />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {/* 新增画布选项 */}
                        <div
                            onClick={handleCreateNewCanvas}
                            className="group hover:-translate-y-1 transform transition-transform duration-300 cursor-pointer"
                        >
                            <article className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md h-full flex flex-col border-2 border-dashed border-gray-300 hover:border-blue-400">
                                <div className="h-40 flex items-center justify-center bg-gradient-to-r from-blue-200 to-indigo-200 ">
                                    <svg
                                        className="h-16 w-16 text-gray-400 group-hover:text-blue-500 transition-colors"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                        />
                                    </svg>
                                </div>
                                <div className="p-5 flex-grow flex flex-col">
                                    <h2 className="text-lg font-medium text-center text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                        创建新画布
                                    </h2>
                                    <div className="mt-auto pt-4 border-t border-gray-100">
                                        <div className="flex justify-center text-xs text-gray-500">
                                            <span>点击创建一个新的画布</span>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </div>
                        {canvasList.map((canvas) => (
                            <div key={canvas.id} className="relative group hover:-translate-y-1 transform transition-transform duration-300">
                                <Link to={`/canvas/${canvas.id}`} className="block">
                                    <article className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md h-full flex flex-col">
                                        <div className="h-40 bg-gradient-to-r from-blue-200 to-indigo-200 flex items-center justify-center relative">
                                            <span className="text-2xl text-gray-600 font-light">Canvas Preview</span>
                                            {/* 三点菜单按钮 */}
                                            <div className="absolute top-3 right-3 z-10 hover:bg-white/30 rounded-md" onClick={(e) => toggleMenu(e, canvas.id)}>
                                                <IconButton 
                                                    icon={<MoreVertical className="h-4 w-4 text-gray-600" />} 
                                                    srOnly="更多选项"
                                                />
                                            </div>
                                            
                                            {/* 菜单功能区域 */}
                                            {activeMenuId === canvas.id && (
                                                <div 
                                                    ref={menuRef}
                                                    className="absolute top-12 right-3 w-40 bg-white bg-opacity-90 rounded-md shadow-md transition-all duration-500 ease-in-out z-20"
                                                >
                                                    <div className="p-2">
                                                        <button 
                                                            className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                                                            onClick={(e) => handleDeleteCanvas(e, canvas.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            删除画布
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-5 flex-grow flex flex-col">
                                            <h2 className="text-lg font-medium text-gray-900 mb-2 group-hover:text-blue-600 transition-colors text-center">
                                                {canvas.title || "Untitled Canvas"}
                                            </h2>
                                            <div className="mt-auto pt-4 border-t border-gray-100">
                                                <div className="flex justify-between text-xs text-gray-500">
                                                    <span>Created: {new Date(canvas.createdAt).toLocaleDateString()}</span>
                                                    <span>Updated: {new Date(canvas.updatedAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}

                {/* Shared Canvases Section */}
                <header className="mt-16 mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">分享给我的画布</h1>
                    <p className="text-gray-600">他人与你共享的画布</p>
                </header>

                {isSharedLoading ? (
                    <LoadingSkeleton />
                ) : sharedCanvasList.length === 0 ? (
                    <EmptyState 
                        message="No shared canvases" 
                        action="Canvases shared with you will appear here." 
                        onClick={null} 
                    />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {sharedCanvasList.map((canvas) => (
                            <Link to={`/canvas/${canvas.id}`} key={canvas.id}
                                className="group hover:-translate-y-1 transform transition-transform duration-300"
                            >
                                <article className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md h-full flex flex-col">
                                    {/* Different gradient for shared canvases */}
                                    <div className="h-40 bg-gradient-to-r from-purple-200 to-pink-200 flex items-center justify-center relative">
                                        <span className="text-2xl text-gray-600 font-light">Canvas Preview</span>
                                        {/* Shared indicator */}
                                        <div className="absolute top-3 right-3 bg-white bg-opacity-90 rounded-full p-1.5 shadow-sm">
                                            <Share2 className="h-4 w-4 text-purple-500" />
                                        </div>
                                    </div>
                                    <div className="p-5 flex-grow flex flex-col">
                                        <div className="flex flex-grow flex-col items-center mb-2">
                                            <h2 className=" text-lg font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                                                {canvas.title || "Untitled Canvas"}
                                            </h2>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-2">
                                            Shared by: {canvas.userName || "Unknown"}
                                        </p>
                                        <div className="mt-auto pt-4 border-t border-gray-100">
                                            <div className="flex justify-between text-xs text-gray-500">
                                                <span>Created: {new Date(canvas.createdAt).toLocaleDateString()}</span>
                                                <span>Updated: {new Date(canvas.updatedAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}
