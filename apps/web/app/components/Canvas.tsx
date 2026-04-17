"use client";

import { useCallback, useEffect, useMemo } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Controls,
} from "reactflow";
import "reactflow/dist/style.css";
import CustomNode from "./CustomNode";

export default function CanvasPage() {
  //
  const initialNodes = [
    {
      id: "1",
      type: "custom",
      position: { x: 250, y: 100 },
      data: { label: "Start" },
    },
  ];

  const initialEdges = [];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // ✅ ADD NODE FUNCTION
  const onAddNode = useCallback(
    (parentId) => {
      setNodes((nds) => {
        const parent = nds.find((n) => n.id === parentId);
        if (!parent) return nds;

        const children = nds.filter((n) => n.parentId === parentId);

        const index = children.length; // how many branches already

        const spacing = 200;

        const newId = crypto.randomUUID();

        const newNode = {
          id: newId,
          type: "custom",
          position: {
            x: parent.position.x + (index - 0.5) * spacing,
            y: parent.position.y + 150,
          },
          data: { label: "New Step" },
          parentId: parentId, // 🔥 important
        };

        setEdges((eds) => [
          ...eds,
          {
            id: `e-${parentId}-${newId}`,
            source: parentId,
            target: newId,
          },
        ]);

        return [...nds, newNode];
      });
    },
    [setNodes, setEdges],
  );

  // ✅ Inject function into all nodes
  // useEffect(() => {
  //   setNodes((nds) =>
  //     nds.map((n) => ({
  //       ...n,
  //       data: {
  //         ...n.data,
  //         onAddNode,
  //       },
  //     })),
  //   );
  // }, [onAddNode, setNodes]);

  // ✅ CONNECT HANDLER (optional drag connect)
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // ✅ CUSTOM NODE TYPES
  const nodeTypes = useMemo(
    () => ({
      custom: (props) => <CustomNode {...props} onAddNode={onAddNode} />,
    }),
    [onAddNode],
  );
  return (
    <div className="h-screen w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        panOnDrag={true}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
