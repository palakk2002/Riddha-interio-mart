import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../../../shared/utils/api';

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
  const [address, setAddress] = useState(null);

  // Sync user state with localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('riddha_user', JSON.stringify(user));
      setIsLoggedIn(true);
      fetchAddresses();
    } else {
      localStorage.removeItem('riddha_user');
      setIsLoggedIn(false);
      setAddress(null);
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const res = await api.get('/address');
      if (res.data.success && res.data.data.length > 0) {
        // find default address or first one
        const defaultAddr = res.data.data.find(a => a.isDefault) || res.data.data[0];
        setAddress(defaultAddr);
      }
    } catch (err) {
      console.error('Failed to fetch addresses:', err);
    }
  };

  const saveAddress = async (addressData) => {
    try {
      setLoading(true);
      const res = await api.post('/address', { ...addressData, isDefault: true });
      if (res.data.success) {
        setAddress(res.data.data);
        return true;
      }
    } catch (err) {
      console.error('Failed to save address:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
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
        saveAddress,
        fetchAddresses
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
