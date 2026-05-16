import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DeliveryLayout from './components/DeliveryLayout';
const Dashboard = React.lazy(() => import('./pages/Dashboard'));;
const Orders = React.lazy(() => import('./pages/Orders'));;
const DeliveryHistory = React.lazy(() => import('./pages/DeliveryHistory'));;
const Earnings = React.lazy(() => import('./pages/Earnings'));;
const Profile = React.lazy(() => import('./pages/Profile'));;
const Wallet = React.lazy(() => import('./pages/Wallet'));;
const Settings = React.lazy(() => import('./pages/Settings'));;
const HelpSupport = React.lazy(() => import('./pages/HelpSupport'));;
const About = React.lazy(() => import('./pages/About'));;
const LoginPage = React.lazy(() => import('../user/pages/LoginPage'));;
const SignupPage = React.lazy(() => import('../user/pages/SignupPage'));;

const DeliveryRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route element={<DeliveryLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
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
