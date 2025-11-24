import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/userService"; // Ajusta la ruta si es necesario

export function useRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await registerUser(email, password);

      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isLoading,
    handleRegister,
  };
}
