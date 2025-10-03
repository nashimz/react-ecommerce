export default function AsideFilters({ filters, setFilters, products = [] }) {
  const categories = ["all", ...new Set(products.map((p) => p.category))];
  const brands = [
    "all",
    ...new Set(products.map((p) => p.brand || "Unknown").filter(Boolean)),
  ];
  const prices = products.map((p) => p.price);
  const maxPrice = Math.max(...prices, 1000);

  return (
    <article className="p-4 w-full md:w-auto">
      <aside
        className="
          w-full md:w-48 
          bg-white rounded-md shadow-md border border-black/20 
          p-4 
          flex flex-col gap-4 
          md:flex-col 
          sm:grid sm:grid-cols-2 sm:gap-4
        "
      >
        <h2 className="font-bold text-lg col-span-2">Filters</h2>

        <div>
          <label className="block font-bold text-xs text-filters">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, category: e.target.value }))
            }
            className="w-full mt-1 border rounded text-xs h-8"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-bold text-xs text-filters">Brand</label>
          <select
            value={filters.brand}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, brand: e.target.value }))
            }
            className="w-full mt-1 border rounded text-xs h-8"
          >
            {brands.map((bra) => (
              <option key={bra} value={bra}>
                {bra.charAt(0).toUpperCase() + bra.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-bold text-xs text-filters">
            Min Price
          </label>
          <input
            type="number"
            value={filters.minPrice === 0 ? "" : filters.minPrice}
            min={0}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                minPrice: e.target.value ? Number(e.target.value) : 0,
              }))
            }
            className="w-full mt-1 p-2 border rounded text-xs h-8"
          />
        </div>

        <div>
          <label className="block font-bold text-xs text-filters">
            Max Price
          </label>
          <input
            type="number"
            value={filters.maxPrice === Infinity ? "" : filters.maxPrice}
            max={maxPrice}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                maxPrice: e.target.value ? Number(e.target.value) : 0,
              }))
            }
            className="w-full mt-1 p-2 border rounded text-xs h-8"
          />
        </div>
      </aside>
    </article>
  );
}
