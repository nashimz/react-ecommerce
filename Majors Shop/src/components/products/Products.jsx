import { useState, useMemo, useEffect } from "react";
import AsideFilters from "../AsideFilters.jsx";
import LoadingButton from "../Loading.jsx";
import { Link } from "react-router-dom";
import { renderPrice } from "../../utils/priceFormatter.jsx";
import StarRating from "../../utils/StarRating.jsx";
import NoProductsResults from "./NoProductsResults.jsx";

// 🔹 List of Products Component
function ListOfProducts({ products }) {
  return (
    <article className="flex w-full justify-center">
      <ul
        className="
          grid gap-6 font-figtree pt-4 pb-4
          grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4
          max-w-7xl mx-auto px-4
        "
      >
        {products.map((product) => (
          <li
            key={product.id}
            className="text-start font-figtree shadow-[var(--shadow-card)] hover:shadow-[0_8px_15px_rgba(0,0,0,0.2)] p-4 bg-white rounded-md"
          >
            <Link to={`/products/${product.id}`} className="block py-2">
              <img
                className="w-full max-h-[30vh] object-contain rounded-md mt-4"
                src={product.images[0]}
                alt={product.title}
              />
              <h2 className="pt-2 font-bold border-t border-gray-300 truncate">
                {product.brand}
              </h2>
              <h3 className="truncate">{product.title}</h3>
              <StarRating rating={product.rating} />
            </Link>
            {renderPrice(product)}
          </li>
        ))}
      </ul>
    </article>
  );
}

// 🔹 Filtering Function
function filterProducts(products, query, filters) {
  const normalizedQuery = query.trim().toLowerCase();

  return products.filter((p) => {
    const matchesSearch = `${p.title} ${p.brand}`
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

// 🔹 Main Products Component
export default function Products({
  products,
  search,
  loading,
  error,
  hasSearched,
}) {
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

  // 🔹 Reset filters when the search changes
  useEffect(() => {
    setFilters(defaultFilters);
  }, [search, defaultFilters]);

  const filteredProducts = useMemo(
    () => filterProducts(products, search, filters),
    [products, search, filters]
  );

  if (loading) {
    return (
      <div className="flex flex-1 justify-center items-center min-h-[70vh]">
        <LoadingButton />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-lg">Error: {error}</p>;
  }

  return (
    <main className="flex w-full">
      {hasSearched && (
        <AsideFilters
          filters={filters}
          setFilters={setFilters}
          products={products}
        />
      )}

      <div className="flex-1 flex justify-center items-start">
        {filteredProducts.length > 0 ? (
          <ListOfProducts products={filteredProducts} />
        ) : (
          <NoProductsResults />
        )}
      </div>
    </main>
  );
}
