# Aihubs PRO Website — Implementation Plan & AI Context

## Context
Dự án website **AI Hub & MMO Portal** (Aihubs PRO) đóng vai trò là "Căn cứ địa" để gom traffic, Affiliate tool AI, bán khóa học và tài khoản giá rẻ.
Dự án được khởi tạo và thiết kế bài bản với sự phối hợp của 2 bộ skill chính (BẮT BUỘC AI PHẢI THAM CHIẾU KHI BẢO TRÌ/NÂNG CẤP):
- **CodyMaster (`cm-planning`, `cm-coder`)**: Dùng để lên kế hoạch kiến trúc dự án (Implementation Plan) và viết mã nguồn.
- **Antigravity-Kit (`frontend-design`, `web-design-guidelines`)**: Dùng để thiết kế giao diện UI/UX (Màu sắc, Typography, Glassmorphism) và audit lại thiết kế chuẩn Premium.

File này được lưu trữ để làm tài liệu tham chiếu gốc (Context) cho các AI Assistant (Cursor, Copilot, Cline, v.v...) khi phát triển các phase tiếp theo.

## Technology Stack
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS (v4)
- **Components:** Shadcn UI, Radix UI primitives
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Language:** TypeScript

## Design System (Wealth & Tech Theme)
Hệ thống thiết kế theo phong cách "Wealth & Tech" (Giao diện Tối/Dark Mode + Sang trọng + Tài chính kích thích chuyển đổi).

### Color Palette (Ghi chú qua OKLCH / Tailwind CSS variables trong globals.css)
- **Background:** `neutral-950` (`oklch(0.145 0 0)` / `#0a0a0a`) — Nền xám đen nhánh sâu thẳm.
- **Primary Gradient:** Dải màu `from-emerald-500 to-cyan-500` làm điểm nhấn cho các nút CTA và huy hiệu quan trọng. Chữ bên trong nút CTA sử dụng màu đen (`text-black`) để tương phản cực mạnh.
- **Text Gradient:** Dải màu `from-emerald-400 to-cyan-400` dùng cho các Headline nhấn mạnh.
- **Text:** Pure white (`oklch(0.985 0 0)`) cho văn bản chính, Neutral-400 cho văn bản phụ râu ria.

### Glassmorphism Utilities
Sử dụng các lớp CSS custom trong `@layer utilities` tại `globals.css`:
- `.glass`: Thẻ kính mỏng nhẹ `bg-white/[0.03] backdrop-blur-md border border-white/10`.
- `.glass-card`: Dùng cho các thẻ tĩnh, bao gồm hiệu ứng hover phát sáng rực lên với viền ngọc lục bảo (`hover:border-emerald-500/50 hover:bg-white/[0.05]`).
- Hover effects có thời gian chuyển đổi `transition-all duration-300`.

## Directory Structure
- `src/app/page.tsx`: Landing Page áp dụng triết lý AIDA (Hero, ecosystem 4 pillars, Social Proof, CTA block).
- `src/app/khoa-hoc/page.tsx`: Subpage liệt kê các khóa học dạng thẻ.
- `src/app/top-list-ai/page.tsx`: Subpage list các tool AI mạnh mẽ (Affiliate items).
- `src/app/blog/page.tsx`: Subpage blog bài viết / case study.
- `src/app/tai-khoan/page.tsx`: Subpage bảng giá bán tài khoản, dùng hiệu ứng thẻ giá rực rỡ cho gói "Lựa Chọn Tốt Nhất".
- `src/components/layout/Navbar.tsx`: Navbar sticky `backdrop-blur-md bg-black/50`, hỗ trợ responsive menu.
- `src/components/layout/Footer.tsx`: Cấu trúc footer 4 cột.
- `src/components/ui/`: Chứa các atom components của Shadcn UI (Button, Badge, Card, v.v...).

## Current Phase: Front-End UI / MVP Completed
- Toàn bộ nội dung hiện tại đang sử dụng *Placeholder Text* và dữ liệu mẫu (mock data).
- Tính năng Responsive đầy đủ (mobile-first approach).
- CSS Animations, Micro-interactions (Framer Motion) đã được thiết lập chặt chẽ ở mọi trang.

## Next Phases (Roadmap for Developers / AI)
1. **Content Population:** Thay thế placeholder text bằng dữ liệu thật (CMS integration).
2. **Backend & Auth:** Tích hợp Auth (NextAuth/Clerk) và Database (Supabase/Prisma/PostgreSQL).
3. **Payment Gateway:** Tích hợp thanh toán QR Code (VNPay, Momo) hoặc Stripe.
4. **User Dashboard:** Khu vực hiển thị user profile, lịch sử mua hàng, truy cập khóa học.
