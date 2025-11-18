// src/hooks/useProductDetail.js
import { useEffect, useState } from "react";
import { fetchProductById } from "../services/productService";

export function useProductDetail(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const data = await fetchProductById(id);

        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProduct();
  }, [id]);

  return { product, loading, error };
}
