"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bot,
  BookOpen,
  ShoppingCart
} from "lucide-react";
import { firebaseSignOut } from "@/lib/firebase";

const sidebarLinks = [
  { name: "Tổng quan", href: "/admin", icon: LayoutDashboard },
  { name: "Khóa học", href: "/admin/courses", icon: BookOpen },
  { name: "Đơn hàng", href: "/admin/orders", icon: ShoppingCart },
  { name: "Bài viết", href: "/admin/posts", icon: FileText },
  { name: "Người dùng", href: "/admin/users", icon: Users },
  { name: "Cài đặt", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex">
      {/* Sidebar background overlay on mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-white/5 transform transition-transform duration-300 md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full h-[100dvh]">
          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-emerald-500/20 p-1.5 rounded-lg group-hover:bg-emerald-500/30 transition-colors">
                <Bot className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="font-heading font-bold text-lg text-white">AIHubs Admin</span>
            </Link>
            <button 
              className="md:hidden text-slate-400 hover:text-white"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sidebar Links */}
          <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
            <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Menu quản trị
            </p>
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/admin");
              
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    isActive 
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" 
                      : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-cyan-400" : "text-slate-500"}`} />
                  <span className="font-medium">{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-white/5">
            <button 
              onClick={() => firebaseSignOut()}
              className="flex items-center gap-3 px-3 py-2.5 w-full text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors border border-transparent"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64 min-w-0 transition-all duration-300">
        {/* Mobile Header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-white/5 bg-slate-900/50 backdrop-blur-md sticky top-0 z-30 md:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-heading font-bold text-lg text-white">Dashboard</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 relative overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
