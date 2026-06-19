import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // 🔥 GLOBAL HEADERS LOCK: Yeh interceptor har ek request mein secret key jodega
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        // Yeh wahi key hai jo tumne backend ke code mein validation ke liye daali hai
        config.headers["x-api-secret"] = "MY_FALLBACK_SECRET_KEY";
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Clean up interceptor on unmount
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, [token]);

  const login = (userData, userToken) => {
    localStorage.setItem("token", userToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(userToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
