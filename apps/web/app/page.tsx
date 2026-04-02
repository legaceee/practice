import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div className="w-full">
      <Navbar />
      <div className="flex mx-auto max-w-6xl mt-9 p-12">
        <div className="flex flex-col  justify-between">
          <h2 className="bold text-3xl ">
            The automation layer for agentic AI
          </h2>
          <p className="mt-4 max-w-md">
            One MCP connection. 8,000+ apps. Set your policies and work across
            any model, surface, or agent harness — without connections or rules
            breaking.
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
      </div>
    </div>
  );
}
