import { useEffect, useState, useRef } from "react";
export function useSearch() {
  const [search, updateSearch] = useState("");
  const [error, setError] = useState(null);
  const isFirstInput = useRef(true);

  useEffect(() => {
    if (isFirstInput) {
      isFirstInput.current = search === "";
      return;
    }
    if (search === "") {
      setError("No se puede buscar un producto vacío");
    } else if (search.match(/^\d+$/)) {
      setError("No se puede buscar un producto con solo números");
    } else {
      setError(null);
    }
  }, [search]);

  return { search, updateSearch, error };
}
