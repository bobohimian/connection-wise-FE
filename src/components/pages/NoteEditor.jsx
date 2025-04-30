import React,{ useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../layout/Navbar";
import Toolbar from "../layout/Toolbar";
import Canvas from "../layout/Canvas";
import { useDispatch } from "react-redux";
import { setCanvasId } from "../../store/slices/user";

export default function NoteEditor() {
  const canvasId = useParams().canvasId;
  const dispatch = useDispatch();
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  useEffect(()=>{
    dispatch(setCanvasId(canvasId));
  },[])
  return (
    <div className="flex h-screen flex-col bg-white">
      <Navbar />
      <div className="grow flex">
        <Toolbar selectedNode={selectedNode} selectedEdge={selectedEdge} />
        <Canvas
          canvasId={canvasId}
          selectedNode={selectedNode}
          selectEdge={selectedEdge}
          setSelectedNode={setSelectedNode}
          setSelectedEdge={setSelectedEdge}
        />
      </div>
    </div>
  );
}