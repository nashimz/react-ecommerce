// src/components/products/Products.jsx
import { useFilteredProducts } from "../../hooks/useFilteredProducts.js";
import AsideFilters from "../AsideFilters.jsx";
import LoadingButton from "../Loading.jsx";
import NoProductsResults from "./NoProductsResults.jsx";
import ListOfProducts from "./ListOfProducts.jsx";

export default function Products({
  products,
  search,
  loading,
  error,
  hasSearched,
}) {
  const { filters, setFilters, filteredProducts } = useFilteredProducts(
    products,
    search
  );

  if (loading)
    return (
      <div className="flex flex-1 justify-center items-center min-h-[70vh]">
        <LoadingButton />
      </div>
    );

  if (error) return <p className="text-red-500 text-lg">Error: {error}</p>;

  const hasResults = filteredProducts.length > 0;

  return (
    <main>
      {hasSearched && hasResults && (
        <AsideFilters
          filters={filters}
          setFilters={setFilters}
          products={filteredProducts}
        />
      )}

      <div className="flex-1 flex justify-center items-start">
        {hasResults ? (
          <ListOfProducts products={filteredProducts} />
        ) : (
          <NoProductsResults />
        )}
      </div>
    </main>
  );
}
