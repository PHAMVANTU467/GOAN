import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  CreditCard,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import type { CatalogService } from "../application/CatalogService";
import { calculateTotals, money, normalizeSearch } from "../application/Cart";
import type { CartLine, Catalog, Product } from "../domain/SalesModels";
import { CategoryNavigation } from "./CategoryNavigation";

export function SalesPage({
  catalogService,
}: {
  catalogService: CatalogService;
}) {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");
  const [lines, setLines] = useState<CartLine[]>([]);
  const [customer, setCustomer] = useState("");
  const [discount, setDiscount] = useState(0);
  const [note, setNote] = useState("");
  const [orderType, setOrderType] = useState("takeaway");
  const [notice, setNotice] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const dialog = useRef<HTMLDialogElement>(null);
  const checkoutButton = useRef<HTMLButtonElement>(null);
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
    .sort((a, b) =>
      sort === "price"
        ? a.price - b.price
        : sort === "name"
          ? a.name.localeCompare(b.name, "vi")
          : 0,
    );
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
    <main className="pos-sales">
      <section className="pos-catalog" aria-label="Danh sách sản phẩm">
        <div className="pos-search-row">
          <label className="pos-search">
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
          <label className="pos-sort">
            <SlidersHorizontal size={18} />
            <select
              aria-label="Sắp xếp sản phẩm"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              <option value="default">Mặc định</option>
              <option value="price">Giá tăng dần</option>
              <option value="name">Tên A–Z</option>
            </select>
          </label>
        </div>
        <CategoryNavigation categories={catalog?.categories ?? []} selected={category} onSelect={setCategory} />
        <div className="pos-results-heading">
          <h2>
            {category === "all"
              ? "Tất cả sản phẩm"
              : catalog?.categories.find((item) => item.id === category)?.name}
            <span>{products.length} sản phẩm</span>
          </h2>
          <span>Chạm để thêm vào đơn</span>
        </div>
        <div className="pos-product-scroll">
          {error ? (
            <div className="pos-empty">
              <p>Không tải được danh sách sản phẩm. Vui lòng tải lại trang.</p>
            </div>
          ) : !catalog ? (
            <div className="pos-empty" role="status">
              Đang tải sản phẩm…
            </div>
          ) : products.length === 0 ? (
            <div className="pos-empty">
              <Search size={30} />
              <h3>Chưa tìm thấy sản phẩm</h3>
              <p>Thử tên hoặc mã khác, hoặc chọn tất cả danh mục.</p>
              <button
                className="pos-secondary"
                onClick={() => {
                  setQuery("");
                  setCategory("all");
                }}
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <div className="pos-product-grid">
              {products.map((product) => {
                const quantity = lines.find(
                  (line) => line.product.id === product.id,
                )?.quantity;
                return (
                  <button
                    key={product.id}
                    className={`pos-product ${quantity ? "in-cart" : ""}`}
                    data-category={product.categoryId}
                    onClick={() => add(product)}
                    aria-label={`Thêm ${product.name}, ${money(product.price)}`}
                  >
                    <div className="pos-product-image">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                      />
                      {quantity && (
                        <span className="pos-product-quantity">
                          <Check size={12} />
                          {quantity}
                        </span>
                      )}
                    </div>
                    <div className="pos-product-info">
                      <div className="pos-product-top">
                        <h3 className="pos-product-title" title={product.name}>
                          {product.name}
                        </h3>
                        <span className="pos-product-stock">
                          Còn: <strong>{product.stock ?? 50}</strong>
                        </span>
                      </div>
                      <div className="pos-product-bottom">
                        <div className="pos-product-price">
                          <strong>{money(product.price)}</strong>
                          <small>/ {product.unit}</small>
                        </div>
                        <span className="pos-add">
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
      <aside className="pos-order" aria-label="Đơn hàng hiện tại">
        <header className="pos-order-heading">
          <div>
            <ShoppingBag size={21} />
            <div className="pos-order-title-group">
              <h2>Đơn hàng hiện tại</h2>
              {catalog?.store?.name && (
                <span className="pos-order-store-name">{catalog.store.name}</span>
              )}
            </div>
          </div>
          <span>#ĐƠN MỚI</span>
        </header>
        <div className="pos-order-type">
          <button
            className={orderType === "takeaway" ? "selected" : ""}
            onClick={() => setOrderType("takeaway")}
          >
            Mang đi
          </button>
          <button
            className={orderType === "here" ? "selected" : ""}
            onClick={() => setOrderType("here")}
          >
            Tại cửa hàng
          </button>
        </div>
        <label className="pos-customer">
          <span className="pos-customer-icon">
            <UserRound size={19} />
          </span>
          <div>
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
        <div className="pos-order-list-heading">
          <span>
            Sản phẩm <b>{count}</b>
          </span>
          <span>Thành tiền</span>
        </div>
        <div className="pos-cart-lines">
          {lines.length === 0 ? (
            <div className="pos-cart-empty">
              <span>
                <ShoppingBag size={35} strokeWidth={1.4} />
              </span>
              <h3>Đơn hàng đang chờ bạn</h3>
              <p>
                Chọn sản phẩm bên trái
                <br />
                để bắt đầu một đơn hàng mới.
              </p>
              <div>
                <span>1</span> Chọn món <ArrowRight size={13} />
                <span>2</span> Thanh toán
              </div>
            </div>
          ) : (
            lines.map((line) => (
              <article className="pos-cart-line" key={line.product.id}>
                <img src={line.product.image} alt="" />
                <div className="pos-line-content">
                  <h3>{line.product.name}</h3>
                  <small>{money(line.product.price)}</small>
                  <div className="pos-line-bottom">
                    <div className="pos-stepper">
                      <button
                        aria-label={`Giảm ${line.product.name}`}
                        onClick={() => changeQuantity(line.product.id, -1)}
                      >
                        <Minus size={13} />
                      </button>
                      <span>{line.quantity}</span>
                      <button
                        aria-label={`Tăng ${line.product.name}`}
                        onClick={() => changeQuantity(line.product.id, 1)}
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <strong>{money(line.product.price * line.quantity)}</strong>
                  </div>
                </div>
                <button
                  className="pos-remove"
                  aria-label={`Xóa ${line.product.name}`}
                  onClick={() =>
                    setLines((current) =>
                      current.filter(
                        (item) => item.product.id !== line.product.id,
                      ),
                    )
                  }
                >
                  <X size={14} />
                </button>
              </article>
            ))
          )}
        </div>
        <div className="pos-order-summary">
          <label className="pos-note">
            <input
              aria-label="Ghi chú đơn hàng"
              placeholder="Thêm ghi chú cho đơn hàng…"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              maxLength={250}
            />
          </label>
          <div className="pos-summary-row">
            <span>
              Tạm tính <small>({count} sản phẩm)</small>
            </span>
            <strong>{money(totals.subtotal)}</strong>
          </div>
          <div className="pos-summary-row">
            <label htmlFor="pos-discount">Giảm giá</label>
            <div className="pos-discount">
              <input
                id="pos-discount"
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
          <div className="pos-total">
            <span>Tổng thanh toán</span>
            <strong>{money(totals.total)}</strong>
          </div>
          <button
            ref={checkoutButton}
            className="pos-checkout"
            disabled={!lines.length}
            onClick={() => dialog.current?.showModal()}
          >
            <CreditCard size={19} />
            Thanh toán
            <ArrowRight size={19} />
          </button>
          <p className="pos-checkout-hint">
            Dữ liệu mẫu · Chưa phát sinh giao dịch thực tế
          </p>
          {lines.length > 0 && (
            <button
              className="pos-clear-cart"
              onClick={() => {
                setLines([]);
                setDiscount(0);
                setNote("");
                setNotice("Đã xóa sản phẩm khỏi đơn hiện tại.");
              }}
            >
              <Trash2 size={13} /> Xóa đơn hiện tại
            </button>
          )}
        </div>
      </aside>
      <div className="pos-notice" role="status">
        {notice}
      </div>
      <dialog className="pos-payment" ref={dialog} onCancel={closePayment}>
        <button
          className="pos-payment-close"
          aria-label="Đóng thanh toán"
          onClick={closePayment}
        >
          <X size={20} />
        </button>
        <span className="pos-section-kicker">
          {catalog?.store?.name ? `${catalog.store.name.toUpperCase()} · XEM TRƯỚC ĐƠN HÀNG` : "XEM TRƯỚC ĐƠN HÀNG"}
        </span>
        <h2>Thanh toán</h2>
        <p>
          {customer
            ? catalog?.customers.find((item) => item.id === customer)?.name
            : "Khách lẻ"}{" "}
          · {orderType === "here" ? "Tại cửa hàng" : "Mang đi"} · {count} sản
          phẩm
        </p>
        <div className="pos-payment-total">{money(totals.total)}</div>
        <div className="pos-payment-methods">
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
        <p className="pos-payment-disclaimer">
          Đây là bản xem trước giao diện. Đơn hàng chưa được lưu và không thu
          tiền thực tế.
        </p>
        <button
          className="pos-primary"
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
