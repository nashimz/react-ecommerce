const API_BASE_URL = "https://majorsshop-backend-api.onrender.com/api";

export async function fetchCart(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/carts/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch cart");
    }
    const cart = await response.json();
    return cart.items || [];
  } catch (err) {
    throw new Error(err.message || "Unknown error fetching cart");
  }
}

export async function addItemToCart(userId, productId, quantity = 1) {
  try {
    const response = await fetch(`${API_BASE_URL}/carts/${userId}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, quantity }),
    });

    if (!response.ok) {
      throw new Error("Failed to add item to cart");
    }

    const updatedCart = await response.json();
    return updatedCart.items || [];
  } catch (err) {
    throw new Error(err.message || "Unknown error adding item to cart");
  }
}

export async function removeItemFromCart(userId, itemId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/carts/${userId}/items/${itemId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to remove item from cart");
    }
    const updatedCart = await response.json();
    return updatedCart.items || [];
  } catch (err) {
    throw new Error(err.message || "Unknown error removing item from cart");
  }
}

export async function updateCartItemQuantity(userId, itemId, quantity) {
  try {
    const response = await fetch(`${API_BASE_URL}/${userId}/items/${itemId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });

    const updatedCart = await response.json();
    return updatedCart.items || [];
  } catch (err) {
    throw new Error(err.message || "Unknown error updating item quantity");
  }
}

export async function clearCart(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/${userId}/items`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to clear cart");
    }

    return [];
  } catch (err) {
    throw new Error(err.message || "Unknown error clearing cart");
  }
}
