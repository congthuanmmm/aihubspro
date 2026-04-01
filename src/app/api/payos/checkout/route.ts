import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import courses from "@/data/khoa-hoc.json";
import { PayOS } from "@payos/node";

export async function POST(request: Request) {
  try {
    const { courseId, userId, email } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "Bạn cần đăng nhập để mua khóa học!" }, { status: 401 });
    }

    // Lấy data khóa học từ JSON đã import
    const course = courses.find((c: any) => c.id === courseId);

    if (!course) {
      return NextResponse.json({ error: "Không tìm thấy khóa học" }, { status: 404 });
    }

    // Sinh mã đơn hàng ngẫu nhiên (chỉ được tối đa 53 bit ~ number)
    const orderCode = Number(String(Date.now()).slice(-6)); 

    // Ghi pending order vào Database
    const orderRef = doc(db, "pending_orders", `${orderCode}`);
    await setDoc(orderRef, {
      userId,
      email,
      courseId,
      amount: course.numericPrice,
      status: "PENDING",
      createdAt: serverTimestamp(),
    });

    const DOMAIN = request.headers.get("origin") || "http://localhost:3000";

    // Khởi tạo PayOS
    const payos = new PayOS({
      clientId: process.env.PAYOS_CLIENT_ID || "",
      apiKey: process.env.PAYOS_API_KEY || "",
      checksumKey: process.env.PAYOS_CHECKSUM_KEY || ""
    });

    const body = {
      orderCode,
      amount: course.numericPrice,
      description: `Mua KH ${courseId}`.slice(0, 25),
      returnUrl: `${DOMAIN}/khoa-hoc/${courseId}/learn`, // Khi quét QR xong bấm quay về Lớp học
      cancelUrl: `${DOMAIN}/khoa-hoc/${courseId}` // Hủy thì quay về trang giới thiệu
    };

    const paymentLinkRes = await payos.paymentRequests.create(body);

    // Trả về Link để Frontend đẩy người dùng thẳng qua cổng QR Payos
    return NextResponse.json({ checkoutUrl: paymentLinkRes.checkoutUrl });

  } catch (error: any) {
    console.error("PayOS Checkout Error:", error);
    return NextResponse.json({ error: error.message || "Internal Error" }, { status: 500 });
  }
}
