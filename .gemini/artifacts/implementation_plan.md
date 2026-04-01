# Kế hoạch Triển khai: Hệ thống "Quản lý Kinh doanh"

Dựa trên yêu cầu của bạn, tôi xin vạch rõ lộ trình kỹ thuật để tích hợp tính năng quản lý doanh thu và theo dõi học viên một cách trực quan trên Admin Dashboard.

## 1. Thống kê Doanh Thu (Admin Dashboard)
- **File:** `src/app/admin/page.tsx`
- **Thay đổi:** 
  - Đọc toàn bộ các Document từ Collection `pending_orders` có trường `status: "SUCCESS"`.
  - Cộng tổng trường `amount` (số tiền).
  - Thêm một Card Thống kê trên Dashboard: **Tổng Doanh Thu (VNĐ)**.

## 2. Trang Quản lý Đơn hàng (Orders Management)
- **File Menu:** `src/app/admin/layout.tsx` (Thêm nút "Đơn hàng" vào Sidebar).
- **File UI:** `src/app/admin/orders/page.tsx` (Tạo mới).
- **Thay đổi:**
  - Lấy dữ liệu từ Collection `pending_orders` theo thời gian thực.
  - Hiển thị thành dạng Bảng (Data Table) chứa: `Biên lai (Order Code)`, `Khách hàng (Email)`, `Khóa học (ID)`, `Số tiền`, `Trạng thái`, và `Thời gian`.
  - Thêm nút phân loại xem *Tất cả* hoặc chỉ *Thành công*.

## 3. Trang Quản lý Học viên (User Management)
- **File hiện tại:** `src/app/admin/users/page.tsx`
- **Thay đổi:**
  - Nâng cấp UI hiện tại, thêm tính năng click vào từng User để mở một Modal/Drawer.
  - Bên trong Modal đó, truy vấn Firebase bằng path: `users/{userId}/user_courses`.
  - Liệt kê chi tiết những tài sản sở hữu của User đó (Họ đã mua khóa nào, vào lúc mấy giờ).
  - *(Tương lai có thể làm thêm nút "Cấp quyền/Xóa quyền" thủ công cho Admin).*

## Tiến độ
Toàn bộ các file này sẽ lập tức được Code, kiểm thử và Push lên mạng ngay bây giờ như bạn yêu cầu!
