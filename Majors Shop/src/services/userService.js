// Asegúrate de que esta URL base apunte a tu servidor Express
const API_BASE_URL = "http://localhost:3000/api/users";

/**
 * Función para loguear un usuario y almacenar el token.
 * @param {string} email - El email del usuario.
 * @param {string} password - La contraseña del usuario.
 * @returns {Promise<{token: string, user: object}>} Los datos de la respuesta (token y datos del usuario).
 */
export async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Envía email y password en el cuerpo de la solicitud
      body: JSON.stringify({ email, password }),
    });

    // 1. Manejar errores HTTP (400, 401, 500, etc.)
    if (!response.ok) {
      // Intenta leer el mensaje de error del servidor
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Credenciales inválidas o error de servidor."
      );
    }

    // 2. Obtener los datos (token y user)
    const data = await response.json();

    // 3. Almacenar el Token JWT
    // Esto es crucial para la autenticación en futuras peticiones.
    localStorage.setItem("userToken", data.token);

    // Opcional: Almacenar la información básica del usuario
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
  } catch (err) {
    // Si hay un error, lanzarlo para que el componente de React lo maneje
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

/**
 * Función para obtener el token almacenado.
 * @returns {string | null} El token JWT o null.
 */
export function getToken() {
  return localStorage.getItem("userToken");
}

/**
 * Función para cerrar sesión y eliminar el token.
 */
export function logoutUser() {
  localStorage.removeItem("userToken");
  localStorage.removeItem("user");
  // Aquí podrías agregar una llamada al backend si tu servidor maneja la invalidación de tokens en logout
}
