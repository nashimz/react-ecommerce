import { useNavigate } from "react-router-dom";

export function useLogout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return { handleLogout };
}
