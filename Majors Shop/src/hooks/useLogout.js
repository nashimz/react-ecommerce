import { useNavigate } from "react-router-dom";

export function useLogout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/login");
  };

  return { handleLogout };
}
