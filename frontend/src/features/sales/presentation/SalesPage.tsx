import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  CreditCard,
  FileText,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";
import type { CatalogService } from "../application/CatalogService";
import { calculateTotals, money, normalizeSearch } from "../application/Cart";
import type { CartLine, Catalog, Product } from "../domain/SalesModels";
import { CategoryNavigation } from "./CategoryNavigation";

interface OrderTab {
  id: string;
  lines: CartLine[];
  customer: string;
  discount: number;
  note: string;
}

export function SalesPage({
  catalogService,
}: {
  catalogService: CatalogService;
}) {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [orders, setOrders] = useState<OrderTab[]>([
    { id: "HD0001", lines: [], customer: "", discount: 0, note: "" },
  ]);
  const [activeOrderId, setActiveOrderId] = useState("HD0001");
  const [orderSeq, setOrderSeq] = useState(1);
  const [notice, setNotice] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const dialog = useRef<HTMLDialogElement>(null);
  const checkoutButton = useRef<HTMLButtonElement>(null);

  const activeOrder =
    orders.find((o) => o.id === activeOrderId) ?? orders[0];
  const lines = activeOrder.lines;
  const customer = activeOrder.customer;
  const discount = activeOrder.discount;
  const note = activeOrder.note;

  function updateActiveOrder(updater: (order: OrderTab) => Partial<OrderTab>) {
    setOrders((current) =>
      current.map((order) =>
        order.id === activeOrder.id ? { ...order, ...updater(order) } : order,
      ),
    );
  }

  function setLines(updater: CartLine[] | ((currentLines: CartLine[]) => CartLine[])) {
    updateActiveOrder((order) => ({
      lines: typeof updater === "function" ? updater(order.lines) : updater,
    }));
  }

  function setCustomer(newCustomer: string) {
    updateActiveOrder(() => ({ customer: newCustomer }));
  }

  function setDiscount(newDiscount: number) {
    updateActiveOrder(() => ({ discount: newDiscount }));
  }

  function setNote(newNote: string) {
    updateActiveOrder(() => ({ note: newNote }));
  }

  function handleAddNewOrder() {
    const nextSeq = orderSeq + 1;
    setOrderSeq(nextSeq);
    const newId = `HD${String(nextSeq).padStart(4, "0")}`;
    const newOrder: OrderTab = {
      id: newId,
      lines: [],
      customer: "",
      discount: 0,
      note: "",
    };
    setOrders((current) => [...current, newOrder]);
    setActiveOrderId(newId);
    setNotice(`Đã mở đơn hàng mới #${newId}`);
  }

  function handleCloseOrder(orderIdToClose: string, event?: React.MouseEvent) {
    event?.stopPropagation();
    if (orders.length <= 1) {
      setLines([]);
      setDiscount(0);
      setNote("");
      setCustomer("");
      setNotice("Đã làm mới đơn hàng hiện tại.");
      return;
    }
    const remaining = orders.filter((o) => o.id !== orderIdToClose);
    setOrders(remaining);
    if (activeOrderId === orderIdToClose) {
      setActiveOrderId(remaining[remaining.length - 1].id);
    }
    setNotice(`Đã hủy đơn hàng #${orderIdToClose}`);
  }
  useEffect(() => {
    let cancelled = false;
    catalogService
      .getCatalog()
      .then((data) => {
        if (!cancelled) setCatalog(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [catalogService]);
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 4000);
    return () => window.clearTimeout(timer);
  }, [notice]);
  const totals = calculateTotals(lines, discount);
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  const products = (catalog?.products ?? [])
    .filter(
      (product) =>
        (category === "all" || category === product.categoryId) &&
        normalizeSearch(product.name + " " + product.sku).includes(
          normalizeSearch(query),
        ),
    )
    .sort((a, b) => a.name.localeCompare(b.name, "vi"));
  function add(product: Product) {
    setLines((current) =>
      current.some((line) => line.product.id === product.id)
        ? current.map((line) =>
            line.product.id === product.id
              ? { ...line, quantity: line.quantity + 1 }
              : line,
          )
        : [...current, { product, quantity: 1 }],
    );
  }
  function changeQuantity(id: string, delta: number) {
    setLines((current) =>
      current
        .map((line) =>
          line.product.id === id
            ? { ...line, quantity: line.quantity + delta }
            : line,
        )
        .filter((line) => line.quantity > 0),
    );
  }
  function closePayment() {
    dialog.current?.close();
    checkoutButton.current?.focus();
  }
  return (
    <main className="sales-layout">
      <section className="catalog-section" aria-label="Danh sách sản phẩm">
        <div className="search-row">
          <label className="search-bar">
            <Search size={20} />
            <input
              aria-label="Tìm kiếm sản phẩm"
              placeholder="Tìm tên sản phẩm hoặc mã sản phẩm..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {query && (
              <button aria-label="Xóa tìm kiếm" onClick={() => setQuery("")}>
                <X size={16} />
              </button>
            )}
          </label>
        </div>
        <CategoryNavigation categories={catalog?.categories ?? []} selected={category} onSelect={setCategory} />
        <div className="results-heading">
          <h2>
            {category === "all"
              ? "Tất cả sản phẩm"
              : catalog?.categories.find((item) => item.id === category)?.name}
            <span>{products.length} sản phẩm</span>
          </h2>
          <span>Chạm để thêm vào đơn</span>
        </div>
        <div className="product-scroll">
          {error ? (
            <div className="empty-state">
              <p>Không tải được danh sách sản phẩm. Vui lòng tải lại trang.</p>
            </div>
          ) : !catalog ? (
            <div className="empty-state" role="status">
              Đang tải sản phẩm…
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <Search size={30} />
              <h3>Chưa tìm thấy sản phẩm</h3>
              <p>Thử tên hoặc mã khác, hoặc chọn tất cả danh mục.</p>
              <button
                className="btn-secondary"
                onClick={() => {
                  setQuery("");
                  setCategory("all");
                }}
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <div className="product-grid">
              {products.map((product) => {
                const quantity = lines.find(
                  (line) => line.product.id === product.id,
                )?.quantity;
                return (
                  <button
                    key={product.id}
                    className={`product-card ${quantity ? "in-cart" : ""}`}
                    data-category={product.categoryId}
                    onClick={() => add(product)}
                    aria-label={`Thêm ${product.name}, ${money(product.price)}`}
                  >
                    <div className="product-image">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                      />
                      {quantity && (
                        <span className="product-quantity">
                          <Check size={12} />
                          {quantity}
                        </span>
                      )}
                    </div>
                    <div className="product-info">
                      <div className="product-top">
                        <h3 className="product-title" title={product.name}>
                          {product.name}
                        </h3>
                        <span className="product-stock">
                          Còn: <strong>{product.stock ?? 50}</strong>
                        </span>
                      </div>
                      <div className="product-bottom">
                        <div className="product-price">
                          <strong>{money(product.price)}</strong>
                          <small>/ {product.unit}</small>
                        </div>
                        <span className="btn-add-product">
                          <Plus size={18} />
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <aside className="order-section" aria-label="Đơn hàng">
        <div className="order-tabs-bar" role="tablist" aria-label="Danh sách đơn hàng">
          <div className="order-tabs-list">
            {orders.map((order) => {
              const isActive = order.id === activeOrder.id;
              const itemCount = order.lines.reduce(
                (sum, line) => sum + line.quantity,
                0,
              );
              return (
                <div
                  key={order.id}
                  role="tab"
                  aria-selected={isActive}
                  className={`order-tab-box ${isActive ? "active" : ""}`}
                  onClick={() => setActiveOrderId(order.id)}
                >
                  <div className="order-tab-header">
                    <span className="order-tab-label">Đơn</span>
                    <button
                      type="button"
                      className="order-tab-cancel"
                      title={`Hủy đơn #${order.id}`}
                      aria-label={`Hủy đơn #${order.id}`}
                      onClick={(e) => handleCloseOrder(order.id, e)}
                    >
                      <X size={11} />
                    </button>
                  </div>
                  <div className="order-tab-body">
                    <span className="order-tab-code">#{order.id}</span>
                    {itemCount > 0 && (
                      <span className="order-tab-badge">{itemCount}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <button
            type="button"
            className="order-new-btn"
            title="Thêm đơn hàng mới"
            aria-label="Thêm đơn hàng mới"
            onClick={handleAddNewOrder}
          >
            <Plus size={18} />
          </button>
        </div>
        <label className="customer-select">
          <span className="customer-icon">
            <UserRound size={18} />
          </span>
          <div className="customer-info">
            <small>Khách hàng</small>
            <select
              aria-label="Chọn khách hàng"
              value={customer}
              onChange={(event) => setCustomer(event.target.value)}
            >
              <option value="">Khách lẻ</option>
              {catalog?.customers.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} · {item.phone}
                </option>
              ))}
            </select>
          </div>
          <ChevronDown size={16} />
        </label>
        <div className="order-list-heading">
          <span>
            Danh sách món <b>{count}</b>
          </span>
          <span>Thành tiền</span>
        </div>
        <div className="cart-lines">
          {lines.length === 0 ? (
            <div className="cart-empty">
              <span>
                <ShoppingBag size={32} strokeWidth={1.5} />
              </span>
              <h3>Đơn hàng chưa có món nào</h3>
              <p>
                Chọn sản phẩm bên thực đơn
                <br />
                để thêm vào đơn hàng hiện tại.
              </p>
              <div>
                <span>1</span> Chọn món <ArrowRight size={12} />
                <span>2</span> Thanh toán
              </div>
            </div>
          ) : (
            lines.map((line) => (
              <article className="cart-line" key={line.product.id}>
                <div className="cart-item-image">
                  <img src={line.product.image} alt={line.product.name} />
                </div>
                <div className="line-content">
                  <div className="line-header">
                    <h3 title={line.product.name}>{line.product.name}</h3>
                    <button
                      type="button"
                      className="btn-remove-item"
                      aria-label={`Xóa ${line.product.name}`}
                      title={`Xóa ${line.product.name}`}
                      onClick={() =>
                        setLines((current) =>
                          current.filter(
                            (item) => item.product.id !== line.product.id,
                          ),
                        )
                      }
                    >
                      <X size={13} />
                    </button>
                  </div>
                  <div className="line-pricing">
                    <span>{money(line.product.price)}</span>
                  </div>
                  <div className="line-bottom">
                    <div className="qty-stepper">
                      <button
                        type="button"
                        aria-label={`Giảm ${line.product.name}`}
                        onClick={() => changeQuantity(line.product.id, -1)}
                      >
                        <Minus size={12} />
                      </button>
                      <span>{line.quantity}</span>
                      <button
                        type="button"
                        aria-label={`Tăng ${line.product.name}`}
                        onClick={() => changeQuantity(line.product.id, 1)}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <strong className="line-total-price">{money(line.product.price * line.quantity)}</strong>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
        <div className="order-summary">
          <div className="order-note-input-wrapper">
            <FileText size={15} className="order-note-icon" />
            <input
              aria-label="Ghi chú đơn hàng"
              placeholder="Ghi chú đơn hàng (ít đá, mang đi…)"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              maxLength={250}
            />
            {note && (
              <button
                type="button"
                className="order-note-clear"
                title="Xóa ghi chú"
                aria-label="Xóa ghi chú"
                onClick={() => setNote("")}
              >
                <X size={12} />
              </button>
            )}
          </div>
          <div className="summary-breakdown">
            <div className="summary-row">
              <span>
                Tạm tính <small>({count} sản phẩm)</small>
              </span>
              <strong>{money(totals.subtotal)}</strong>
            </div>
            <div className="summary-row">
              <label htmlFor="discount-field">Giảm giá</label>
              <div className="discount-input-wrapper">
                <input
                  id="discount-field"
                  type="number"
                  min="0"
                  max={totals.subtotal}
                  step="1000"
                  value={discount || ""}
                  placeholder="0"
                  onChange={(event) =>
                    setDiscount(
                      Math.min(
                        totals.subtotal,
                        Math.max(0, Number(event.target.value)),
                      ),
                    )
                  }
                  onBlur={() => setDiscount(totals.discount)}
                />
                <span>₫</span>
              </div>
            </div>
          </div>
          <div className="summary-total-card">
            <div className="summary-total-label">
              <span>Tổng thanh toán</span>
            </div>
            <strong className="summary-total-amount">{money(totals.total)}</strong>
          </div>
          <button
            ref={checkoutButton}
            className="btn-checkout"
            disabled={!lines.length}
            onClick={() => dialog.current?.showModal()}
          >
            <CreditCard size={18} />
            <span>Thanh toán</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </aside>
      <div className="floating-notice" role="status">
        {notice}
      </div>
      <dialog className="payment-dialog" ref={dialog} onCancel={closePayment}>
        <button
          className="payment-dialog-close"
          aria-label="Đóng thanh toán"
          onClick={closePayment}
        >
          <X size={20} />
        </button>
        <span className="section-kicker">
          {catalog?.store?.name ? `${catalog.store.name.toUpperCase()} · XEM TRƯỚC ĐƠN HÀNG` : "XEM TRƯỚC ĐƠN HÀNG"}
        </span>
        <h2>Thanh toán</h2>
        <p>
          {customer
            ? catalog?.customers.find((item) => item.id === customer)?.name
            : "Khách lẻ"}{" "}
          · #{activeOrder.id} · {count} sản phẩm
        </p>
        <div className="payment-dialog-total">{money(totals.total)}</div>
        <div className="payment-methods">
          {[
            { id: "cash", name: "Tiền mặt" },
            { id: "transfer", name: "Chuyển khoản" },
          ].map((method) => (
            <button
              key={method.id}
              aria-pressed={paymentMethod === method.id}
              className={paymentMethod === method.id ? "selected" : ""}
              onClick={() => setPaymentMethod(method.id)}
            >
              {method.name}
              {paymentMethod === method.id && <Check size={16} />}
            </button>
          ))}
        </div>
        {note && <p>Ghi chú: {note}</p>}
        <p className="payment-disclaimer">
          Đây là bản xem trước giao diện. Đơn hàng chưa được lưu và không thu
          tiền thực tế.
        </p>
        <button
          className="btn-primary"
          onClick={() => {
            closePayment();
            setNotice(
              "Đã xem trước thanh toán. Đơn hàng vẫn được giữ để tiếp tục trải nghiệm.",
            );
          }}
        >
          Hoàn tất xem trước <Check size={18} />
        </button>
      </dialog>
    </main>
  );
}
