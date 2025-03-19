import { useCallback, useEffect, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useToast } from "./provider/toast";
import { nodeTypes, createNode } from "@/components/nodes";
import { edgeTypes, defaultEdgeOption } from "@/components/edges";

import apiService from "../api";
import axios from "axios";
// Define custom node types

// Define custom edge types



export default function Canvas({ selectedNode, setSelectedNode, selectedEdge, setSelectedEdge }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const onConnect = (connection) => setEdges((edges) => addEdge(connection, edges))
  const { toast } = useToast();
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);


  const onNodeClick = useCallback(
    (_, node) => {
      setSelectedEdge(null);
      setSelectedNode(node.id);
    },
    [setSelectedNode]
  );
  const onEdgeClick = useCallback(
    (_, edge) => {
      setSelectedNode(null);
      setSelectedEdge(edge.id);
    },
    [setSelectedEdge]
  );
  const onPaneClick = useCallback(() => {
    const mousedownEvent = new MouseEvent('mousedown', { bubbles: true });
    document.dispatchEvent(mousedownEvent);
    setSelectedNode(null);
    setSelectedEdge(null);
  }, [setSelectedNode, setSelectedEdge]);


  const onDragOver = useCallback((event) => {
    event.preventDefault();
    // event.dataTransfer.dropEffect = "move"; // 将任何其他值赋给 dropEffect 都没有效果，这种情况下会保留旧值。——from MDN
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      if (!reactFlowInstance) return;
      const type = event.dataTransfer.getData("application/reactflow");
      if (typeof type === "undefined" || !type) return;
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = createNode(type, position);
      setNodes((nodes) => nodes.concat(newNode))

      toast({
        title: "Node added",
        description: `Added a new ${type} node to the canvasch.`,
      });
    },
    [reactFlowInstance, toast]
  );


  return (
    <div ref={reactFlowWrapper} className="flex-1 h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        defaultEdgeOptions={defaultEdgeOption}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        // nodeDragThreshold={10}
        paneClickDistance={5}
        nodeClickDistance={10}
        nodeOrigin={[0.5, 0.5]}
        fitView
      // snapToGrid
      // snapGrid={[15, 15]}
      // defaultViewport={{ x: 0, y: 0, zoom: 1}}
      >
        <Background color="#aaa" gap={16} />
        <Controls />
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
        <Panel position="top-right" className="bg-background/80 p-2 rounded-md shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <button
              className="h-8 px-3 text-sm border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => {
                toast({
                  title: "画布清空",
                  description: "所有内容已被清除",
                });
                setNodes([])
                setEdges([])
              }}
            >
              Clear Canvas
            </button>
            <button
              className="h-8 px-3 text-sm border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => {
                toast({
                  title: "Layout reset",
                  description: "Canvas view has been reset.",
                });
                reactFlowInstance?.fitView();
              }}
            >
              Reset View
            </button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}