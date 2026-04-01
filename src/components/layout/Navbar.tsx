"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Bot, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { firebaseSignOut } from "@/lib/firebase";

const navItems = [
  { href: "/", label: "Trang Chủ" },
  { href: "/khoa-hoc", label: "Khóa Học" },
  { href: "/top-list-ai", label: "Top List AI" },
  { href: "/blog", label: "Blog" },
  { href: "/tai-khoan", label: "Tài Khoản Giá Rẻ" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
        scrolled ? "bg-slate-950/80 backdrop-blur-md border-slate-800 shadow-sm py-3" : "bg-transparent border-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-emerald-500/10 p-2 rounded-xl group-hover:bg-emerald-500/20 transition-colors">
            <Bot className="w-6 h-6 text-emerald-400" />
          </div>
          <span className="font-heading font-bold text-xl tracking-tight leading-none text-white">
            Aihubs<span className="text-cyan-400">.PRO</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Menu điều hướng chính" className="hidden lg:flex items-center gap-1 bg-background/40 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                pathname === item.href
                  ? "bg-cyan-400/10 backdrop-blur-md border border-cyan-400/80 text-white font-semibold shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                  : "font-medium text-zinc-400 hover:text-cyan-400 hover:bg-cyan-500/5"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          {!loading ? (
            user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="w-8 h-8 rounded-full border border-emerald-500/50" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center">
                      {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-medium text-white">{user.displayName || user.email?.split("@")[0]}</span>
                </div>
                <Button 
                  onClick={() => firebaseSignOut()} 
                  variant="outline" 
                  className="border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                >
                  Đăng xuất
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                    Đăng nhập
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 !text-black font-bold hover:brightness-110 shadow-[0_0_15px_rgba(45,212,191,0.5)] transition-all">
                    Bắt đầu ngay
                  </Button>
                </Link>
              </>
            )
          ) : (
            <div className="w-32 h-10 animate-pulse bg-white/5 rounded-full"></div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2 text-muted-foreground hover:text-white transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Đóng menu điều hướng' : 'Mở menu điều hướng'}
          aria-expanded={isOpen}
          aria-controls="mobile-nav"
        >
          {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass border-t border-white/10 mt-3"
          >
            <nav id="mobile-nav" aria-label="Menu điều hướng di động" className="flex flex-col p-4 gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-xl transition-colors ${
                    pathname === item.href
                      ? "bg-cyan-400/10 backdrop-blur-md border border-cyan-400/80 text-white font-semibold shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                      : "font-medium text-zinc-400 hover:text-cyan-400 hover:bg-cyan-500/5"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/10">
                {!loading ? (
                  user ? (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3 p-3 glass rounded-xl">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt="Avatar" className="w-10 h-10 rounded-full" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center">
                            {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="font-semibold text-white">{user.displayName || user.email?.split("@")[0]}</span>
                      </div>
                      <Button onClick={() => firebaseSignOut()} variant="outline" className="w-full border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300">
                        Đăng xuất
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full">
                          Đăng nhập
                        </Button>
                      </Link>
                      <Link href="/register" onClick={() => setIsOpen(false)}>
                        <Button className="w-full bg-gradient-to-r from-emerald-400 to-cyan-400 !text-black font-bold hover:brightness-110 shadow-[0_0_15px_rgba(45,212,191,0.5)] transition-all">
                          Bắt đầu ngay
                        </Button>
                      </Link>
                    </>
                  )
                ) : (
                  <div className="w-full h-10 animate-pulse bg-white/5 rounded-xl"></div>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
