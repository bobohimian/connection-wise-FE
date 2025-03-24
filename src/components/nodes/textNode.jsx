import { useState, useCallback } from "react";
import { usewsProxy } from "../../components/provider/WebSocketProvider";
import { Handle, Position, useReactFlow, useStoreApi } from "@xyflow/react";
export default function TextNode({ id, data, isConnectable, selected}) {
  const bgColor = data.background ? data.background : {};
  const { updateNodeData } = useReactFlow();
  const [text, setText] = useState(data.text || "Text node");
  const { wsProxy } = usewsProxy();
  const handleTextChange = useCallback(
    (e) => {
      const nextText = e.target.value;
      setText(prev=>nextText);
      updateNodeData({
        id: id,
        data: { text: nextText },
      })
      wsProxy.updateNode(1,id,["data","text"],nextText)
    }, []);

  return (
    <div style={{ backgroundColor: bgColor ? bgColor : "white" }}
      className={`p-1 rounded-md bg-white dark:bg-black  border box-border ${selected ? "border-primary ring-1 ring-primary/20" : "border"} w-50 h-30`}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className=""
      />

      <textarea
        value={text}
        onChange={handleTextChange}
        autoFocus
        className="w-full h-full p-1 text-sm rounded  overflow-y-auto resize-none focus:outline-none  nodrag "

      />

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className=""
      />
    </div>
  );
}