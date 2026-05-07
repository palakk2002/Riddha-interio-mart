import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CategoryDetailPage from './pages/CategoryDetailPage';
import CategoriesPage from './pages/CategoriesPage';
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
import BrandPage from './pages/BrandPage';
import SearchEntryPage from './pages/SearchEntryPage';
import SearchProductsPage from './pages/SearchProductsPage';
import InvoicePage from './pages/InvoicePage';
import ReferralRewardsPage from './pages/ReferralRewardsPage';
import ComingSoonPage from './pages/ComingSoonPage';
import ComingSoonSubPage from './pages/ComingSoonSubPage';
import ComingSoonAboutPage from './pages/ComingSoonAboutPage';
import ComingSoonServicesPage from './pages/ComingSoonServicesPage';
import ComingSoonCategoriesPage from './pages/ComingSoonCategoriesPage';
import ComingSoonShopPage from './pages/ComingSoonShopPage';
import ComingSoonContactPage from './pages/ComingSoonContactPage';
import ContractorRegistration from './pages/ContractorRegistration';
import DesignerRegistration from './pages/DesignerRegistration';
import BuilderRegistration from './pages/BuilderRegistration';

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/coming-soon" element={<ComingSoonPage />} />
      <Route path="/coming-soon/about" element={<ComingSoonAboutPage />} />
      <Route path="/coming-soon/services" element={<ComingSoonServicesPage />} />
      <Route path="/coming-soon/categories" element={<ComingSoonCategoriesPage />} />
      <Route path="/coming-soon/shop" element={<ComingSoonShopPage />} />
      <Route path="/coming-soon/contact" element={<ComingSoonContactPage />} />
      <Route path="/coming-soon/:section" element={<ComingSoonSubPage />} />
      <Route path="/contractor-registration" element={<ContractorRegistration />} />
      <Route path="/designer-registration" element={<DesignerRegistration />} />
      <Route path="/builder-registration" element={<BuilderRegistration />} />
      <Route path="/referral" element={<ReferralRewardsPage />} />
      <Route path="/products" element={<ProductListingPage />} />
      <Route path="/products/:id" element={<ProductDetailsPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/category/:slug" element={<CategoryDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/referral-rewards" element={<ReferralRewardsPage />} />
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
      <Route path="/track-order/:id" element={<OrderTrackingPage />} />
      <Route path="/profile/edit" element={<EditProfile />} />
      <Route path="/brand/:brandName" element={<BrandPage />} />
      <Route path="/search" element={<SearchEntryPage />} />
      <Route path="/search-results" element={<SearchProductsPage />} />
      <Route path="/order/invoice/:id" element={<InvoicePage />} />
    </Routes>
  );
};

export default UserRoutes;
