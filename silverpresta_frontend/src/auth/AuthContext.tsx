import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import type { ReactNode } from "react";


export interface UtilisateurAuth {
  _id: string;
  nom: string;
  prenom: string;
  courriel: string;
  role: string; // "admin" | "employe" | etc.
}

interface AuthContextType {
  user: UtilisateurAuth | null;
  token: string | null;
  login: (token: string, user: UtilisateurAuth) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UtilisateurAuth | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Au chargement, on récupère l'état depuis le localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const handleLogin = (newToken: string, newUser: UtilisateurAuth) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth doit être utilisé à l'intérieur de <AuthProvider>");
  }
  return ctx;
}
