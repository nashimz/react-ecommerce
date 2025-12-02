import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../services/userService";
import { fetchCurrentUser } from "../services/userService";
import { useAuth } from "./useAuth";

export function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated } = useAuth();
  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await loginUser(email, password);
      const user = await fetchCurrentUser();
      setUser(user);
      setIsAuthenticated(true);

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
    handleLogin,
  };
}
