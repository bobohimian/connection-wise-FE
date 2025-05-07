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
    const resData = await apiService.generateGraph(text);
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
