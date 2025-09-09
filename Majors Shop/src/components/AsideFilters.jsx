export default function AsideFilters({ filters, setFilters, products = [] }) {
  // products defaults to [] so map never fails
  const categories = ["all", ...new Set(products.map((p) => p.category))];
  const brands = [
    "all",
    ...new Set(products.map((p) => p.brand || "Unknown").filter(Boolean)),
  ];

  // optional: find min and max price from the products
  const prices = products.map((p) => p.price);

  const maxPrice = Math.max(...prices, 1000);

  return (
    <section className="p-4 pr-0 ">
      <aside className="w-48 p-4 bg-white rounded-md shadow-md flex flex-col gap-4 border border-black/20">
        <h2 className="font-bold text-lg">Filters</h2>

        <div>
          <label className="block font-bold text-xs text-filters">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, category: e.target.value }))
            }
            className="w-full mt-1  border rounded text-xs h-8"
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
            value={filters.minPrice === 0 ? "" : filters.minPrice} // show empty if 0
            min={0}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                minPrice: e.target.value ? Number(e.target.value) : 0, // 0 if empty
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
    </section>
  );
}
