import type { CatalogService } from "../application/CatalogService";
import type {
  Catalog,
  Product,
  Category,
  Customer,
  StoreInfo,
  CuaHang,
  DanhMucSP,
  DonViTinh,
  NhaCC,
  Sanpham,
  BienTheSP,
  Khachhang,
  NhanVien,
} from "../domain/SalesModels";
import db from "./catalog.json";

export class MockCatalogService implements CatalogService {
  // Lấy dữ liệu dạng Catalog cho giao diện POS
  async getCatalog(): Promise<Catalog> {
    const donViMap = new Map(
      (db.DonViTinh as DonViTinh[]).map((d) => [d.MaDonVi, d.TenDonVi]),
    );
    const bienTheMap = new Map(
      (db.BienTheSP as BienTheSP[]).map((b) => [b.sp, b]),
    );

    const products: Product[] = (db.Sanpham as Sanpham[]).map((sp) => {
      const bienThe = bienTheMap.get(sp.MaSP);
      const unitName = donViMap.get(sp.dv) ?? "Ly";
      return {
        id: bienThe?.MaBienThe ?? sp.MaSP,
        sku: sp.MaSP,
        name: sp.TenSP,
        categoryId: sp.dm,
        price: sp.GiaBan,
        image: sp.HinhAnh ?? "/images/products/product-01.jpg",
        unit: unitName,
        stock: bienThe?.TonKho ?? 50,
      };
    });

    const categories: Category[] = (db.DanhMucSP as DanhMucSP[]).map((c) => ({
      id: c.MaLoai,
      name: c.TenLoai,
    }));

    const customers: Customer[] = (db.Khachhang as Khachhang[]).map((k) => ({
      id: k.MaKH,
      name: k.HoTenKH,
      phone: k.SDT,
    }));

    const store: StoreInfo = {
      id: db.CuaHang.MaCuaHang,
      name: db.CuaHang.TenCuaHang,
      phone: db.CuaHang.SDT,
      address: db.CuaHang.diaChi?.DiaChiChiTiet,
    };

    return {
      store,
      products,
      categories,
      customers,
    };
  }

  // Cung cấp các hàm truy xuất trực tiếp các bảng database mẫu
  getCuaHang(): CuaHang {
    return db.CuaHang as CuaHang;
  }

  getDanhMucSP(): DanhMucSP[] {
    return db.DanhMucSP as DanhMucSP[];
  }

  getDonViTinh(): DonViTinh[] {
    return db.DonViTinh as DonViTinh[];
  }

  getNhaCC(): NhaCC[] {
    return db.NhaCC as NhaCC[];
  }

  getSanpham(): Sanpham[] {
    return db.Sanpham as Sanpham[];
  }

  getBienTheSP(): BienTheSP[] {
    return db.BienTheSP as BienTheSP[];
  }

  getKhachhang(): Khachhang[] {
    return db.Khachhang as Khachhang[];
  }

  getNhanVien(): NhanVien[] {
    return db.NhanVien as NhanVien[];
  }
}
