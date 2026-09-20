import { describe, expect, it } from "vitest";
import { calculateTotals, normalizeSearch } from "./Cart";
import type { CartLine } from "../domain/SalesModels";

const lines: CartLine[] = [
  {
    product: {
      id: "p1",
      sku: "SP0001",
      name: "Cà phê",
      categoryId: "coffee",
      price: 35000,
      image: "",
      unit: "Ly",
    },
    quantity: 2,
  },
];
describe("POS preview totals", () => {
  it("calculates quantities and a fixed discount", () => {
    expect(calculateTotals(lines, 10000)).toEqual({
      subtotal: 70000,
      discount: 10000,
      total: 60000,
    });
  });
  it("never produces a negative total or discount", () => {
    expect(calculateTotals(lines, 90000).total).toBe(0);
    expect(calculateTotals(lines, -1).discount).toBe(0);
    expect(calculateTotals(lines, NaN).discount).toBe(0);
    expect(calculateTotals([], 10000)).toEqual({
      subtotal: 0,
      discount: 0,
      total: 0,
    });
  });
  it("supports Vietnamese searches without accents", () => {
    expect(normalizeSearch("Cà phê ĐEN đá")).toBe("ca phe den da");
  });
});
