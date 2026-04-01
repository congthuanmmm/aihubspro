import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("__fb_session")?.value;
  const role = request.cookies.get("__fb_role")?.value;

  // Lấy path hiện tại
  const pathname = request.nextUrl.pathname;

  // Bảo vệ route /admin
  if (pathname.startsWith("/admin")) {
    if (!session || role !== "admin") {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Bảo vệ route /khoa-hoc (chỉ cần đăng nhập)
  if (pathname.startsWith("/khoa-hoc")) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Nếu người dùng đã đăng nhập (có session) nhưng vào trang /login hoặc /register
  // -> chuyển hướng về trang chủ
  if ((pathname === "/login" || pathname === "/register") && session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Config các route cần chạy middleware này
export const config = {
  matcher: [
    "/admin/:path*",
    "/khoa-hoc/:path*",
    "/login",
    "/register"
  ],
};
