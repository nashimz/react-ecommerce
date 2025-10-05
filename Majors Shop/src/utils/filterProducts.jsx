// 🔹 Filtering Function
export function filterProducts(products = [], query, filters) {
  const normalizedQuery = query.trim().toLowerCase();

  return products.filter((p) => {
    const matchesSearch = `${p.title} ${p.brand} ${p.category}`
      .toLowerCase()
      .includes(normalizedQuery);

    const matchesCategory =
      filters.category === "all" || p.category === filters.category;

    const matchesBrand = filters.brand === "all" || p.brand === filters.brand;

    const matchesPrice =
      p.price >= filters.minPrice && p.price <= filters.maxPrice;

    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  });
}
