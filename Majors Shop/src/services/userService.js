// Asegúrate de que esta URL base apunte a tu servidor Express
const API_BASE_URL = "/api/users";

/**
 * Función para loguear un usuario y almacenar el token.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{token: string, user: object}>}
 */
export async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    return data;
  } catch (err) {
    throw new Error(
      err.message || "Error desconocido durante el inicio de sesión."
    );
  }
}

export async function registerUser(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Error desconocido durante el registro."
      );
    }
  } catch (err) {
    throw new Error(err.message || "Error desconocido durante el registro.");
  }
}

export async function fetchCurrentUser() {
  try {
    const response = await fetch(`${API_BASE_URL}/me`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();
    return data.user;
  } catch (err) {
    throw new Error(
      err.message || "Error desconocido al obtener el usuario actual."
    );
  }
}
