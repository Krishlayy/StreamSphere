import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('streamsphere_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('streamsphere_token'));
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (user && token) {
      localStorage.setItem('streamsphere_user', JSON.stringify(user));
      localStorage.setItem('streamsphere_token', token);
    } else {
      localStorage.removeItem('streamsphere_user');
      localStorage.removeItem('streamsphere_token');
    }
  }, [user, token]);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!user,
        isAuthModalOpen,
        setIsAuthModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
