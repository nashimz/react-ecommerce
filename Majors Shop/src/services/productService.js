export async function fetchProducts() {
  try {
    const response = await fetch(
      "https://majorsshop-backend-api.onrender.com/api/products"
    );
    if (!response.ok) throw new Error("Failed to fetch products");

    const products = await response.json();

    return products;
  } catch (err) {
    throw new Error(err.message || "Unknown error fetching products");
  }
}

export async function fetchProductById(id) {
  try {
    const response = await fetch(
      `https://majorsshop-backend-api.onrender.com/api/products/${id}`
    );
    if (!response.ok) throw new Error("Product not found");

    const product = await response.json();

    return product;
  } catch (err) {
    throw new Error(err.message || "Unknown error fetching product");
  }
}
