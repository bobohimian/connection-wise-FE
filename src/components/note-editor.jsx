import { useState } from "react";

import Navbar from "@/components/navbar";
import Toolbar from "@/components/toolbar";
import Canvas from "@/components/canvas";

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