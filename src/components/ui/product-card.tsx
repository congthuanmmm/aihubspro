"use client";

import { Check, Zap, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface Product {
  name: string;
  originalPrice: string;
  salePrice: string;
  note: string;
  category: "ai" | "creative" | "other";
  badge?: string;
  badgeColor?: "hot" | "sale" | "popular";
  features: string[];
  zaloUrl?: string;
}

interface ProductCardProps {
  product: Product;
  highlighted?: boolean;
}

const BADGE_STYLES: Record<string, string> = {
  hot: "bg-gradient-to-r from-rose-500 to-orange-400 text-white shadow-[0_0_12px_rgba(244,63,94,0.5)]",
  sale: "bg-gradient-to-r from-emerald-400 to-cyan-400 text-black shadow-[0_0_12px_rgba(45,212,191,0.5)]",
  popular: "bg-gradient-to-r from-violet-500 to-purple-400 text-white shadow-[0_0_12px_rgba(139,92,246,0.5)]",
};

export function ProductCard({ product, highlighted = false }: ProductCardProps) {
  const zaloLink = product.zaloUrl ?? "https://zalo.me/0000000000";

  return (
    <div
      className={`
        relative flex flex-col rounded-3xl p-6 md:p-7 border transition-all duration-300 group
        ${highlighted
          ? "border-emerald-500/50 bg-emerald-950/20 shadow-[0_0_40px_rgba(16,185,129,0.12)] scale-100 md:scale-[1.02] z-10"
          : "border-white/10 bg-white/[0.03]"
        }
        hover:border-emerald-500/60 hover:shadow-[0_20px_60px_-15px_rgba(16,185,129,0.2)] hover:-translate-y-1.5
        backdrop-blur-md
      `}
    >
      {/* Badge */}
      {product.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span
            className={`
              inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase border-none
              ${BADGE_STYLES[product.badgeColor ?? "sale"]}
            `}
          >
            {product.badgeColor === "hot" && <Zap className="w-3 h-3 fill-current" />}
            {product.badge}
          </span>
        </div>
      )}

      {/* Product name */}
      <div className="mt-2 mb-4">
        <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2 leading-snug">
          {product.name}
        </h3>
        {product.note && (
          <p className="mt-1.5 text-xs text-slate-400 leading-relaxed line-clamp-2">
            {product.note}
          </p>
        )}
      </div>

      {/* Price block */}
      <div className="mb-5 pb-5 border-b border-white/10">
        {product.originalPrice && (
          <p className="text-sm text-slate-500 line-through mb-0.5">
            {product.originalPrice}
          </p>
        )}
        <div className="flex items-end gap-1.5">
          <span
            className={`font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-emerald-300 to-cyan-400 leading-none ${
              product.salePrice.length > 20
                ? "text-xl md:text-2xl"
                : product.salePrice.length > 14
                ? "text-2xl md:text-3xl"
                : "text-3xl md:text-4xl"
            }`}
          >
            {product.salePrice}
          </span>
        </div>
      </div>

      {/* Features */}
      <ul className="space-y-2.5 flex-1 mb-6">
        {product.features.map((feat, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
            <span
              className={`mt-0.5 flex-shrink-0 rounded-full p-0.5 ${
                highlighted
                  ? "bg-gradient-to-r from-emerald-400 to-cyan-400 text-black"
                  : "bg-emerald-500/15 text-emerald-400"
              }`}
            >
              <Check className="w-3.5 h-3.5" />
            </span>
            {feat}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href={zaloLink}
        target="_blank"
        rel="noopener noreferrer"
        id={`buy-${product.name.toLowerCase().replace(/\s+/g, "-").slice(0, 30)}`}
        className={`
          flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold text-sm md:text-base
          transition-all duration-200 active:scale-95
          ${highlighted
            ? "bg-gradient-to-r from-emerald-400 to-cyan-400 text-black hover:brightness-110 shadow-[0_0_20px_rgba(45,212,191,0.35)]"
            : "bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/15 hover:border-emerald-400/60"
          }
        `}
      >
        <MessageCircle className="w-4 h-4" />
        Mua ngay qua Zalo
      </a>
    </div>
  );
}
