import "./App.css";
import { useProducts } from "./hooks/useProducts.js";
import Products from "./components/Products.jsx";
import { Navbar } from "./components/Navbar.jsx";
import { useSearch } from "./hooks/useSearch.js"; // import the hook here

function App() {
  const { products: mappedProducts } = useProducts();
  const { search, updateSearch, error } = useSearch();

  return (
    <div className="page bg-black/10 min-h-screen">
      <Navbar search={search} updateSearch={updateSearch} error={error} />
      <main>
        <div className="flex flex-col items-center ">
          <Products products={mappedProducts} search={search} />
        </div>
      </main>
    </div>
  );
}

export default App;
