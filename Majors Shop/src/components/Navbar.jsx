import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUser,
  faCartShopping,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLogout } from "../hooks/useLogout.js";
import { useCart } from "../hooks/useCart.js";

export function Navbar({ submitSearch, search }) {
  const navigate = useNavigate();
  const auth = JSON.parse(localStorage.getItem("auth"));
  const { handleLogout } = useLogout();
  const { cart } = useCart();

  const [menuOpen, setMenuOpen] = useState(false); // user dropdown
  const [mobileOpen, setMobileOpen] = useState(false); // mobile navbar
  const [inputValue, setInputValue] = useState(search || "");

  const handleSearch = (e) => {
    e.preventDefault();
    submitSearch(inputValue);
    navigate("/");
    if (mobileOpen) setMobileOpen(false);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const displayCount = totalItems > 10 ? "+10" : totalItems;

  return (
    <header className="fixed md:static top-0 left-0 w-full z-50 bg-black border-b border-black">
      <div className="flex flex-col p-4">
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <Link to="/" className="text-white font-cards font-bold text-3xl">
            Majors Shops
          </Link>

          {/* Search bar - hidden on mobile */}
          <form
            className="hidden md:flex items-center flex-1 mx-6 max-w-xl"
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

          {/* Right side - hidden on mobile */}
          <div className="hidden md:flex items-center gap-3 relative">
            {auth ? (
              <>
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
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full hover:bg-gray-300"
              >
                <FontAwesomeIcon icon={faUser} className="text-gray-700" />
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <FontAwesomeIcon icon={mobileOpen ? faTimes : faBars} />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden mt-4 flex flex-col gap-4 bg-black p-4 rounded-lg text-white">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex">
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Busca productos..."
                className="flex-1 p-2 rounded-l-md bg-white text-black"
                type="text"
              />
              <button
                type="submit"
                className="bg-white text-black px-3 rounded-r-md flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </form>

            {/* User + Cart */}
            {auth ? (
              <div className="flex flex-col items-start gap-3 w-full">
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-left text-white font-bold hover:text-gray-300"
                >
                  Go To Profile
                </Link>

                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left text-white font-bold hover:text-gray-300"
                >
                  Logout
                </button>

                <Link
                  to="/cart"
                  onClick={() => setMobileOpen(false)}
                  className="w-full flex items-center gap-2 text-white font-bold hover:text-gray-300"
                >
                  <FontAwesomeIcon icon={faCartShopping} />
                  <span>Cart</span>
                  {totalItems > 0 && (
                    <span className="ml-auto bg-white/60 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full">
                      {displayCount}
                    </span>
                  )}
                </Link>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full text-left text-white font-bold hover:text-gray-300"
              >
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
