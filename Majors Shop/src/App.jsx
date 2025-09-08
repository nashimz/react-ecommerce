import "./App.css";
import { useProducts } from "./hooks/useProducts.js";
import Products from "./components/Products.jsx";
import { Navbar } from "./components/Navbar.jsx";

function App() {
  const { products: mappedProducts } = useProducts();

  return (
    <>
      <div className="page">
        <Navbar />
        <main>
          <div className="flex flex-col items-center bg-white">
            <Products products={mappedProducts} />
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
