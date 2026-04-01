import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowLeft, Star, Eye, CheckCircle2, Globe, Tag } from "lucide-react";
import { slugify } from "@/lib/slugify";
import { ToolLogoClient, RelatedLogoClient } from "./ToolLogoClient";

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRpP5McaQlTg53FW1ZOPpiWPkyYcDPa20CPir-RM1NJXiklG90xM08jUA8-5fg8Ef7CwjTrEduxPbkk/pub?output=csv";

interface AiTool {
  category: string;
  name: string;
  link: string;
  features: string;
  logo: string;
  summary?: string;
}

function parseCSV(csv: string): AiTool[] {
  const lines = csv.split("\n");
  const tools: AiTool[] = [];
  let currentLine = "";
  for (const line of lines.slice(1)) {
    currentLine += (currentLine ? "\n" : "") + line;
    const quoteCount = (currentLine.match(/"/g) || []).length;
    if (quoteCount % 2 !== 0) continue;
    const cols: string[] = [];
    let inQuotes = false;
    let col = "";
    for (let i = 0; i < currentLine.length; i++) {
      const c = currentLine[i];
      if (c === '"') { inQuotes = !inQuotes; }
      else if (c === "," && !inQuotes) { cols.push(col.trim()); col = ""; }
      else { col += c; }
    }
    cols.push(col.trim());
    const category = cols[0] || "";
    const name = cols[1] || "";
    const link = cols[2] || "#";
    const features = cols[3] || "";
    const logo = cols[4] || "";
    const summary = cols[5] || "";
    if (name && category) tools.push({ category, name, link, features, logo, summary });
    currentLine = "";
  }
  return tools;
}

async function getTools(): Promise<AiTool[]> {
  try {
    const res = await fetch(SHEET_CSV_URL, { next: { revalidate: 3600 } });
    return parseCSV(await res.text());
  } catch {
    return [];
  }
}

// Generate static paths for all tools
export async function generateStaticParams() {
  const tools = await getTools();
  return tools.map((tool) => ({ slug: slugify(tool.name) }));
}

// Get favicon URL from tool domain
function getLogoUrl(link: string): string {
  try {
    const url = new URL(link.startsWith("http") ? link : `https://${link}`);
    const domain = url.hostname.replace("www.", "");
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch {
    return "";
  }
}

// Derive category color
function getCategoryColor(cat: string) {
  if (cat.includes("Writing") || cat.includes("Produc")) return "from-violet-500 to-purple-600";
  if (cat.includes("Marketing") || cat.includes("Business")) return "from-blue-500 to-cyan-500";
  if (cat.includes("Learning")) return "from-amber-500 to-orange-500";
  if (cat.includes("Video")) return "from-red-500 to-pink-500";
  if (cat.includes("Image") || cat.includes("Photo")) return "from-pink-500 to-rose-500";
  if (cat.includes("Audio")) return "from-teal-500 to-green-500";
  return "from-emerald-500 to-cyan-500";
}

// Split features into bullet points
function parseFeatures(features: string): string[] {
  if (!features) return [];
  // Split by comma, period, or semicolon that isn't inside a number  
  const bullets = features
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 5);
  return bullets.slice(0, 6);
}

export default async function ToolDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tools = await getTools();
  const tool = tools.find((t) => slugify(t.name) === slug);

  if (!tool) notFound();

  const logoUrl = getLogoUrl(tool.link);
  const featureBullets = parseFeatures(tool.features);
  const colorClass = getCategoryColor(tool.category);
  const related = tools
    .filter((t) => t.category === tool.category && t.name !== tool.name)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 md:px-6 py-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-8">
          <Link href="/" className="hover:text-white transition-colors">Trang chủ</Link>
          <span>/</span>
          <Link href="/top-list-ai" className="hover:text-white transition-colors">Top List AI</Link>
          <span>/</span>
          <span className="text-white">{tool.name}</span>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* ── LEFT: Main Content ── */}
          <div className="space-y-8">

            {/* Hero Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-start gap-5">
                {/* Logo */}
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center shrink-0 overflow-hidden shadow-lg`}>
                  <ToolLogoClient logoUrl={logoUrl} name={tool.name} colorClass={colorClass} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-white">{tool.name}</h1>
                    <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                  </div>

                  {/* Stars + Views */}
                  <div className="flex items-center gap-4 text-sm mb-3">
                    <div className="flex items-center gap-1 text-yellow-400">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} className="w-4 h-4 fill-current" />
                      ))}
                      <span className="text-slate-400 ml-1">5.0</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                      <Eye className="w-4 h-4" />
                      <span>2.4K lượt xem</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700">
                      <Tag className="w-3 h-3 mr-1" />
                      {tool.category.replace("AI ", "")}
                    </Badge>
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                      FREEMIUM
                    </Badge>
                  </div>
                </div>

                {/* Back button on desktop */}
                <Link href="/top-list-ai" className="hidden md:flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm shrink-0">
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại
                </Link>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <a
                  href={tool.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button className="w-full bg-gradient-to-r from-cyan-400 to-blue-400 !text-black font-bold hover:brightness-110 h-12 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all">
                    <Globe className="w-4 h-4 mr-2" />
                    Truy cập Website
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </a>
                <Button variant="outline" className="sm:w-auto border-slate-700 text-slate-300 hover:bg-slate-800 h-12 rounded-xl">
                  ★ Lưu lại
                </Button>
              </div>
            </div>

            {/* Description */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full inline-block"></span>
                Giới thiệu {tool.name}
              </h2>
              <p className="text-slate-300 leading-relaxed text-[15px]">
                {tool.features || `${tool.name} là một công cụ AI mạnh mẽ giúp tối ưu hóa công việc của bạn trong lĩnh vực ${tool.category}.`}
              </p>
            </div>

            {/* Summary / Conclusion (New) */}
            {tool.summary && (
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <CheckCircle2 className="w-24 h-24 text-emerald-400" />
                 </div>
                 <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full inline-block"></span>
                  Tổng kết & Đánh giá
                </h2>
                <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4">
                  <p className="text-slate-300 leading-relaxed italic">
                    "{tool.summary}"
                  </p>
                </div>
              </div>
            )}

            {/* Key Features */}
            {featureBullets.length > 0 && (
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-emerald-400 to-cyan-500 rounded-full inline-block"></span>
                  Tính năng nổi bật
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {featureBullets.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pricing Info */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full inline-block"></span>
                Giá & Gói dùng
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                  <p className="text-emerald-400 font-bold text-lg mb-1">Miễn phí</p>
                  <p className="text-slate-400 text-sm">Dùng thử các tính năng cơ bản, không cần thẻ tín dụng.</p>
                </div>
                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-4">
                  <p className="text-cyan-400 font-bold text-lg mb-1">Premium</p>
                  <p className="text-slate-400 text-sm">Mở khóa toàn bộ tính năng Pro, không giới hạn sử dụng.</p>
                </div>
              </div>
            </div>

            {/* Related Tools */}
            {related.length > 0 && (
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-purple-400 to-pink-500 rounded-full inline-block"></span>
                  Công cụ tương tự
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {related.map((rel, i) => (
                    <Link
                      key={i}
                      href={`/top-list-ai/${slugify(rel.name)}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/40 hover:bg-slate-800 transition-all group"
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getCategoryColor(rel.category)} flex items-center justify-center shrink-0 overflow-hidden`}>
                        <RelatedLogoClient logoUrl={getLogoUrl(rel.link)} name={rel.name} colorClass={getCategoryColor(rel.category)} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-semibold group-hover:text-cyan-400 transition-colors truncate">{rel.name}</p>
                        <p className="text-slate-500 text-xs">AI Tool</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Sidebar — one sticky container ── */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-5">

              {/* Aihubs PRO CTA Card */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md">✦ AIHUBS PRO</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Tài Khoản AI Giá Rẻ</h3>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                  Mua tài khoản {tool.name} và 50+ công cụ AI Premium với mức giá tốt nhất thị trường, dịch vụ 24/7.
                </p>
                <ul className="space-y-2 mb-5">
                  {[
                    "ChatGPT Plus, Claude, Gemini Advanced",
                    "Midjourney, Runway, ElevenLabs...",
                    "Hỗ trợ kỹ thuật 24/7",
                    "Giá tốt nhất, đảm bảo uy tín",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/tai-khoan-gia-re">
                  <Button className="w-full bg-gradient-to-r from-emerald-400 to-cyan-400 !text-black font-bold h-11 rounded-xl hover:brightness-110 shadow-[0_0_15px_rgba(45,212,191,0.5)] transition-all mb-3">
                    XEM GIÁ NGAY →
                  </Button>
                </Link>
                <Link href="/khoa-hoc">
                  <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-800 h-10 rounded-xl text-sm">
                    Xem Khóa Học AI
                  </Button>
                </Link>
              </div>

              {/* ⚡ Top AI Thịnh Hành */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="text-yellow-400">⚡</span>
                  Top AI Thịnh Hành
                </h3>
                <div className="space-y-3">
                  {tools
                    .filter((t) => t.name !== tool.name)
                    .slice(0, 6)
                    .map((t, i) => (
                      <Link
                        key={t.name}
                        href={`/top-list-ai/${slugify(t.name)}`}
                        className="flex items-center gap-3 group"
                      >
                        {/* Rank */}
                        <span className={`text-xs font-bold w-5 text-center shrink-0 ${i === 0 ? "text-yellow-400" : i === 1 ? "text-slate-300" : i === 2 ? "text-amber-600" : "text-slate-500"}`}>
                          #{i + 1}
                        </span>
                        {/* Logo */}
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${getCategoryColor(t.category)} flex items-center justify-center shrink-0 overflow-hidden`}>
                          <RelatedLogoClient
                            logoUrl={getLogoUrl(t.link)}
                            name={t.name}
                            colorClass={getCategoryColor(t.category)}
                          />
                        </div>
                        {/* Info */}
                        <div className="min-w-0 flex-1">
                          <p className="text-white text-sm font-medium group-hover:text-cyan-400 transition-colors truncate">{t.name}</p>
                          <span className="text-xs text-emerald-400">Freemium</span>
                        </div>
                      </Link>
                    ))}
                </div>
                <Link href="/top-list-ai" className="flex items-center justify-center gap-1 mt-4 text-xs text-slate-500 hover:text-cyan-400 transition-colors">
                  Xem tất cả →
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
