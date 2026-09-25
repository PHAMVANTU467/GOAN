import type { InvoiceRecord } from "../domain/InvoiceRecord";

export interface InvoiceRepository {
  getAll(): Promise<InvoiceRecord[]>;
}
