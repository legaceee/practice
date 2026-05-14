"use client";

import React, { useCallback, useRef, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Panel,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import { Plus, Settings2, Trash2 } from "lucide-react";

// Custom Node for a Zapier-like feel
import { Handle, Position, NodeProps } from "reactflow";


const ZapierNode = ({ data, isConnectable, id }: NodeProps) => {
  return (
    <div className="bg-white border-2 border-gray-100 rounded-2xl shadow-sm min-w-[280px] hover:border-indigo-400 hover:shadow-lg transition-all duration-200">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-indigo-500 border-2 border-white"
      />
      
      <div className="p-4 flex gap-4 items-start">
        <div className="bg-indigo-50 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-indigo-100">
           {data.icon || <Settings2 className="w-5 h-5 text-indigo-600" />}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">{data.label}</h3>
            <button 
              className="text-gray-400 hover:text-red-500 transition-colors"
              onClick={() => data.onDelete?.(id)}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {data.description || "Choose an event..."}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-50 bg-gray-50/50 p-2 flex justify-center">
         <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Step {data.step}</span>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-indigo-500 border-2 border-white"
      />
    </div>
  );
};

const nodeTypes = {
  zapier: ZapierNode,
};

const initialNodes: Node[] = [
  {
    id: "1",
    type: "zapier",
    position: { x: 250, y: 100 },
    data: { 
      label: "Trigger", 
      description: "When this happens...",
      step: 1
    },
  },
];

const initialEdges: Edge[] = [];

export default function WorkflowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [stepCounter, setStepCounter] = useState(2);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } }, eds)),
    [setEdges]
  );

  const onDeleteNode = useCallback((id: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
  }, [setNodes, setEdges]);

  // Inject onDelete to initial nodes and newly added nodes
  const nodesWithProps = nodes.map(node => ({
    ...node,
    data: {
      ...node.data,
      onDelete: onDeleteNode
    }
  }));

  const addNode = useCallback(() => {
    const newNodeId = `node_${Date.now()}`;
    const newNode: Node = {
      id: newNodeId,
      type: "zapier",
      position: { 
        x: 250 + Math.random() * 50, 
        y: 100 + nodes.length * 150 
      },
      data: { 
        label: "Action", 
        description: "Do this...",
        step: stepCounter,
        onDelete: onDeleteNode
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setStepCounter(s => s + 1);

    // Auto connect to the last node if exists
    if (nodes.length > 0) {
      const lastNodeId = nodes[nodes.length - 1]!.id;
      const newEdge: Edge = {
        id: `e${lastNodeId}-${newNodeId}`,
        source: lastNodeId,
        target: newNodeId,
        animated: true,
        style: { stroke: '#6366f1', strokeWidth: 2 }
      };
      setEdges((eds) => [...eds, newEdge]);
    }
  }, [nodes, setNodes, setEdges, stepCounter, onDeleteNode]);

  return (
    <div className="w-full h-full relative flex flex-col bg-[#fcfcfc]" ref={reactFlowWrapper}>
      <div className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm relative ">
        <div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight  ">Workflow Builder</h1>
          <p className="text-xs text-gray-500 font-medium ">Design your automation flow</p>
        </div>
        <button
          onClick={addNode}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all shadow-sm shadow-indigo-200 "
        >
          <Plus className="w-4 h-4" />
          Add Step
        </button>
      </div>
      
      <div className="flex-1 w-full h-full">
        <ReactFlow
          nodes={nodesWithProps}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gray-50/50"
          defaultEdgeOptions={{
            style: { stroke: '#6366f1', strokeWidth: 2 },
            animated: true,
          }}
        >
          <Background color="#e2e8f0" gap={16} size={1} variant={BackgroundVariant.Dots} />
          <Controls className="bg-white border-gray-100 shadow-md rounded-xl overflow-hidden" />
          <MiniMap 
            nodeColor="#6366f1" 
            maskColor="rgba(248, 250, 252, 0.7)"
            className="rounded-xl overflow-hidden shadow-md border-gray-100 bg-white" 
          />
          <Panel position="top-right" className="bg-white/80 backdrop-blur-md p-3 rounded-xl shadow-sm border border-gray-100 text-xs font-medium text-gray-600">
            Scroll to pan, pinch or scroll-wheel to zoom
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}
