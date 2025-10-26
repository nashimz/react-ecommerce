import { useState, useMemo } from "react";
import { useFilteredProducts } from "../../hooks/useFilteredProducts.js";
import AsideFilters from "../AsideFilters.jsx";
import LoadingButton from "../Loading.jsx";
import NoProductsResults from "./NoProductsResults.jsx";
import ListOfProducts from "./ListOfProducts.jsx";
import Pagination from "../products/Pagination.jsx";

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

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 36;

  const filteredProductsLength = filteredProducts.length;
  useMemo(() => setCurrentPage(1), [filteredProductsLength]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * productsPerPage;
    return filteredProducts.slice(start, start + productsPerPage);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);

    const top = document.getElementById("product-list-top");
    if (top) {
      top.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading)
    return (
      <div className="flex flex-1 justify-center items-center min-h-[70vh]">
        <LoadingButton />
      </div>
    );

  if (error) return <p className="text-red-500 text-lg">Error: {error}</p>;

  const hasResults = filteredProducts.length > 0;

  return (
    <main className="flex w-full">
      {hasSearched && hasResults && (
        <AsideFilters
          filters={filters}
          setFilters={setFilters}
          products={filteredProducts}
        />
      )}

      <div className="flex-1 flex flex-col justify-start items-center">
        <div id="product-list-top" />
        {hasResults ? (
          <>
            <ListOfProducts products={paginatedProducts} />
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <NoProductsResults />
        )}
      </div>
    </main>
  );
}
