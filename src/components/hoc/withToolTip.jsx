import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import IconButton from "../common/IconButton";
import { Save, Network } from "lucide-react";
import { createNode } from "../common/node";
import { createEdge } from "../common/edge";
import { useEnhancedReaceFlow } from "../../hooks/useEnhancedReaceFlow";
const withToolTip = (Component) => {
    return (props) => {
        const { id: nodeId, data: nodeData } = props;
        const dataText = nodeData.text;
        const bgTheme = nodeData.theme;
        // if (!nodeId || !nodeData || !dataText)s
        //     return <Component {...props} />;
        const { addNode, updateNode, addEdge, screenToFlowPosition } = useEnhancedReaceFlow();
        const [showToolTip, setShowToolTip] = useState(false);
        const wrapperRef = useRef(null);
        const toolTipRef = useRef(null);
        const associationRef = useRef(null);
        const [associations, setAssociations] = useState(["工厂模式与抽象工厂的区别", "工厂模式与抽象工厂的区别", "", ""]);
        // const [associations, setAssociations] = useState(x["", "", "", ""]);
        const [showAssociation, setShowAssociation] = useState(false);
        // 确保generationContentRef是最新的
        const generationContentRef = useRef(dataText ? dataText : "");
        const associationContentRef = useRef("");
        const associationGenerationRef = useRef("");
        useEffect(() => {
            const handleClickOutside = (event) => {
                if (!showToolTip)
                    if (toolTipRef.current && toolTipRef.current.contains(event.target))
                        return;
                if (associationRef.current && associationRef.current.contains(event.target))
                    return;
                if (wrapperRef.current &&
                    !wrapperRef.current.contains(event.target)) {
                    setShowToolTip(false);
                }
                else {
                    setShowToolTip(true);
                    console.log("点击ref")
                }
            };
            document.addEventListener("click", handleClickOutside);
            return () => {
                document.removeEventListener("click", handleClickOutside);
            };
        }, []);
        // 补全数组数据，实现结构化数据流式输出
        const completeArray = (str) => {
            if (str.length && str[0] !== '[')
                return ["error", "error", "error", "error"]
            if (str[0] === '[')
                str = str.slice(1)
            if (str[str.length - 1] === ']')
                str = str.slice(0, str.length - 1)
            let strArr = str.slice(1).split(',')
            strArr = strArr.map((str) => {
                str = str.trim()
                if (str[0] === '\'' || str[0] === '\"')
                    str = str.slice(1)
                if (str[str.length - 1] === '\'' || str[str.length - 1] === '\"')
                    str = str.slice(0, str.length - 1)
                return str
            })
            const leftWords = 4 - strArr.length
            for (let i = 0; i < leftWords; i++) {
                strArr.push("")
            }
            return strArr
        }
        // 为联想内容转换主题色
        const reverseTheme = (theme) => {
            if (!theme) {
                console.log("theme is null")
                return ""
            }
            const fromMatch = theme.match(/from-([a-zA-Z]+-\d+)/);
            const toMatch = theme.match(/to-([a-zA-Z]+-\d+)/);

            if (!fromMatch || !toMatch) {
                return theme;
            }

            const fromColor = fromMatch[1];
            const toColor = toMatch[1];
            const tmp = "tmp";
            const reverseTheme =
                theme.replace(fromColor, tmp)
                    .replace(toColor, fromColor)
                    .replace(tmp, toColor);
            return reverseTheme;
        }
        const handleClickGenerate = () => {
            const SSESource = '/api/ai/generate?prompt=' + encodeURIComponent(dataText);
            const eventSource = new EventSource(SSESource);
            eventSource.addEventListener('push', (event) => {
                generationContentRef.current += event.data;
                const prevText = generationContentRef.current;
                updateNode(nodeId,["data","text"], prevText + event.data)
            });
            eventSource.addEventListener('close', () => {
                eventSource.close();
            })

            eventSource.onerror = (error) => {
                console.error('EventSource failed:', error);
                eventSource.close();
            };
        }
        const hanldeClickAssociate = () => {
            const SSESource = '/api/ai/associate?prompt=' + encodeURIComponent(dataText);
            const eventSource = new EventSource(SSESource);
            setShowAssociation(true)
            eventSource.addEventListener('push', (event) => {
                associationContentRef.current += event.data;
                setAssociations(completeArray(associationContentRef.current));
            });
            eventSource.addEventListener('close', () => {
                eventSource.close();
            })
            eventSource.onerror = (error) => {
                console.error('EventSource failed:', error);
                eventSource.close();
            };
        }
        const hanldeGenerateAssociation = (associationIndex) => {
            const SSESource = '/api/ai/generate?prompt=' + encodeURIComponent(dataText) + '&direction=' + encodeURIComponent(associations[associationIndex]);
            const parent = document.querySelector(`[data-id="${nodeId}"]`);
            setShowAssociation(false);
            const rect = parent.getBoundingClientRect();
            const x = rect.right + rect.width
            const y = rect.top
            const newNodeId = uuidv4();
            const newNode = createNode({
                id: newNodeId,
                type: 'textNode',
                data: { text: "" },
                position: screenToFlowPosition({ x, y }),
            })
            addNode(newNode)
            const newEdge = createEdge({
                id: `edge-${nodeId}-${newNodeId}`,
                source: nodeId,
                target: newNodeId,
            })
            addEdge(newEdge)
            const eventSource = new EventSource(SSESource);
            eventSource.addEventListener('push', (event) => {
                associationGenerationRef.current += event.data;
                updateNode(newNodeId,["data","text"],associationGenerationRef.current);
            });
            eventSource.addEventListener('close', () => {
                eventSource.close();
            });
            eventSource.onerror = (error) => {
                console.error('EventSource failed:', error);
                eventSource.close();
            };
        }
        return (<div ref={wrapperRef} className={`relative flex ${bgTheme}`}>
            <Component {...props} />
            <div className="w-full absolute bottom-full mb-2 nodrag cursor-auto" ref={toolTipRef}>
                <div
                    className={`ml-auto mr-0 w-50 h-10 rounded-md ${bgTheme}
             transition-all duration-500 ease-in-out origin-bottom ${showToolTip
                            ? 'opacity-100 scale-100 '
                            : 'opacity-0 scale-90 translate-y-5 pointer-events-none'}
            flex justify-around items-center `}
                >
                    <IconButton icon={<Save className="h-4 w-4" />}
                        onClick={() => handleClickGenerate()}></IconButton>
                    <IconButton icon={<Network className="h-4 w-4" />}
                        onClick={() => hanldeClickAssociate()}></IconButton>
                </div>
            </div>
            <div className="absolute left-full ml-2 nodrag cursor-auto" ref={associationRef}>
                <div
                    className={`w-40 rounded-md ${reverseTheme(bgTheme)}
             transition-all duration-500 ease-in-out origin-bottom ${(showToolTip && showAssociation)
                            ? 'opacity-100 scale-100'
                            : 'opacity-0 scale-90 -translate-x-5 pointer-events-none'}
            flex flex-col justify-center items-center`}
                >
                    <div className="m-3 flex flex-col space-y-2.5 transition-all duration-500 ease-in-out">
                        {associations.map((association, index) => {
                            return (
                                <div key={index} className={`w-35 rounded-md bg-current/10
                                hover:scale-108
                                transition-all duration-100 ease-in ${association.length > 0
                                        ? "opacity-100"
                                        : "opacity-0 translate-y-10 pointer-events-none absolute"}
                                px-2 py-0.5`}
                                    onClick={() => hanldeGenerateAssociation(index)}
                                >
                                    <span className="break-words" >{association}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>);
    };
}
export { withToolTip };