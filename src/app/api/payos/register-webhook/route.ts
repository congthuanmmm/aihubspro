import { NextResponse } from "next/server";
import { PayOS } from "@payos/node";

export async function GET(request: Request) {
  try {
    const payos = new PayOS({
      clientId: process.env.PAYOS_CLIENT_ID || "",
      apiKey: process.env.PAYOS_API_KEY || "",
      checksumKey: process.env.PAYOS_CHECKSUM_KEY || ""
    });

    // Tự động lấy tên miền hiện tại
    const host = request.headers.get("host");
    const DOMAIN = host?.includes("localhost") ? `http://${host}` : `https://${host}`;

    const webhookUrl = `${DOMAIN}/api/payos/webhook`;
    const confirm = await payos.webhooks.confirm(webhookUrl);
    
    return NextResponse.json({ success: true, webhookUrl, confirm });
  } catch (err: any) {
    console.error("Webhook Registration Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
