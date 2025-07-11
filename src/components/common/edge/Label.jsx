import { useState } from 'react';
import { useEnhancedReaceFlow } from '../../../hooks/useEnhancedReaceFlow';

export const Label = ({ id, data, labelX, labelY, style }) => {

  const [isEditing, setIsEditing] = useState(false);
  const { updateEdge } = useEnhancedReaceFlow();

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (!isEditing)
      setIsEditing(true);
  };

  const handleLabelChange = (e) => {
    const nextLabel = e.target.value;
    updateEdge(id, ['data', 'label'], nextLabel);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
    }
  };




  return (<div
    style={{
      transform: `translate(${labelX}px, ${labelY}px)`,
      color: style?.stroke ? style.stroke : '#4caf50',
    }}
    className="absolute w-20 h-40 -translate-1/2 pointer-events-auto nodrag cursor-text flex justify-center items-center
        text-sm font-bold"
    onDoubleClick={handleDoubleClick}
  >
    {isEditing ? (
      <input
        autoFocus
        defaultValue={data?.label || ''}
        onChange={handleLabelChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={'p-3 text-center bg-white'}
      />
    ) : (
      <p className={'text-sm font-bold'}>
        {data?.label}
      </p>
    )}
  </div>);
};