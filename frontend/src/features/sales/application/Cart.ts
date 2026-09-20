import type { CartLine } from "../domain/SalesModels";

export function calculateTotals(lines: CartLine[], discount: number) {
  const subtotal = lines.reduce(
    (sum, line) => sum + line.product.price * line.quantity,
    0,
  );
  const safeDiscount = Math.min(
    subtotal,
    Math.max(0, Number.isFinite(discount) ? discount : 0),
  );
  return { subtotal, discount: safeDiscount, total: subtotal - safeDiscount };
}
export const money = (value: number) =>
  new Intl.NumberFormat("vi-VN").format(value) + " ₫";
export const normalizeSearch = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
