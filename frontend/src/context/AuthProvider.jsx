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
        setUser({ ...response.data?.user, status: "authenticated" });
      } catch (err) {
       if (!err.response) {
          console.error("Network error while checking authentication:", err);
          setUser({ status: "server error" });
        } else if (err.response.status === 401) {
          setUser({ status: "unauthenticated" });
        } else if (err.response.status === 429) {
          setUser({ status: "rate limited" });
        } else {
          console.error("Error while checking authentication:", err);
          setUser({ status: "server error" });
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
