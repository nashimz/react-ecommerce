import { useState } from "react";
import AsideFilters from "../AsideFilters.jsx";
import LoadingButton from "../Loading.jsx";
import { Link } from "react-router-dom";
import { renderPrice } from "../../utils/priceFormatter";

function ListOfProducts({ products }) {
  return (
    <article className="flex">
      <ul className="grid grid-cols-3 gap-4 font-titles pt-4 pb-4">
        {products.map((product) => (
          <li
            key={product.id}
            className="text-start font-titles shadow-[var(--shadow-card)] hover:shadow-[0_8px_15px_rgba(0,0,0,0.2)] transition-all duration-300 transform hover:-translate-y-1 p-4 bg-white rounded-md"
          >
            <Link to={`/products/${product.id}`} className="block">
              <img
                className="max-w-[30vh] rounded-md mt-4"
                src={product.images[0]}
                alt={product.title}
              />
              <h2 className="max-w-[30vh] pt-2 font-bold border-t border-gray-300">
                {product.brand}
              </h2>
              <h3 className="max-w-[30vh]">{product.title}</h3>
            </Link>

            {renderPrice(product)}
          </li>
        ))}
      </ul>
    </article>
  );
}

function NoProductsResults() {
  return <p className="pt-2 text-xl text-black">No products found</p>;
}

export default function Products({ products, search, loading, error }) {
  const [filters, setFilters] = useState({
    category: "all",
    minPrice: 0,
    maxPrice: Infinity,
    brand: "all",
  });

  if (loading)
    return (
      <main className="flex flex-1 justify-center items-center min-h-[70vh]">
        <LoadingButton />
      </main>
    );
  if (error) return <p className="text-red-500 text-lg">Error: {error}</p>;

  const query = search.trim().toLowerCase();
  const filteredProducts = products.filter((p) => {
    const matchesSearch = `${p.title} ${p.brand}`.toLowerCase().includes(query);
    const matchesCategory =
      filters.category === "all" || p.category === filters.category;
    const matchesBrand = filters.brand === "all" || p.brand === filters.brand;
    const matchesPrice =
      p.price >= filters.minPrice && p.price <= filters.maxPrice;

    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  });

  return (
    <section className="flex">
      <AsideFilters
        filters={filters}
        setFilters={setFilters}
        products={products}
      />
      <div className="flex-1 flex justify-center items-start">
        {filteredProducts.length > 0 ? (
          <ListOfProducts products={filteredProducts} />
        ) : (
          <NoProductsResults />
        )}
      </div>
    </section>
  );
}
