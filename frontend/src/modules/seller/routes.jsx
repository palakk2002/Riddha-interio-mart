import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SellerLayout from './components/SellerLayout';
import Dashboard from './pages/Dashboard';
import BrowseCatalog from './pages/BrowseCatalog';
import AddProduct from './pages/AddProduct';
import MyProducts from './pages/MyProducts';
import LoginPage from '../user/pages/LoginPage';
import SignupPage from '../user/pages/SignupPage';
import SellerProfile from './pages/SellerProfile';

const SellerRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route element={<SellerLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/catalog" element={<BrowseCatalog />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/my-products" element={<MyProducts />} />
        <Route path="/profile" element={<SellerProfile />} />
      </Route>
    </Routes>
  );
};

export default SellerRoutes;
