import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import DashboardPage from './pages/DashboardPage';
import CatalogPage from './pages/CatalogPage';
import CategoriesPage from './pages/CategoriesPage';
import SettingsPage from './pages/SettingsPage';
import ManageCategories from './pages/ManageCategories';
import ManageFeaturedProducts from './pages/ManageFeaturedProducts';
import ManageHeroBanner from './pages/ManageHeroBanner';
import ManagePromoBanner from './pages/ManagePromoBanner';
import ManageCategoryGrid from './pages/ManageCategoryGrid';
import LoginPage from '../user/pages/LoginPage';
import SignupPage from '../user/pages/SignupPage';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route element={<AdminLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/manage-categories" element={<ManageCategories />} />
        <Route path="/manage-featured" element={<ManageFeaturedProducts />} />
        <Route path="/manage-hero" element={<ManageHeroBanner />} />
        <Route path="/manage-promo" element={<ManagePromoBanner />} />
        <Route path="/manage-grid" element={<ManageCategoryGrid />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
