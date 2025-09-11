export async function fetchProducts() {
  try {
    const response = await fetch("https://dummyjson.com/products/?limit=50");
    if (!response.ok) throw new Error("Failed to fetch products");

    const data = await response.json();

    return data.products.map((product) => ({
      id: product.id,
      brand: product.brand,
      title: product.title,
      price: product.price,
      images: product.images,
      description: product.description,
      discountPercentage: product.discountPercentage,
      category: product.category,
      thumbnail: product.thumbnail,
    }));
  } catch (err) {
    throw new Error(err.message || "Unknown error fetching products");
  }
}
