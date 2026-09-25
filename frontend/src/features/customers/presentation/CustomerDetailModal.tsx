import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import type { CustomerRecord } from "../domain/Customer";
import type { InvoiceRecord } from "../../invoices/domain/InvoiceRecord";
import { formatInvoiceCode } from "./DisplayCodes";

interface CustomerDetailModalProps {
  customer: CustomerRecord | null;
  customerCode: string;
  invoices?: InvoiceRecord[];
  onClose: () => void;
}

const LABELS = {
  close: "\u0110\u00f3ng chi ti\u1ebft kh\u00e1ch h\u00e0ng",
  title: "Chi ti\u1ebft kh\u00e1ch h\u00e0ng",
  name: "H\u1ecd t\u00ean",
  phone: "S\u1ed1 \u0111i\u1ec7n tho\u1ea1i",
  tier: "H\u1ea1ng th\u00e0nh vi\u00ean",
  status: "Tr\u1ea1ng th\u00e1i",
  customerId: "M\u00e3 kh\u00e1ch h\u00e0ng",
  activity: "L\u1ecbch s\u1eed mua h\u00e0ng",
  noInvoices: "Kh\u00e1ch h\u00e0ng ch\u01b0a c\u00f3 h\u00f3a \u0111\u01a1n trong d\u1eef li\u1ec7u m\u1eabu.",
} as const;

export function CustomerDetailModal({ customer, customerCode, invoices = [], onClose }: CustomerDetailModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (customer && !dialog.open) dialog.showModal();
    if (!customer && dialog.open) dialog.close();
  }, [customer]);

  const customerInvoices = customer
    ? invoices.filter((invoice) => invoice.header.MaKhachHang === customer.MaKhachHang)
    : [];
  const customerRevenue = customerInvoices.filter((invoice) => invoice.header.TrangThai === "Ho\u00e0n th\u00e0nh").reduce((sum, invoice) => sum + invoice.header.TongTien, 0);

  return (
    <dialog ref={dialogRef} className="customer-detail-dialog" aria-labelledby="customer-detail-title" onCancel={onClose}>
      {customer && <>
        <header className="customer-detail-header">
          <div className="customer-detail-avatar" aria-hidden="true">{customer.HoTen.trim().charAt(0).toLocaleUpperCase("vi-VN") || "K"}</div>
          <div className="customer-detail-heading"><h2 id="customer-detail-title">{customer.HoTen}</h2><span>{LABELS.title}</span></div>
          <button type="button" className="customer-detail-close" aria-label={LABELS.close} onClick={onClose}><X size={19} aria-hidden="true" /></button>
        </header>
        <dl className="customer-detail-fields">
          <div><dt>{LABELS.customerId}</dt><dd>{customerCode}</dd></div>
          <div><dt>{LABELS.name}</dt><dd>{customer.HoTen}</dd></div>
          <div><dt>{LABELS.phone}</dt><dd>{customer.SoDienThoai || "-"}</dd></div>
          <div><dt>{LABELS.tier}</dt><dd><span className="customer-tier-badge">{customer.HangThanhVien || "-"}</span></dd></div>
          <div><dt>{LABELS.status}</dt><dd><span className="customer-status-badge">{customer.TrangThai || "-"}</span></dd></div>
        </dl>
        <section className="customer-detail-activity" aria-labelledby="customer-activity-title">
          <h3 id="customer-activity-title">{LABELS.activity}</h3>
          {customerInvoices.length ? <>
            <p>{customerInvoices.length} {"h\u00f3a \u0111\u01a1n"} \u00b7 {customerRevenue.toLocaleString("vi-VN")} doanh thu</p>
            <ul className="customer-invoice-history">{customerInvoices.map((invoice) => <li key={invoice.header.MaHoaDon}>
              <span>{formatInvoiceCode(invoices.findIndex((item) => item.header.MaHoaDon === invoice.header.MaHoaDon) + 1)}</span>
              <time dateTime={invoice.header.NgayLap}>{new Date(invoice.header.NgayLap).toLocaleDateString("vi-VN")}</time>
              <strong>{invoice.header.TongTien.toLocaleString("vi-VN")} {"\u20ab"}</strong>
            </li>)}</ul>
          </> : <p>{LABELS.noInvoices}</p>}
        </section>
      </>}
    </dialog>
  );
}
