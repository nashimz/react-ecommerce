import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useProducts } from "./hooks/useProducts.js";
import Products from "./components/products/Products.jsx";
import ProductDetail from "./components/products/ProductDetail.jsx"; // we'll make this
import { Navbar } from "./components/Navbar.jsx";
import { useSearch } from "./hooks/useSearch.js";
import { Login } from "./components/Login.jsx";

function App() {
  const {
    products: mappedProducts,
    loading,
    error: productsError,
  } = useProducts();
  const { search, submitSearch, error: searchError, hasSearched } = useSearch();

  return (
    <div className="page flex flex-col bg-black/10 min-h-screen">
      <Navbar search={search} submitSearch={submitSearch} error={searchError} />

      <main className="flex-1">
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
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
