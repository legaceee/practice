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
import { Plus, Settings2, Trash2, Mail, Globe, X, Zap } from "lucide-react";

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
            <div className="flex items-center gap-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-500 mr-1">
                {data.type || (id === "1" ? "TRIGGER" : "ACTION")}
              </span>
              <button 
                className="text-gray-400 hover:text-red-500 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  data.onDelete?.(id);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
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
      step: 1,
      type: "TRIGGER"
    },
  },
];

const initialEdges: Edge[] = [];

export default function WorkflowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [stepCounter, setStepCounter] = useState(2);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

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
    
    // Automatically select the new node to configure it
    setSelectedNodeId(newNodeId);
  }, [nodes, setNodes, setEdges, stepCounter, onDeleteNode]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  const updateNodeService = (service: "EMAIL" | "WEBHOOK") => {
    if (!selectedNodeId) return;
    
    setNodes((nds) => nds.map((node) => {
      if (node.id === selectedNodeId) {
        const type = node.id === "1" ? "TRIGGER" : "ACTION";
        return {
          ...node,
          data: {
            ...node.data,
            type,
            service,
            label: service === "EMAIL" ? "Email" : "Webhook",
            description: type === "TRIGGER" ? `When new ${service.toLowerCase()} arrives...` : `Send ${service.toLowerCase()}...`,
            icon: service === "EMAIL" 
              ? <Mail className="w-5 h-5 text-blue-600" /> 
              : <Globe className="w-5 h-5 text-green-600" />
          }
        };
      }
      return node;
    }));
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

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
      
      <div className="flex-1 w-full h-full relative overflow-hidden flex">
        <ReactFlow
          nodes={nodesWithProps}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
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
          <Panel position="top-right" className="bg-white/80 backdrop-blur-md p-3 rounded-xl shadow-sm border border-gray-100 text-xs font-medium text-gray-600 mr-2">
            Scroll to pan, pinch or scroll-wheel to zoom
          </Panel>
        </ReactFlow>

        {/* Zapier-like Configuration Sidebar */}
        <div 
          className={`absolute top-0 right-0 h-full w-96 bg-white shadow-2xl border-l border-gray-200 transform transition-transform duration-300 ease-in-out z-20 ${
            selectedNodeId ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {selectedNode && (
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center gap-2 text-gray-800">
                  <div className="w-8 h-8 rounded bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                    {selectedNode.data.step}
                  </div>
                  <h2 className="font-semibold text-lg">
                    {selectedNode.id === "1" ? "Configure Trigger" : "Configure Action"}
                  </h2>
                </div>
                <button 
                  onClick={() => setSelectedNodeId(null)}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto">
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">
                    1. Choose app & event
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Select the service that will {selectedNode.id === "1" ? "start" : "perform an action in"} this workflow.
                  </p>

                  <div className="space-y-3">
                    <div 
                      onClick={() => updateNodeService("EMAIL")}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
                        selectedNode.data.service === "EMAIL" 
                          ? "border-indigo-500 bg-indigo-50/30" 
                          : "border-gray-100 hover:border-indigo-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">Email</div>
                        <div className="text-xs text-gray-500">
                          {selectedNode.id === "1" ? "Triggers when a new email is received" : "Sends an email"}
                        </div>
                      </div>
                    </div>

                    <div 
                      onClick={() => updateNodeService("WEBHOOK")}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
                        selectedNode.data.service === "WEBHOOK" 
                          ? "border-indigo-500 bg-indigo-50/30" 
                          : "border-gray-100 hover:border-indigo-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                        <Globe className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">Webhook</div>
                        <div className="text-xs text-gray-500">
                          {selectedNode.id === "1" ? "Catch incoming webhooks" : "Send a POST request"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {selectedNode.data.service && (
                  <div className="mb-6 pt-6 border-t border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                      2. Configure {selectedNode.data.service === "EMAIL" ? "Email" : "Webhook"}
                    </h3>
                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 text-center">
                       <Zap className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                       <p className="text-sm text-gray-600">
                         Configuration options for <strong>{selectedNode.data.service}</strong> will appear here.
                       </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                <button 
                  onClick={() => setSelectedNodeId(null)}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
