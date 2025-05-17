import React, { useEffect, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { Check, Plus, Trash2 } from "lucide-react";
import { useEnhancedReaceFlow } from "../../../hooks/useEnhancedReaceFlow";
export default function ({ id, data, isConnectable, selected }) {

  const items = data.items;
  const { updateNode } = useEnhancedReaceFlow();
  const [newItemText, setNewItemText] = useState("");
  const [isAddingItem, setIsAddingItem] = useState(true);
  useEffect(() => {
    if (!selected) {
      setIsAddingItem(false);
    }
  }, [selected]);
  const toggleItem = (itemId) => {
    const updatedItems = items.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    updateNode(id, ["data", "items"], updatedItems)
  };

  const deleteItem = (itemId) => {
    const updatedItems = items.filter((item) => item.id !== itemId);
    updateNode(id, ["data", "items"], updatedItems)
  };

  const addItem = () => {
    if (newItemText.trim()) {
      const newItem = {
        id: Date.now().toString(),
        text: newItemText,
        completed: false,
      };
      const updatedItems = [...items, newItem];
      updateNode(id, ["data", "items"], updatedItems)
      setNewItemText("");
    }
    setIsAddingItem(false);
  };

  return (
    <div
      className={`p-2 rounded-md  ${selected ? "border-primary ring-1" : ""} shadow-sm w-50`}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Todo List</h3>
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`todo-${item.id}`}
                checked={item.completed}
                onChange={() => toggleItem(item.id)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label
                htmlFor={`todo-${item.id}`}
                className={`text-sm flex-1 ${item.completed ? "line-through text-muted-foreground" : ""}`}
              >
                {item.text}
              </label>
              <button
                className="h-6 w-6 flex items-center justify-center rounded opacity-50 hover:opacity-100 hover:bg-gray-100"
                onClick={() => deleteItem(item.id)}
              >
                <Trash2 className="h-3 w-3" />
                <span className="sr-only">Delete</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between w-full gap-1 h-10 nodrag cursor-default">
          {isAddingItem ? (
            <>
              <input
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addItem()}
                autoFocus
                className="h-6 text-sm border rounded focus:outline-none"
                placeholder="New task..."
              />
              <button
                className={`h-6 w-10 flex items-center justify-center rounded hover:bg-gray-100 `}
                onClick={() => addItem()}
              >
                <Check className="h-3 w-3" />
                <span className="sr-only">Add</span>
              </button>
            </>
          ) : (
            <button
              className="w-full h-6 px-3 py-1 text-xs border rounded flex items-center justify-center gap-1 hover:bg-gray-100 "
              onClick={() => setIsAddingItem(true)}
            >
              <Plus className="h-3 w-3" />
              Add Task
            </button>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-primary border-2 border-background"
      />
    </div>
  );
}