export async function fetchProducts() {
  try {
    const response = await fetch("http://localhost:3000/api/products");
    if (!response.ok) throw new Error("Failed to fetch products");

    const products = await response.json();

    return products;
  } catch (err) {
    throw new Error(err.message || "Unknown error fetching products");
  }
}
