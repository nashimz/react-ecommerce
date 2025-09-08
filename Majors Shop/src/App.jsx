import "./App.css";
import { useProducts } from "./hooks/useProducts.js";
import Products from "./components/Products.jsx";
import { Navbar } from "./components/Navbar.jsx";
import { useSearch } from "./hooks/useSearch.js";
import { useState } from "react";
import AsideFilters from "./components/AsideFilters.jsx";

function App() {
  const { products: mappedProducts } = useProducts();
  const { search, updateSearch, error } = useSearch();
  const [filters, setFilters] = useState({
    category: "all",
    minPrice: 0,
    maxPrice: Infinity,
  });

  return (
    <div className="page bg-black/10 min-h-screen">
      <Navbar search={search} updateSearch={updateSearch} error={error} />
      <main className="flex">
        <AsideFilters
          filters={filters}
          setFilters={setFilters}
          products={mappedProducts}
        />
        <div className="flex-1 flex justify-center">
          <Products
            products={mappedProducts}
            search={search}
            filters={filters}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
