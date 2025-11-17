import { useState, useEffect, useRef } from "react";
import { SearchContext } from "./SearchContext";

export function SearchProvider({ children }) {
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const isFirstInput = useRef(true);

  useEffect(() => {
    if (isFirstInput.current) {
      isFirstInput.current = search === "";
      return;
    }
    setError(null);
  }, [search]);

  const submitSearch = (query) => {
    setSearch(query);
    setHasSearched(query.trim() !== "");
  };

  return (
    <SearchContext.Provider
      value={{ search, submitSearch, error, hasSearched }}
    >
      {children}
    </SearchContext.Provider>
  );
}
