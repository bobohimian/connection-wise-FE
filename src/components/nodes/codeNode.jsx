import { useState } from "react";
import { Handle, Position, useReactFlow, useStoreApi } from "@xyflow/react";
import { Code, Copy, ChevronDown } from "lucide-react";
import { useToast } from "@/components/provider/toast";
export default function CodeNode({ id, data, isConnectable, selected }) {
  const bgColor = data.background ? data.background : {};
  const { updateNodeData } = useReactFlow();
  const { toast } = useToast();
  const [code, setCode] = useState(data.code || "// Your code here");
  const [language, setLanguage] = useState(data.language || "javascript");
  const [openDropdown, setOpenDropdown] = useState(false);
  const handleCodeChange = (e) => {
    setCode(e.target.value);
    updateNodeData({
      id: id,
      data: { code: code }
    })
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied to clipboard",
      description: "Code has been copied to clipboard.",
    });
  };

  return (
    <div style={{ backgroundColor: bgColor?bgColor : "white" }}
      className={`p-3 rounded-md border bg-white dark:bg-black ${selected ? "border-primary ring-1" : "border-border"} shadow-sm w-80`}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-primary border-2 border-background"
      />


      <div className="flex -mt-2 items-center justify-between">
        <div className="relative">
          <button
            className="px-2 py-1 h-8 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-1"
            onClick={() => setOpenDropdown(pre => !pre)}>
            <Code className="h-4 w-4" />
            {language}
            <ChevronDown className="h-3 w-3" />
          </button>

          {openDropdown &&
            <div className="absolute left-2 mt-0 w-30 rounded-md bg-white ring-1 ring-black z-10">
              {['JavaScripts', 'TypeScripts', 'Css', 'Html', 'C++', 'Python'].map(lang =>
              (<button onClick={() => setLanguage(lang, setOpenDropdown(false))} className="w-full text-left px-3 text-xs text-gray-700 hover:bg-gray-100">
                {lang}
              </button>))}
            </div>}

        </div>
        <button
          className="h-6 w-6 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={copyToClipboard}>
          <Copy className="h-3 w-3" />
          <span className="sr-only">Copy</span>
        </button>

      </div>

      <textarea
        value={code}
        onChange={handleCodeChange}
        className="w-full h-full min-h-30 p-2 text-xs font-mono border rounded focus:outline-none nodrag resize-none"
        rows={5}
      />

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-primary border-2 border-background"
      />
    </div>
  );
}