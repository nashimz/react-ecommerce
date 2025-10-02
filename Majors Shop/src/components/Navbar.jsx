import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUser,
  faCartShopping,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLogout } from "../hooks/useLogout.js";
import { useCart } from "../hooks/useCart.js";

export function Navbar({ submitSearch, search }) {
  const navigate = useNavigate();
  const auth = JSON.parse(localStorage.getItem("auth"));
  const [menuOpen, setMenuOpen] = useState(false);
  const { handleLogout } = useLogout();
  const { cart } = useCart();
  const handleSearch = (e) => {
    e.preventDefault();
    submitSearch(inputValue); // 👈 call your search logic
    navigate("/"); // 👈 send user back to product list page
  };
  const [inputValue, setInputValue] = useState(search || "");
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const displayCount = totalItems > 10 ? "+10" : totalItems;

  return (
    <header className="flex flex-col p-4 bg-black border-b border-black">
      {/* Top row: logo + search + user/cart */}
      <div className="flex items-center justify-between w-full">
        <Link to="/" className="text-white font-cards font-bold text-3xl">
          Majors Shops
        </Link>

        <form
          className="flex items-center flex-1 mx-6 max-w-xl"
          onSubmit={handleSearch}
        >
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Busca productos, marcas y más..."
            className="bg-white rounded-md flex-1 p-2 font-cards"
            type="text"
          />
          <button
            className="bg-white text-black rounded-md p-2 ml-2 w-12 font-titles flex justify-center items-center"
            type="submit"
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </form>

        {/* User & Cart */}
        {auth ? (
          <div className="flex items-center gap-3 relative">
            <span className="text-white font-bold">{auth.username}</span>
            <div className="relative">
              <img
                src={auth.image}
                alt={auth.username}
                className="w-8 h-8 rounded-full border border-gray-300 cursor-pointer"
                onClick={() => setMenuOpen((prev) => !prev)}
              />
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg py-2 z-50 px-2">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/profile");
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 font-bold border-b border-gray-300/50"
                  >
                    Go to Profile
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 font-bold hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            <Link
              to="/cart"
              className="relative flex items-center justify-center w-8 h-8 text-white"
            >
              <FontAwesomeIcon icon={faCartShopping} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-white/60 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full">
                  {displayCount}
                </span>
              )}
            </Link>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full hover:bg-gray-300"
          >
            <FontAwesomeIcon icon={faUser} className="text-gray-700" />
          </Link>
        )}
      </div>
    </header>
  );
}
