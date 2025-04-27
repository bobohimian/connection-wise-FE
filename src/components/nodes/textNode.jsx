import React, { useState, useCallback } from "react";
import { usewsProxy } from "../../components/provider/WebSocketProvider";
import { Handle, Position, useReactFlow } from "@xyflow/react";
const TextNode = ({ id, data, isConnectable, selected }) => {
  const { wsProxy } = usewsProxy();
  const { updateNodeData } = useReactFlow();
  const handleTextChange = useCallback(
    (e) => {
      const nextText = e.target.value;
      updateNodeData(
        id,
        { text: nextText },
      )
      wsProxy.updateNode(1, id, ["data", "text"], nextText)
    }, []);

  return (
    <>
      <div
        // 添加absolute，脱离文档流，避免影响ToolTip的absolute定位,失败，节点位置不明
        className={` p-1 rounded-md  border box-border ${selected ? "border-primary ring-1 ring-primary/20" : "border"} w-50 h-30`}
      >
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
          className=""
        />
        <textarea
          value={data.text ? data.text : ""}
          onChange={handleTextChange}
          autoFocus
          className="w-full h-full p-1 text-sm rounded  overflow-y-auto resize-none focus:outline-none  nodrag "

        />

        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
          className=""
        />
      </div>

    </>
  );
}
export default TextNode;