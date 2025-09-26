import { useState, useMemo } from "react";
import AsideFilters from "../AsideFilters.jsx";
import LoadingButton from "../Loading.jsx";
import { Link } from "react-router-dom";
import { renderPrice } from "../../utils/priceFormatter.jsx";
import StarRating from "../StarRating.jsx";

// 🔹 List of Products Component
function ListOfProducts({ products }) {
  return (
    <article className="flex">
      <ul className="grid grid-cols-3 gap-4 font-figtree pt-4 pb-4">
        {products.map((product) => (
          <li
            key={product.id}
            className="text-start font-figtree shadow-[var(--shadow-card)] hover:shadow-[0_8px_15px_rgba(0,0,0,0.2)] p-4 bg-white rounded-md"
          >
            <Link to={`/products/${product.id}`} className="block py-2">
              <img
                className="max-w-[30vh] rounded-md mt-4"
                src={product.images[0]}
                alt={product.title}
              />
              <h2 className="max-w-[30vh] pt-2 font-bold border-t border-gray-300">
                {product.brand}
              </h2>
              <h3 className="max-w-[30vh]">{product.title}</h3>
              <StarRating rating={product.rating} />
            </Link>
            {renderPrice(product)}
          </li>
        ))}
      </ul>
    </article>
  );
}

// 🔹 No Products Found Component
function NoProductsResults() {
  return <p className="pt-2 text-xl text-black">No products found</p>;
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
  const [filters, setFilters] = useState({
    category: "all",
    minPrice: 0,
    maxPrice: Infinity,
    brand: "all",
  });

  // ✅ Always call useMemo before returns
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
    <main className="flex">
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
