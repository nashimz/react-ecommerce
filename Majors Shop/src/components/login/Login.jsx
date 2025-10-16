import { useLogin } from "../../hooks/useLogin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

export function Login() {
  const { username, setUsername, password, setPassword, error, handleLogin } =
    useLogin();

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="relative w-[60%] hidden md:block">
        <img
          src="/shop.jpg"
          alt="Shop background"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
      </div>

      <div className="w-full md:w-[40%] flex items-center justify-center bg-gray-50 p-4">
        <form onSubmit={handleLogin} className="p-6 flex flex-col gap-3">
          <div className="flex text-black items-center justify-center text-2xl border-b border-gray-300/50">
            <p className="font-cards font-bold p-2 text-5xl">Majors Shop</p>
            <FontAwesomeIcon icon={faCartShopping} />
          </div>

          <h2 className="text-2xl font-bold text-center text-black font-figtree">
            Welcome
          </h2>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <input
            type="text"
            placeholder="Username"
            className="border rounded-md p-2 bg-transparent"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border rounded-md p-2 bg-transparent"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <span className="text-sm font-figtree text-black font-medium hover:underline cursor-pointer ">
            Forgot password?
          </span>

          <button
            type="submit"
            className="bg-black text-white rounded-full py-2 hover:bg-gray-800 font-figtree font-bold mt-4"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
