import React from 'react';
const IconButton = ({ icon, onClick, srOnly }) => {
    return (
        <button
            className="h-8 w-8 flex items-center justify-center rounded transition-transform duration-150 ease-in-out hover:scale-120 active:scale-100"
            onClick={onClick ? () => onClick() : () => { console.log("icon button clicked") }}
        >
            {icon}
            <span className="sr-only">{srOnly}</span>
        </button>
    )
}
export default IconButton;