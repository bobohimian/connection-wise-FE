import React from "react"

const Card = ({ title, createdTime, updatedTime }) => {
    return (
        <div className="bg-pink-200 rounded-xl p-2 flex flex-col transition-all duration-200 ease-in hover:-translate-y-5">
            <img src="" alt="缩略图" className="block bg-red-500 w-full h-40 rounded-xl"/>
            <p className="text-center">{title}</p>
        </div>

    )

}
export { Card };