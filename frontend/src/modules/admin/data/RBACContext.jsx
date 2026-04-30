import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_ASSISTANT_PERMISSIONS } from './permissionsMap';

const RBACContext = createContext();

export const useRBAC = () => {
  const context = useContext(RBACContext);
  if (!context) {
    throw new Error('useRBAC must be used within an RBACProvider');
  }
  return context;
};

export const RBACProvider = ({ children }) => {
  // State for current role and permissions
  const [role, setRole] = useState(() => {
    const saved = localStorage.getItem('rbac_role');
    return saved || 'admin';
  });

  const [currentPermissions, setCurrentPermissions] = useState(() => {
    const saved = localStorage.getItem('rbac_permissions');
    if (saved) return JSON.parse(saved);
    return role === 'admin' ? null : DEFAULT_ASSISTANT_PERMISSIONS;
  });

  // State for assistants list (simulating DB)
  const [assistants, setAssistants] = useState(() => {
    const saved = localStorage.getItem('rbac_assistants');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: '1',
        name: 'John Assistant',
        email: 'john@riddha.com',
        role: 'assistant',
        permissions: { ...DEFAULT_ASSISTANT_PERMISSIONS, analytics: true }
      },
      {
        id: '2',
        name: 'Sarah Clerk',
        email: 'sarah@riddha.com',
        role: 'assistant',
        permissions: { ...DEFAULT_ASSISTANT_PERMISSIONS, orders: true, products: false }
      }
    ];
  });

  // Persist state
  useEffect(() => {
    localStorage.setItem('rbac_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('rbac_permissions', JSON.stringify(currentPermissions));
  }, [currentPermissions]);

  useEffect(() => {
    localStorage.setItem('rbac_assistants', JSON.stringify(assistants));
  }, [assistants]);

  const switchRole = (newRole, permissions = null) => {
    setRole(newRole);
    if (newRole === 'admin') {
      setCurrentPermissions(null); // Admin has full access
    } else {
      setCurrentPermissions(permissions || DEFAULT_ASSISTANT_PERMISSIONS);
    }
  };

  const hasPermission = (permissionKey) => {
    if (role === 'admin') return true;
    if (!currentPermissions) return false;
    return !!currentPermissions[permissionKey];
  };

  const addAssistant = (assistantData) => {
    const newAssistant = {
      ...assistantData,
      id: Date.now().toString(),
      role: 'assistant'
    };
    setAssistants(prev => [...prev, newAssistant]);
    return newAssistant;
  };

  const updateAssistant = (id, updatedData) => {
    setAssistants(prev => prev.map(a => a.id === id ? { ...a, ...updatedData } : a));
  };

  const removeAssistant = (id) => {
    setAssistants(prev => prev.filter(a => a.id !== id));
  };

  return (
    <RBACContext.Provider value={{
      role,
      currentPermissions,
      assistants,
      switchRole,
      hasPermission,
      addAssistant,
      updateAssistant,
      removeAssistant
    }}>
      {children}
    </RBACContext.Provider>
  );
};
