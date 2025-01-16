"use client";
import React, { createContext, useState, useEffect } from "react";
import { getCurrentUser } from "aws-amplify/auth";
const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        if (user) {
          isAuthenticated(true);
        }
      })
      .catch((err) => {});
  }, []);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
