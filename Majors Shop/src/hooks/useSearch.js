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
    } else {
      setError(null);
    }
  }, [search]);

  const submitSearch = (query) => {
    setSearch(query);

    if (query.trim() === "") {
      setHasSearched(false);
    } else {
      setHasSearched(true);
    }
  };

  return { search, submitSearch, error, hasSearched };
}
