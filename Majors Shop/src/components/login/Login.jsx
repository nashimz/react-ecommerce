import { useLogin } from "../../hooks/useLogin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
export function Login() {
  const { username, setUsername, password, setPassword, error, handleLogin } =
    useLogin();

  return (
    <div className="flex items-center justify-center h-full p-4">
      <form
        onSubmit={handleLogin}
        className="bg-white/90 p-6 rounded-xl shadow-md w-80 flex flex-col gap-4"
      >
        <div className="flex text-black items-center justify-center text-2xl border-b border-gray-300/50">
          <p className="font-cards font-bold p-2">Majors Shop</p>
          <FontAwesomeIcon icon={faCartShopping} />
        </div>
        <h2 className="text-xl font-bold text-center text-black">Login</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          className="border rounded-md p-2 bg-white"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border rounded-md p-2 bg-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-black text-white rounded-md py-2 hover:bg-gray-800 font-roboto font-bold"
        >
          Log In
        </button>
      </form>
    </div>
  );
}
