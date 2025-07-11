import { Save } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import IconButton from './IconButton.jsx';

const ToolTip = ({ nodeId }) => {
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });
  const popupRef = useRef(null);
  useEffect(() => {
    const node = document.querySelector('[data-id="node-1"]');
    if (node) {
      const rect = node.getBoundingClientRect();
      setPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  }, [nodeId]);
  return <div ref={popupRef}
    style={{ top: position.top, left: position.left }}
    className={`absolute bottom-35 w-50 h-10 rounded-md bg-gradient-to-r from-blue-500 to-purple-600
        transform transition-all duration-500 ease-in-out origin-bottom ${nodeId
    ? 'opacity-100 scale-100 '
    : 'opacity-0 scale-90 translate-y-5 pointer-events-none'}
        felx justify-center items-center`}
  >
    <IconButton icon={<Save className="h-4 w-4" />}></IconButton>
  </div>;
};

export default ToolTip;