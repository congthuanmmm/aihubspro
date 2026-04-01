"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Bell, Shield, Palette, Save } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminSettingsPage() {
  return (
    <div className="p-4 md:p-8 w-full max-w-5xl mx-auto space-y-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-white flex items-center gap-3">
            <Settings className="w-8 h-8 text-cyan-500" />
            Cài Đặt Hệ Thống
          </h1>
          <p className="text-slate-400 text-lg mt-2">
            Quản lý cấu hình, thông báo và bảo mật của nền tảng ⚙️
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
          {/* Settings Tabs Sidebar (Visual only) */}
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start gap-3 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20">
              <Settings className="w-4 h-4" /> Chung
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 text-slate-400 hover:text-white hover:bg-white/5">
              <Palette className="w-4 h-4" /> Giao Diện
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 text-slate-400 hover:text-white hover:bg-white/5">
              <Bell className="w-4 h-4" /> Thông Báo
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 text-slate-400 hover:text-white hover:bg-white/5">
              <Shield className="w-4 h-4" /> Bảo Mật
            </Button>
          </div>

          {/* Settings Content Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* General Settings Card */}
            <Card className="glass-card border-white/10 bg-slate-900/40 shadow-neon-sm">
              <CardHeader className="border-b border-white/5 bg-white/[0.02]">
                <CardTitle className="text-xl text-white">Cấu Hình Chung</CardTitle>
                <CardDescription className="text-slate-400">
                  Cập nhật các thông tin cơ bản của Website.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Tên Website</label>
                  <input
                    type="text"
                    defaultValue="AIHubs PRO"
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Email Hỗ Trợ</label>
                  <input
                    type="email"
                    defaultValue="support@aihubs.pro"
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-white"
                  />
                </div>
                <div className="space-y-2 flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/[0.01]">
                  <div>
                    <h4 className="text-white font-medium">Chế độ bảo trì (Maintenance Mode)</h4>
                    <p className="text-sm text-slate-400">Khóa website, chỉ admin mới có thể truy cập.</p>
                  </div>
                  {/* Toggle UI fallback */}
                  <div className="w-12 h-6 bg-slate-800 rounded-full relative cursor-pointer border border-white/10">
                    <div className="w-4 h-4 bg-slate-400 rounded-full absolute left-1 top-1"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4 mt-8">
              <Button variant="outline" className="border-white/10 text-slate-300 hover:text-white">
                Hủy bỏ
              </Button>
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold px-8 flex items-center gap-2">
                <Save className="w-4 h-4" /> Lưu Thay Đổi
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
