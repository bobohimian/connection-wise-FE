import { v4 as uuidv4 } from 'uuid';
import TextNode from './TextNode.jsx';
import TodoNode from './TodoNode.jsx';
import CodeNode from './CodeNode.jsx';
export const nodeTypes = {
    textNode: TextNode,
    todoNode: TodoNode,
    codeNode: CodeNode,
};
const initialNodeData = {
    textNode: {
        text: "New text node"
    },
    todoNode: {
        items: [
            { id: "1", text: "New task", completed: false },
            { id: "2", text: "Another task", completed: false },
        ],
    },
    codeNode: {
        language: "javascript",
        code: "// Your code here\n",
    },
};
export const createNode = (type, position) => {
    const node = {
        id: uuidv4(),
        type,
        position,
        data: initialNodeData[type],
        origin:[0.5,0.5]
    };
    return node;
}
// const getInitialNodeData = (() => {
//     const initialNodeData = {
//         textNode: {
//             text: "New text node"
//         },
//         todoNode: {
//             items: [
//                 { id: "1", text: "New task", completed: false },
//                 { id: "2", text: "Another task", completed: false },
//             ],
//         },
//         codeNode: {
//             language: "javascript",
//             code: "// Your code here\n",
//         },
//     };
//     return (type) => {
//         return initialNodeData[type];
//     };
// })();