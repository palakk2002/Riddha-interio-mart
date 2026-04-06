import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DeliveryLayout from './components/DeliveryLayout';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Earnings from './pages/Earnings';
import Profile from './pages/Profile';
import LoginPage from '../user/pages/LoginPage';
import SignupPage from '../user/pages/SignupPage';

const DeliveryRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route element={<DeliveryLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/earnings" element={<Earnings />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default DeliveryRoutes;
