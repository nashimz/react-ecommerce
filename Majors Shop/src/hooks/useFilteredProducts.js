// src/hooks/useFilteredProducts.js
import { useState, useEffect, useMemo, useContext } from "react";
import { filterProducts } from "../utils/filterProducts.jsx";
import { SearchContext } from "../context/SearchContext.jsx";

export function useFilteredProducts(products) {
  const { search } = useContext(SearchContext);

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
  }, [search, defaultFilters]); // Dependencia 'search' ahora del contexto

  const filteredProducts = useMemo(
    () => filterProducts(products, search, filters), // 'search' usado desde el contexto
    [products, search, filters]
  );

  return { filters, setFilters, filteredProducts };
}
