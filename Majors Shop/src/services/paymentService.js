const API_BASE_URL = "https://majorsshop-backend-api.onrender.com/api";

export async function createPaymentPreference(payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });

    // Intentamos parsear el JSON siempre
    const data = await response.json();

    if (!response.ok) {
      // Si el backend envió un mensaje de error, lo usamos
      throw new Error(data.message || "Error en el servidor");
    }

    return data; // { orderId, initPoint }
  } catch (err) {
    console.error("Payment Service Error:", err);
    throw err;
  }
}
