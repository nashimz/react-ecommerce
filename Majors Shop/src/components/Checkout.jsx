import { useState } from "react";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { createPaymentPreference } from "../services/paymentService.js";
import { useModal } from "./modal/ModalContext";
import { useEffect } from "react";

export default function Checkout() {
  const { cart } = useCart();
  const { user } = useAuth();
  const { showModal } = useModal();

  // Corregido: declaración correcta de estado para loading
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    phone: "",
    street: "",
    city: "",
    zipCode: "",
  });

  // Sincronizar datos del usuario cuando carguen
  useEffect(() => {
    if (user) {
      // Buscamos la dirección de envío o la primera que haya
      const address = user.addresses?.[0] || {};

      setFormData({
        name: user.name || "",
        surname: user.surname || "",
        phone: user.phone || "",
        street: address.street || "",
        city: address.city || "",
        zipCode: address.zipCode || "",
      });
    }
  }, [user]);

  // Cálculo del total
  const total = cart
    .reduce((sum, item) => {
      const price = Number(item.product.discountedPrice || item.product.price);
      return sum + price * item.quantity;
    }, 0)
    .toFixed(2);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return showModal("Your cart is empty");

    setLoading(true);

    try {
      // Unificamos todo en un solo objeto (Payload)
      const payload = {
        userId: user.id,
        ...formData, // Aquí van street, city, zipCode, phone, etc.
      };

      const result = await createPaymentPreference(payload);

      // Redirección a la pasarela de Mercado Pago
      if (result.initPoint) {
        window.location.href = result.initPoint;
      }
    } catch (error) {
      showModal(error.message || "Error al procesar el pago");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper mx-auto max-w-[1100px] p-4 font-figtree">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Formulario de Envío */}
        <div className="w-full md:w-2/3 bg-white p-6 rounded-md shadow-md">
          <h2 className="text-lg font-bold mb-4 border-b pb-2">
            Shipping Details
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600">
                Name
              </label>
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="border p-2 rounded-md outline-add-cart"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600">
                Surname
              </label>
              <input
                required
                name="surname"
                value={formData.surname}
                onChange={handleInputChange}
                className="border p-2 rounded-md outline-add-cart"
              />
            </div>
            <div className="flex flex-col sm:col-span-2">
              <label className="text-sm font-semibold text-gray-600">
                Street Address
              </label>
              <input
                required
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                placeholder="Street name and number"
                className="border p-2 rounded-md outline-add-cart"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600">
                City
              </label>
              <input
                required
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="border p-2 rounded-md outline-add-cart"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600">
                ZIP Code
              </label>
              <input
                required
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                className="border p-2 rounded-md outline-add-cart"
              />
            </div>
            <div className="flex flex-col sm:col-span-2">
              <label className="text-sm font-semibold text-gray-600">
                Phone
              </label>
              <input
                required
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="border p-2 rounded-md outline-add-cart"
              />
            </div>

            {/* Botón dinámico según el estado de carga */}
            <button
              type="submit"
              disabled={loading}
              className={`sm:col-span-2 text-white font-bold p-3 rounded-md mt-4 transition-all ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-add-cart hover:brightness-90"
              }`}
            >
              {loading ? "Processing Order..." : "Pay with Mercado Pago"}
            </button>
          </form>
        </div>

        {/* Resumen Lateral */}
        <div className="w-full md:w-1/3 h-fit bg-gray-50 p-6 rounded-md border border-gray-200">
          <h2 className="font-bold mb-4">Order Summary</h2>
          <div className="max-h-[300px] overflow-y-auto pr-2">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm mb-3">
                <span className="text-gray-600">
                  {item.quantity}x {item.product.title.substring(0, 20)}...
                </span>
                <span className="font-bold">
                  $
                  {(
                    Number(item.product.discountedPrice || item.product.price) *
                    item.quantity
                  ).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-add-cart">${total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
