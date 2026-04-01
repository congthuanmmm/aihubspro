# Quản lý Tiến độ: Hệ thống Admin Khóa học

Dưới đây là các bước tôi sẽ thực hiện để chuyển đổi từ `JSON` sang truy xuất `Firestore Realtime` cho các khóa học và giao diện Admin.

- [x] Bước 1: Thêm Menu "Khóa học" vào Sidebar Admin
- [x] Bước 2: Tạo trang "Danh sách khóa học" (`/admin/courses`)
- [x] Bước 3: Tạo công cụ đồng bộ dữ liệu (Seed DB) từ `JSON` cũ sang Firestore `courses` collection.
- [x] Bước 4: Chức năng Thêm mới & Chỉnh sửa / Xóa Khóa học (Form Create/Update).
- [x] Bước 5: Đưa dữ liệu Firebase ra ngoài mặt người dùng (`/khoa-hoc` và `/khoa-hoc/[slug]`).
- [x] Bước 6: Đảm bảo luồng tạo hóa đơn tạo đơn hàng (`/api/payos/checkout`) lấy giá chuẩn từ Database Firebase thay vì file tĩnh.
