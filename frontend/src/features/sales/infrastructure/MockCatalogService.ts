import type { CatalogService } from "../application/CatalogService";
import type { CustomerRecord } from "../../customers/domain/Customer";
import type {
  Catalog,
  Product,
  Category,
  Customer,
  StoreInfo,
  CuaHang,
  DanhMuc,
  DonViTinh,
  NhaCungCap,
  SanPham,
  BienTheSanPham,
  NguoiDung,
} from "../domain/SalesModels";
import db from "./catalog.json";
import { SAMPLE_CUSTOMERS } from "../../customers/infrastructure/customerFixtures";

export class MockCatalogService implements CatalogService {
  async getCatalog(): Promise<Catalog> {
    const unitsById = new Map(
      (db.DonViTinh as DonViTinh[]).map((unit) => [unit.MaDonVi, unit]),
    );
    const variantByProductId = new Map(
      (db.BienTheSanPham as BienTheSanPham[]).map((variant) => [variant.MaSanPham, variant]),
    );

    const products: Product[] = (db.SanPham as SanPham[]).map((product, index) => {
      const variant = variantByProductId.get(product.MaSanPham);
      return {
        id: variant?.MaBienThe ?? product.MaSanPham,
        sku: variant?.SKU ?? product.MaVach,
        name: product.TenSanPham,
        categoryId: product.MaDanhMuc,
        price: variant?.GiaBan ?? product.GiaBan,
        image: `/images/products/product-${String(index + 1).padStart(2, "0")}.jpg`,
        unit: unitsById.get(product.MaDonVi)?.KyHieu ?? "",
      };
    });

    const categories: Category[] = (db.DanhMuc as DanhMuc[]).map((category) => ({
      id: category.MaDanhMuc,
      name: category.TenDanhMuc,
    }));

    const customers: Customer[] = SAMPLE_CUSTOMERS.map((customer: CustomerRecord) => ({
      id: customer.MaKhachHang,
      storeId: customer.MaCuaHang,
      name: customer.HoTen,
      phone: customer.SoDienThoai,
      memberTier: customer.HangThanhVien,
      status: customer.TrangThai,
    }));

    const storeRow = db.CuaHang as CuaHang;
    const store: StoreInfo = { id: storeRow.MaCuaHang, name: storeRow.TenCuaHang };

    return { store, products, categories, customers };
  }

  getCuaHang(): CuaHang {
    return db.CuaHang as CuaHang;
  }

  getDanhMuc(): DanhMuc[] {
    return db.DanhMuc as DanhMuc[];
  }

  getDonViTinh(): DonViTinh[] {
    return db.DonViTinh as DonViTinh[];
  }

  getNhaCungCap(): NhaCungCap[] {
    return db.NhaCungCap as NhaCungCap[];
  }

  getSanPham(): SanPham[] {
    return db.SanPham as SanPham[];
  }

  getBienTheSanPham(): BienTheSanPham[] {
    return db.BienTheSanPham as BienTheSanPham[];
  }

  getKhachHang(): CustomerRecord[] {
    return db.KhachHang as CustomerRecord[];
  }

  getNguoiDung(): NguoiDung[] {
    return db.NguoiDung as NguoiDung[];
  }
}
