# GOAN

GOAN là hệ thống quản lý bán hàng gồm frontend React/TypeScript và backend ASP.NET Core Web API. Hai phần được tách riêng để có thể phát triển, kiểm thử và triển khai độc lập.

## Cấu trúc dự án

```text
GOAN/
├── frontend/                         # React + TypeScript + Vite
│   ├── public/images/                # Logo và ảnh nền tĩnh
│   ├── server.js                     # Phục vụ frontend đã build
│   └── src/
│       ├── app/                      # Khởi tạo ứng dụng và điều hướng
│       ├── features/auth/
│       │   ├── domain/               # Model và kiểu dữ liệu nghiệp vụ
│       │   ├── application/          # Interface, validator và mapper
│       │   ├── infrastructure/       # HTTP adapter kết nối backend
│       │   └── presentation/         # Page và component giao diện
│       ├── shared/presentation/      # Component dùng chung
│       └── styles/                   # CSS toàn cục
├── backend/
│   ├── Goan.sln
│   └── Goan.Api/
│       ├── Application/              # DTO, contract và service nghiệp vụ
│       ├── Domain/                   # Entity và domain exception
│       ├── Infrastructure/           # Repository và dịch vụ kỹ thuật
│       ├── Presentation/             # MVC controller và middleware
│       └── Program.cs                # Composition root và dependency injection
├── docs/                             # Tài liệu đặc tả và luận văn
└── assets/branding/                  # Tài nguyên thương hiệu gốc
```

Frontend áp dụng feature architecture kết hợp Dependency Inversion. Page chỉ biết `AuthService`; cách gọi HTTP nằm trong `HttpAuthService`. Backend dùng MVC kết hợp các lớp Domain, Application và Infrastructure. Controller nhận HTTP request, service xử lý nghiệp vụ, repository phụ trách dữ liệu.

## Chạy môi trường phát triển

Yêu cầu:

- Node.js 22 trở lên.
- .NET SDK 8 trở lên.

Mở terminal thứ nhất để chạy backend:

```powershell
cd C:\Users\phamv\Desktop\GOAN
npm run dev:backend
```

Backend chạy tại `http://127.0.0.1:5080`.

Mở terminal thứ hai để chạy frontend:

```powershell
cd C:\Users\phamv\Desktop\GOAN
npm run dev:frontend
```

Frontend chạy tại `http://127.0.0.1:5173`. Vite tự chuyển các request `/api` sang backend.

Các trang hiện có:

- Đăng nhập: `http://127.0.0.1:5173/`
- Đăng ký: `http://127.0.0.1:5173/register`

## Kiểm tra và build

```powershell
# Kiểm tra frontend
npm --prefix frontend test

# Build frontend
npm --prefix frontend run build

# Build backend
dotnet build backend/Goan.sln
```

Lệnh `npm run build` tại thư mục gốc cài dependency và tạo frontend production trong `frontend/dist`. Lệnh `npm start` phục vụ thư mục build này bằng `frontend/server.js`.

## API xác thực

```text
POST /api/auth/register
POST /api/auth/login
```

Backend hiện dùng `InMemoryUserRepository` để chạy và kiểm tra luồng giao diện. Dữ liệu sẽ mất khi backend khởi động lại. Khi tích hợp SQL Server, tạo repository mới triển khai `IUserRepository` rồi thay đăng ký dependency trong `Program.cs`; controller và service không cần phụ thuộc trực tiếp vào Entity Framework.

Mật khẩu được băm bằng `PasswordHasher<UserAccount>` trước khi repository lưu dữ liệu. API không trả mật khẩu hoặc password hash về frontend.

## Quy ước đặt tên

- React component/page: PascalCase và đuôi `.tsx`, ví dụ `LoginPage.tsx`.
- TypeScript service, validator, mapper và model: PascalCase, ví dụ `HttpAuthService.ts`.
- C# class/interface: PascalCase; interface có tiền tố `I`, ví dụ `IAuthService.cs`.
- Thư mục thể hiện đúng trách nhiệm kiến trúc; không đặt logic API trong component và không đặt truy cập dữ liệu trong controller.
