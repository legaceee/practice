"use client";
import { Calendar, History, Home, Settings, Zap, Plus, MoreHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("active") || "Home";

  const handleClick = (name: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("active", name);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const items = [
    { name: "Home", icon: <Home size={20} /> },
    { name: "Zaps", icon: <Zap size={20} /> },
    { name: "Calendar", icon: <Calendar size={20} /> },
    { name: "History", icon: <History size={20} /> },
    { name: "Settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="w-16 shrink-0 h-screen bg-[#2d2e2e]">
      <aside className="fixed left-0 top-0 h-screen bg-[#2d2e2e] text-[#dcdcdc] w-16 hover:w-64 transition-all duration-300 ease-in-out z-50 overflow-hidden group shadow-[4px_0_24px_rgba(0,0,0,0.15)] border-r border-[#3f4040]">
        <div className="flex flex-col h-full py-4">
          {/* Logo */}
          <div className="px-4 mb-6 flex items-center h-8 cursor-pointer" onClick={() => handleClick("Home")}>
            <div className="min-w-[32px] w-[32px] h-[32px] rounded flex items-center justify-center bg-[#ff4f00] text-white font-bold text-xl">
              _
            </div>
            <span className="ml-3 font-bold text-white text-xl tracking-tight whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Zapier
            </span>
          </div>

          {/* Create Button */}
          <div className="px-3 mb-6">
            <button className="flex items-center w-full h-10 rounded-full bg-white text-black hover:bg-gray-200 transition-colors shadow-sm overflow-hidden">
              <div className="min-w-[40px] flex items-center justify-center">
                <Plus size={20} />
              </div>
              <span className="font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Create
              </span>
            </button>
          </div>

          {/* Nav Items */}
          <ul className="flex flex-col gap-1 px-2 flex-1">
            {items.map((ele, index) => {
              const isActive = active === ele.name;
              return (
                <li
                  key={index}
                  onClick={() => handleClick(ele.name)}
                  className="relative group/item"
                >
                  <div
                    className={`flex items-center h-10 rounded-md cursor-pointer transition-colors
                    ${isActive ? "bg-[#3f4040] text-white font-medium" : "hover:bg-[#3f4040] text-gray-300"}`}
                  >
                    {/* Active Line indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#ff4f00] rounded-r-full" />
                    )}

                    <div className="min-w-[48px] flex items-center justify-center">
                      {ele.icon}
                    </div>
                    
                    <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {ele.name}
                    </span>
                  </div>

                  {/* Tooltip when collapsed */}
                  <div className="absolute left-[72px] top-1/2 -translate-y-1/2 bg-[#3f4040] text-white text-xs px-2.5 py-1.5 rounded shadow-lg opacity-0 group-hover/item:opacity-100 group-hover:hidden pointer-events-none whitespace-nowrap z-50 font-medium">
                    {ele.name}
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Bottom Profile */}
          <div className="px-3 mt-auto">
             <div className="flex items-center h-12 rounded-md hover:bg-[#3f4040] cursor-pointer transition-colors">
               <div className="min-w-[40px] flex items-center justify-center">
                 <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm font-semibold text-white shadow-sm border border-purple-500">
                   AP
                 </div>
               </div>
               <div className="ml-1 flex-1 flex flex-col whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden">
                 <span className="text-sm font-medium text-white truncate">Ashish P.</span>
                 <span className="text-xs text-gray-400 truncate">Free Plan</span>
               </div>
               <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 pr-2">
                 <MoreHorizontal size={16} className="text-gray-400" />
               </div>
             </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
