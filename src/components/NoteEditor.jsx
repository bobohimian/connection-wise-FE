import { useState } from "react";

import Navbar from "../components/Navbar";
import Toolbar from "../components/Toolbar";
import Canvas from "../components/Canvas";

export default function NoteEditor() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  return (
    <div className="flex h-screen flex-col bg-white">
      <Navbar />
      <div className="grow flex">
        <Toolbar selectedNode={selectedNode} selectedEdge={selectedEdge} />
        <Canvas
          selectedNode={selectedNode}
          selectEdge={selectedEdge}
          setSelectedNode={setSelectedNode}
          setSelectedEdge={setSelectedEdge}
        />
      </div>
    </div>
  );
}