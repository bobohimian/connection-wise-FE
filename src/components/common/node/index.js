import { v4 as uuidv4 } from 'uuid';
import CodeNode from './CodeNode.jsx';
import TextNode from './TextNode.jsx';
import TodoNode from './TodoNode.jsx';
import { withToolTip } from '../../hoc/withToolTip.jsx';
const nodeTypes = {
  textNode: withToolTip(TextNode),
  todoNode: withToolTip(TodoNode),
  codeNode: withToolTip(CodeNode),
};
const initialNodeData = {
  textNode: {
    text: 'New text node',
  },
  todoNode: {
    items: [
      { id: '1', text: 'New task', completed: false },
      { id: '2', text: 'Another task', completed: false },
    ],
  },
  codeNode: {
    language: 'javascript',
    code: '// Your code here\n',
  },
};
const createNode = ({ id, type, position, data }) => {
  const node = {
    id: id ? id : uuidv4(),
    type,
    position,
    data: data ? data : initialNodeData[type],
    origin: [0.5, 0.5],
    version: 1,
  };
  return node;
};
export {
  nodeTypes,
  createNode,
};