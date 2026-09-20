// Các thực thể bảng dữ liệu khớp với Sơ đồ phân tích / Database schema
export interface CuaHang {
  MaCuaHang: string;
  TenCuaHang: string;
  SDT: string;
  diaChi?: {
    MaDiaChi: string;
    DiaChiChiTiet: string;
    PhuongXa: string;
    TinhThanhPho: string;
    QuocGia: string;
  };
  linhVuc?: {
    MaLinhVuc: string;
    TenLinhVuc: string;
    MoTa: string;
    TrangThai: string;
  };
}

export interface DanhMucSP {
  MaLoai: string;
  TenLoai: string;
}

export interface DonViTinh {
  MaDonVi: string;
  TenDonVi: string;
}

export interface NhaCC {
  MaNCC: string;
  TenNCC: string;
  SDT: string;
  Email: string;
  DiaChi: string;
}

export interface Sanpham {
  MaSP: string;
  TenSP: string;
  GiaVon: number;
  GiaBan: number;
  dm: string; // MaLoai
  ncc: string; // MaNCC
  dv: string; // MaDonVi
  HinhAnh?: string;
}

export interface BienTheSP {
  MaBienThe: string;
  MoTa: string;
  TonKho: number;
  MucTonToiThieu: number;
  sp: string; // MaSP
}

export interface Khachhang {
  MaKH: string;
  HoTenKH: string;
  SDT: string;
  GhiChu?: string;
}

export interface NhanVien {
  MaNV: string;
  HoTenNV: string;
  SDT: string;
  Email: string;
  DiaChi: string;
  ChucVu: string;
  LoaiNhanVien: string;
  NgayTao: string;
}

export interface Hoadon {
  MaHD: string;
  ThongTinDonHang: string;
  ThoiGianTao: string;
  TrangThai: string;
  TongTien: number;
  kh: string; // MaKH
  nv: string; // MaNV
}

export interface CTHD {
  MaCTHD: string;
  hd: string; // MaHD
  bt: string; // MaBienThe
  SoLuong: number;
  DonGia: number;
  ThanhTien: number;
}

// Cấu trúc View Model phục vụ giao diện POS
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
  name: string;
  phone: string;
}

export interface StoreInfo {
  id: string;
  name: string;
  branch?: string;
  address?: string;
  phone?: string;
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
