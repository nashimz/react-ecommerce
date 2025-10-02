export async function fetchCategories() {
  try {
    const response = await fetch(
      "https://dummyjson.com/products/category-list"
    );
    if (!response.ok) throw new Error("Failed to fetch categories");

    const data = await response.json();

    return data;
  } catch (err) {
    throw new Error(err.message || "Unknown error fetching categories");
  }
}
