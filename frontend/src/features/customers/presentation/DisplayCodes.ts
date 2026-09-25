export function formatCustomerCode(sequence: number): string {
  return `KH${String(sequence).padStart(6, "0")}`;
}

export function formatInvoiceCode(sequence: number): string {
  return `HD${String(sequence).padStart(6, "0")}`;
}
