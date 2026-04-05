import { cookies } from "next/headers";

export async function fetchWithAuth(url: string, options: any = {}) {
  const cookieStore = cookies();

  let res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Cookie: cookieStore.toString(),
    },
    cache: "no-store",
  });

  //  If access token expired
  if (res.status === 401) {
    // call refresh
    await fetch("http://localhost:3001/auth/refresh", {
      method: "POST",
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    // retry original request
    res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Cookie: cookieStore.toString(),
      },
    });
  }

  return res;
}
