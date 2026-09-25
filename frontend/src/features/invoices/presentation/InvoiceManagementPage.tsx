import { useEffect, useMemo, useRef, useState } from "react";
import { Banknote, ReceiptText, Search, X } from "lucide-react";
import type { CustomerRecord } from "../../customers/domain/Customer";
import type { CustomerService } from "../../customers/application/CustomerService";
import type { InvoiceService } from "../application/InvoiceService";
import type { InvoiceRecord } from "../domain/InvoiceRecord";
import { formatCustomerCode, formatInvoiceCode } from "../../customers/presentation/DisplayCodes";
import { InvoiceDatePicker } from "./InvoiceDatePicker";

interface InvoiceManagementPageProps {
  invoiceService: InvoiceService;
  customerService: CustomerService;
}

const TEXT = {
  title: "H\u00f3a \u0111\u01a1n",
  list: "Danh s\u00e1ch h\u00f3a \u0111\u01a1n",
  count: "T\u1ed5ng h\u00f3a \u0111\u01a1n",
  revenue: "Doanh thu",
  date: "Th\u1eddi gian",
  from: "T\u1eeb ng\u00e0y",
  to: "\u0110\u1ebfn ng\u00e0y",
  status: "Tr\u1ea1ng th\u00e1i \u0111\u01a1n h\u00e0ng",
  allStatuses: "T\u1ea5t c\u1ea3 tr\u1ea1ng th\u00e1i",
  creator: "Ng\u01b0\u1eddi t\u1ea1o",
  allCreators: "T\u1ea5t c\u1ea3 ng\u01b0\u1eddi t\u1ea1o",
  method: "Ph\u01b0\u01a1ng th\u1ee9c thanh to\u00e1n",
  allMethods: "T\u1ea5t c\u1ea3 ph\u01b0\u01a1ng th\u1ee9c",
  search: "T\u00ecm m\u00e3 h\u00f3a \u0111\u01a1n ho\u1eb7c kh\u00e1ch h\u00e0ng",
  number: "M\u00e3 h\u00f3a \u0111\u01a1n",
  customer: "Kh\u00e1ch h\u00e0ng",
  createdAt: "Ng\u00e0y l\u1eadp",
  discount: "Gi\u1ea3m gi\u00e1",
  total: "T\u1ed5ng ti\u1ec1n",
  details: "Chi ti\u1ebft h\u00f3a \u0111\u01a1n",
  product: "S\u1ea3n ph\u1ea9m",
  quantity: "S\u1ed1 l\u01b0\u1ee3ng",
  unitPrice: "\u0110\u01a1n gi\u00e1",
  lineTotal: "Th\u00e0nh ti\u1ec1n",
  guest: "Kh\u00e1ch l\u1ebb",
  loading: "\u0110ang t\u1ea3i h\u00f3a \u0111\u01a1n...",
  empty: "Ch\u01b0a c\u00f3 d\u1eef li\u1ec7u h\u00f3a \u0111\u01a1n.",
  noMatch: "Kh\u00f4ng t\u00ecm th\u1ea5y h\u00f3a \u0111\u01a1n ph\u00f9 h\u1ee3p.",
  error: "Kh\u00f4ng t\u1ea3i \u0111\u01b0\u1ee3c danh s\u00e1ch h\u00f3a \u0111\u01a1n.",
  close: "\u0110\u00f3ng chi ti\u1ebft h\u00f3a \u0111\u01a1n",
  shiftCode: "M\u00e3 ca",
  warehouseCode: "M\u00e3 kho",
} as const;

const currency = (amount: number) => `${amount.toLocaleString("vi-VN")} \u20ab`;
const formatDateParts = (value: string) => {
  const date = new Date(value);
  return {
    date: new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date),
    time: new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }).format(date),
  };
};
const formatDate = (value: string) => {
  const parts = formatDateParts(value);
  return `${parts.date} ${parts.time}`;
};
const isRevenueInvoice = (invoice: InvoiceRecord) => invoice.header.TrangThai === "Ho\u00e0n th\u00e0nh";

export function InvoiceManagementPage({ invoiceService, customerService }: InvoiceManagementPageProps) {
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [creatorFilter, setCreatorFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const detailDialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    let cancelled = false;
    invoiceService.list()
      .then((rows) => { if (!cancelled) setInvoices(rows); })
      .catch(() => { if (!cancelled) setError(TEXT.error); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [invoiceService]);

  useEffect(() => {
    let cancelled = false;
    customerService.list().then((rows) => { if (!cancelled) setCustomers(rows); }).catch(() => {});
    return () => { cancelled = true; };
  }, [customerService]);

  useEffect(() => {
    const dialog = detailDialogRef.current;
    if (!dialog) return;
    if (selectedInvoice && !dialog.open) dialog.showModal();
    if (!selectedInvoice && dialog.open) dialog.close();
  }, [selectedInvoice]);

  const customerNames = useMemo(() => new Map(customers.map((customer) => [customer.MaKhachHang, customer.HoTen])), [customers]);
  const customerCodes = useMemo(() => new Map(customers.map((customer, index) => [customer.MaKhachHang, formatCustomerCode(index + 1)])), [customers]);
  const invoiceCodes = useMemo(() => new Map(invoices.map((invoice, index) => [invoice.header.MaHoaDon, formatInvoiceCode(index + 1)])), [invoices]);
  const statuses = useMemo(() => [...new Set(invoices.map((invoice) => invoice.header.TrangThai))], [invoices]);
  const methods = useMemo(() => [...new Set(invoices.flatMap((invoice) => invoice.payments.map((payment) => payment.PhuongThuc)))], [invoices]);
  const creators = useMemo(() => [...new Map(invoices.flatMap((invoice) => invoice.creator ? [[invoice.creator.MaNguoiDung, invoice.creator.HoTen] as const] : [])).entries()], [invoices]);
  const startDateTime = startDate ? new Date(`${startDate}T00:00:00`).getTime() : null;
  const endDateTime = endDate ? new Date(`${endDate}T23:59:59.999`).getTime() : null;

  const filteredInvoices = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("vi-VN");
    return invoices.filter((invoice) => {
      const header = invoice.header;
      const customerName = header.MaKhachHang ? customerNames.get(header.MaKhachHang) ?? "" : TEXT.guest;
      const customerCode = header.MaKhachHang ? customerCodes.get(header.MaKhachHang) ?? "" : "";
      const invoiceCode = invoiceCodes.get(header.MaHoaDon) ?? "";
      const invoiceTime = new Date(header.NgayLap).getTime();
      return (!term || `${invoiceCode} ${header.MaHoaDon} ${customerCode} ${customerName}`.toLocaleLowerCase("vi-VN").includes(term))
        && (startDateTime === null || invoiceTime >= startDateTime)
        && (endDateTime === null || invoiceTime <= endDateTime)
        && (statusFilter === "all" || header.TrangThai === statusFilter)
        && (methodFilter === "all" || invoice.payments.some((payment) => payment.PhuongThuc === methodFilter))
        && (creatorFilter === "all" || invoice.creator?.MaNguoiDung === creatorFilter);
    });
  }, [creatorFilter, customerCodes, customerNames, endDateTime, invoiceCodes, invoices, methodFilter, search, startDateTime, statusFilter]);

  const revenue = invoices.filter(isRevenueInvoice).reduce((sum, invoice) => sum + invoice.header.TongTien, 0);
  const methodLabel = (method: string) => method;
  const paymentMethodsFor = (invoice: InvoiceRecord) => [...new Set(invoice.payments.map((payment) => methodLabel(payment.PhuongThuc)))].join(", ") || "-";

  return (
    <main className="invoice-management-page">
      <section className="customer-summary-grid" aria-label={`${TEXT.count} / ${TEXT.revenue}`}>
        <article className="customer-summary-card"><span className="customer-summary-icon"><ReceiptText size={19} aria-hidden="true" /></span><div><p>{TEXT.count}</p><strong>{invoices.length}</strong></div></article>
        <article className="customer-summary-card"><span className="customer-summary-icon is-active"><Banknote size={19} aria-hidden="true" /></span><div><p>{TEXT.revenue}</p><strong>{currency(revenue)}</strong></div></article>
      </section>

      <section className="customer-list-panel invoice-panel" aria-label={TEXT.list}>
        <div className="invoice-list-heading">
          <h2>{TEXT.list}</h2>
          <label className="customer-search-field invoice-search-field">
            <Search size={17} aria-hidden="true" />
            <span className="sr-only">{TEXT.search}</span>
            <input type="search" value={search} placeholder={TEXT.search} onChange={(event) => setSearch(event.target.value)} />
          </label>
        </div>
        <div className="invoice-filter-bar">
          <div className="invoice-filter-control invoice-date-filter"><span>{TEXT.from}</span><InvoiceDatePicker label={TEXT.from} value={startDate} max={endDate || undefined} onChange={setStartDate} /></div>
          <div className="invoice-filter-control invoice-date-filter"><span>{TEXT.to}</span><InvoiceDatePicker label={TEXT.to} value={endDate} min={startDate || undefined} onChange={setEndDate} /></div>
          <label className="invoice-filter-control"><span>{TEXT.creator}</span><select value={creatorFilter} onChange={(event) => setCreatorFilter(event.target.value)}><option value="all">{TEXT.allCreators}</option>{creators.map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></label>
          <label className="invoice-filter-control"><span>{TEXT.status}</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">{TEXT.allStatuses}</option>{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></label>
          <label className="invoice-filter-control"><span>{TEXT.method}</span><select value={methodFilter} onChange={(event) => setMethodFilter(event.target.value)}><option value="all">{TEXT.allMethods}</option>{methods.map((method) => <option key={method} value={method}>{methodLabel(method)}</option>)}</select></label>
        </div>

        {error ? <div className="customer-empty-state" role="alert">{error}</div> : loading ? (
          <div className="customer-empty-state" role="status">{TEXT.loading}</div>
        ) : filteredInvoices.length === 0 ? (
          <div className="customer-empty-state" role="status">{invoices.length ? TEXT.noMatch : TEXT.empty}</div>
        ) : (
          <div className="customer-table-scroll"><table className="invoice-table">
            <thead><tr><th>{TEXT.number}</th><th>{TEXT.customer}</th><th>{TEXT.date}</th><th>{TEXT.creator}</th><th>{TEXT.method}</th><th>{TEXT.total}</th><th>{TEXT.status}</th></tr></thead>
            <tbody>{filteredInvoices.map((invoice) => {
              const header = invoice.header;
              const name = header.MaKhachHang ? customerNames.get(header.MaKhachHang) ?? "-" : TEXT.guest;
              const dateParts = formatDateParts(header.NgayLap);
              return <tr key={header.MaHoaDon} tabIndex={0} aria-label={`Xem ${TEXT.title} ${invoiceCodes.get(header.MaHoaDon)}`} onClick={() => setSelectedInvoice(invoice)} onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedInvoice(invoice); }
              }}>
                <td><strong>{invoiceCodes.get(header.MaHoaDon)}</strong></td><td><span>{name}</span>{header.MaKhachHang && <small className="invoice-customer-code">{customerCodes.get(header.MaKhachHang)}</small>}</td><td><time className="invoice-date-time" dateTime={header.NgayLap}><span>{dateParts.date}</span><span>{dateParts.time}</span></time></td><td>{invoice.creator?.HoTen ?? "-"}</td><td>{paymentMethodsFor(invoice)}</td><td className="invoice-amount">{currency(header.TongTien)}</td><td><span className="customer-status-badge">{header.TrangThai}</span></td>
              </tr>;
            })}</tbody>
          </table></div>
        )}
        <footer className="customer-list-footer">{filteredInvoices.length} {TEXT.title}</footer>
      </section>

      <dialog ref={detailDialogRef} className="invoice-detail-dialog" aria-labelledby="invoice-detail-title" onCancel={() => setSelectedInvoice(null)}>
        {selectedInvoice && <>
          <header className="invoice-detail-heading"><div><span>{TEXT.title}</span><h2 id="invoice-detail-title">{invoiceCodes.get(selectedInvoice.header.MaHoaDon)}</h2></div><button type="button" className="customer-detail-close" aria-label={TEXT.close} onClick={() => setSelectedInvoice(null)}><X size={19} aria-hidden="true" /></button></header>
          <dl className="invoice-meta-grid">
            <div><dt>{TEXT.customer}</dt><dd>{selectedInvoice.header.MaKhachHang ? customerNames.get(selectedInvoice.header.MaKhachHang) ?? "-" : TEXT.guest}</dd></div>
            <div><dt>{TEXT.createdAt}</dt><dd>{formatDate(selectedInvoice.header.NgayLap)}</dd></div>
            <div><dt>{TEXT.creator}</dt><dd>{selectedInvoice.creator?.HoTen ?? "-"}</dd></div>
            <div><dt>{TEXT.method}</dt><dd>{paymentMethodsFor(selectedInvoice)}</dd></div>
            <div><dt>{TEXT.shiftCode}</dt><dd>{shiftCodesFor(invoices, selectedInvoice.header.MaCa)}</dd></div>
            <div><dt>{TEXT.warehouseCode}</dt><dd>{warehouseCodesFor(invoices, selectedInvoice.header.MaKho)}</dd></div>
            <div><dt>{TEXT.status}</dt><dd>{selectedInvoice.header.TrangThai}</dd></div>
          </dl>
          <div className="customer-table-scroll invoice-lines-scroll"><table className="invoice-table invoice-lines-table">
            <thead><tr><th>{TEXT.product}</th><th>{TEXT.quantity}</th><th>{TEXT.unitPrice}</th><th>{TEXT.discount}</th><th>{TEXT.lineTotal}</th></tr></thead>
            <tbody>{selectedInvoice.lines.map((line) => <tr key={line.MaChiTiet}><td>{line.TenSanPham}</td><td>{line.SoLuong}</td><td>{currency(line.DonGia)}</td><td>{currency(line.GiamGia)}</td><td>{currency(line.ThanhTien)}</td></tr>)}</tbody>
          </table></div>
          <div className="invoice-detail-total"><span>{TEXT.discount}</span><strong>{currency(selectedInvoice.header.GiamGia)}</strong><span>{TEXT.total}</span><strong>{currency(selectedInvoice.header.TongTien)}</strong></div>
        </>}
      </dialog>
    </main>
  );
}

function shiftCodesFor(invoices: InvoiceRecord[], id: string): string {
  const position = [...new Set(invoices.map((invoice) => invoice.header.MaCa))].indexOf(id) + 1;
  return `CA${String(position).padStart(6, "0")}`;
}

function warehouseCodesFor(invoices: InvoiceRecord[], id: string): string {
  const position = [...new Set(invoices.map((invoice) => invoice.header.MaKho))].indexOf(id) + 1;
  return `KHO${String(position).padStart(6, "0")}`;
}
