import type { CaLam, ChiTietHoaDon, HoaDon, NguoiDung, ThanhToan } from "../../sales/domain/SalesModels";

export interface InvoiceLineRecord extends ChiTietHoaDon {
  TenSanPham: string;
}

export interface InvoiceRecord {
  header: HoaDon;
  lines: InvoiceLineRecord[];
  shift: CaLam | null;
  creator: NguoiDung | null;
  payments: ThanhToan[];
}
