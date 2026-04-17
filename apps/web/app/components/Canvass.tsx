// "use client";
// import { useState, useRef } from "react";
// export default function Canvass() {
//   const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
//   const [nodes, setNodes] = useState([
//     { id: 1, x: 200, y: 150, label: "Start" },
//   ]);
//   const [transform, setTransform] = useState({
//     x: 0,
//     y: 0,
//     scale: 1,
//   });
//   const isPanning = useRef(false);
//   const last = useRef({ x: 0, y: 0 });

//   const onMouseDown = (e) => {
//     isPanning.current = true;
//     last.current = { x: e.clientX, y: e.clientY };
//   };
//   const WORLD_WIDTH = 2000;
//   const WORLD_HEIGHT = 2000;

//   const onMouseMove = (e) => {
//     if (!isPanning.current) return;

//     const dx = e.clientX - last.current.x;
//     const dy = e.clientY - last.current.y;

//     setTransform((prev) => {
//       const newX = prev.x + dx;
//       const newY = prev.y + dy;

//       const scaledWidth = WORLD_WIDTH * prev.scale;
//       const scaledHeight = WORLD_HEIGHT * prev.scale;

//       const viewportWidth = window.innerWidth;
//       const viewportHeight = window.innerHeight;

//       const minX = viewportWidth - scaledWidth;
//       const minY = viewportHeight - scaledHeight;

//       return { ...prev, x: minX, y: minY };
//     });

//     last.current = { x: e.clientX, y: e.clientY };
//   };

//   const onMouseUp = () => {
//     isPanning.current = false;
//   };
//   const onWheel = (e) => {
//     e.preventDefault();
//     const zoomFactor = 0.1;
//     const newScale = Math.max(
//       0.5,
//       Math.min(2, transform.scale - e.deltaY * zoomFactor * 0.01),
//     );
//     setTransform((prev) => ({
//       ...prev,
//       scale: newScale,
//     }));
//   };
//   return (
//     <div
//       className="w-full h-full bg-gray-100 overflow-hidden"
//       onMouseMove={onMouseMove}
//       onMouseUp={onMouseUp}
//       onMouseLeave={onMouseUp}
//       onWheel={onWheel}
//     >
//       {/* viewport */}
//       <div
//         onMouseDown={onMouseDown}
//         className="w-full h-full cursor-grab active:cursor-grabbing text-black"
//       >
//         {/* world */}
//         <div
//           style={{
//             transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
//             transformOrigin: "0 0",
//           }}
//           className="w-[200000px] h-[2000000px] bg-white relative overflow-hidden"
//         >
//           {nodes.map((node) => (
//             <div
//               key={node.id}
//               className="absolute bg-black text-white px-4 py-2 rounded"
//               style={{
//                 transform: `translate(${node.x}px, ${node.y}px)`,
//               }}
//             >
//               {node.label}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";
import { useState, useRef } from "react";

export default function Canvas() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const [nodes, setNodes] = useState([{ id: 1, x: 0, y: 0, label: "Start" }]);

  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  const onMouseDown = (e) => {
    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseMove = (e) => {
    if (!dragging.current) return;

    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;

    setOffset((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));

    last.current = { x: e.clientX, y: e.clientY };
  };

  const stop = () => (dragging.current = false);

  return (
    <div
      className="w-screen h-screen overflow-hidden bg-gray-100"
      onMouseMove={onMouseMove}
      onMouseUp={stop}
      onMouseLeave={stop}
    >
      {/* GRID */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${offset.x}px, ${offset.y}px)`,
          backgroundImage: `
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* NODES */}
      {nodes.map((node) => (
        <div
          key={node.id}
          style={{
            position: "absolute",
            left: node.x + offset.x,
            top: node.y + offset.y,
            padding: "12px 20px",
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          {node.label}
        </div>
      ))}

      {/* PAN LAYER */}
      <div
        onMouseDown={onMouseDown}
        style={{
          position: "absolute",
          inset: 0,
          cursor: "grab",
        }}
      />
    </div>
  );
}
