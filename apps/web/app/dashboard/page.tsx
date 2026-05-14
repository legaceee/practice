import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Sidebar from "../components/Sidebar";
import WorkflowBuilder from "../components/WorkflowBuilder";
export default async function page() {
  const cookieStore = cookies();

  const res = await fetch("http://localhost:3001/auth/details", {
    credentials: "include",
    cache: "no-store",
    headers: {
      cookie: (await cookieStore).toString(),
    },
  });
  if (!res.ok) {
    redirect("/api/logout");
  }

  await res.json();

  return (
    <div className="grid grid-cols-[auto_1fr] overflow-hidden h-screen bg-[#fcfcfc]">
      <Sidebar />
      <main className="text-black h-screen overflow-hidden flex flex-col">
        <div className="flex-1 w-full h-full relative">
          <WorkflowBuilder />
        </div>
      </main>
    </div>
  );
}
