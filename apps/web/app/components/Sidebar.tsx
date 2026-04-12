"use client";
import { Calendar, Clock, History, Home, Settings, Zap } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const [active, setActive] = useState("Home");

  const items = [
    { name: "Home", icon: <Home size={18} /> },
    { name: "Zaps", icon: <Zap size={18} /> },
    { name: "Calendar", icon: <Calendar size={18} /> },
    { name: "History", icon: <History size={18} /> },
    { name: "Settings", icon: <Settings size={18} /> },
  ];

  return (
    <aside className="group h-screen bg-[#2f2a28] text-white w-14 hover:w-56 transition-all duration-300 ease-in-out">
      <div className="flex flex-col h-full justify-between py-3">
        {/* TOP MENU */}
        <ul className="flex flex-col gap-1 px-2">
          {items.map((ele, index) => (
            <li
              key={index}
              onClick={() => setActive(ele.name)}
              className="relative group/item"
            >
              {/* ACTIVE INDICATOR */}
              {active === ele.name && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-orange-400 rounded-r" />
              )}

              <div
                className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-all
                ${
                  active === ele.name
                    ? "bg-white text-black"
                    : "hover:bg-white/10"
                }`}
              >
                {/* ICON */}
                <div className="min-w-[18px] flex justify-center">
                  {ele.icon}
                </div>

                {/* TEXT (SLIDE + FADE) */}
                <span className="opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 whitespace-nowrap">
                  {ele.name}
                </span>
              </div>

              {/* TOOLTIP (ONLY WHEN COLLAPSED) */}
              <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-black text-xs px-2 py-1 rounded opacity-0 group-hover/item:opacity-0 group-hover:opacity-0 group-hover/item:group-hover:opacity-100 pointer-events-none whitespace-nowrap">
                {ele.name}
              </div>
            </li>
          ))}
        </ul>

        {/* PROFILE */}
        <div className="flex justify-center pb-3">
          <div className="w-8 h-8 rounded-full bg-purple-400 flex items-center justify-center text-sm font-semibold">
            ap
          </div>
        </div>
      </div>
    </aside>
  );
}
