import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

export default function AuthPage() {
  const { login, register } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");

    if (!username || !password) {
      setError("Please enter username and password.");
      return;
    }

    if (isLoginPage) {
      const success = login(username, password);
      if (!success) {
        setError("Wrong username or password!");
        return;
      }

      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const userRole = storedUsers.find((u: any) => u.username === username)?.role;
      navigate(userRole === "admin" ? "/admin" : "/");
    } else {
      const success = register(username, password, role);
      if (!success) {
        setError("Username already exists!");
        return;
      }

      navigate("/login");
    }
  };

  const handleInputChange = (setter: (val: string) => void, value: string) => {
    setError("");
    setter(value);
  };

  return (
    <div className="flex flex-col items-center mt-20 p-6 max-w-sm mx-auto bg-gray-50 rounded-xl shadow-md space-y-4">

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded w-full text-center">
          {error}
        </div>
      )}

      <h1 className="text-2xl font-bold">{isLoginPage ? "Login" : "Register"}</h1>

      <input
        placeholder="Username"
        value={username}
        onChange={e => handleInputChange(setUsername, e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => handleInputChange(setPassword, e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />

      {!isLoginPage && (
        <select
          value={role}
          onChange={e => { setError(""); setRole(e.target.value as "user" | "admin"); }}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      )}

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition"
      >
        {isLoginPage ? "Login" : "Register"}
      </button>

      <p className="text-sm text-center">
        {isLoginPage ? "Don't have an account?" : "Already have an account?"}{" "}
        <span
          className="text-blue-600 cursor-pointer underline"
          onClick={() => navigate(isLoginPage ? "/register" : "/login")}
        >
          {isLoginPage ? "Register now" : "Login now"}
        </span>
      </p>
    </div>
  );
}
