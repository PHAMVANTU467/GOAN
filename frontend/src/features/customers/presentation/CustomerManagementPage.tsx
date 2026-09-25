import { useEffect, useMemo, useState } from "react";
import { Search, UserPlus, Users, Banknote } from "lucide-react";
import type { CustomerRecord } from "../domain/Customer";
import { AddCustomerModal } from "./AddCustomerModal";
import { CustomerDetailModal } from "./CustomerDetailModal";
import type { NewCustomerInput } from "../domain/NewCustomerInput";
import type { CustomerService } from "../application/CustomerService";
import type { InvoiceService } from "../../invoices/application/InvoiceService";
import type { InvoiceRecord } from "../../invoices/domain/InvoiceRecord";
import { formatCustomerCode } from "./DisplayCodes";

interface CustomerManagementPageProps {
  customerService: CustomerService;
  invoiceService: InvoiceService;
}

const TEXT = {
  unableToLoad: "Kh\u00f4ng t\u1ea3i \u0111\u01b0\u1ee3c danh s\u00e1ch kh\u00e1ch h\u00e0ng.",
  added: "\u0110\u00e3 th\u00eam kh\u00e1ch h\u00e0ng v\u00e0o d\u1eef li\u1ec7u m\u1eabu.",
  addFailed: "Ch\u01b0a th\u1ec3 th\u00eam kh\u00e1ch h\u00e0ng. Vui l\u00f2ng th\u1eed l\u1ea1i.",
  pageTitle: "Kh\u00e1ch h\u00e0ng",
  addCustomer: "Th\u00eam kh\u00e1ch h\u00e0ng",
  overview: "T\u1ed5ng quan kh\u00e1ch h\u00e0ng",
  total: "T\u1ed5ng kh\u00e1ch h\u00e0ng",
  revenue: "Doanh thu",
  list: "Danh s\u00e1ch kh\u00e1ch h\u00e0ng",
  search: "T\u00ecm kh\u00e1ch h\u00e0ng",
  loading: "\u0110ang t\u1ea3i kh\u00e1ch h\u00e0ng...",
  none: "Ch\u01b0a c\u00f3 kh\u00e1ch h\u00e0ng.",
  noMatch: "Kh\u00f4ng t\u00ecm th\u1ea5y kh\u00e1ch h\u00e0ng ph\u00f9 h\u1ee3p.",
  customer: "Kh\u00e1ch h\u00e0ng",
  phone: "S\u1ed1 \u0111i\u1ec7n tho\u1ea1i",
  tier: "H\u1ea1ng th\u00e0nh vi\u00ean",
  status: "Tr\u1ea1ng th\u00e1i",
  orders: "Đơn hàng",
} as const;

function matchesSearch(customer: CustomerRecord, search: string, displayCode: string): boolean {
  const normalizedSearch = search.trim().toLocaleLowerCase("vi-VN");
  if (!normalizedSearch) return true;

  return [
    customer.MaKhachHang,
    customer.HoTen,
    customer.SoDienThoai,
    customer.HangThanhVien,
    customer.TrangThai,
    displayCode,
  ].some((value) => value.toLocaleLowerCase("vi-VN").includes(normalizedSearch));
}

export function CustomerManagementPage({
  customerService,
  invoiceService,
}: CustomerManagementPageProps) {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let cancelled = false;
    customerService
      .list()
      .then((data) => {
        if (!cancelled) setCustomers(data);
      })
      .catch(() => {
        if (!cancelled) setError(TEXT.unableToLoad);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [customerService]);

  useEffect(() => {
    let cancelled = false;
    invoiceService.list().then((rows) => { if (!cancelled) setInvoices(rows); }).catch(() => {});
    return () => { cancelled = true; };
  }, [invoiceService]);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(""), 3500);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const customerCodes = useMemo(
    () => new Map(customers.map((customer, index) => [customer.MaKhachHang, formatCustomerCode(index + 1)])),
    [customers],
  );
  const filteredCustomers = useMemo(
    () => customers.filter((customer) => matchesSearch(customer, search, customerCodes.get(customer.MaKhachHang) ?? "")),
    [customerCodes, customers, search],
  );

  const completedInvoices = invoices.filter((invoice) => invoice.header.TrangThai === "Ho\u00e0n th\u00e0nh");
  const totalRevenue = completedInvoices.reduce((sum, invoice) => sum + invoice.header.TongTien, 0);
  const totalOrders = invoices.length;
  const customerMetrics = (customerId: string) => {
    const customerInvoices = invoices.filter((invoice) => invoice.header.MaKhachHang === customerId);
    return {
      orders: customerInvoices.length,
      revenue: customerInvoices.filter((invoice) => invoice.header.TrangThai === "Ho\u00e0n th\u00e0nh").reduce((sum, invoice) => sum + invoice.header.TongTien, 0),
    };
  };

  async function handleCreateCustomer(input: NewCustomerInput) {
    try {
      const customer = await customerService.create(input);
      setCustomers((current) => [customer, ...current]);
      setNotice(TEXT.added);
    } catch {
      setNotice(TEXT.addFailed);
    }
  }

  return (
    <main className="customer-management-page">
      <section className="customer-summary-grid" aria-label={TEXT.overview}>
        <article className="customer-summary-card">
          <span className="customer-summary-icon"><Users size={19} aria-hidden="true" /></span>
          <div><p>{TEXT.total}</p><strong>{customers.length}</strong></div>
        </article>
        <article className="customer-summary-card">
          <span className="customer-summary-icon is-active"><Banknote size={19} aria-hidden="true" /></span>
          <div><p>{TEXT.revenue}</p><strong>{totalRevenue.toLocaleString("vi-VN")} ₫</strong></div>
        </article>
      </section>

      <section className="customer-list-panel" aria-labelledby="customer-list-title">
        <div className="customer-list-toolbar">
          <div>
            <h2 id="customer-list-title">{TEXT.list}</h2>
          </div>
          <div className="customer-list-controls">
            <button
              type="button"
              className="customer-primary-action customer-add-icon-button"
              aria-label={TEXT.addCustomer}
              title={TEXT.addCustomer}
              onClick={() => setModalOpen(true)}
            >
              <UserPlus size={19} aria-hidden="true" />
            </button>
            <label className="customer-search-field">
              <Search size={17} aria-hidden="true" />
              <span className="sr-only">{TEXT.search}</span>
              <input
                type="search"
                value={search}
                placeholder={`${TEXT.search}...`}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
          </div>
        </div>

        {error ? (
          <div className="customer-empty-state" role="alert">{error}</div>
        ) : loading ? (
          <div className="customer-empty-state" role="status">{TEXT.loading}</div>
        ) : filteredCustomers.length === 0 ? (
          <div className="customer-empty-state" role="status">
            {customers.length === 0 ? TEXT.none : TEXT.noMatch}
          </div>
        ) : (
          <div className="customer-table-scroll">
            <table className="customer-table">
              <thead>
                <tr>
                  <th scope="col">{TEXT.customer}</th>
                  <th scope="col">{TEXT.phone}</th>
                  <th scope="col">{TEXT.revenue}</th>
                  <th scope="col">{TEXT.orders}</th>
                  <th scope="col">{TEXT.tier}</th>
                  <th scope="col">{TEXT.status}</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  (() => {
                    const metrics = customerMetrics(customer.MaKhachHang);
                    return (
                  <tr
                    key={customer.MaKhachHang}
                    className="customer-clickable-row"
                    tabIndex={0}
                    aria-label={`Xem chi tiết khách hàng ${customer.HoTen}`}
                    onClick={() => setSelectedCustomer(customer)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedCustomer(customer);
                      }
                    }}
                  >
                    <td>
                      <div className="customer-table-name">{customer.HoTen}</div>
                      <div className="customer-table-id">{customerCodes.get(customer.MaKhachHang)}</div>
                    </td>
                    <td>{customer.SoDienThoai || "-"}</td>
                    <td>{metrics.revenue.toLocaleString("vi-VN")} ₫</td>
                    <td>{metrics.orders}</td>
                    <td><span className="customer-tier-badge">{customer.HangThanhVien}</span></td>
                    <td><span className="customer-status-badge">{customer.TrangThai}</span></td>
                  </tr>
                    );
                  })()
                ))}
              </tbody>
            </table>
          </div>
        )}

        <footer className="customer-list-footer" aria-live="polite">
          <span>{filteredCustomers.length} {TEXT.customer} · {totalOrders} {TEXT.orders}</span>
        </footer>
      </section>

      {notice && <div className="customer-toast" role="status">{notice}</div>}

      <AddCustomerModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(data) => { void handleCreateCustomer(data); }}
      />
      <CustomerDetailModal
        customer={selectedCustomer}
        customerCode={customerCodes.get(selectedCustomer?.MaKhachHang ?? "") ?? ""}
        invoices={invoices}
        onClose={() => setSelectedCustomer(null)}
      />
    </main>
  );
}
