import React from "react";
import { MoreVertical, Share2, Trash2 } from "lucide-react";
import IconButton from "./IconButton";
import LazyImage from "./LazyImage";
const CanvasCard = (props) => {
    const { canvas, type, isExpanded, onDelete, onToggle } = props
    return (
        <>
            {type === "mine" && <article className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md h-full flex flex-col">
                <div className="h-40 bg-gradient-to-r from-blue-200 to-indigo-200 flex items-center justify-center relative">
                    <LazyImage
                        src={`${process.env.MINIO_BASE_URL}/${canvas.thumbnailFileName}`} // 替换为实际图片路径
                        alt="Canvas Preview Image"
                        placeholder={<span className="text-2xl text-gray-600 font-light">Canvas Preview</span>}
                        className="absolute inset-0  w-full h-full object-cover z-0"
                    />
                    <div className="absolute top-3 right-3 z-10 hover:bg-black/10 rounded-md" onClick={(e) => onToggle(e, canvas.id)}>
                        <IconButton
                            icon={<MoreVertical className="h-4 w-4 text-gray-600" />}
                            srOnly="更多选项"
                        />
                    </div>

                    {isExpanded && (
                        <div
                            id="card-menu"
                            className="absolute top-12 right-3 w-40 bg-white bg-opacity-90 rounded-md shadow-md transition-all duration-500 ease-in-out z-20"
                        >
                            <div className="p-2">
                                <button
                                    className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                                    onClick={(e) => {
                                        onDelete(e, canvas.id);
                                    }}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    删除画布
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-5 flex-grow flex flex-col border-t border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900 mb-2 group-hover:text-blue-600 transition-colors text-center">
                        {canvas.title || "Untitled Canvas"}
                    </h2>
                    <div className="mt-auto pt-4 border-t border-gray-100">
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>创建: {new Date(canvas.createdAt).toLocaleDateString()}</span>
                            <span>更新: {new Date(canvas.updatedAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </article>}

            {type === "shared" &&
                <article className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md h-full flex flex-col">
                    <div className="h-40 bg-gradient-to-r from-purple-200 to-pink-200 flex items-center justify-center relative">
                        <LazyImage
                            src={`${process.env.MINIO_BASE_URL}/${canvas.thumbnailFileName}`} // 替换为实际图片路径
                            alt="Canvas Preview Image"
                            placeholder={<span className="text-2xl text-gray-600 font-light">Canvas Preview</span>}
                            className="absolute inset-0  w-full h-full object-cover z-0"
                        />
                        {/* <span className="text-2xl text-gray-600 font-light">Canvas Preview</span> */}
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
                                <span>创建: {new Date(canvas.createdAt).toLocaleDateString()}</span>
                                <span>更新: {new Date(canvas.updatedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </article>}
        </>
    )
}
export default CanvasCard