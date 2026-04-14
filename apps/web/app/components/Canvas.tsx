"use client";
import ReactFlow, { useNodesState, useEdgesState, addEdge } from "reactflow";

export default function CanvasPage() {
  const initialNodes = [
    {
      id: "1",
      position: { x: 100, y: 100 },
      data: { label: "Start Node" },
      type: "default",
    },
    {
      id: "2",
      position: { x: 300, y: 200 },
      data: { label: "Action Node" },
      type: "default",
    },
  ];

  const initialEdges = [
    {
      id: "e1-2",
      source: "1",
      target: "2",
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = (params) => setEdges((eds) => addEdge(params, eds));
  const addNode = () => {
    const newNode = {
      id: String(nodes.length + 1),
      position: { x: 200, y: 200 },
      data: { label: "New Node" },
    };
    setNodes((nds) => [...nds, newNode]);
  };
  return (
    <div className="h-screen w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      />
    </div>
  );
}
