import type { CustomerRecord } from "../domain/Customer";
import type { NewCustomerInput } from "../domain/NewCustomerInput";

export interface CustomerRepository {
  getAll(): Promise<CustomerRecord[]>;
  create(input: NewCustomerInput): Promise<CustomerRecord>;
}
