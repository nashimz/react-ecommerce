import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUser,
  faCartShopping,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLogout } from "../hooks/useLogout.js";

export function Navbar({ submitSearch, search }) {
  const navigate = useNavigate();
  const auth = JSON.parse(localStorage.getItem("auth"));
  const [menuOpen, setMenuOpen] = useState(false);
  const { handleLogout } = useLogout();

  // Local input state for typing
  const [inputValue, setInputValue] = useState(search || "");

  // Keep inputValue in sync if parent search changes
  useEffect(() => {
    setInputValue(search || "");
  }, [search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitSearch) submitSearch(inputValue);
    if (window.location.pathname !== "/") navigate("/");
  };

  return (
    <header className="flex items-center justify-between p-4 bg-black border-b border-black">
      <Link to="/" className="text-white font-cards font-bold text-3xl">
        Majors Shops
      </Link>

      <form
        className="flex items-center flex-1 mx-6 max-w-xl"
        onSubmit={handleSubmit}
      >
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)} // ONLY update local state
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

      {/* User section */}
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
            className="flex items-center justify-center w-8 h-8 rounded-full text-white"
          >
            <FontAwesomeIcon icon={faCartShopping} />
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
    </header>
  );
}
