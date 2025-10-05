// src/hooks/useFilteredProducts.js
import { useState, useEffect, useMemo } from "react";
import { filterProducts } from "../utils/filterProducts.jsx";

export function useFilteredProducts(products, search) {
  const defaultFilters = useMemo(
    () => ({
      category: "all",
      minPrice: 0,
      maxPrice: Infinity,
      brand: "all",
    }),
    []
  );

  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    setFilters(defaultFilters);
  }, [search, defaultFilters]);

  const filteredProducts = useMemo(
    () => filterProducts(products, search, filters),
    [products, search, filters]
  );

  return { filters, setFilters, filteredProducts };
}
