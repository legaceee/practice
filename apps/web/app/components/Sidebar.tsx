import { Calendar, Clock, History, Home, Zap } from "lucide-react";

export default function Sidebar() {
  const items = [
    {
      name: "home",
      icon: <Home size={18} />,
    },
    {
      name: "zap",
      icon: <Zap size={18} />,
    },
    {
      name: "calendar",
      icon: <Calendar size={18} />,
    },
    {
      name: "clock",
      icon: <Clock size={18} />,
    },
    {
      name: "history",
      icon: <History size={18} />,
    },
  ];
  return (
    <aside className="h-screen flex items-stretch relative overflow-visible">
      <div className="relative flex flex-col justify-between h-screen w-14 px-2 bg-[#413735] text-white z-[104]">
        <ul className="flex flex-col gap-2.5 list-none">
          {items.map((ele, index) => (
            <li className="flex items-center justify-center" key={index}>
              {ele.icon}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
