import { useState } from "react";
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
import { useToast } from "@/components/provider/toast";
import { useReactFlow, useStoreApi } from "@xyflow/react";
import { useWebSocket } from "./provider/websocketProvider";

export default function Toolbar({ selectedNode, selectedEdge }) {
  const [ws] = useWebSocket()
  const { toast } = useToast();
  const { updateEdge, updateNodeData } = useReactFlow();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("nodes");
  const handleDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleToolClick = (tool) => {
    toast({
      title: `${tool} selected`,
      description: `You can now add a ${tool.toLowerCase()} node to the canvas.`,
    });
  };

  const handleClickColor = (color) => {
    if (selectedNode && selectedEdge)
      throw new Error("Only one node or one Edge can be selected at a time");
    if (selectedEdge) {
      updateEdge(selectedEdge,
        (edge) => ({ ...edge, style: { stroke: color } }))
        const updateData={ style: { stroke: color } }
      ws.updateEdge(selectedEdge, updateData)
    }
    else if (selectedNode) {
      updateNodeData(selectedNode, { background: color })
      const updateData={ data: { background: color } }
      ws.updateNode(selectedNode, updateData)
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
                    {["#F56565", "#4299E1", "#48BB78", "#F6E05E", "#A855F7", "#ED64A6"].map(
                      (color) => (
                        <button
                          key={color}
                          className={`h-6 w-6 rounded-full hover:ring-2 hover:ring-offset-2`}
                          style={{ backgroundColor: color }}
                          onClick={() => handleClickColor(color)}
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