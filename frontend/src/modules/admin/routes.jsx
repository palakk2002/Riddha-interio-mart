import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import CatalogPage from './pages/CatalogPage';
import CategoriesPage from './pages/CategoriesPage';
import SettingsPage from './pages/SettingsPage';
import ManageCategories from './pages/ManageCategories';
import ManageFeaturedProducts from './pages/ManageFeaturedProducts';
import AddFeaturedProductPage from './pages/AddFeaturedProductPage';
import ManageHeroBanner from './pages/ManageHeroBanner';
import ManagePromoBanner from './pages/ManagePromoBanner';
import ManageSection from './pages/ManageSection';
import ManageFavouriteCategories from './pages/ManageFavouriteCategories';
import ManageCategoryGrid from './pages/ManageCategoryGrid';
import ManageBrands from './pages/ManageBrands';
import LoginPage from '../user/pages/LoginPage';
import SignupPage from '../user/pages/SignupPage';
import AdminProfile from './pages/AdminProfile';
import AnalyticsPage from './pages/AnalyticsPage';
import ActivityPage from './pages/ActivityPage';
import ReferralManagement from './pages/ReferralManagement';
import OrderTracking from './pages/OrderTracking';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';
import AddCategoryPage from './pages/AddCategoryPage';
import EditCategoryPage from './pages/EditCategoryPage';
import AddCategoryGridItemPage from './pages/AddCategoryGridItemPage';
import AddBrandPage from './pages/AddBrandPage';
import PendingSellers from './pages/PendingSellers';
import ActiveSellers from './pages/ActiveSellers';
import OrderListPage from './pages/OrderListPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ProductListPage from './pages/ProductListPage';
import AddInventoryPage from './pages/AddInventoryPage';
import EditInventoryPage from './pages/EditInventoryPage';
import ManageDeliveries from './pages/ManageDeliveries';
import AssignDeliveryPage from './pages/DeliveryAssignment';
import AddProductFlowPage from './pages/AddProductFlowPage';
import StockManagement from './pages/StockManagement';
import BulkProductUpload from './pages/BulkProductUpload';
import BulkOrdersPage from './pages/BulkOrdersPage';
import TeamManagementPage from './pages/TeamManagementPage';
import CreateAssistantPage from './pages/CreateAssistantPage';
import ManageUserPage from './pages/ManageUserPage';
import UserPaymentsPage from './pages/UserPaymentsPage';
import CashCollectionPage from './pages/CashCollectionPage';
import SellerTransactionsPage from './pages/SellerTransactionsPage';

import { RBACProvider } from './data/RBACContext';

const AdminRoutes = () => {
  return (
    <RBACProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AdminLayout />}>
          {/* ... (all routes) */}
          <Route index element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<AdminProfile />} />

          {/* Analytics & Activity */}
          <Route element={<ProtectedRoute permission="analytics" />}>
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/activity" element={<ActivityPage />} />
          </Route>

          {/* Catalog & Products */}
          <Route element={<ProtectedRoute permission="catalog" />}>
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/catalog/add" element={<AddProductPage />} />
            <Route path="/catalog/edit/:id" element={<EditProductPage />} />
            <Route path="/bulk-upload" element={<BulkProductUpload />} />
          </Route>

          {/* Inventory & Stock */}
          <Route element={<ProtectedRoute permission="products" />}>
            <Route path="/inventory" element={<ProductListPage />} />
            <Route path="/inventory/add-flow" element={<AddProductFlowPage />} />
            <Route path="/inventory/add" element={<AddInventoryPage />} />
            <Route path="/inventory/edit/:id" element={<EditInventoryPage />} />
            <Route path="/stock-management" element={<StockManagement />} />
          </Route>

          {/* Categories */}
          <Route element={<ProtectedRoute permission="categories" />}>
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/manage-categories" element={<ManageCategories />} />
            <Route path="/manage-categories/add" element={<AddCategoryPage />} />
            <Route path="/manage-categories/edit/:id" element={<EditCategoryPage />} />
          </Route>

          {/* Orders */}
          <Route element={<ProtectedRoute permission="orders" />}>
            <Route path="/orders/:status" element={<OrderListPage />} />
            <Route path="/orders/view/:id" element={<OrderDetailPage />} />
            <Route path="/orders/tracking" element={<OrderTracking />} />
            <Route path="/bulk-orders" element={<BulkOrdersPage />} />
          </Route>

          {/* Delivery */}
          <Route element={<ProtectedRoute permission="delivery" />}>
            <Route path="/delivery" element={<ManageDeliveries />} />
            <Route path="/delivery/pending" element={<ManageDeliveries />} />
            <Route path="/delivery/assign" element={<AssignDeliveryPage />} />
          </Route>

          {/* Sellers */}
          <Route element={<ProtectedRoute permission="sellers" />}>
            <Route path="/sellers/pending" element={<PendingSellers />} />
            <Route path="/sellers/active" element={<ActiveSellers />} />
            <Route path="/customers" element={<ManageUserPage type="customer" />} />
            <Route path="/customers/individual" element={<ManageUserPage type="customer" />} />
            <Route path="/customers/enterpriser" element={<ManageUserPage type="enterpriser" />} />
          </Route>

          {/* Content Management */}
          <Route element={<ProtectedRoute permission="content" />}>
            <Route path="/manage-hero" element={<ManageHeroBanner />} />
            <Route path="/manage-promo" element={<ManagePromoBanner />} />
            <Route path="/manage-section" element={<ManageSection />} />
            <Route path="/manage-section/create" element={<ManageSection />} />
            <Route path="/manage-favourites" element={<ManageFavouriteCategories />} />
            <Route path="/manage-favourites/create" element={<ManageFavouriteCategories />} />
            <Route path="/manage-favourites/add" element={<ManageFavouriteCategories />} />
            <Route path="/manage-featured" element={<ManageFeaturedProducts />} />
            <Route path="/manage-featured/add" element={<AddFeaturedProductPage />} />
            <Route path="/manage-brands" element={<ManageBrands />} />
            <Route path="/manage-brands/add" element={<AddBrandPage />} />
            <Route path="/manage-grid" element={<ManageCategoryGrid />} />
            <Route path="/manage-grid/add" element={<AddCategoryGridItemPage />} />
          </Route>

          {/* Referrals */}
          <Route element={<ProtectedRoute permission="referrals" />}>
            <Route path="/referrals" element={<ReferralManagement />} />
          </Route>

          {/* Settings */}
          <Route element={<ProtectedRoute permission="settings" />}>
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Team Management (Admin Only) */}
          <Route element={<ProtectedRoute permission="team" />}>
            <Route path="/team" element={<TeamManagementPage />} />
            <Route path="/team/create" element={<CreateAssistantPage />} />
            <Route path="/team/edit/:id" element={<CreateAssistantPage />} />
          </Route>

          {/* Payments */}
          <Route element={<ProtectedRoute permission="payments" />}>
            <Route path="/payments/users" element={<UserPaymentsPage />} />
            <Route path="/payments/delivery" element={<CashCollectionPage />} />
            <Route path="/payments/sellers" element={<SellerTransactionsPage />} />
          </Route>
        </Route>
      </Routes>
    </RBACProvider>
  );
};

export default AdminRoutes;
