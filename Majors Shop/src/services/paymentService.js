const API_BASE_URL = "https://majorsshop-backend-api.onrender.com/api";

export async function createPaymentPreference(userId, shippingAddressId) {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ userId, shippingAddressId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to create payment preference"
      );
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Payment Service Error:", err);
    throw new Error(err.message || "Unknown error processing checkout");
  }
}
