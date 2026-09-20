# GOAN — Giao diện đăng nhập

Giao diện Web Portal cho cửa hàng bán lẻ, dựa trên hai tài liệu trong `docs/`. Công nghệ theo đề cương: React + TypeScript cho web; .NET/C# và SQL Server dành cho backend tương lai, Flutter/Dart dành cho mobile tương lai.

## Chạy giao diện

Yêu cầu Node.js 22 trở lên.

```powershell
cd web
npm install
npm run dev
```

Mở địa chỉ Vite hiển thị (mặc định http://127.0.0.1:5173).

```powershell
npm run build
npm test
```

## Thiết kế và cấu trúc

- Giao diện tham khảo cách xử lý tương phản của iOrder/KiotViet: ảnh bán hàng phủ toàn màn hình, lớp xanh đen bán trong suốt và thẻ đăng nhập trắng nổi. Màu thao tác chính `#087fe7`, cyan `#54c8f3`, navy `#0c3152`; logo gốc trong `Logo/` được sao chép nguyên vẹn vào public.
- Slogan: **TINH GỌN VẬN HÀNH — BỨT PHÁ KINH DOANH**; hiển thị dạng chữ thường đầu câu để dễ đọc.
- `web/src/features/auth/LoginPage.tsx`: bố cục, trạng thái biểu mẫu và tương tác.
- `web/src/features/auth/auth-service.ts`: interface `AuthService`, adapter và lớp `LoginValidator`; tiêm service tại `main.tsx`. React dùng function component; OOP áp dụng ở tầng nghiệp vụ, không ép class component vào giao diện.
- `web/src/components/InfoDialog.tsx`: dialog dùng lại, hỗ trợ bàn phím và focus bằng native dialog.
- `web/src/styles.css`: token màu, bố cục card responsive, focus và reduced motion. Trên mobile phần giới thiệu được rút gọn thành slogan để toàn bộ thao tác đăng nhập nằm gọn trong một màn hình.

## Phạm vi hiện tại

Đây là giao diện, chưa có API xác thực. Submit hợp lệ báo chưa kết nối; không tạo session giả, không lưu mật khẩu. Các nút đăng ký, quên mật khẩu, hỗ trợ và chính sách mở thông báo về trạng thái triển khai. Khi xây backend, cung cấp implementation của `AuthService`, hợp đồng session và điều hướng sau đăng nhập; không dùng adapter hiện tại cho production.

## Hình ảnh và tham khảo

Ảnh `web/public/images/vietnam-grocery.png` được tạo bằng imagegen cho dự án: quầy thanh toán bách hóa Việt Nam với máy POS, không phải ảnh cửa hàng có thật. Logo do chủ dự án cung cấp. Font Be Vietnam Pro tải từ Google Fonts, có Arial fallback khi offline.

Tham khảo nghiệp vụ và cách trình bày lợi ích bán lẻ từ [Sapo](https://www.sapo.vn/phan-mem-quan-ly-cua-hang-tap-hoa.html) và [KiotViet](https://www.kiotviet.vn/huong-dan-su-dung-kiotviet/retail-he-thong-giai-phap-kiotviet/tong-quan-cac-nhom-giai-phap-kiotviet/). Không sử dụng ảnh hoặc logo của các đơn vị này.
