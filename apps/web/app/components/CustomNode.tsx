"use client";

import { Handle, Position } from "reactflow";

export default function CustomNode({ id, data, onAddNode }) {
  return (
    <div className="bg-white border rounded p-3 shadow relative text-sm">
      
      <Handle type="target" position={Position.Top} />

      <div>{data.label}</div>

      
      <button
        onClick={() => onAddNode(id)}
        className="nodrag nopan absolute -bottom-3 left-1/2 -translate-x-1/2 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center"
      >
        +
      </button>

     
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
