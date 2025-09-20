import { useLogin } from "../hooks/useLogin";

export function Login() {
  const { username, setUsername, password, setPassword, error, handleLogin } =
    useLogin();

  return (
    <div className="flex items-center justify-center h-full p-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-xl shadow-md w-80 flex flex-col gap-4"
      >
        <h2 className="text-xl font-bold text-center">Log in</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          className="border rounded-md p-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border rounded-md p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-black text-white rounded-md py-2 hover:bg-gray-800"
        >
          Log In
        </button>
      </form>
    </div>
  );
}
