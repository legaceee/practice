import Image from "next/image";
import aside from "../public/aside1.png";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div className="w-full">
      <Navbar />
      <div className="border border-gray-300">
        <div className="md:flex mx-auto max-w-6xl border-l border-r border-gray-300 p-12 gap-8 justify-center ">
          <div className="flex flex-col  justify-between">
            <h2 className="font-medium text-3xl ">
              The automation layer for agentic AI
            </h2>
            <p className="mt-4 max-w-md">
              One MCP connection. 8,000+ apps. Set your policies and work across
              any model, surface, or agent harness — without connections or
              rules breaking.
            </p>
            <div className="flex gap-4 mt-9">
              <button className="p-4 bg-amber-500 rounded-md">
                Start Free With Email
              </button>
              <button className="p-4 bg-amber-50 rounded-md border ">
                Start Free with Google
              </button>
            </div>
          </div>
          <Image src={aside} alt="image" width={478} height={560} />
        </div>
      </div>
      <div className="font-extralight -mt-4 bg-white block w-fit px-4 mx-12">
        Trusted by the world’s best companies
      </div>
    </div>
  );
}
