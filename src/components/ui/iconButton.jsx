const IconButton = ({ icon, onClick, srOnly }) => {
    return (
        <button
            className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => onClick()}
        >
            {icon}
            <span className="sr-only">{srOnly}</span>
        </button>
    )
}
export default IconButton;