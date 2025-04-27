import React, { useState } from "react";
import {
  Heading1,
  Text,
  Image,
  FileText,
  LinkIcon,
  CheckSquare,
  Code,
  Table,
  PanelLeft,
  Palette,
  Workflow,
  Shapes,
} from "lucide-react";
import { useToast } from "../components/provider/toast";
import { useReactFlow, useStoreApi } from "@xyflow/react";
import { usewsProxy } from "../components/provider/WebSocketProvider";

export default function Toolbar({ selectedNode, selectedEdge }) {
  const { wsProxy } = usewsProxy();
  const { toast } = useToast();
  const { updateEdge, updateNodeData } = useReactFlow();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("nodes");
  const handleDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };
  const themes = [
    "bg-linear-to-r from-purple-500 via-indigo-500 to-blue-500",
    "bg-linear-to-r from-cyan-700 via-blue-500 to-indigo-600",
    "bg-linear-to-r from-green-500 via-emerald-500 to-teal-500",
    "bg-[linear-gradient(60deg,_rgb(247,_149,_51),_rgb(243,_112,_85),_rgb(239,_78,_123),_rgb(161,_102,_171),_rgb(80,_115,_184),_rgb(16,_152,_173),_rgb(7,_179,_155),_rgb(111,_186,_130))]  ",
  ]
  // 显示写出反转的主题色，用于tooltip的association使用函数反转颜色
  const reverseThemes = [
    "bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500",
    "bg-linear-to-r from-indigo-600 via-blue-500 to-cyan-700",
    "bg-linear-to-r from-teal-500 via-emerald-500 to-green-500",
    "bg-[linear-gradient(60deg,_rgb(111,_186,_130),_rgb(7,_179,_155),_rgb(16,_152,_173),_rgb(80,_115,_184),_rgb(161,_102,_171),_rgb(239,_78,_123),_rgb(243,_112,_85),_rgb(247,_149,_51))]"
  ]
  const handleToolClick = (tool) => {
    toast({
      title: `${tool} selected`,
      description: `You can now add a ${tool.toLowerCase()} node to the canvas.`,
    });
  };

  const handleClickColor = (theme) => {
    if (selectedNode && selectedEdge)
      throw new Error("Only one node or one Edge can be selected at a time");
    if (selectedEdge) {
      updateEdge(selectedEdge,
        (edge) => ({ ...edge, style: { stroke: theme } }))
      wsProxy.updateEdge(1, selectedEdge, ['style', 'stroke'], theme)

    }
    else if (selectedNode) {
      updateNodeData(selectedNode, { theme: theme })
      wsProxy.updateNode(1, selectedNode, ['data', 'theme'], theme)
    }

  }

  return (
    <div className={`flex flex-col border-r bg-white transition-all ease-in-out duration-300  ${isCollapsed ? "w-14" : "w-64"}`}>
      <div className="flex items-center justify-between p-2 overflow-hidden">
        <h2 className={`text-sm font-medium ${isCollapsed && "hidden"}`}>Toolbox</h2>
        <button
          className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <PanelLeft className="h-4 w-4" />
          <span className="sr-only">Toggle Sidebar</span>
        </button>
      </div>
      <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
      {!isCollapsed ? (
        <div className="flex-1">
          <div className="grid w-full grid-cols-2 border-b border-gray-200 dark:border-gray-700">
            <button
              className={`py-2 text-xs font-medium ${activeTab === "nodes" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
              onClick={() => setActiveTab("nodes")}
            >
              Nodes
            </button>
            <button
              className={`py-2 text-xs font-medium ${activeTab === "styles" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
              onClick={() => setActiveTab("styles")}
            >
              Styles
            </button>
          </div>

          {activeTab === "nodes" && (
            <div className="p-2">
              <div className="grid grid-cols-2 gap-2">
                <div
                  className="flex flex-col items-center justify-center rounded-md border border-dashed p-2 cursor-grab hover:border-primary/50 hover:bg-muted"
                  draggable
                  onDragStart={(e) => handleDragStart(e, "textNode")}
                  onClick={() => handleToolClick("Text")}
                >
                  <Text className="h-6 w-6 text-primary" />
                  <span className="mt-1 text-xs">Text</span>
                </div>
                <div
                  className="flex flex-col items-center justify-center rounded-md border border-dashed p-2 cursor-grab hover:border-primary/50 hover:bg-muted"
                  draggable
                  onDragStart={(e) => handleDragStart(e, "codeNode")}
                  onClick={() => handleToolClick("Code")}
                >
                  <Code className="h-6 w-6 text-primary" />
                  <span className="mt-1 text-xs">Code</span>
                </div>
                <div
                  className="flex flex-col items-center justify-center rounded-md border border-dashed p-2 cursor-grab hover:border-primary/50 hover:bg-muted"
                  draggable
                  onDragStart={(e) => handleDragStart(e, "todoNode")}
                  onClick={() => handleToolClick("Todo")}
                >
                  <CheckSquare className="h-6 w-6 text-primary" />
                  <span className="mt-1 text-xs">Todo</span>
                </div>
                <div
                  className="flex flex-col items-center justify-center rounded-md border border-dashed p-2 cursor-grab hover:border-primary/50 hover:bg-muted"
                  draggable
                  onDragStart={(e) => handleDragStart(e, "tableNode")}
                  onClick={() => handleToolClick("Table")}
                >
                  <Table className="h-6 w-6 text-primary" />
                  <span className="mt-1 text-xs">Table</span>
                </div>
                <div
                  className="flex flex-col items-center justify-center rounded-md border border-dashed p-2 cursor-grab hover:border-primary/50 hover:bg-muted"
                  draggable
                  onDragStart={(e) => handleDragStart(e, "linkNode")}
                  onClick={() => handleToolClick("Link")}
                >
                  <LinkIcon className="h-6 w-6 text-primary" />
                  <span className="mt-1 text-xs">Link</span>
                </div>
                <div
                  className="flex flex-col items-center justify-center rounded-md border border-dashed p-2 cursor-grab hover:border-primary/50 hover:bg-muted"
                  draggable
                  onDragStart={(e) => handleDragStart(e, "fileNode")}
                  onClick={() => handleToolClick("File")}
                >
                  <FileText className="h-6 w-6 text-primary" />
                  <span className="mt-1 text-xs">File</span>
                </div>
              </div>

              <div className="h-px bg-gray-200 dark:bg-gray-700 my-4"></div>

              <div className="space-y-2 overflow-hidden">
                <h3 className="text-xs font-medium">Connections</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div
                    className="flex flex-col items-center justify-center rounded-md border border-dashed p-2 cursor-grab hover:border-primary/50 hover:bg-muted"
                    draggable
                    onDragStart={(e) => handleDragStart(e, "straightEdge")}
                    onClick={() => handleToolClick("Straight Connection")}
                  >
                    <Workflow className="h-6 w-6 text-primary" />
                    <span className="mt-1 text-xs">Straight</span>
                  </div>
                  <div
                    className="flex flex-col items-center justify-center rounded-md border border-dashed p-2 cursor-grab hover:border-primary/50 hover:bg-muted"
                    draggable
                    onDragStart={(e) => handleDragStart(e, "curvedEdge")}
                    onClick={() => handleToolClick("Curved Connection")}
                  >
                    <Shapes className="h-6 w-6 text-primary" />
                    <span className="mt-1 text-xs">Curved</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "styles" && (
            <div className="p-2">
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 text-xs font-medium">Colors</h3>
                  <div className="flex  gap-2">
                    {themes.map(
                      (theme, index) => (
                        <button
                          key={'theme' + index}
                          className={`h-6 w-6 ${theme} rounded-full hover:ring-2 hover:ring-offset-2`}
                          onClick={() => handleClickColor(theme)}
                        />
                      )
                    )}
                  </div>
                </div>

                <div className="overflow-hidden">
                  <h3 className="mb-2 text-xs font-medium whitespace-nowrap">Font Size</h3>
                  <div className="flex gap-2 overflow-hidden">
                    {["S", "M", "L", "XL"].map((size) => (
                      <button
                        key={size}
                        className="flex h-8 w-8 items-center justify-center rounded-md border hover:bg-muted"
                        onClick={() =>
                          toast({
                            title: `Font size ${size} selected`,
                            description: "Font size applied to the selected node.",
                          })
                        }
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-xs font-medium">Styles</h3>
                  <div className="flex overflow-hidden gap-2">
                    <button
                      className="flex h-8 items-center justify-center rounded-md border px-2 hover:bg-muted"
                      onClick={() =>
                        toast({
                          title: "Bold style applied",
                          description: "Bold style applied to the selected node.",
                        })
                      }
                    >
                      <span className="font-bold">B</span>
                    </button>
                    <button
                      className="flex h-8 items-center justify-center rounded-md border px-2 hover:bg-muted"
                      onClick={() =>
                        toast({
                          title: "Italic style applied",
                          description: "Italic style applied to the selected node.",
                        })
                      }
                    >
                      <span className="italic">I</span>
                    </button>
                    <button
                      className="flex h-8 items-center justify-center rounded-md border px-2 hover:bg-muted"
                      onClick={() =>
                        toast({
                          title: "Underline style applied",
                          description: "Underline style applied to the selected node.",
                        })
                      }
                    >
                      <span className="underline">U</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-4">
          <button
            className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => handleToolClick("Text")}
          >
            <Text className="h-5 w-5" />
            <span className="sr-only">Text</span>
          </button>
          <button
            className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => handleToolClick("Heading")}
          >
            <Heading1 className="h-5 w-5" />
            <span className="sr-only">Heading</span>
          </button>
          <button
            className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => handleToolClick("Image")}
          >
            <Image className="h-5 w-5" />
            <span className="sr-only">Image</span>
          </button>
          <button
            className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => handleToolClick("Code")}
          >
            <Code className="h-5 w-5" />
            <span className="sr-only">Code</span>
          </button>
          <div className="h-px w-4 bg-gray-200 dark:bg-gray-700"></div>
          <button
            className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => handleToolClick("Styles")}
          >
            <Palette className="h-5 w-5" />
            <span className="sr-only">Styles</span>
          </button>
        </div>
      )}
    </div>
  );
}