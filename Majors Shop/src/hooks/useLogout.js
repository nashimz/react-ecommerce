import { useNavigate } from "react-router-dom";

import { logoutUser } from "@/services/userService";

export function useLogout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();

      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión, forzando redirección:", error);

      navigate("/login");
    }
  };

  return { handleLogout };
}
