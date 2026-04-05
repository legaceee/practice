import { redirect } from "next/navigation";
import { cookies } from "next/headers";
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

  const user = await res.json();

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>

      <p>Welcome 👋</p>
      <p>User ID: {user.id}</p>
      <p>Email: {user.email}</p>
    </div>
  );
}
