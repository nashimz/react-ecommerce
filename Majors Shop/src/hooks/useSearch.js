import { useEffect, useState, useRef } from "react";

export function useSearch() {
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const isFirstInput = useRef(true);

  useEffect(() => {
    if (isFirstInput.current) {
      isFirstInput.current = search === "";
      return;
    }

    if (search === "") {
      setError("No se puede buscar un producto vacío");
    } else if (/^\d+$/.test(search)) {
      setError("No se puede buscar un producto con solo números");
    } else {
      setError(null);
    }
  }, [search]);

  const submitSearch = (query) => {
    setSearch(query);
    setHasSearched(true);
  };

  return { search, submitSearch, error, hasSearched };
}
