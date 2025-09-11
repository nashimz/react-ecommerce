import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export function Navbar({ updateSearch, error, search }) {
  const [inputValue, setInputValue] = useState(search || "");
  const navigate = useNavigate();
  const location = useLocation();

  // Keep local input in sync with global search
  useEffect(() => {
    setInputValue(search || "");
  }, [search]);

  const handleSubmit = (event) => {
    event.preventDefault();
    updateSearch(inputValue);

    // If not on home page, redirect to "/"
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <header className="flex flex-col p-4 bg-black border border-black items-center">
      <Link to="/">
        <h1 className="font-cards font-bold text-3xl text-center text-white">
          Majors Shops
        </h1>
      </Link>
      <form className="flex justify-center mt-4" onSubmit={handleSubmit}>
        <input
          value={inputValue}
          onChange={handleChange}
          placeholder="Busca productos, marcas y más..."
          className="bg-white rounded-md w-128 p-2 font-cards"
          type="text"
        />
        <button
          className="bg-white text-black rounded-md p-2 ml-2 w-24 font-titles flex justify-center items-center"
          type="submit"
        >
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </header>
  );
}
