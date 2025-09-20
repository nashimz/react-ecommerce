import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUser,
  faCartShopping,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export function Navbar({ submitSearch, search }) {
  const navigate = useNavigate();
  const auth = JSON.parse(localStorage.getItem("auth"));
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between p-4 bg-black border-b border-black">
      {/* Logo */}
      <Link to="/" className="text-white font-cards font-bold text-3xl">
        Majors Shops
      </Link>

      {/* Search */}
      <form
        className="flex items-center flex-1 mx-6 max-w-xl"
        onSubmit={(e) => {
          e.preventDefault();
          if (submitSearch) submitSearch(search || "");
          if (window.location.pathname !== "/") navigate("/");
        }}
      >
        <input
          value={search || ""}
          onChange={(e) => submitSearch && submitSearch(e.target.value)}
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

          {/* Avatar with dropdown */}
          <div className="relative">
            <img
              src={auth.image}
              alt={auth.username}
              className="w-10 h-10 rounded-full border-2 border-gray-300 cursor-pointer"
              onClick={() => setMenuOpen((prev) => !prev)}
            />

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg py-2 z-50">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/profile");
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Go to Profile
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>

          {/* Cart */}
          <button className="flex items-center justify-center w-8 h-8 bg-white rounded-full">
            <FontAwesomeIcon icon={faCartShopping} />
          </button>
        </div>
      ) : (
        <Link
          to="/login"
          className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full hover:bg-gray-300"
        >
          <FontAwesomeIcon icon={faUser} className="text-gray-600" />
        </Link>
      )}
    </header>
  );
}
