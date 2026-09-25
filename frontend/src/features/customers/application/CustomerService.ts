import type { CustomerRecord } from "../domain/Customer";
import type { NewCustomerInput } from "../domain/NewCustomerInput";
import type { CustomerRepository } from "./CustomerRepository";

export class CustomerService {
  constructor(private readonly repository: CustomerRepository) {}

  list(): Promise<CustomerRecord[]> {
    return this.repository.getAll();
  }

  create(input: NewCustomerInput): Promise<CustomerRecord> {
    return this.repository.create(input);
  }
}
