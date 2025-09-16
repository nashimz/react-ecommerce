import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useProducts } from "./hooks/useProducts.js";
import Products from "./components/products/Products.jsx";
import ProductDetail from "./components/products/ProductDetail.jsx"; // we'll make this
import { Navbar } from "./components/Navbar.jsx";
import { useSearch } from "./hooks/useSearch.js";

function App() {
  const {
    products: mappedProducts,
    loading,
    error: productsError,
  } = useProducts();
  const { search, submitSearch, error: searchError, hasSearched } = useSearch();

  return (
    <div className="page bg-black/10 min-h-screen">
      <Navbar search={search} submitSearch={submitSearch} error={searchError} />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <Products
                products={mappedProducts}
                search={search}
                loading={loading}
                error={productsError}
                hasSearched={hasSearched}
              />
            }
          />
          <Route
            path="/products/:id"
            element={<ProductDetail search={search} />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
