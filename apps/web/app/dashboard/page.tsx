import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Sidebar from "../components/Sidebar";

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
    <div className="w-full h-full bg-gray-50">
      <Sidebar />
    </div>
  );
}
