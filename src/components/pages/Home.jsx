import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import { selectUser } from "../../store/slices/user";

import apiService from "../../api";
import { Card } from "../common/Card"
const Home = () => {
    const userState = useSelector(selectUser)
    const userId = userState?.userInfo?.id;
    const [canvasList, setCanvasList] = useState([]);
    useEffect(() => {
        const fetchData = async (userId) => {
            const data = await apiService.fetchCanvasList(userId)
            setCanvasList(data);
        }
        fetchData(userId);

    }, [])
    
    return (
        <div className="w-full h-screen overflow-y-scroll
        grid justify-center items-center 
        bg-gradient-to-r bg-blue-400  to-purple-500">

            <div>Home</div>
            {/* 设置w百分比不起作用 */}
            <div className="grid  grid-cols-[repeat(auto-fit,16rem)] gap-10 min-w-200">
                {canvasList.map((canvas, index) => {
                    return (
                        <Link to={`/canvas/${canvas.id}`} key={index}>
                            <Card
                                title={canvas.title}
                                createdTime={canvas.createdTime}
                                updatedTime={canvas.updatedTime}
                            ></Card>
                        </Link>)
                })}
            </div>
        </div>
    )
}
export default Home;