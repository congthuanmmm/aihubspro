"use client";

import { useState } from "react";
import Link from "next/link";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { Badge } from "@/components/ui/badge";
import { Bot, Search, X } from "lucide-react";
import { slugify } from "@/lib/slugify";

interface AiTool {
  category: string;
  name: string;
  link: string;
  features: string;
  logo: string;
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getCategoryColor(category: string): string {
  const map: Record<string, string> = {
    "AI Writing & Productivity": "from-emerald-500 to-teal-600",
    "AI Marketing & Online Business": "from-cyan-500 to-blue-600",
    "AI Learning & eLearning Tools": "from-teal-500 to-emerald-600",
    "AI Video": "from-violet-500 to-purple-600",
    "AI Image & Photo": "from-pink-500 to-rose-600",
    "AI Audio": "from-amber-500 to-orange-600",
    "Ai WorkFlow": "from-indigo-500 to-blue-600",
  };
  return map[category] || "from-emerald-500 to-cyan-500";
}

// Known affiliate/tracking domains that won't have real logos
const TRACKING_DOMAINS = new Set([
  "sjv.io", "pxf.io", "idevaffiliate.com", "partnerlinks.io",
  "refer.pdf.ai", "app.youlearn.ai", "try.elevenlabs.io",
  "try.gamma.app", "app.sellerpic.ai", "app.livechat.com",
]);

function getDomainFromLink(link: string): string {
  try {
    const url = new URL(link);
    let domain = url.hostname.replace("www.", "");
    // Skip known tracking/affiliate redirect domains
    if (TRACKING_DOMAINS.has(domain)) {
      // Try to extract the real domain from the path or subdomain
      const parts = domain.split(".");
      if (parts.length > 2) {
        domain = parts.slice(-2).join(".");
      }
    }
    return domain;
  } catch {
    return "";
  }
}

function ToolLogo({ tool }: { tool: AiTool }) {
  const [srcIndex, setSrcIndex] = useState(0);
  const domain = getDomainFromLink(tool.link);

  // Multiple logo sources in priority order
  const logoSources = domain
    ? [
        `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=128`,
        `https://icons.duckduckgo.com/ip3/${domain}.ico`,
      ]
    : [];

  // All sources exhausted or no domain → show initials fallback
  if (!domain || srcIndex >= logoSources.length) {
    return (
      <div
        className={`w-full h-full rounded-2xl bg-gradient-to-tr ${getCategoryColor(tool.category)} flex items-center justify-center text-lg font-bold text-black`}
      >
        {getInitials(tool.name)}
      </div>
    );
  }

  return (
    <img
      src={logoSources[srcIndex]}
      alt={`${tool.name} logo`}
      className="w-full h-full object-cover"
      onError={() => setSrcIndex((prev) => prev + 1)}
      loading="lazy"
    />
  );
}

export function ToolGrid({ tools }: { tools: AiTool[] }) {
  const rawCategories = [...new Set(tools.map((t) => t.category))];
  const priorityCats = ["AI Video", "AI Audio"];
  const categories = [
    ...priorityCats.filter((c) => rawCategories.includes(c)),
    ...rawCategories.filter((c) => !priorityCats.includes(c)),
  ];
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const searchFiltered = searchQuery.trim()
    ? tools.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.features.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tools;

  const filteredTools =
    activeCategory === "all"
      ? searchFiltered
      : searchFiltered.filter((t) => t.category === activeCategory);

  const rawDisplay =
    activeCategory === "all"
      ? [...new Set(filteredTools.map((t) => t.category))]
      : [activeCategory];

  const displayCategories = [
    ...priorityCats.filter((c) => rawDisplay.includes(c)),
    ...rawDisplay.filter((c) => !priorityCats.includes(c)),
  ];

  return (
    <>
      {/* Search Bar */}
      <ScrollReveal className="mb-6">
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm công cụ AI..."
            className="w-full bg-slate-900/80 border border-slate-700 rounded-full pl-10 pr-10 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="text-center text-sm text-slate-500 mt-2">
            Tìm thấy <span className="text-cyan-400 font-medium">{filteredTools.length}</span> công cụ phù hợp
          </p>
        )}
      </ScrollReveal>

      {/* Category Filter Bar */}
      <ScrollReveal className="flex flex-wrap items-center gap-2 mb-6 justify-center">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
            activeCategory === "all"
              ? "bg-teal-400/10 backdrop-blur-md border border-teal-400/80 text-white font-semibold shadow-[0_0_15px_rgba(45,212,191,0.2)] transition-all"
              : "bg-transparent border-white/10 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/30"
          }`}
        >
          Tất cả ({tools.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
              activeCategory === cat
                ? "bg-teal-400/10 backdrop-blur-md border border-teal-400/80 text-white font-semibold shadow-[0_0_15px_rgba(45,212,191,0.2)] transition-all"
                : "bg-transparent border-white/10 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/30"
            }`}
          >
            {cat} ({tools.filter((t) => t.category === cat).length})
          </button>
        ))}
      </ScrollReveal>

      {/* Category Sections */}
      {displayCategories.map((category) => {
        const categoryTools = filteredTools.filter(
          (t) => t.category === category
        );
        if (categoryTools.length === 0) return null;
        return (
          <ScrollReveal key={category} as="section" className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl md:text-3xl font-bold">{category}</h2>
              <Badge
                variant="outline"
                className="border-white/10 text-zinc-400"
              >
                {categoryTools.length}
              </Badge>
            </div>

            <StaggerContainer
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              staggerDelay={0.07}
            >
              {categoryTools.map((tool, idx) => (
                <StaggerItem
                  key={`${category}-${idx}`}
                  className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 flex flex-col group hover:border-cyan-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:bg-slate-800/80 hover:-translate-y-1 transition-all duration-300 ease-out"
                >
                  {/* Top: Logo + Name + Badge */}
                  <div className="flex flex-row items-center gap-4">
                    {/* iOS-style Icon Container */}
                    <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center shrink-0 overflow-hidden">
                      <ToolLogo tool={tool} />
                    </div>
                    {/* Info */}
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2 leading-tight">
                        <span className="truncate">{tool.name}</span>
                        <svg className="w-4 h-4 text-blue-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </h3>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-xs text-slate-300 border border-slate-700">
                          AI Tool
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-xs text-slate-300 border border-slate-700">
                          FREEMIUM
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-400 mt-4 line-clamp-3 flex-1">
                    {tool.features || "Công cụ AI hữu ích cho công việc của bạn."}
                  </p>

                  {/* Footer: Rating & Detail Link */}
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-800/50">
                    <div className="flex items-center gap-1 text-yellow-500 text-xs">
                      ★★★★★
                      <span className="text-slate-500 ml-2">👁 {(idx + 1) * 127 + 173}</span>
                    </div>
                    <Link
                      href={`/top-list-ai/${slugify(tool.name)}`}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 border border-transparent group-hover:bg-teal-400/10 group-hover:backdrop-blur-md group-hover:border-teal-400/80 group-hover:text-white group-hover:shadow-[0_0_15px_rgba(45,212,191,0.2)] transition-all flex items-center gap-1 text-sm font-medium"
                    >
                      Xem chi tiết →
                    </Link>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </ScrollReveal>
        );
      })}

      {/* Empty Filter State */}
      {filteredTools.length === 0 && (
        <div className="text-center py-20">
          <Bot className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">
            Không tìm thấy công cụ AI nào trong danh mục này.
          </p>
        </div>
      )}
    </>
  );
}
