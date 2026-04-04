import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import DashboardPage from './pages/DashboardPage';
import CatalogPage from './pages/CatalogPage';
import CategoriesPage from './pages/CategoriesPage';
import SettingsPage from './pages/SettingsPage';
import ManageCategories from './pages/ManageCategories';
import ManageFeaturedProducts from './pages/ManageFeaturedProducts';
import AddFeaturedProductPage from './pages/AddFeaturedProductPage';
import ManageFavouriteCategories from './pages/ManageFavouriteCategories';
import AddFavouriteCategoryItemPage from './pages/AddFavouriteCategoryItemPage';
import ManageHeroBanner from './pages/ManageHeroBanner';
import ManagePromoBanner from './pages/ManagePromoBanner';
import ManageCategoryGrid from './pages/ManageCategoryGrid';
import ManageBrands from './pages/ManageBrands';
import LoginPage from '../user/pages/LoginPage';
import SignupPage from '../user/pages/SignupPage';
import AdminProfile from './pages/AdminProfile';
import AnalyticsPage from './pages/AnalyticsPage';
import ActivityPage from './pages/ActivityPage';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';
import AddCategoryPage from './pages/AddCategoryPage';
import EditCategoryPage from './pages/EditCategoryPage';
import AddCategoryGridItemPage from './pages/AddCategoryGridItemPage';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/catalog/add" element={<AddProductPage />} />
        <Route path="/catalog/edit/:id" element={<EditProductPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/manage-categories" element={<ManageCategories />} />
        <Route path="/manage-categories/add" element={<AddCategoryPage />} />
        <Route path="/manage-categories/edit/:id" element={<EditCategoryPage />} />
        <Route path="/manage-featured" element={<ManageFeaturedProducts />} />
        <Route path="/manage-favourites" element={<ManageFavouriteCategories />} />
        <Route path="/manage-favourites/add" element={<AddFavouriteCategoryItemPage />} />
        <Route path="/manage-featured/add" element={<AddFeaturedProductPage />} />
        <Route path="/manage-hero" element={<ManageHeroBanner />} />
        <Route path="/manage-promo" element={<ManagePromoBanner />} />
        <Route path="/manage-brands" element={<ManageBrands />} />
        <Route path="/manage-grid" element={<ManageCategoryGrid />} />
        <Route path="/manage-grid/add" element={<AddCategoryGridItemPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<AdminProfile />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/activity" element={<ActivityPage />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
