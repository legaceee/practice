"use client";
import { useState, useRef } from "react";
export default function Canvass() {
  const [nodes, setNodes] = useState([
    { id: 1, x: 200, y: 150, label: "Start" },
  ]);
  const [transform, setTransform] = useState({
    x: 0,
    y: 0,
    scale: 1,
  });
  const isPanning = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  const onMouseDown = (e) => {
    isPanning.current = true;
    last.current = { x: e.clientX, y: e.clientY };
  };
  const onMouseMove = (e) => {
    if (!isPanning.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;

    setTransform((prev) => ({
      ...prev,
      x: prev.x + dx,
      y: prev.y + dy,
    }));
    last.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseUp = () => {
    isPanning.current = false;
  };
  const onWheel = (e) => {
    e.preventDefault();
    const zoomFactor = 0.1;
    const newScale = Math.max(
      0.5,
      Math.min(2, transform.scale - e.deltaY * zoomFactor * 0.01),
    );
    setTransform((prev) => ({
      ...prev,
      scale: newScale,
    }));
  };
  return (
    <div
      className="w-screen h-screen bg-gray-100 overflow-hidden"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onWheel={onWheel}
    >
      {/* viewport */}
      <div
        onMouseDown={onMouseDown}
        className="w-full h-full cursor-grab active:cursor-grabbing text-black"
      >
        {/* world */}
        <div
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            transformOrigin: "0 0",
          }}
          className="w-[2000px] h-[2000px] bg-white relative"
        >
          {nodes.map((node) => (
            <div
              key={node.id}
              className="absolute bg-black text-white px-4 py-2 rounded"
              style={{
                transform: `translate(${node.x}px, ${node.y}px)`,
              }}
            >
              {node.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
