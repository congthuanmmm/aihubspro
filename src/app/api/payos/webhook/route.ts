import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { PayOS } from "@payos/node";

// Hỗ trợ Mocking qua GET (Browser Redirect)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderCode = searchParams.get("orderCode");
  const mock = searchParams.get("mock");

  if (mock && orderCode) {
    return await handlePaymentSuccess(orderCode);
  }

  return NextResponse.json({ success: true, message: "Webhook endpoint ready" }, { status: 200 });
}

// Xử lý Thực Tế qua POST (Webhook thật từ PayOS)
export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("PayOS Webhook Data:", data);
    
    // Khởi tạo PayOS để xác thực chữ ký Webhook
    const payos = new PayOS({
      clientId: process.env.PAYOS_CLIENT_ID || "",
      apiKey: process.env.PAYOS_API_KEY || "",
      checksumKey: process.env.PAYOS_CHECKSUM_KEY || ""
    });

    // Xác thực Webhook (Ném ra lỗi nếu sai signature)
    const webhookData = await payos.webhooks.verify(data);

    if (webhookData.orderCode && (data.code === "00" || data.desc === "success")) {
      return await handlePaymentSuccess(webhookData.orderCode.toString(), true);
    }
    
    return NextResponse.json({ success: true, message: "Ignored" }, { status: 200 });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// Hàm xử lý Cấp Quyền Khóa Học
async function handlePaymentSuccess(orderCode: string, isReal = false) {
  try {
    const pendingRef = doc(db, "pending_orders", `${orderCode}`);
    const pendingSnap = await getDoc(pendingRef);

    if (!pendingSnap.exists()) {
      return NextResponse.json({ success: true, message: "Order Not Found or Test Webhook" }, { status: 200 });
    }

    const orderData = pendingSnap.data();

    // 1. Phân quyền Database (Ghi vào User Courses)
    const userCourseRef = doc(db, "users", orderData.userId, "user_courses", orderData.courseId);
    await setDoc(userCourseRef, {
      courseId: orderData.courseId,
      amount: orderData.amount,
      purchasedAt: new Date(), // Không dùng serverTimestamp() khi ở môi trường Next.js server vì đôi khi thiếu auth context tùy rules
      orderCode: orderCode,
      source: isReal ? "payos_webhook" : "mock",
    });

    // 2. Đánh dấu Đơn Hàng Thành Công
    await updateDoc(pendingRef, {
      status: "SUCCESS"
    });

    // Nếu là luồng Mock (Redirect từ Browser), đẩy thẳng User vô Lớp Học
    if (!isReal) {
      return NextResponse.redirect(`http://localhost:3000/khoa-hoc/${orderData.courseId}/learn?unlocked=true`);
    }

    return NextResponse.json({ success: true, message: "Course Unlocked" }, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
