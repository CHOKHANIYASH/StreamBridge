"use client";
import React, { createContext, useState, useEffect } from "react";
import { getCurrentUser, fetchAuthSession } from "aws-amplify/auth";
const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [tokenExpiry, setTokenExpiry] = useState(0);
  const getAccessToken = async () => {
    if (tokenExpiry < Date.now() / 1000 && accessToken !== "")
      return accessToken;
    const session = await fetchAuthSession();
    if (session) {
      let token = session.tokens.accessToken.toString();
      let expiry = session.tokens.accessToken.payload.exp;
      setAccessToken(token);
      setTokenExpiry(expiry);
      return token;
    }
  };
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
  return (
    <AuthContext.Provider
      value={{
        userId,
        setUserId,
        isAuthenticated,
        setIsAuthenticated,
        getAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
