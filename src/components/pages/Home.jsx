import React, { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectUserId } from "../../store/slices/user"
import apiService from "../../api"
import { Share2, MoreVertical, Trash2 } from 'lucide-react'
import IconButton from "../common/IconButton"
import CanvasCard from "../common/CanvasCard"
import AddCanvas from "../common/AddCanvas"
import useSWR from "swr"
export default function CanvasGallery() {
    const userId = useSelector(selectUserId)
    const [expandedCardId, setExpandedCardId] = useState(null)

    // 使用SWR获取我的画布列表
    const fetchCanvasList = async () => {
        return await apiService.fetchCanvasList(userId)
    }
    const {
        data: canvasData,
        error: canvasError,
        isLoading,
        isValidating,
        mutate: refreshCanvasList
    } = useSWR(
        userId ? `canvas-list-${userId}` : null,
        fetchCanvasList,
        {
            onSuccess: (data) => {
                console.log("Canvas list fetched successfully")
            },
            onError: (error) => {
                console.error("Failed to fetch canvas list:", error)
            },
            revalidateOnFocus: true,
            revalidateOnReconnect: true
        }
    )
    // 添加更多日志来跟踪状态变化
    useEffect(() => {
        console.log("SWR States:", {
            isLoading,
            isValidating,
            hasData: !!canvasData,
            hasError: !!canvasError,
            userId
        });
    }, [isLoading, canvasData, isValidating, canvasError, userId]);
    // 使用SWR获取共享画布列表
    const fetchSharedCanvasList = async () => {
        return await apiService.fetchSharedCanvasList(userId)
    }

    const { data: sharedCanvasData, error: sharedCanvasError, isLoading: isSharedLoading, mutate: refreshSharedCanvasList } = useSWR(
        userId ? `shared-canvas-list-${userId}` : null,
        fetchSharedCanvasList,
        {
            onSuccess: (data) => {
                console.log("Shared canvas list fetched successfully")
            },
            onError: (error) => {
                console.error("Failed to fetch shared canvas list:", error)
            },
            revalidateOnFocus: true,
            revalidateOnReconnect: true
        }
    )

    // 根据更新时间排序的画布列表
    const canvasList = canvasData ? [...canvasData].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    ) : []

    // 根据更新时间排序的共享画布列表
    const sharedCanvasList = sharedCanvasData ? [...sharedCanvasData].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    ) : []

    const handleCreateNewCanvas = () => {
        apiService.createCanvas(userId).then((res) => {
            refreshCanvasList()
        })
    }

    const handleDeleteCanvas = (e, canvasId) => {
        console.log("e:", e)
        e.preventDefault();
        e.stopPropagation();
        console.log("Deleting canvas:", canvasId)
        apiService.deleteCanvas(canvasId).then(() => {
            refreshCanvasList()
            setExpandedCardId(null)
        }).catch(error => {
            console.error("删除画布失败:", error)
        })
    }

    const toggleMenu = (e, canvasId) => {
        e.preventDefault();
        e.stopPropagation();
        setExpandedCardId(expandedCardId === canvasId ? null : canvasId)
    }

    // 点击外部关闭菜单
    useEffect(() => {
        const handleClickOutside = (event) => {
            setExpandedCardId(null)
        }

        document.addEventListener('click', handleClickOutside)
        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [expandedCardId])

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
                            <AddCanvas />
                        </div>
                        {canvasList.map((canvas, index) => (
                            <div key={canvas.id} className="relative group hover:-translate-y-1 transform transition-transform duration-300">
                                <Link to={`/canvas/${canvas.id}`} className="block">
                                    <CanvasCard
                                        canvas={canvas}
                                        type={"mine"}
                                        isExpanded={expandedCardId === canvas.id}
                                        onDelete={(e, canvasId) => handleDeleteCanvas(e, canvasId)}
                                        onToggle={(e, canvasId) => toggleMenu(e, canvasId)}></CanvasCard>
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
                                <CanvasCard canvas={canvas} type={"shared"}></CanvasCard>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}
