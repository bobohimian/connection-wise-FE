import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../layout/Navbar";
import Toolbox from "../layout/Toolbox";
import Canvas from "../layout/Canvas";
import { useDispatch } from "react-redux";
import { setCanvasId } from "../../store/slices/user";
import { setActiveDropdownId } from "../../store/slices/ui";
import { GraphSpotlight } from "../common/GraphSpotlight"
import apiService from "../../api";
import { getLayoutedElements, transformGraphData } from "../../utils";
import { useReactFlow } from "@xyflow/react";
import { useEnhancedReaceFlow } from "../../hooks/useEnhancedReaceFlow";


export default function NoteEditor() {
  const canvasId = useParams().canvasId;
  const dispatch = useDispatch();
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [canvasData, setCanvasData] = useState(null);
  const { addNode, addEdge } = useEnhancedReaceFlow();
  useEffect(() => {
    dispatch(setCanvasId(canvasId));
    return () => {
      dispatch(setActiveDropdownId(null));
    }
  }, [])
  useEffect(() => {
    getCanvas()
  }, [])
  const getCanvas = async () => {
    const canvasData = await apiService.fetchCanvas(canvasId)
    setCanvasData(canvasData);
  }
  const hanldeSubmit = async (text) => {
    // const resData = await apiService.generateGraph(text);
    const resData={
      "nodes": [
        {"id": 1, "title": "列奥纳多·达·芬奇", "content": "文艺复兴全才，画家、发明家、科学家，代表作《蒙娜丽莎》"},
        {"id": 2, "title": "米开朗琪罗", "content": "雕塑家、画家、建筑师，代表作《大卫像》和西斯廷教堂天顶画"},
        {"id": 3, "title": "尼科洛·马基雅维利", "content": "政治哲学家，代表作《君主论》，提出现实主义政治观"},
        {"id": 4, "title": "但丁·阿利吉耶里", "content": "中世纪晚期诗人，代表作《神曲》，奠定意大利语文学基础"},
        {"id": 5, "title": "人文主义思想", "content": "文艺复兴核心理念，强调人的价值与古典文化的复兴"}
      ],
      "edges": [
        {"source": 1, "target": 2, "relation": "艺术竞争"},
        {"source": 1, "target": 5, "relation": "思想实践者"},
        {"source": 2, "target": 5, "relation": "思想实践者"},
        {"source": 3, "target": 5, "relation": "思想贡献者"},
        {"source": 4, "target": 5, "relation": "思想先驱"},
        {"source": 1, "target": 3, "relation": "同时代交流"},
        {"source": 2, "target": 4, "relation": "文化传承影响"},
        {"source": 4, "target": 3, "relation": "文学与政治思想影响"}
      ]
    }
    const { nodes: newNodes, edges: newEdges } = transformGraphData(resData);
    const { nodes: newNodes2, edges: newEdges2 } = getLayoutedElements(newNodes, newEdges);
    newNodes2.forEach(node => {
      addNode(node);
    })
    newEdges2.forEach(edge => {
      addEdge(edge);
    })

  }
  const handleChangeCanvasName = async (value) => {
    const canvasDataCopy = structuredClone(canvasData);
    canvasDataCopy.title = value;
    await apiService.updateCanvas(canvasDataCopy);
    getCanvas();
  }
  return (
    <div className="flex h-screen flex-col bg-white">
      <Navbar
        canvasName={canvasData?.title} 
        canvasId={canvasId}
        onCanvasNameChange={(value)=> handleChangeCanvasName(value)}/>
      <div className="grow flex">
        <Toolbox
          selectedNode={selectedNode}
          selectedEdge={selectedEdge} />
        <Canvas
          canvasData={canvasData}
          canvasId={canvasId}
          selectedNode={selectedNode}
          selectEdge={selectedEdge}
          setSelectedNode={setSelectedNode}
          setSelectedEdge={setSelectedEdge}
        />
      </div>
      <GraphSpotlight onSubmit={hanldeSubmit} />
    </div>
  );
}
