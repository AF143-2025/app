import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get("admin_session_token")?.value;

    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      loginUrl.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(loginUrl);
    }

    try {
      const [encodedPayload, signature] = token.split(".");
      if (!encodedPayload || !signature) {
        throw new Error("Invalid token format");
      }

      const payload = JSON.parse(
        Buffer.from(encodedPayload, "base64url").toString("utf8")
      );

      // Verify expiration
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        throw new Error("Token expired");
      }

      // Verify role
      if (payload.role !== "ADMIN" && payload.role !== "admin") {
        throw new Error("Insufficient role");
      }
    } catch (err) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      loginUrl.searchParams.set("error", "invalid_session");
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("admin_session_token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
