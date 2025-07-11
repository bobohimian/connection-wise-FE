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
  Workflow,
  Shapes,
} from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../common/toast';

export default function Toolbox() {
  const { toast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const handleDragStart = (event, nodeType) => {
    event.dataTransfer.setData('text/plain', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };
  const handleToolClick = (tool) => {
    toast({
      title: `${tool} selected`,
      description: `You can now add a ${tool.toLowerCase()} node to the canvas.`,
    });
  };


  return (
    <div className={`flex flex-col border-r bg-white transition-all ease-in-out duration-300  ${isCollapsed ? 'w-14' : 'w-64'}`}>
      <div className="flex items-center justify-between p-2 overflow-hidden">
        <h2 className={`text-sm font-medium ${isCollapsed && 'hidden'}`}>Toolbox</h2>
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
          </div>
          <div className="p-2">
            <h3 className="text-xs font-medium mb-2">Nodes</h3>
            <div className="grid grid-cols-2 gap-2">
              <div
                className="flex flex-col items-center justify-center rounded-md border border-dashed p-2 cursor-grab hover:border-primary/50 hover:bg-muted"
                draggable
                onDragStart={(e) => handleDragStart(e, 'textNode')}
                onClick={() => handleToolClick('Text')}
              >
                <Text className="h-6 w-6 text-primary" />
                <span className="mt-1 text-xs">Text</span>
              </div>
              <div
                className="flex flex-col items-center justify-center rounded-md border border-dashed p-2 cursor-grab hover:border-primary/50 hover:bg-muted"
                draggable
                onDragStart={(e) => handleDragStart(e, 'codeNode')}
                onClick={() => handleToolClick('Code')}
              >
                <Code className="h-6 w-6 text-primary" />
                <span className="mt-1 text-xs">Code</span>
              </div>
              <div
                className="flex flex-col items-center justify-center rounded-md border border-dashed p-2 cursor-grab hover:border-primary/50 hover:bg-muted"
                draggable
                onDragStart={(e) => handleDragStart(e, 'todoNode')}
                onClick={() => handleToolClick('Todo')}
              >
                <CheckSquare className="h-6 w-6 text-primary" />
                <span className="mt-1 text-xs">Todo</span>
              </div>
              <div
                className="flex flex-col items-center justify-center rounded-md border border-dashed p-2 cursor-grab hover:border-primary/50 hover:bg-muted"
                draggable
                onDragStart={(e) => handleDragStart(e, 'tableNode')}
                onClick={() => handleToolClick('Table')}
              >
                <Table className="h-6 w-6 text-primary" />
                <span className="mt-1 text-xs">Table</span>
              </div>
              <div
                className="flex flex-col items-center justify-center rounded-md border border-dashed p-2 cursor-grab hover:border-primary/50 hover:bg-muted"
                draggable
                onDragStart={(e) => handleDragStart(e, 'linkNode')}
                onClick={() => handleToolClick('Link')}
              >
                <LinkIcon className="h-6 w-6 text-primary" />
                <span className="mt-1 text-xs">Link</span>
              </div>
              <div
                className="flex flex-col items-center justify-center rounded-md border border-dashed p-2 cursor-grab hover:border-primary/50 hover:bg-muted"
                draggable
                onDragStart={(e) => handleDragStart(e, 'fileNode')}
                onClick={() => handleToolClick('File')}
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
                  onDragStart={(e) => handleDragStart(e, 'straightEdge')}
                  onClick={() => handleToolClick('Straight Connection')}
                >
                  <Workflow className="h-6 w-6 text-primary" />
                  <span className="mt-1 text-xs">Straight</span>
                </div>
                <div
                  className="flex flex-col items-center justify-center rounded-md border border-dashed p-2 cursor-grab hover:border-primary/50 hover:bg-muted"
                  draggable
                  onDragStart={(e) => handleDragStart(e, 'curvedEdge')}
                  onClick={() => handleToolClick('Curved Connection')}
                >
                  <Shapes className="h-6 w-6 text-primary" />
                  <span className="mt-1 text-xs">Curved</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-4">
          <button
            className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => handleToolClick('Text')}
          >
            <Text className="h-5 w-5" />
            <span className="sr-only">Text</span>
          </button>
          <button
            className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => handleToolClick('Heading')}
          >
            <Heading1 className="h-5 w-5" />
            <span className="sr-only">Heading</span>
          </button>
          <button
            className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => handleToolClick('Image')}
          >
            <Image className="h-5 w-5" />
            <span className="sr-only">Image</span>
          </button>
          <button
            className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => handleToolClick('Code')}
          >
            <Code className="h-5 w-5" />
            <span className="sr-only">Code</span>
          </button>
          <div className="h-px w-4 bg-gray-200 dark:bg-gray-700"></div>
        </div>
      )}
    </div>
  );
}