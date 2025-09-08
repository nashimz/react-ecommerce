import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
export function Navbar({ search, updateSearch, error }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({ search });
  };

  const handleChange = (event) => {
    updateSearch(event.target.value);
  };

  return (
    <header className="flex flex-col p-4 bg-black border border-black items-center">
      <h1 className="font-cards font-bold text-3xl text-center text-white">
        Majors Shops
      </h1>
      <form className="flex justify-center mt-4" onSubmit={handleSubmit}>
        <input
          value={search}
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
