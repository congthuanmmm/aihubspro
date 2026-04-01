# Xây dựng Hệ thống Quản lý Khóa học & Chuyển đổi Firestore

Do hiện tại các khóa học đang được "vít cứng" bằng file `JSON`, để bạn có thể tự thân vận động (thêm/sửa/xóa khóa học) trên Web thì chúng ta cần đưa dữ liệu lên máy chủ Firestore và xây dựng giao diện điều khiển (Dashboard) cho bạn. Dưới đây là kế hoạch chi tiết:

## User Review Required

> [!WARNING]
> **Thay đổi cấu trúc cốt lõi!** Việc này sẽ ngắt toàn bộ trang hiển thị khóa học (`/khoa-hoc`) khỏi kết nối file cứng, chuyển sang kết nối trực tiếp với Firestore theo thời gian thực (Realtime). Nếu bạn đồng ý, quá trình thanh toán và giá cả từ nay sẽ được kiểm soát an toàn từ Database.

Vui lòng xem lại danh sách thư mục và file sẽ bị thay đổi ở dưới đây, và **xác nhận** để tôi bắt tay vào code ngay!

## Kế hoạch Cụ thể

### 1. Firestore Schema (Cấu trúc DB mới)
Di chuyển toàn bộ file `khoa-hoc.json` vào Collection `courses` trên Firebase với các trường:
- `id` (String): Mã khóa học duy nhất để tạo URL (ví dụ: `master-mmo`)
- `title` (String): Tên hiển thị
- `desc` (String): Mô tả ngắn
- `price` (String), `numericPrice` (Number), `oldPrice` (String)
- `students` (String), `rating` (Number)
- `badge` (String), `tag` (String), `color` (String)
- `features` (Array): Lợi ích khóa học
- `videoUrl` (String): Link Youtube giới thiệu

### 2. Thêm Giao diện Admin mới

#### [MODIFY] [admin/layout.tsx](file:///d:/ANTIGRAVITY/AIHUBSPRO/aihubspro-master/src/app/admin/layout.tsx)
- Thêm link `Khóa học` với Icon `BookOpen` vào Sidebar Menu.

#### [NEW] [admin/courses/page.tsx](file:///d:/ANTIGRAVITY/AIHUBSPRO/aihubspro-master/src/app/admin/courses/page.tsx)
- Bảng danh sách khóa học lấy từ Firestore.
- Thêm nút "Sync Data" (Dùng 1 lần duy nhất để đẩy dữ liệu có sẵn từ JSON lên Firebase).

#### [NEW] [admin/courses/add/page.tsx](file:///d:/ANTIGRAVITY/AIHUBSPRO/aihubspro-master/src/app/admin/courses/add/page.tsx)
- Form nhập liệu thêm một Khóa học mới.

#### [NEW] [admin/courses/edit/[id]/page.tsx](file:///d:/ANTIGRAVITY/AIHUBSPRO/aihubspro-master/src/app/admin/courses/edit/[id]/page.tsx)
- Form chỉnh sửa, xóa khóa học.

### 3. Cập nhật Trang người dùng & Thanh toán

#### [MODIFY] [khoa-hoc/page.tsx](file:///d:/ANTIGRAVITY/AIHUBSPRO/aihubspro-master/src/app/khoa-hoc/page.tsx)
- Đổi từ việc import JSON sang gọi `getDocs(collection(db, "courses"))`.

#### [MODIFY] [khoa-hoc/[slug]/page.tsx](file:///d:/ANTIGRAVITY/AIHUBSPRO/aihubspro-master/src/app/khoa-hoc/[slug]/page.tsx)
#### [MODIFY] [khoa-hoc/[slug]/learn/page.tsx](file:///d:/ANTIGRAVITY/AIHUBSPRO/aihubspro-master/src/app/khoa-hoc/[slug]/learn/page.tsx)
- Tìm động (Query by `id`) từ Firestore thay cho mảng JSON.

#### [MODIFY] [api/payos/checkout/route.ts](file:///d:/ANTIGRAVITY/AIHUBSPRO/aihubspro-master/src/app/api/payos/checkout/route.ts)
- Kiểm tra lại giá khóa học thực tế trên Firebase trước khi gửi lệnh tạo mã QR tới PayOS (để chống hack sửa giá ở trình duyệt người dùng).

---

## Open Questions

> [!CAUTION]
> **Vui lòng xác nhận:**
> 1. Bạn hoàn toàn nhất trí để tôi tạo bảng dữ liệu `courses` trên Firestore đúng không?
> 2. Có thông tin/trường dữ liệu nào bạn muốn bổ sung cho khóa học (như `mô tả dài`, `tác giả`, v.v..) để tôi nhúng luôn vào Form không? Trường hợp không có, tôi sẽ bê nguyên các cột từ JSON cũ.

Nhấn **Phê duyệt** (hoặc cứ nhắn OK) để tôi bắt đầu!
