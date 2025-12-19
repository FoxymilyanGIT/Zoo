import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

const parseToken = (token) => {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      email: payload.sub,
      role: payload.role
    };
  } catch (error) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => parseToken(localStorage.getItem("token")));

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      setUser(parseToken(token));
    } else {
      localStorage.removeItem("token");
      setUser(null);
    }
  }, [token]);

  const value = useMemo(() => ({
    token,
    user,
    login: setToken,
    logout: () => setToken(null)
  }), [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};



