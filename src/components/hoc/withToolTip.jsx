import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import IconButton from "../common/IconButton";
import { Network } from "lucide-react";
import { createNode } from "../common/node";
import { createEdge } from "../common/edge";
import { useEnhancedReaceFlow } from "../../hooks/useEnhancedReaceFlow";
const themes = [
    "bg-linear-to-r from-purple-300 via-indigo-300 to-blue-300",
    "bg-linear-to-r from-green-300 via-emerald-300 to-teal-300",
    "bg-linear-to-r from-cyan-100 via-blue-100 to-indigo-200",
    "bg-linear-to-r from-blue-300 via-cyan-300 to-teal-300",
    "bg-linear-to-r from-orange-100 via-amber-100 to-orange-100",
]
// 显示写出反转的主题色，用于tooltip的association使用函数反转颜色
const reverseThemes = [
    "bg-linear-to-r from-blue-300 via-indigo-300 to-purple-300",
    "bg-linear-to-r from-teal-300 via-emerald-300 to-green-300",
    "bg-linear-to-r from-indigo-200 via-blue-100 to-cyan-100",
    "bg-linear-to-r from-teal-300 via-cyan-300 to-blue-300",
    "bg-linear-to-r from-orange-100 via-amber-100 to-orange-100",
]
const withToolTip = (Component) => {
    return (props) => {
        const { id: nodeId, data: nodeData } = props;
        const dataText = nodeData.text;
        const bgTheme = nodeData.theme ? nodeData.theme : themes[0];
        const { addNode, updateNode, addEdge, updateEdge, screenToFlowPosition } = useEnhancedReaceFlow();
        const [showToolTip, setShowToolTip] = useState(false);
        const nodeRef = useRef(null);
        const toolTipRef = useRef(null);
        const associationRef = useRef(null);
        const [associations, setAssociations] = useState(["", "", "", ""]);
        const [showAssociation, setShowAssociation] = useState(false);
        // 确保generationContentRef是最新的


        const generationContentRef = useRef(dataText ? dataText : "");
        const associationContentRef = useRef("");
        const associationGenerationRef = useRef("");
        useEffect(() => {
            const handleClick = (event) => {
                // 当前未显示tooltip
                if (!showToolTip) {
                    if (nodeRef.current?.contains(event.target)) {
                        setShowToolTip(true);
                        if (associationContentRef.current !== "")
                            setShowAssociation(true);
                    }
                }
                else {
                    if (!toolTipRef.current?.contains(event.target) &&
                        !associationRef.current?.contains(event.target) &&
                        !nodeRef.current?.contains(event.target)) {
                        setShowToolTip(false);
                    }
                }
            };
            document.addEventListener("click", handleClick);
            return () => {
                document.removeEventListener("click", handleClick);
            };
        }, [showToolTip]);
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
        const handleClickColor = (theme) => {
            updateNode(nodeId, ['data', 'theme'], theme)
        }
        const handleClickGenerate = () => {
            const SSESource = '/api/ai/generate?prompt=' + encodeURIComponent(dataText);
            const eventSource = new EventSource(SSESource);
            eventSource.addEventListener('push', (event) => {
                generationContentRef.current += event.data;
                const prevText = generationContentRef.current;
                updateNode(nodeId, ["data", "text"], prevText + event.data)
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
            associationContentRef.current = "";
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
            associationGenerationRef.current = "";
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
                type: 'curvedEdge',
                animated: true,
                data: {
                    label: associations[associationIndex],
                }
            })
            addEdge(newEdge)
            const eventSource = new EventSource(SSESource);
            eventSource.addEventListener('push', (event) => {
                associationGenerationRef.current += event.data;
                updateNode(newNodeId, ["data", "text"], associationGenerationRef.current);
            });
            eventSource.addEventListener('close', () => {
                eventSource.close();
            });
            eventSource.onerror = (error) => {
                console.error('EventSource failed:', error);
                eventSource.close();
            };
        }
        return (<div className={`relative flex ${bgTheme} rounded-md`}>
            <div ref={nodeRef}>
                <Component {...props} />
            </div>
            <div className="w-full absolute bottom-full mb-2 nodrag cursor-auto" ref={toolTipRef}>
                <div
                    className={`ml-auto mr-0 w-50 h-10 rounded-md ${bgTheme}
             transition-all duration-500 ease-in-out origin-bottom ${showToolTip
                            ? 'opacity-100 scale-100 '
                            : 'opacity-0 scale-90 translate-y-5 pointer-events-none'}
            flex justify-around items-center `}
                >
                    {themes.map(
                        (theme, index) => (
                            <button
                                key={'theme' + index}
                                className={`h-4 w-4 ${theme} rounded-full ring-1 hover:ring-offset-2`}
                                onClick={() => handleClickColor(theme)}
                            />
                        )
                    )}
                    {/* <IconButton icon={<Save className="h-4 w-4" />}
                        onClick={() => handleClickGenerate()}></IconButton> */}
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
                        {associations[0].length > 0 ?
                            associations.map((association, index) => {
                                return (
                                    <div key={index} className={`w-35 rounded-md bg-current/10
                                hover:scale-108
                                transition-all duration-100 ease-in ${association.length > 0
                                            ? "opacity-100"
                                            : "opacity-0 translate-y-10 pointer-events-none absolute"}
                                px-2 py-0.5`}
                                        onClick={() => {
                                            hanldeGenerateAssociation(index)
                                        }}
                                    >
                                        <span className="break-words" >{association}</span>
                                    </div>
                                )
                            }) : <div className="h-5 w-5 border-2 border-gray-100 border-t-transparent rounded-full animate-spin"></div>
                        }
                    </div>
                </div>
            </div>
        </div>);
    };
}
export { withToolTip };