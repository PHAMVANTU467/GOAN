import type { Category } from "../domain/SalesModels";

export function CategoryNavigation({
  categories,
  selected,
  onSelect,
}: {
  categories: Category[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <nav className="category-pills" aria-label="Danh mục sản phẩm">
      {[{ id: "all", name: "Tất cả" }, ...categories].map((category) => (
        <button
          key={category.id}
          type="button"
          aria-pressed={selected === category.id}
          className={`category-pill ${selected === category.id ? "selected" : ""}`}
          onClick={() => onSelect(category.id)}
        >
          {category.name}
        </button>
      ))}
    </nav>
  );
}
