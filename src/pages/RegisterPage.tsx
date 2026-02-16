import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");

  const handleRegister = () => {
    if (!username || !password) return toast.error("Enter username and password");

    // get existing users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");

    // check if username exists
    if (storedUsers.some((u: any) => u.username === username)) {
      return toast.error("Username already exists");
    }

    // add new user
    storedUsers.push({ username, password, role });
    localStorage.setItem("users", JSON.stringify(storedUsers));

    toast.success("Account created successfully!");
    navigate("/login");
  };

  return (
    <div className="flex flex-col gap-4 items-center mt-20">
      <h1 className="text-xl font-bold">Register</h1>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 rounded w-60"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded w-60"
      />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value as "user" | "admin")}
        className="border p-2 rounded w-60"
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <button
        onClick={handleRegister}
        className="w-60 px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
      >
        Register
      </button>

      <p className="text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 underline">
          Login now
        </Link>
      </p>
    </div>
  );
}
