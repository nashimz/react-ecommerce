import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { useProducts } from "./hooks/useProducts.js";
import Products from "./components/products/Products.jsx";
import ProductDetail from "./components/products/ProductDetail.jsx";
import { Navbar } from "./components/Navbar.jsx";
import { Login } from "./components/login/Login.jsx";
import { Register } from "./components/login/Register.jsx";
import Cart from "./components/cart/Cart.jsx";

function App() {
  const location = useLocation();

  const {
    products: mappedProducts,
    loading,
    error: productsError,
  } = useProducts();

  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="page flex flex-col bg-black/10 min-h-screen pt-20 md:pt-0">
      <div id="product-list-top" />
      {!hideNavbar && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <Products
                products={mappedProducts}
                loading={loading}
                error={productsError}
              />
            }
          />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
