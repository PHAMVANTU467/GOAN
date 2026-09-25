import type { CaLam, HoaDon, ChiTietHoaDon, NguoiDung, SanPham, ThanhToan } from "../../sales/domain/SalesModels";
import catalog from "../../sales/infrastructure/catalog.json";
import type { InvoiceRecord } from "../domain/InvoiceRecord";
import type { InvoiceRepository } from "../application/InvoiceRepository";

const sampleHeaders: HoaDon[] = [
  { MaHoaDon: "8b6036a6-90cc-48fc-8dc3-48ecfc520001", MaCa: "6da255b7-d425-4173-bf1e-7c301c160001", MaKhachHang: "4f85efa5-dad4-49ad-b2ce-9631a80e39ba", MaKho: "88d08175-680a-4440-a3a0-1160c25e0001", NgayLap: "2026-09-25T09:15:00", TongTien: 64000, GiamGia: 0, TrangThai: "Ho\u00e0n th\u00e0nh" },
  { MaHoaDon: "8b6036a6-90cc-48fc-8dc3-48ecfc520002", MaCa: "6da255b7-d425-4173-bf1e-7c301c160001", MaKhachHang: "2fa80da8-ecf5-48a4-9bfe-86c11e15a7d7", MaKho: "88d08175-680a-4440-a3a0-1160c25e0001", NgayLap: "2026-09-25T10:42:00", TongTien: 85000, GiamGia: 5000, TrangThai: "Ho\u00e0n th\u00e0nh" },
  { MaHoaDon: "8b6036a6-90cc-48fc-8dc3-48ecfc520003", MaCa: "6da255b7-d425-4173-bf1e-7c301c160001", MaKhachHang: "8c3c31e8-70c6-47e9-9da4-dbe7cf33472b", MaKho: "88d08175-680a-4440-a3a0-1160c25e0001", NgayLap: "2026-09-24T14:08:00", TongTien: 90000, GiamGia: 0, TrangThai: "\u0110ang x\u1eed l\u00fd" },
  { MaHoaDon: "8b6036a6-90cc-48fc-8dc3-48ecfc520004", MaCa: "3f16c533-7cf0-4948-91bc-f49f40f70002", MaKhachHang: "cc73177f-9e64-49d0-a3bf-9ece196a523e", MaKho: "88d08175-680a-4440-a3a0-1160c25e0001", NgayLap: "2026-09-24T17:26:00", TongTien: 70000, GiamGia: 0, TrangThai: "\u0110\u00e3 h\u1ee7y" },
  { MaHoaDon: "8b6036a6-90cc-48fc-8dc3-48ecfc520005", MaCa: "3f16c533-7cf0-4948-91bc-f49f40f70002", MaKhachHang: null, MaKho: "88d08175-680a-4440-a3a0-1160c25e0001", NgayLap: "2026-09-23T11:30:00", TongTien: 39000, GiamGia: 0, TrangThai: "Ho\u00e0n th\u00e0nh" },
];

const sampleLines: ChiTietHoaDon[] = [
  { MaChiTiet: "b92be6d0-e13b-435e-97f4-67b2c67d0001", MaHoaDon: "8b6036a6-90cc-48fc-8dc3-48ecfc520001", MaSanPham: "1992a499-2adb-44c5-917d-ab606f25a31d", SoLuong: 1, DonGia: 29000, GiamGia: 0, ThanhTien: 29000 },
  { MaChiTiet: "b92be6d0-e13b-435e-97f4-67b2c67d0002", MaHoaDon: "8b6036a6-90cc-48fc-8dc3-48ecfc520001", MaSanPham: "57fac1dc-8a27-4f4a-97d8-5f104082ce9c", SoLuong: 1, DonGia: 35000, GiamGia: 0, ThanhTien: 35000 },
  { MaChiTiet: "b92be6d0-e13b-435e-97f4-67b2c67d0003", MaHoaDon: "8b6036a6-90cc-48fc-8dc3-48ecfc520002", MaSanPham: "012cfda0-39eb-4898-b9f4-e2faba73f00f", SoLuong: 2, DonGia: 45000, GiamGia: 0, ThanhTien: 90000 },
  { MaChiTiet: "b92be6d0-e13b-435e-97f4-67b2c67d0004", MaHoaDon: "8b6036a6-90cc-48fc-8dc3-48ecfc520003", MaSanPham: "012cfda0-39eb-4898-b9f4-e2faba73f00f", SoLuong: 2, DonGia: 45000, GiamGia: 0, ThanhTien: 90000 },
  { MaChiTiet: "b92be6d0-e13b-435e-97f4-67b2c67d0005", MaHoaDon: "8b6036a6-90cc-48fc-8dc3-48ecfc520004", MaSanPham: "57fac1dc-8a27-4f4a-97d8-5f104082ce9c", SoLuong: 2, DonGia: 35000, GiamGia: 0, ThanhTien: 70000 },
  { MaChiTiet: "b92be6d0-e13b-435e-97f4-67b2c67d0006", MaHoaDon: "8b6036a6-90cc-48fc-8dc3-48ecfc520005", MaSanPham: "59bacb4f-473a-41e1-a442-af0e0c879899", SoLuong: 1, DonGia: 39000, GiamGia: 0, ThanhTien: 39000 },
];

const sampleUsers: NguoiDung[] = [
  { MaNguoiDung: "de203ff7-2a8e-446c-88a8-101ecdf00001", HoTen: "Nguy\u1ec5n Th\u1ecb Mai", Email: "mai.demo@goan.local", MatKhauHash: "mock-only", TrangThai: "Ho\u1ea1t \u0111\u1ed9ng" },
  { MaNguoiDung: "de203ff7-2a8e-446c-88a8-101ecdf00002", HoTen: "Tr\u1ea7n V\u0103n An", Email: "an.demo@goan.local", MatKhauHash: "mock-only", TrangThai: "Ho\u1ea1t \u0111\u1ed9ng" },
];

const sampleShifts: CaLam[] = [
  { MaCa: "6da255b7-d425-4173-bf1e-7c301c160001", MaChiNhanh: "66b27f37-4925-41d2-9dd1-c8e913c1bb0d", MaNguoiDung: sampleUsers[0].MaNguoiDung, ThoiGianMo: "2026-09-25T08:00:00", ThoiGianDong: "2026-09-25T16:00:00", TienDauCa: 1000000, TrangThai: "\u0110\u00e3 \u0111\u00f3ng" },
  { MaCa: "3f16c533-7cf0-4948-91bc-f49f40f70002", MaChiNhanh: "66b27f37-4925-41d2-9dd1-c8e913c1bb0d", MaNguoiDung: sampleUsers[1].MaNguoiDung, ThoiGianMo: "2026-09-24T08:00:00", ThoiGianDong: "2026-09-24T18:00:00", TienDauCa: 1000000, TrangThai: "\u0110\u00e3 \u0111\u00f3ng" },
];

const samplePayments: ThanhToan[] = sampleHeaders.map((invoice, index) => ({
  MaThanhToan: `de203ff7-2a8e-446c-88a8-101ecdf1000${index + 1}`,
  MaHoaDon: invoice.MaHoaDon,
  PhuongThuc: index % 2 === 0 ? "Ti\u1ec1n m\u1eb7t" : "Chuy\u1ec3n kho\u1ea3n",
  SoTien: invoice.TongTien,
  MaThamChieu: index % 2 === 0 ? "" : `DEMO-TRANSFER-${String(index + 1).padStart(4, "0")}`,
  TrangThai: invoice.TrangThai === "\u0110\u00e3 h\u1ee7y" ? "\u0110\u00e3 h\u1ee7y" : invoice.TrangThai,
}));

export class MockInvoiceRepository implements InvoiceRepository {
  private readonly sampleProductNames = new Map<string, string>([
    ["1992a499-2adb-44c5-917d-ab606f25a31d", "C\u00e0 ph\u00ea s\u1eefa \u0111\u00e1"],
    ["57fac1dc-8a27-4f4a-97d8-5f104082ce9c", "C\u00e0 ph\u00ea kem mu\u1ed1i"],
    ["012cfda0-39eb-4898-b9f4-e2faba73f00f", "Matcha latte"],
    ["59bacb4f-473a-41e1-a442-af0e0c879899", "Tr\u00e0 \u0111\u00e0o h\u1ea1t chia"],
  ]);
  private readonly productNames = new Map(
    (catalog.SanPham as SanPham[]).map((product) => [product.MaSanPham, product.TenSanPham]),
  );
  private readonly shiftsById = new Map(sampleShifts.map((shift) => [shift.MaCa, shift]));
  private readonly usersById = new Map(sampleUsers.map((user) => [user.MaNguoiDung, user]));

  async getAll(): Promise<InvoiceRecord[]> {
    return sampleHeaders.map((header) => {
      const shift = this.shiftsById.get(header.MaCa) ?? null;
      return {
      header: { ...header },
      shift,
      creator: shift ? this.usersById.get(shift.MaNguoiDung) ?? null : null,
      payments: samplePayments.filter((payment) => payment.MaHoaDon === header.MaHoaDon).map((payment) => ({ ...payment })),
      lines: sampleLines
        .filter((line) => line.MaHoaDon === header.MaHoaDon)
        .map((line) => ({
          ...line,
          TenSanPham: this.sampleProductNames.get(line.MaSanPham) ?? this.productNames.get(line.MaSanPham) ?? line.MaSanPham,
        })),
      };
    });
  }
}
