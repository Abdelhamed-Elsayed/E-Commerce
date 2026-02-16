import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");
  const [isRegister, setIsRegister] = useState(false);

  const handleLoginOrRegister = () => {
    if (!username || !password) return alert("Enter username & password");

    const authStore = useAuthStore.getState();

    if (isRegister) {
      const success = authStore.register(username, password, role);
      if (!success) return alert("Username already exists!");

      // بعد التسجيل يتم التوجيه على Home
      navigate("/");
    } else {
      const success = authStore.login(username, password);
      if (!success) return alert("Wrong username or password");

      const userRole = localStorage.getItem("role");
      navigate(userRole === "admin" ? "/admin" : "/");
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center mt-20">
      <h1 className="text-xl font-bold">{isRegister ? "Register" : "Login"}</h1>

      <input
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        className="border p-2 rounded w-60"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="border p-2 rounded w-60"
      />

      {isRegister && (
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "user" | "admin")}
          className="border p-2 w-60 rounded"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      )}

      <button
        onClick={handleLoginOrRegister}
        className="bg-blue-600 text-white px-4 py-2 rounded w-60 cursor-pointer"
      >
        {isRegister ? "Register" : "Login"}
      </button>

      <p className="text-sm">
        {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
        <span
          className="text-blue-600 cursor-pointer underline"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister ? "Login now" : "Register now"}
        </span>
      </p>
    </div>
  );
}
