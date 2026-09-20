import type { Catalog } from "../domain/SalesModels";

// Replace the mock adapter with an ASP.NET Core HTTP adapter at the composition root.
export interface CatalogService {
  getCatalog(): Promise<Catalog>;
}
