import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  cookieStore.delete("refreshToken");
  
  // Redirect to signin page
  const url = new URL("/auth/signin", request.url);
  return NextResponse.redirect(url);
}
