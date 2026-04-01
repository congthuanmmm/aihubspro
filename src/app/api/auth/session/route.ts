import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { token, role } = await request.json();
    
    // Lưu ý: Trong production, nên verify token này với firebase-admin
    // (yc. Service Account) trước khi set cookie. Ở đây set token làm cookie
    // session với maxAge = 14 ngày (giống session firebase).
    
    const cookieStore = await cookies();
    cookieStore.set("__fb_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 14, // 14 days
      path: "/",
      sameSite: "lax",
    });

    if (role) {
      cookieStore.set("__fb_role", role, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 14,
        path: "/",
        sameSite: "lax",
      });
    }

    return NextResponse.json({ success: true, message: "Session created" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal Error" }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("__fb_session");
  cookieStore.delete("__fb_role");
  return NextResponse.json({ success: true, message: "Session destroyed" }, { status: 200 });
}
