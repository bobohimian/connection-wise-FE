import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  applyEdgeChanges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import html2canvas from "html2canvas";

import { useToast } from "../common/toast";
import { nodeTypes, createNode } from "../common/node";
import { edgeTypes, defaultEdgeOption } from "../common/edge";

import { createEdge } from "../common/edge";
import apiService from "../../api";
import { useEnhancedReaceFlow } from "../../hooks/useEnhancedReaceFlow";
// Define custom node types

// Define custom edge types



export default function Canvas({ canvasData, selectedNode, setSelectedNode, selectedEdge, setSelectedEdge }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(canvasData?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(canvasData?.edges || []);
  const { addNode, deleteNode, updateNode, addEdge, deleteEdge, updateEdge } = useEnhancedReaceFlow()
  const { toast } = useToast();
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);



  useEffect(() => {
    setNodes(canvasData?.nodes || []);
    setEdges(canvasData?.edges || []);
  }, [canvasData])

  const onConnect = (connection) => {
    const newEdge = createEdge(connection)
    addEdge(newEdge)
  }
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


  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    // event.dataTransfer.dropEffect = "move"; // 将任何其他值赋给 dropEffect 都没有效果，这种情况下会保留旧值。——from MDN
  }, []);

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      if (!reactFlowInstance)
        return;
      const type = event.dataTransfer.getData("text/plain");
      if (typeof type === "undefined" || !type) return;
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = createNode({ type, position });
      addNode(newNode)
      toast({
        title: "Node added",
        description: `Added a new ${type} node to the canvasch.`,
      });
    },
    [reactFlowInstance, toast]
  );

  return (
    <div id="canvasContainer" ref={reactFlowWrapper} className="flex-1 h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onNodeDragStop={(e, node) => updateNode(node.id, ["position"], node.position)}
        onEdgesChange={onEdgesChange}
        onNodesDelete={deletedNodes => deletedNodes.map(node => deleteNode(node.id))}
        onEdgesDelete={deletedEdges => {
          console.log(deletedEdges);
          deletedEdges.map(edge => deleteEdge(edge.id))
        }}
        onConnect={onConnect}
        defaultEdgeOptions={defaultEdgeOption}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        onInit={setReactFlowInstance}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        // nodeDragThreshold={10}
        paneClickDistance={5}
        nodeClickDistance={10}
        nodeOrigin={[0.5, 0.5]}
        onViewportChange={({ x, y, zoom }) => { }}
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