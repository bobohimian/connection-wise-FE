import { useReactFlow } from '@xyflow/react';
import { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import apiService from '../../api';
import { useEnhancedReactFlow } from '../../hooks/useEnhancedReactFlow';
import { setCanvasId, setPermission } from '../../store/slices/canvas';
import { setActiveDropdownId } from '../../store/slices/ui';
import { getLayoutedElements, transformGraphData } from '../../utils';
import { GraphSpotlight } from '../common/GraphSpotlight';
import Modal from '../common/Modal';
import Canvas from '../layout/Canvas';
import Navbar from '../layout/Navbar';
import Toolbox from '../layout/Toolbox';


export default function NoteEditor() {
  const canvasId = useParams().canvasId;
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const { fitView } = useReactFlow();
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [canvasData, setCanvasData] = useState(null);
  const [isloading, setIsloading] = useState(false);
  const { addNode, addEdge } = useEnhancedReactFlow();
  useEffect(() => {
    dispatch(setCanvasId(canvasId));
    return () => {
      dispatch(setActiveDropdownId(null));
    };
  }, [canvasId, dispatch]);
  useEffect(() => {
    getCanvas();
  }, [getCanvas]);
  const getCanvas = useCallback(async () => {
    try {
      const canvasData = (await apiService.fetchCanvas(canvasId)).data;
      setCanvasData(canvasData);
    } catch (error) {
      if (error.isApi) {
        console.log('获取画布失败', error);
        if (error.code === 3006) {
          navigator('/canvas');
        }
      } else {
        console.error(error);
      }
    }
  }, [canvasId, navigator]);
  const hanldeSubmit = async (text) => {
    setIsloading(true);
    const resData = (await apiService.generateGraph(text)).data;
    // const resData={
    //   "nodes": [
    //   {"id": 1, "title": "计算机网络", "content": "连接计算机和设备以实现数据通信的技术体系"},
    //   {"id": 2, "title": "OSI模型", "content": "开放系统互联模型，七层网络通信标准"},
    //   {"id": 3, "title": "TCP/IP协议", "content": "互联网核心协议，实际应用中的四层模型"},
    //   {"id": 4, "title": "HTTP协议", "content": "超文本传输协议，用于网页数据传输"},
    //   {"id": 5, "title": "路由器", "content": "网络层设备，负责数据包转发"},
    //   {"id": 6, "title": "交换机", "content": "数据链路层设备，局域网内数据帧转发"},
    //   {"id": 7, "title": "防火墙", "content": "网络安全设备，控制进出网络的流量"},
    //   {"id": 8, "title": "DNS服务", "content": "域名系统，将域名解析为IP地址"},
    //   {"id": 9, "title": "无线网络", "content": "通过无线信号实现设备互联的技术"}
    //   ],
    //   "edges": [
    //   {"source": 1, "target": 2, "relation": "理论模型"},
    //   {"source": 1, "target": 3, "relation": "实际协议栈"},
    //   {"source": 2, "target": 3, "relation": "理论与实践对比"},
    //   {"source": 3, "target": 4, "relation": "应用层协议"},
    //   {"source": 3, "target": 5, "relation": "网络层设备支持"},
    //   {"source": 1, "target": 6, "relation": "数据链路层设备"},
    //   {"source": 1, "target": 7, "relation": "网络安全组件"},
    //   {"source": 3, "target": 8, "relation": "域名解析支持"},
    //   {"source": 1, "target": 9, "relation": "无线通信分支"},
    //   {"source": 5, "target": 9, "relation": "无线路由支持"},
    //   {"source": 7, "target": 4, "relation": "保护协议通信"},
    //   {"source": 6, "target": 9, "relation": "局域网无线扩展"}
    //   ]
    //   }
    const { nodes: newNodes, edges: newEdges } = transformGraphData(resData);
    const { nodes: newNodes2, edges: newEdges2 } = getLayoutedElements(newNodes, newEdges);
    setIsloading(false);
    newNodes2.forEach(node => {
      addNode(node);
    });
    newEdges2.forEach(edge => {
      addEdge(edge);
    });
    fitView({ duration: 1000 });
  };
  const handleChangeCanvasName = async (value) => {
    const canvasDataCopy = structuredClone(canvasData);
    canvasDataCopy.title = value;
    try {
      await apiService.updateCanvas(canvasDataCopy);
      getCanvas();
    } catch (error) {
      if (error.isApi) {
        console.log('更新画布失败', error);
      } else {
        console.error(error);
      }
    }
  };
  return (
    <div className="flex h-screen flex-col bg-white">
      <Navbar
        canvasName={canvasData?.title}
        canvasId={canvasId}
        onCanvasNameChange={(value) => handleChangeCanvasName(value)}
      />
      <div className="grow flex">
        <Toolbox
          selectedNode={selectedNode}
          selectedEdge={selectedEdge}
        />
        <Canvas
          canvasData={canvasData}
          canvasId={canvasId}
          selectedNode={selectedNode}
          selectEdge={selectedEdge}
          setSelectedNode={setSelectedNode}
          setSelectedEdge={setSelectedEdge}
        />
      </div>
      <GraphSpotlight onSubmit={hanldeSubmit} />
      <Modal
        isOpen={isloading}
        onClose={() => {}}
      >
        <div className="m-auto h-50 w-50 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
      </Modal>
    </div>
  );
}
