import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DeliveryLayout from './components/DeliveryLayout';
import Dashboard from './pages/Dashboard';
import DeliveryHistory from './pages/DeliveryHistory';
import Earnings from './pages/Earnings';
import Profile from './pages/Profile';
import Wallet from './pages/Wallet';
import Settings from './pages/Settings';
import HelpSupport from './pages/HelpSupport';
import About from './pages/About';
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
        <Route path="/delivery-history" element={<DeliveryHistory />} />
        <Route path="/earnings" element={<Earnings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<HelpSupport />} />
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  );
};

export default DeliveryRoutes;
