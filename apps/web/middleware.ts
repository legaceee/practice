import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/signin", "/signup"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("refreshToken")?.value;
  const { pathname } = req.nextUrl;
  console.log("MIDDLEWARE HIT:", pathname, token);

  //  Logged in user should not see auth pages
  if (token && PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  //  Not logged in → block protected routes
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/signin", "/signup"],
};
