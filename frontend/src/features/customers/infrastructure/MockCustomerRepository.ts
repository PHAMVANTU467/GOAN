import type { CustomerRecord } from "../domain/Customer";
import type { NewCustomerInput } from "../domain/NewCustomerInput";
import type { CustomerRepository } from "../application/CustomerRepository";
import { SAMPLE_CUSTOMERS } from "./customerFixtures";

export class MockCustomerRepository implements CustomerRepository {
  private readonly storeId = SAMPLE_CUSTOMERS[0].MaCuaHang;
  private readonly customers: CustomerRecord[] = [...SAMPLE_CUSTOMERS];

  async getAll(): Promise<CustomerRecord[]> {
    return this.customers.map((customer) => ({ ...customer }));
  }

  async create(input: NewCustomerInput): Promise<CustomerRecord> {
    const customer: CustomerRecord = {
      MaKhachHang: crypto.randomUUID(),
      MaCuaHang: this.storeId,
      HoTen: input.name.trim(),
      SoDienThoai: input.phone.trim(),
      HangThanhVien: input.memberTier.trim(),
      TrangThai: input.status.trim(),
    };

    this.customers.push(customer);
    return { ...customer };
  }
}
