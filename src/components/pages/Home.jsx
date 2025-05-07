import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectUser } from "../../store/slices/user"
import apiService from "../../api"

export default function CanvasGallery() {
    const userState = useSelector(selectUser)
    const userId = userState?.userInfo?.id
    const [canvasList, setCanvasList] = useState([])
    const [isLoading, setIsLoading] = useState(true)

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
    useEffect(() => {
        fetchData()
    }, [userId])

    const handleCreateNewCanvas = () => {
        apiService.createCanvas(userId).then((res) => {
            fetchData()
        })
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">我的画布</h1>
                    <p className="text-gray-600">展示最近更新的画布</p>
                </header>

                {isLoading ? (
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
                ) : canvasList.length === 0 ? (
                    <div onClick={handleCreateNewCanvas}
                        className="text-center py-16 bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300 hover:border-blue-400">
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
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No canvases</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating a new canvas.</p>
                    </div>

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
                            <Link to={`/canvas/${canvas.id}`} key={canvas.id}
                                className="group hover:-translate-y-1 transform transition-transform duration-300"
                            >
                                <article className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md h-full flex flex-col">
                                    <div className="h-40 bg-gradient-to-r from-blue-200 to-indigo-200 flex items-center justify-center">
                                        <span className="text-2xl text-gray-600 font-light">Canvas Preview</span>
                                    </div>
                                    <div className="p-5 flex-grow flex flex-col">
                                        <h2 className="text-lg font-medium text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
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
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}