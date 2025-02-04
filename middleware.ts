import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const userID = req.cookies.get("userID")?.value;

  // Redirect if no userID and not on sign-in page
  if (!userID && req.nextUrl.pathname !== "/sign-in") {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
  // redirect to home page if userID exists 
  if (userID && req.nextUrl.pathname != "/") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Clone the request and attach the userID to headers
  const requestHeaders = new Headers(req.headers);
  if (userID) {
    requestHeaders.set("x-user-id", userID); // Attach userID to headers
  }

  const response = NextResponse.next();
  response.headers.set("x-user-id", userID || ""); // Also attach it to response if needed

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"], // Protect these routes
};
