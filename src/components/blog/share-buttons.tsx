"use client";

import { Send, Link as LinkIcon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

interface ShareButtonsProps {
  url: string;
  title: string;
  variant?: "header" | "sidebar";
}

export function ShareButtons({ url, title, variant = "header" }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const shareFb = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank", "width=600,height=400");
  };

  const shareTw = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, "_blank", "width=600,height=400");
  };

  const shareTg = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, "_blank", "width=600,height=400");
  };

  if (variant === "sidebar") {
    return (
      <>
        <div className="flex gap-4 text-slate-400">
          <button onClick={shareFb} title="Chia sẻ Facebook" className="hover:text-emerald-400 transition-colors">
            <FacebookIcon className="w-5 h-5 fill-current" />
          </button>
          <button onClick={shareTw} title="Chia sẻ X (Twitter)" className="hover:text-emerald-400 transition-colors">
            <TwitterIcon className="w-5 h-5 fill-current" />
          </button>
          <button onClick={shareTg} title="Chia sẻ Telegram" className="hover:text-emerald-400 transition-colors">
            <Send className="w-5 h-5" />
          </button>
          <button onClick={handleCopy} title="Copy Link" className="hover:text-emerald-400 transition-colors">
            {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <LinkIcon className="w-5 h-5" />}
          </button>
        </div>
        <Toast copied={copied} />
      </>
    );
  }

  // Header Variant
  return (
    <>
      <div className="flex items-center gap-3">
        <Button onClick={shareFb} title="Chia sẻ Facebook" size="icon-sm" variant="outline" className="rounded-full border-white/10 hover:bg-white/5 hover:text-blue-400 hover:border-blue-400/50 shadow-neon-sm transition-all">
          <FacebookIcon className="w-4 h-4 fill-current" />
        </Button>
        <Button onClick={shareTw} title="Chia sẻ X (Twitter)" size="icon-sm" variant="outline" className="rounded-full border-white/10 hover:bg-white/5 hover:text-slate-200 hover:border-slate-400/50 shadow-neon-sm transition-all">
          <TwitterIcon className="w-4 h-4 fill-current" />
        </Button>
        <Button onClick={shareTg} title="Chia sẻ Telegram" size="icon-sm" variant="outline" className="rounded-full border-white/10 hover:bg-white/5 hover:text-cyan-400 hover:border-cyan-400/50 shadow-neon-sm transition-all">
          <Send className="w-4 h-4" />
        </Button>
        <Button onClick={handleCopy} title="Copy Link" size="icon-sm" variant="outline" className="rounded-full border-white/10 hover:bg-white/5 hover:text-emerald-400 hover:border-emerald-400/50 shadow-neon-sm transition-all">
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <LinkIcon className="w-4 h-4" />}
        </Button>
      </div>
      <Toast copied={copied} />
    </>
  );
}

// Simple Custom Toast inside the same file
function Toast({ copied }: { copied: boolean }) {
  return (
    <AnimatePresence>
      {copied && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-emerald-500 text-slate-950 px-5 py-3 rounded-full shadow-neon font-medium"
        >
          <Check className="w-5 h-5" />
          Đã copy đường dẫn bài viết!
        </motion.div>
      )}
    </AnimatePresence>
  );
}
