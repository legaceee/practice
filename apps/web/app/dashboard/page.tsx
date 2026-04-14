import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Sidebar from "../components/Sidebar";
import CanvasPage from "../components/Canvas";
import Canvass from "../components/Canvass";

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
    redirect("/auth/signin");
  }

  await res.json();

  return (
    <div className="grid grid-cols-[auto_1fr] overflow-hidden h-screen ">
      <Sidebar />
      <main className="text-black h-[110dvh] overflow-y-auto">
        <div>
          <CanvasPage />
        </div>
      </main>
    </div>
  );
}
