import Link from "next/link";
import { Bot, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-white/5 pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-emerald-500/10 p-2 rounded-xl group-hover:bg-emerald-500/20 transition-colors">
                <Bot className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="font-heading font-bold text-lg tracking-tight text-white">
                Aihubs<span className="text-cyan-400">.PRO</span>
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Căn cứ địa MMO & AI dành cho creator và marketer. Cung cấp kiến thức,
              công cụ và tài khoản chất lượng cao để bứt phá thu nhập.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-6 flex items-center gap-2">
              Liên kết nhanh
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/khoa-hoc" className="text-zinc-400 hover:text-emerald-400 transition-colors">
                  Khóa Học MMO
                </Link>
              </li>
              <li>
                <Link href="/top-list-ai" className="text-zinc-400 hover:text-emerald-400 transition-colors">
                  Trí Tuệ Nhân Tạo
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-zinc-400 hover:text-emerald-400 transition-colors">
                  Blog Kiến Thức
                </Link>
              </li>
              <li>
                <Link href="/tai-khoan" className="text-zinc-400 hover:text-emerald-400 transition-colors">
                  Tài Khoản Giá Rẻ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-6">Liên hệ</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3 text-zinc-400">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Vietnam</span>
              </li>
              <li className="flex gap-3 text-zinc-400">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>0123 456 789</span>
              </li>
              <li className="flex gap-3 text-zinc-400">
                <Mail className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>hello@aihubs.pro</span>
              </li>
            </ul>
          </div>

          {/* Legal / Social */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-6">Chính sách</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Chính sách hoàn tiền
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2026 Aihubs.PRO. All rights reserved.</p>
          <div className="flex bg-background border border-white/5 rounded-full px-4 py-1.5 items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Hệ thống hoạt động bình thường</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
