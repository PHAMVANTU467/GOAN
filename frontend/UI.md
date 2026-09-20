# Khung giao diện GOAN

## Cập nhật giao diện 21/09/2026

- Bỏ hàng tiêu đề Bán hàng/Ca đang mở và khối cửa hàng/chi nhánh trên đầu trang.
- Navigation và danh mục sản phẩm dùng icon màu phía trên, tên phía dưới; mục chọn dùng nền và viền xanh GOAN. Giữ chức năng lọc, tìm kiếm, giỏ hàng và thanh toán mẫu.
- Thẻ sản phẩm dùng nền phẳng, giá xanh đậm, dấu chọn và số lượng rõ ràng; vùng tổng tiền được tách bằng nền xanh nhạt.
- Header đọc `fullName` từ kết quả đăng nhập API. `AccountProfileStore` chỉ lưu `userId` và `fullName` cho hiển thị, không lưu mật khẩu, không phải token xác thực. Tùy chọn duy trì đăng nhập quyết định localStorage/sessionStorage; về đăng nhập bằng nút trên header xóa profile. Mở trực tiếp giao diện khi chưa có profile hiển thị “Chưa đăng nhập”.
- Đã kiểm tra build, 40 test hiện có, luồng UI với phản hồi đăng nhập mô phỏng, giữ tên khi tải lại, lọc danh mục, giữ giỏ khi đổi module và viewport 390/768/1280px.

## Tài khoản mặc định (Development)

Chạy backend bằng `npm run dev:backend`, sau đó đăng nhập bằng tên tài khoản `admin` và mật khẩu `123456`. Email `admin@goan.local` và số điện thoại `0900000000` vẫn dùng được. Nút **Điền nhanh tài khoản mặc định** chỉ điền thông tin; nhấn **Đăng nhập** để vào `/sales`.

Tài khoản được seed khi backend chạy trong môi trường Development, mật khẩu được băm bằng dịch vụ hiện có. Repository hiện lưu trong bộ nhớ; tài khoản mặc định được tạo lại mỗi lần khởi động. Không seed tài khoản này trong Production.

Chạy `npm run dev:frontend`, mở `http://127.0.0.1:5173/sales`.
Các đường dẫn đăng nhập `/` và đăng ký `/register` giữ nguyên.

Các trang khung: `/overview`, `/invoices`, `/products`, `/inventory`, `/customers`, `/employees`, `/reports`, `/settings`. Mỗi trang có điều hướng và trạng thái đang xây dựng; `/sales` là trang được triển khai UI.

Trang bán hàng hỗ trợ tìm kiếm không dấu/tìm mã, lọc danh mục, sắp xếp, thêm/xóa sản phẩm, điều chỉnh số lượng, chọn khách hàng mẫu, mang đi/tại cửa hàng, ghi chú, giảm giá theo số tiền và xem trước thanh toán. Thanh toán không tạo giao dịch hay lưu đơn. Trạng thái nằm trong bộ nhớ, giữ khi chuyển giữa các trang quản lý, mất khi tải lại hoặc về đăng nhập.

## Ranh giới dữ liệu

- `features/sales/domain`: kiểu sản phẩm, danh mục, khách hàng, dòng đơn hàng.
- `features/sales/application`: contract `CatalogService` và phép tính hiển thị.
- `features/sales/infrastructure`: `MockCatalogService`, `catalog.json`.
- `features/sales/presentation`: giao diện bán hàng.
- `styles/workspace.css`: style cho màn hình bán hàng và không gian làm việc.

Khi tích hợp, bổ sung HTTP adapter triển khai `CatalogService`, inject tại `app/App.tsx`. React gọi ASP.NET Core API; SQL Server thuộc backend. Giá, giảm giá, quyền và giao dịch phải được backend xác thực khi triển khai nghiệp vụ.

## Ảnh và mock data

24 ảnh được kiểm tra trực quan và sao chép từ `Hinh_Anh_SP` vào `frontend/public/images/products`. Tên sản phẩm được đối chiếu ảnh; giá, mã sản phẩm, danh mục, nhãn bán chạy và khách hàng là dữ liệu mẫu. Giữ nguyên thư mục nguồn. `12.jpg` không đọc được; ảnh quầy/kệ, ảnh ghép và các ảnh chưa chọn không đưa vào catalog. Không cần API hoặc database để mở trang bán hàng.

Kiểm tra: `npm --prefix frontend test` và `npm --prefix frontend run build`.
