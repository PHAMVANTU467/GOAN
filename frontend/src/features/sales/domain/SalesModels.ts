// Database row models aligned with the supplied schema.
export interface CuaHang {
  MaCuaHang: string;
  TenCuaHang: string;
  MaSoThue: string;
  TrangThai: string;
}

export interface DanhMuc {
  MaDanhMuc: string;
  MaCuaHang: string;
  TenDanhMuc: string;
  MaDanhMucCha: string | null;
}

export interface DonViTinh {
  MaDonVi: string;
  MaCuaHang: string;
  TenDonVi: string;
  KyHieu: string;
}

export interface NhaCungCap {
  MaNCC: string;
  MaCuaHang: string;
  TenNCC: string;
  SoDienThoai: string;
  DiaChi: string;
  TrangThai: string;
}

export interface SanPham {
  MaSanPham: string;
  MaDanhMuc: string;
  MaDonVi: string;
  TenSanPham: string;
  MaVach: string;
  GiaVon: number;
  GiaBan: number;
  TrangThai: string;
}

export interface BienTheSanPham {
  MaBienThe: string;
  MaSanPham: string;
  SKU: string;
  ThuocTinh: string;
  MaVach: string;
  GiaBan: number;
}

export interface NguoiDung {
  MaNguoiDung: string;
  HoTen: string;
  Email: string;
  MatKhauHash: string;
  TrangThai: string;
}

export interface CaLam {
  MaCa: string;
  MaChiNhanh: string;
  MaNguoiDung: string;
  ThoiGianMo: string;
  ThoiGianDong: string | null;
  TienDauCa: number;
  TrangThai: string;
}

export interface HoaDon {
  MaHoaDon: string;
  MaCa: string;
  MaKhachHang: string | null;
  MaKho: string;
  NgayLap: string;
  TongTien: number;
  GiamGia: number;
  TrangThai: string;
}

export interface ChiTietHoaDon {
  MaChiTiet: string;
  MaHoaDon: string;
  MaSanPham: string;
  SoLuong: number;
  DonGia: number;
  GiamGia: number;
  ThanhTien: number;
}

export interface ThanhToan {
  MaThanhToan: string;
  MaHoaDon: string;
  PhuongThuc: string;
  SoTien: number;
  MaThamChieu: string;
  TrangThai: string;
}

// View models used by the sales UI; these are not database tables.
export interface Product {
  id: string;
  sku: string;
  name: string;
  categoryId: string;
  price: number;
  image: string;
  unit: string;
  stock?: number;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export interface Customer {
  id: string;
  storeId: string;
  name: string;
  phone: string;
  memberTier: string;
  status: string;
}

export interface StoreInfo {
  id: string;
  name: string;
}

export interface Catalog {
  store?: StoreInfo;
  products: Product[];
  categories: Category[];
  customers: Customer[];
}

export interface CartLine {
  product: Product;
  quantity: number;
}
