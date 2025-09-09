import "./App.css";
import { useProducts } from "./hooks/useProducts.js";
import Products from "./components/Products.jsx";
import { Navbar } from "./components/Navbar.jsx";
import { useSearch } from "./hooks/useSearch.js";
import { useState } from "react";
import LoadingButton from "./components/Loading.jsx";
import AsideFilters from "./components/AsideFilters.jsx";

function App() {
  const {
    products: mappedProducts,
    loading,
    error: productsError,
  } = useProducts();
  const { search, updateSearch, error: searchError } = useSearch();
  const [filters, setFilters] = useState({
    category: "all",
    minPrice: 0,
    maxPrice: Infinity,
    brand: "all",
  });

  return (
    <div className="page bg-black/10 min-h-screen">
      <Navbar search={search} updateSearch={updateSearch} error={searchError} />
      <main className="flex">
        <AsideFilters
          filters={filters}
          setFilters={setFilters}
          products={mappedProducts}
        />
        <div className="flex-1 flex justify-center items-center">
          <Products
            products={mappedProducts}
            search={search}
            filters={filters}
            loading={loading}
            error={productsError}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
