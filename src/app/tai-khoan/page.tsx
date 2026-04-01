import type { Metadata } from "next";
import {
  Shield,
  Headphones,
  RefreshCw,
  Zap,
  MessageCircle,
  Phone,
} from "lucide-react";
import { ProductCard, type Product } from "@/components/ui/product-card";

export const metadata: Metadata = {
  title: "Tài Khoản Giá Rẻ – AI & Sáng Tạo Chính Chủ",
  description:
    "Mua tài khoản ChatGPT Plus, Grok, Gemini, Capcut Pro, Freepik, Kling chính hãng, giá rẻ, bảo hành fulltime tại Aihubs PRO.",
  openGraph: {
    title: "Tài Khoản Giá Rẻ – AI & Sáng Tạo Chính Chủ | Aihubs PRO",
    description:
      "Mua tài khoản AI chính hãng giá tốt nhất. Bảo hành suốt thời gian, hỗ trợ 24/7.",
  },
};

// ─── Config ───────────────────────────────────────────────────────────────────
const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQIzFqkc7sC-gZCw_RkIPCa6-lwabY4KF_ARCnyFnbwltLOR1y6DZsOL59tsy7z7OFmQtictqHrmCxz/pub?output=csv";

const ZALO_LINK = "https://zalo.me/0985886879";
const PHONE_NUMBER = "0985.886.879";

// ─── Parse helpers ────────────────────────────────────────────────────────────
function inferCategory(name: string): Product["category"] {
  const lc = name.toLowerCase();
  if (
    lc.includes("chatgpt") ||
    lc.includes("grok") ||
    lc.includes("gemini") ||
    lc.includes("google ultra") ||
    lc.includes("google pro")
  )
    return "ai";
  if (
    lc.includes("capcut") ||
    lc.includes("freepik") ||
    lc.includes("canva") ||
    lc.includes("kling") ||
    lc.includes("elevenlab")
  )
    return "creative";
  return "other";
}

function inferBadge(
  name: string,
  note: string
): { badge?: string; badgeColor?: Product["badgeColor"] } {
  const lc = name.toLowerCase() + " " + note.toLowerCase();
  if (lc.includes("chatgpt plus") && lc.includes("tháng"))
    return { badge: "Bán chạy", badgeColor: "hot" };
  if (lc.includes("grok")) return { badge: "Dùng nhiều nhất", badgeColor: "popular" };
  if (lc.includes("capcut") && lc.includes("năm"))
    return { badge: "Khuyến mãi", badgeColor: "sale" };
  if (lc.includes("google ultra") || lc.includes("google pro"))
    return { badge: "HOT", badgeColor: "hot" };
  if (lc.includes("freepik")) return { badge: "Bán chạy", badgeColor: "hot" };
  return {};
}

function buildFeatures(name: string, note: string): string[] {
  const features: string[] = [];
  const lc = name.toLowerCase();
  const lcNote = note.toLowerCase();

  // Note-driven features
  if (lcNote.includes("email chính chủ"))
    features.push("Email chính chủ – thêm vào dùng ngay");
  if (lcNote.includes("bảo hành fulltime") || lcNote.includes("bảo hành full"))
    features.push("Bảo hành fulltime suốt thời gian");
  if (lcNote.includes("1 đổi 1")) features.push("Đổi mới 1:1 nếu lỗi");
  if (lcNote.includes("12 tháng") || lcNote.includes("1 năm") || lcNote.includes("full 12"))
    features.push("Sử dụng trọn 12 tháng");
  if (lcNote.includes("tool auto grok") || lcNote.includes("tool"))
    features.push("🎁 Tặng kèm Tool Auto Grok + hướng dẫn");
  if (lcNote.includes("nâng cấp chính chủ") || lcNote.includes("nâng cấp email"))
    features.push("Nâng cấp email chính chủ của bạn");
  if (lcNote.includes("window") || lcNote.includes("cài máy"))
    features.push("Cài trực tiếp trên máy Windows");
  if (lcNote.includes("30 ngày") && !lcNote.includes("12 tháng"))
    features.push("Hạn dùng 30 ngày");

  // Name-driven features
  if (lc.includes("chatgpt plus"))
    features.push("Truy cập GPT-4o & DALL-E 3");
  if (lc.includes("grok"))
    features.push("Super Grok – AI mạnh nhất của xAI");
  if (lc.includes("capcut"))
    features.push("Capcut Pro – không watermark, full template");
  if (lc.includes("freepik"))
    features.push("Freepik Premium – tải ảnh vector & AI không giới hạn");
  if (lc.includes("canva"))
    features.push("Canva Pro – 600K+ template, xuất PDF/Video HD");
  if (lc.includes("kling"))
    features.push("Kling – tạo video AI chất lượng ultra-HD");
  if (lc.includes("elevenlab"))
    features.push("ElevenLab – 6 triệu ký tự text-to-speech");
  if (lc.includes("google ultra") || lc.includes("google pro"))
    features.push("Google AI Ultra – model Gemini Ultra mạnh nhất");

  // Universal
  features.push("Hỗ trợ kỹ thuật 24/7 qua Zalo");

  // Deduplicate & cap
  return [...new Set(features)].slice(0, 6);
}

// ─── Minimal CSV parser (handles quoted fields with newlines) ─────────────────
function parseCsvRow(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCsv(raw: string): Product[] {
  // Normalise line endings and join quoted multi-line values
  const chars = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  // Re-assemble logical rows (quoted fields may span lines)
  const logicalLines: string[] = [];
  let current = "";
  let inQ = false;
  for (const ch of chars) {
    if (ch === '"') { inQ = !inQ; current += ch; }
    else if (ch === "\n" && !inQ) { logicalLines.push(current); current = ""; }
    else { current += ch; }
  }
  if (current) logicalLines.push(current);

  const rows = logicalLines
    .slice(1) // skip header
    .map((l) => parseCsvRow(l))
    .filter((r) => r.length >= 3 && r[0]);

  return rows.map((r) => {
    const name    = r[0] ?? "";
    const origPx  = r[1] ?? "";
    const salePx  = r[2] ?? "";
    const note    = r[3] ?? "";
    const cat     = inferCategory(name);
    const { badge, badgeColor } = inferBadge(name, note);
    const features = buildFeatures(name, note);

    return {
      name,
      originalPrice: origPx,
      salePrice: salePx,
      note,
      category: cat,
      badge,
      badgeColor,
      features,
      zaloUrl: ZALO_LINK,
    } satisfies Product;
  });
}

// ─── Data fetcher (Server Component) ─────────────────────────────────────────
async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch(SHEET_CSV_URL, {
      next: { revalidate: 3600 }, // ISR: re-fetch every 1 hour
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    return parseCsv(text);
  } catch (err) {
    console.error("[tai-khoan] Failed to fetch product sheet:", err);
    return [];
  }
}

// ─── Why-buy reasons ─────────────────────────────────────────────────────────
const TRUST_ITEMS = [
  {
    icon: Shield,
    title: "Bảo hành Fulltime",
    desc: "Tài khoản bị lỗi? Chúng tôi đổi mới ngay – không câu hỏi, không phí phát sinh.",
  },
  {
    icon: Zap,
    title: "Nâng cấp Chính Chủ",
    desc: "Bạn dùng email của mình – chúng tôi nâng cấp trực tiếp, không share, không mất dữ liệu.",
  },
  {
    icon: Headphones,
    title: "Hỗ trợ 24/7 qua Zalo",
    desc: "Nhắn Zalo bất cứ lúc nào, phản hồi nhanh trong vòng 15 phút ngay cả ban đêm.",
  },
  {
    icon: RefreshCw,
    title: "Cập nhật kịp thời",
    desc: "Khi nhà cung cấp thay đổi chính sách, bạn luôn được thông báo & hỗ trợ chuyển đổi miễn phí.",
  },
];

// ─── Category labels ──────────────────────────────────────────────────────────
const CATEGORY_META: Record<
  Product["category"],
  { label: string; emoji: string; desc: string }
> = {
  ai: {
    label: "Công cụ AI",
    emoji: "🤖",
    desc: "ChatGPT, Grok, Gemini – tất cả mô hình AI hàng đầu, giá tốt nhất thị trường",
  },
  creative: {
    label: "Công cụ Sáng tạo",
    emoji: "🎨",
    desc: "Capcut, Freepik, Kling, Canva – bộ công cụ sáng tạo nội dung chuyên nghiệp",
  },
  other: {
    label: "Công cụ Khác",
    emoji: "⚡",
    desc: "Các tài khoản hữu ích cho công việc & sản xuất nội dung mỗi ngày",
  },
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function TaiKhoanPage() {
  const products = await fetchProducts();

  const grouped = {
    ai:       products.filter((p) => p.category === "ai"),
    creative: products.filter((p) => p.category === "creative"),
    other:    products.filter((p) => p.category === "other"),
  };

  // Decide which card to highlight per category (the one marked hot, or first)
  const highlightMap: Record<Product["category"], number> = {
    ai:       grouped.ai.findIndex((p) => p.badgeColor === "hot"),
    creative: grouped.creative.findIndex((p) => p.badgeColor === "hot"),
    other:    0,
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background ambient glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 py-16 md:py-20 space-y-24">

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="text-center max-w-3xl mx-auto space-y-5">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold tracking-widest uppercase">
            🏷️ Tài khoản giá rẻ
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.08]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-200 to-cyan-300">
              AI & Sáng Tạo
            </span>
            <br />
            <span className="text-white/90">Giá Sinh Viên, Bảo Hành VIP</span>
          </h1>

          <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Tất cả tài khoản đều là <strong className="text-emerald-400">chính chủ, nâng cấp thẳng vào email bạn</strong>. 
            Bảo hành fulltime, hỗ trợ 24/7 – không lo bị khóa, không lo mất tiền oan.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={ZALO_LINK}
              target="_blank"
              rel="noopener noreferrer"
              id="hero-cta-zalo"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-black bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-[0_0_25px_rgba(45,212,191,0.35)] hover:brightness-110 transition-all active:scale-95 text-sm md:text-base"
            >
              <MessageCircle className="w-4 h-4" />
              Nhắn Zalo ngay
            </a>
            <a
              href={`tel:${PHONE_NUMBER.replace(/\./g, "")}`}
              id="hero-cta-phone"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-emerald-300 border border-emerald-500/30 bg-emerald-950/30 hover:bg-emerald-500/10 transition-all text-sm md:text-base"
            >
              <Phone className="w-4 h-4" />
              {PHONE_NUMBER}
            </a>
          </div>
        </section>

        {/* ── Product Categories ────────────────────────────────────── */}
        {(["ai", "creative", "other"] as const).map((cat) => {
          const items = grouped[cat];
          if (!items.length) return null;
          const meta = CATEGORY_META[cat];

          return (
            <section key={cat} id={`category-${cat}`} className="space-y-8">
              {/* Category header */}
              <div className="flex flex-col sm:flex-row sm:items-end gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-2xl">{meta.emoji}</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                      {meta.label}
                    </h2>
                  </div>
                  <p className="text-slate-400 text-sm md:text-base">{meta.desc}</p>
                </div>
                {/* Decorative line */}
                <div className="hidden sm:block flex-1 h-px bg-gradient-to-r from-emerald-500/30 to-transparent mb-1.5" />
              </div>

              {/* Cards grid */}
              <div
                className={`grid gap-5 ${
                  items.length === 1
                    ? "grid-cols-1 max-w-sm"
                    : items.length === 2
                    ? "grid-cols-1 sm:grid-cols-2 max-w-2xl"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {items.map((product, i) => (
                  <ProductCard
                    key={`${cat}-${i}`}
                    product={product}
                    highlighted={
                      highlightMap[cat] === -1
                        ? i === 0
                        : i === highlightMap[cat]
                    }
                  />
                ))}
              </div>
            </section>
          );
        })}

        {/* ── Why buy here ──────────────────────────────────────────── */}
        <section id="tai-sao-chon-chung-toi" className="space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Tại sao nên mua tại{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                Aihubs.PRO?
              </span>
            </h2>
            <p className="text-slate-400 text-sm md:text-base">
              Hàng nghìn khách hàng đã lựa chọn và tin tưởng – bởi vì chúng tôi luôn
              đặt quyền lợi của bạn lên hàng đầu.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TRUST_ITEMS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="flex flex-col gap-4 p-6 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md hover:border-emerald-500/40 hover:bg-white/[0.05] transition-all duration-300"
                >
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1.5">{item.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Quick Contact CTA ─────────────────────────────────────── */}
        <section
          id="contact-cta"
          className="relative overflow-hidden rounded-3xl border border-emerald-500/25 bg-gradient-to-br from-emerald-950/60 via-slate-900/80 to-cyan-950/60 p-8 md:p-12"
        >
          {/* Ambient blurs inside CTA */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-emerald-500/10 blur-[80px]" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full bg-cyan-500/8 blur-[80px]" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
            {/* Text */}
            <div className="flex-1 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-semibold tracking-widest uppercase">
                💬 Cần tư vấn nhanh?
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-snug">
                Chưa biết chọn gói nào phù hợp?
              </h2>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                Nhắn Zalo hoặc gọi cho chúng tôi – sẽ tư vấn miễn phí, giúp bạn chọn
                đúng công cụ AI tiết kiệm nhất trong vòng <strong className="text-emerald-400">5 phút</strong>.
              </p>
              <p className="text-emerald-400 font-mono font-bold text-lg tracking-wider">
                📞 {PHONE_NUMBER}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 min-w-[200px]">
              <a
                href={ZALO_LINK}
                target="_blank"
                rel="noopener noreferrer"
                id="footer-cta-zalo"
                className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl font-bold text-black bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-[0_0_25px_rgba(45,212,191,0.3)] hover:brightness-110 transition-all active:scale-95 text-sm md:text-base"
              >
                <MessageCircle className="w-5 h-5" />
                Nhắn Zalo tư vấn
              </a>
              <a
                href={`tel:${PHONE_NUMBER.replace(/\./g, "")}`}
                id="footer-cta-phone"
                className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl font-semibold text-emerald-300 border border-emerald-500/30 bg-transparent hover:bg-emerald-500/10 transition-all text-sm md:text-base"
              >
                <Phone className="w-5 h-5" />
                Gọi điện ngay
              </a>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
