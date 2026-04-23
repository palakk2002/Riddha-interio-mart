import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SellerLayout from './components/SellerLayout';
import Dashboard from './pages/Dashboard';
import BrowseCatalog from './pages/BrowseCatalog';
import AddProduct from './pages/AddProduct';
import MyProducts from './pages/MyProducts';
import Orders from './pages/Orders';
import AssignDeliveryBoy from './pages/AssignDeliveryBoy';
import Taxes from './pages/Taxes';
import StockManagement from './pages/StockManagement';
import Wallet from './pages/Wallet';
import SalesReport from './pages/SalesReport';
import ReturnOrders from './pages/ReturnOrders';
import OrderDetail from './pages/OrderDetail';
import LoginPage from '../user/pages/LoginPage';
import SignupPage from '../user/pages/SignupPage';
import SellerProfile from './pages/SellerProfile';
import OrderTracking from './pages/OrderTracking';
import Notifications from './pages/Notifications';

const SellerRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route element={<SellerLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/track" element={<OrderTracking />} />
        <Route path="/assign-delivery" element={<AssignDeliveryBoy />} />
        <Route path="/order/:id" element={<OrderDetail />} />
        <Route path="/product/add" element={<AddProduct />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/product/list" element={<MyProducts />} />
        <Route path="/my-products" element={<MyProducts />} />
        <Route path="/product/taxes" element={<Taxes />} />
        <Route path="/product/stock" element={<StockManagement />} />
        <Route path="/stock-management" element={<StockManagement />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/reports/sales" element={<SalesReport />} />
        <Route path="/return" element={<ReturnOrders />} />
        <Route path="/catalog" element={<BrowseCatalog />} />
        <Route path="/profile" element={<SellerProfile />} />
        <Route path="/notifications" element={<Notifications />} />
      </Route>
    </Routes>
  );
};

export default SellerRoutes;
