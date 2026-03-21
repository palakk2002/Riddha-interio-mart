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

  useEffect(() => {
    if (address) {
      localStorage.setItem('riddha_address', JSON.stringify(address));
    } else {
      localStorage.removeItem('riddha_address');
    }
  }, [address]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    setAddress(null);
  };

  const saveAddress = (addressData) => {
    setAddress(addressData);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoggedIn,
        address,
        login,
        logout,
        saveAddress,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
