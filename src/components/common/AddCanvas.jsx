const AddCanvas = () => (
  <article className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md h-full flex flex-col border-2 border-dashed border-gray-300 hover:border-blue-400">
    <div className="h-8/12 flex items-center justify-center bg-gradient-to-r from-blue-200 to-indigo-200 ">
      <svg
        className="h-2/5 w-2/5 text-gray-400 group-hover:text-blue-500 transition-colors"
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
);
export default AddCanvas;