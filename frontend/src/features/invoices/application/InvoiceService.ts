import type { InvoiceRepository } from "./InvoiceRepository";
import type { InvoiceRecord } from "../domain/InvoiceRecord";

export class InvoiceService {
  constructor(private readonly repository: InvoiceRepository) {}

  list(): Promise<InvoiceRecord[]> {
    return this.repository.getAll();
  }
}
