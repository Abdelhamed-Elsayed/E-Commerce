import { create } from "zustand";

type Role = "user" | "admin";

interface User {
  username: string;
  password: string;
}

interface AuthState {
  currentUser: string | null;
  role: Role | null;
  admins: User[];
  users: User[];
  login: (username: string, password: string) => boolean;
  register: (username: string, password: string, role: Role) => boolean;
  logout: () => void;
}

const defaultAdmins: User[] = [
  { username: "admin", password: "admin123" },
];

const defaultUsers: User[] = [
  { username: "user", password: "user123" },
];

const useAuthStore = create<AuthState>((set, get) => {
  const storedAdmins = JSON.parse(localStorage.getItem("admins") || "null");
  const storedUsers = JSON.parse(localStorage.getItem("users") || "null");

  const admins = storedAdmins || defaultAdmins;
  const users = storedUsers || defaultUsers;

  localStorage.setItem("admins", JSON.stringify(admins));
  localStorage.setItem("users", JSON.stringify(users));

  return {
    currentUser: localStorage.getItem("currentUser"),
    role: (localStorage.getItem("role") as Role) || null,
    admins,
    users,

    login: (username, password) => {
      let userFound: User | undefined;
      let userRole: Role | null = null;

      userFound = get().admins.find(u => u.username === username && u.password === password);
      if (userFound) userRole = "admin";

      if (!userFound) {
        userFound = get().users.find(u => u.username === username && u.password === password);
        if (userFound) userRole = "user";
      }

      if (!userFound) return false;

      localStorage.setItem("currentUser", userFound.username);
      localStorage.setItem("role", userRole!);
      set({ currentUser: userFound.username, role: userRole });
      return true;
    },

    register: (username, password, role) => {
      if (role === "admin") {
        const exist = get().admins.find(u => u.username === username);
        if (exist) return false;

        const updatedAdmins = [...get().admins, { username, password }];
        localStorage.setItem("admins", JSON.stringify(updatedAdmins));
        set({ admins: updatedAdmins });
      } else {
        const exist = get().users.find(u => u.username === username);
        if (exist) return false;

        const updatedUsers = [...get().users, { username, password }];
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        set({ users: updatedUsers });
      }

      get().login(username, password);
      return true;
    },

    logout: () => {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("role");
      set({ currentUser: null, role: null });
    },
  };
});

export default useAuthStore;
