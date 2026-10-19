import { useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import { authMe } from "../services/authService";

export function AuthProvider({ children }) {
  const [user, setUser] = useState({ status: "loading" });


  // wrap in Callback and pass if checkAuth is needed to used in other comps as well.
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await authMe();
        setUser({ status: "authenticated", ...response.data?.user });
      } catch (err) {
        setUser({ status: "unauthenticated" });
        if (!err.response) {
          console.error("Network error while checking authentication:", err);
        }
      }
    }

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
