import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError(null);

    try {
      const res = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          expiresInMins: 30,
        }),
      });

      if (!res.ok) {
        throw new Error("Invalid Credentials");
      }

      const data = await res.json();

      // save user in localStorage
      localStorage.setItem("auth", JSON.stringify(data));

      // redirect to home
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    error,
    handleLogin,
  };
}
