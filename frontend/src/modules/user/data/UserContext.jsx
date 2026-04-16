import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('riddha_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!user);
  
  const [address, setAddress] = useState(() => {
    const savedAddress = localStorage.getItem('riddha_address');
    return savedAddress ? JSON.parse(savedAddress) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('riddha_user', JSON.stringify(user));
      setIsLoggedIn(true);
    } else {
      localStorage.removeItem('riddha_user');
      setIsLoggedIn(false);
    }
  }, [user]);

  const login = (userData) => {
    // userData should contain { id, fullName, email, role, token }
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    setAddress(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        setLoading,
        isLoggedIn,
        address,
        login,
        logout,
        saveAddress: setAddress,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
