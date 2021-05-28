import { createContext, useCallback, useMemo, useState } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [isAutenticated, setIsAutenticated] = useState(
    localStorage.getItem("authentication")
  );

  const Login = useCallback(() => {
    window.localStorage.setItem("authentication", true);
    setIsAutenticated(true);
  }, []);

  const Logout = useCallback(() => {
    window.localStorage.removeItem("authentication", true);
    setIsAutenticated(false);
  }, []);

  const value = useMemo(
    () => ({
      Login,
      Logout,
      isAutenticated,
    }),
    [isAutenticated, Login, Logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}