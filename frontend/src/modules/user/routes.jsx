import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CategoryDetailPage from './pages/CategoryDetailPage';
import CartPage from './pages/CartPage';
import Profile from './pages/Profile';
import Shop from './pages/Shop';
import Orders from './pages/Orders';
import Stores from './pages/Stores';
import About from './pages/About';
import Contact from './pages/Contact';
import Cancellation from './pages/Cancellation';
import Returns from './pages/Returns';
import Refund from './pages/Refund';
import Terms from './pages/Terms';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AddressPage from './pages/AddressPage';
import PaymentPage from './pages/PaymentPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import EditProfile from './pages/EditProfile';

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductListingPage />} />
      <Route path="/products/:id" element={<ProductDetailsPage />} />
      <Route path="/category/:slug" element={<CategoryDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/stores" element={<Stores />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/policies/cancellation" element={<Cancellation />} />
      <Route path="/policies/returns" element={<Returns />} />
      <Route path="/policies/refund" element={<Refund />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/address" element={<AddressPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/order-success" element={<OrderSuccessPage />} />
      <Route path="/order-tracking" element={<OrderTrackingPage />} />
      <Route path="/profile/edit" element={<EditProfile />} />
    </Routes>
  );
};

export default UserRoutes;
