import React from 'react';
import { useStoreApi, useReactFlow, Panel } from '@xyflow/react';
import { useSelector } from 'react-redux';



const ViewHelp = () => {

    const nodes = useSelector(selectNodes);
    const { zoomIn, zoomOut, setCenter } = useReactFlow();

    const focusNode = () => {
        const node = nodes.find(node => node.id === '1');
        if (node) {
            const x = node.position.x + node.measured.width / 2;
            const y = node.position.y + node.measured.height / 2;
            const zoom = 1.85;
            setCenter(x, y, { zoom, duration: 1000 });
        }
    };
    return (
        <Panel position="top-left" >
            <div className="description">
                This is an example of how you can use the zoom pan helper hook
            </div>
            <div>
                <button onClick={focusNode} className='bg-blue-400 hover:bg-blue-600 px-2 border rounded-lg pointer-events-auto'>
                    focus node
                </button>
                <button onClick={zoomIn} className='bg-blue-400 hover:bg-blue-600 px-2 border rounded-lg pointer-events-auto'>
                    zoom in
                </button>
                <button onClick={zoomOut} className='bg-blue-400 hover:bg-blue-600 px-2 border rounded-lg pointer-events-auto'>
                    zoom out
                </button>
            </div>
        </Panel>
    )
};
export default ViewHelp;