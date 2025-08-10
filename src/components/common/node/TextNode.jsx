import { Handle, NodeResizer, Position } from '@xyflow/react';
import { debounce } from 'lodash';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useEnhancedReactFlow } from '../../../hooks/useEnhancedReactFlow';

const TextNode = ({ id, data, isConnectable, selected }) => {
  // const text = data.text || '';
  const [text, setText] = useState(data.text || '');
  const { updateNode } = useEnhancedReactFlow();
  const textareaRef = useRef(null);
  const [width, setWidth] = useState(data?.size?.width || 160);
  const [height, setHeight] = useState(data?.size?.height || 160);

  useEffect(() => {
    setText(data.text);
  }, [data.text]);
  // 使用useCallback和debounce创建防抖的updateNode函数
  const debouncedUpdateNode = useCallback(
    debounce((nodeId, path, value) => {
      updateNode(nodeId, path, value);
    }, 300),
    [updateNode],
  );
  // 在组件卸载时取消未执行的防抖函数
  useEffect(() => () => {
    debouncedUpdateNode.cancel();
  }, [debouncedUpdateNode]);

  const handleTextChange = (e) => {
    const nextText = e.target.value;
    setText(nextText);
    // 使用防抖函数更新节点，减少频繁更新
    debouncedUpdateNode(id, ['data', 'text'], nextText);
  };
  // 滚动事件
  useEffect(() => {
    const handleWheel = (e) => {
      // Prevent the canvas from zooming
      e.stopPropagation();
      // e.preventDefault();

      const textarea = e.currentTarget;
      textarea.scrollTop += e.deltaY;
    };

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        textarea.removeEventListener('wheel', handleWheel);
      };
    }
  }, []);

  return (
    <>
      <NodeResizer minWidth={160} minHeight={160} isVisible={selected}
        onResizeEnd={(event, { width, height }) => {
          updateNode(id, ['data', 'size'], { width: width - 16, height: height - 16 });
          console.log(width, height);
          setWidth(width - 16);
          setHeight(height - 16);
        }}
      />
      <div
        // 添加absolute，脱离文档流，避免影响ToolTip的absolute定位,失败，节点位置不明
        className={'w-full h-full p-2 rounded-md'}
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
          style={{
            width: width,
            height: height,
          }}
          className="min-w-40 min-h-40 w-full h-full p-1 text-sm rounded overflow-y-auto resize-none focus:outline-none nodrag"
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
};
export default TextNode;