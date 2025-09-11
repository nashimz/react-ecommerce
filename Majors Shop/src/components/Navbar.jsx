import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Link } from "react-router-dom";
export function Navbar({ updateSearch, error }) {
  const [inputValue, setInputValue] = useState("");
  const handleSubmit = (event) => {
    event.preventDefault();
    updateSearch(inputValue); // update parent state only on submit
  };

  const handleChange = (event) => {
    setInputValue(event.target.value); // update local input state
  };

  return (
    <header className="flex flex-col p-4 bg-black border border-black items-center">
      <Link to={`/`}>
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
          className="bg-white text-black rounded-md p-2 ml-2 w-24 font-titles"
          type="submit"
        >
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </header>
  );
}
