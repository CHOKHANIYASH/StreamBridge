"use client";
import React, { createContext, useState, useEffect } from "react";
import { getCurrentUser } from "aws-amplify/auth";
const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        if (user) {
          setIsAuthenticated(true);
          setUserId(user.userId);
        }
      })
      .catch((err) => {});
  }, []);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState("");
  return (
    <AuthContext.Provider
      value={{ userId, setUserId, isAuthenticated, setIsAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
