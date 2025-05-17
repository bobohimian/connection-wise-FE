import React, { useState, useCallback, useEffect, useRef } from "react";
import { Handle, Position } from "@xyflow/react";
import { useEnhancedReaceFlow } from "../../../hooks/useEnhancedReaceFlow";
const TextNode = ({ id, data, isConnectable, selected }) => {
  const text = data.text || "";
  const { updateNode } = useEnhancedReaceFlow();
  const textareaRef = useRef(null);
  
  const handleTextChange = useCallback(
    (e) => {
      const nextText = e.target.value;
      updateNode(id, ["data", "text"], nextText)
    }, [id, updateNode]);
    
  useEffect(() => {
    const handleWheel = (e) => {
      // Prevent the canvas from zooming
      e.stopPropagation();
      e.preventDefault();
      
      // Manually handle textarea scrolling
      const textarea = e.currentTarget;
      textarea.scrollTop += e.deltaY;
    };
    
    const textarea = textareaRef.current;
    if (textarea) {
      // Add event listener with passive: false to allow preventDefault
      textarea.addEventListener('wheel', handleWheel, { passive: false });
      
      return () => {
        textarea.removeEventListener('wheel', handleWheel);
      };
    }
  }, []);

  return (
    <>
      <div
        // 添加absolute，脱离文档流，避免影响ToolTip的absolute定位,失败，节点位置不明
        className={` p-2 rounded-md  w-50 h-30`}
      >
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
          className=""
        />
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          autoFocus
          className="w-full h-full p-1 text-sm rounded overflow-y-auto resize-none focus:outline-none nodrag"
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