// src/context/CartProvider.jsx
import { useState } from "react";
import { CartContext } from "./CartContext";
import { useAuth } from "../hooks/useAuth";
import {
  fetchCart,
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  clearCart as clearCartService,
} from "../services/cartService";
import { useEffect } from "react";

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      setCart([]);
      setLoading(false);
      return;
    }

    // Llama al servicio y maneja la Promesa
    fetchCart(userId)
      .then((items) => setCart(items))
      .catch((error) => {
        console.error("Fallo al cargar el carrito:", error);
        setCart([]);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const addToCart = async (product, quantity = 1) => {
    if (!userId) return;
    try {
      // El servicio devuelve el array de ítems actualizado
      const updatedItems = await addItemToCart(userId, product.id, quantity);
      setCart(updatedItems);
    } catch (error) {
      console.error("Error al añadir al carrito:", error);
    }
  };

  const removeFromCart = async (itemId) => {
    if (!userId) return;
    try {
      const updatedItems = await removeItemFromCart(userId, itemId);
      setCart(updatedItems);
    } catch (error) {
      console.error("Error al eliminar del carrito:", error);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (!userId) return;
    try {
      // Lógica para eliminar si la cantidad es 0 o menor
      if (quantity <= 0) {
        const updatedItems = await removeItemFromCart(userId, itemId);
        setCart(updatedItems);
      } else {
        const updatedItems = await updateCartItemQuantity(
          userId,
          itemId,
          quantity
        );
        setCart(updatedItems);
      }
    } catch (error) {
      console.error("Error al actualizar cantidad:", error);
    }
  };

  const clearCart = async () => {
    if (!userId) return;
    try {
      // El servicio maneja la llamada DELETE, el Provider limpia el estado
      await clearCartService(userId);
      setCart([]);
    } catch (error) {
      console.error("Error al limpiar el carrito:", error);
    }
  };

  // Puedes usar este estado de carga para mostrar un spinner mientras se inicializa el carrito
  if (loading) {
    return <div>Cargando carrito...</div>;
  }

  return (
    <CartContext.Provider
      value={{
        fetchCart,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,

        loading,
        setLoading,
        userId,
        setCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
