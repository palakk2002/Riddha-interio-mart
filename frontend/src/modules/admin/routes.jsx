import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import DashboardPage from "./pages/DashboardPage";
import CatalogPage from "./pages/CatalogPage";
import CategoriesPage from "./pages/CategoriesPage";
import SettingsPage from "./pages/SettingsPage";
import ManageCategories from "./pages/ManageCategories";
import ManageFeaturedProducts from "./pages/ManageFeaturedProducts";
import AddFeaturedProductPage from "./pages/AddFeaturedProductPage";
import ManageFavouriteCategories from "./pages/ManageFavouriteCategories";
import AddFavouriteCategoryItemPage from "./pages/AddFavouriteCategoryItemPage";
import ManageHeroBanners from "./pages/ManageHeroBanners";
import ManageHeroBanner from "./pages/ManageHeroBanner";
import ManagePromoBanner from "./pages/ManagePromoBanner";
import ManagePromoBanners from "./pages/ManagePromoBanners";
import ManageCategoryGrid from "./pages/ManageCategoryGrid";
import ManageBrands from "./pages/ManageBrands";
import LoginPage from "../user/pages/LoginPage";
import SignupPage from "../user/pages/SignupPage";
import AdminProfile from "./pages/AdminProfile";
import AnalyticsPage from "./pages/AnalyticsPage";
import ActivityPage from "./pages/ActivityPage";
import AddProductPage from "./pages/AddProductPage";
import EditProductPage from "./pages/EditProductPage";
import AddCategoryPage from "./pages/AddCategoryPage";
import EditCategoryPage from "./pages/EditCategoryPage";
import AddCategoryGridItemPage from "./pages/AddCategoryGridItemPage";
import AddBrandPage from "./pages/AddBrandPage";
import ProductListPage from "./pages/ProductListPage";
import TaxesPage from "./pages/TaxesPage";
import ManageSellerListPage from "./pages/ManageSellerListPage";
import PendingSellersPage from "./pages/PendingSellersPage";
import SellerTransactionsPage from "./pages/SellerTransactionsPage";
import SellerLocationPage from "./pages/SellerLocationPage";
import PendingDeliveryBoyPage from "./pages/PendingDeliveryBoyPage";
import ManageDeliveryBoyPage from "./pages/ManageDeliveryBoyPage";
import FundTransferPage from "./pages/FundTransferPage";
import CashCollectionPage from "./pages/CashCollectionPage";
import OrderListPage from "./pages/OrderListPage";
import ReturnOrdersPage from "./pages/ReturnOrdersPage";
import ManageUserPage from "./pages/ManageUserPage";
import WalletEarningsPage from "./pages/WalletEarningsPage";
import OrderDetailPage from "./pages/OrderDetailPage";

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
        <Route path="/product/list" element={<ProductListPage />} />
        <Route path="/product/taxes" element={<TaxesPage />} />
        <Route path="/sellers/list" element={<ManageSellerListPage />} />
        <Route path="/sellers/pending" element={<PendingSellersPage />} />
        <Route
          path="/sellers/transactions"
          element={<SellerTransactionsPage />}
        />
        <Route
          path="/delivery/location/seller"
          element={<SellerLocationPage />}
        />
        <Route
          path="/delivery/boy/pending"
          element={<PendingDeliveryBoyPage />}
        />
        <Route
          path="/delivery/boy/manage"
          element={<ManageDeliveryBoyPage />}
        />
        <Route
          path="/delivery/boy/fund-transfer"
          element={<FundTransferPage />}
        />
        <Route
          path="/delivery/boy/cash-collection"
          element={<CashCollectionPage />}
        />
        <Route
          path="/orders/all"
          element={<OrderListPage specificStatus="All Order" />}
        />
        <Route
          path="/orders/pending"
          element={<OrderListPage specificStatus="Pending" />}
        />
        <Route
          path="/orders/received"
          element={<OrderListPage specificStatus="Received" />}
        />
        <Route
          path="/orders/processed"
          element={<OrderListPage specificStatus="Processed" />}
        />
        <Route
          path="/orders/shipped"
          element={<OrderListPage specificStatus="Shipped" />}
        />
        <Route
          path="/orders/out-for-delivery"
          element={<OrderListPage specificStatus="Out For Delivery" />}
        />
        <Route
          path="/orders/delivered"
          element={<OrderListPage specificStatus="Delivered" />}
        />
        <Route
          path="/orders/cancelled"
          element={<OrderListPage specificStatus="Cancelled" />}
        />
        <Route path="/orders/view/:id" element={<OrderDetailPage />} />
        <Route path="/orders/return" element={<ReturnOrdersPage />} />
        <Route path="/users" element={<ManageUserPage />} />
        <Route path="/finance/wallet" element={<WalletEarningsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/manage-categories" element={<ManageCategories />} />
        <Route path="/manage-categories/add" element={<AddCategoryPage />} />
        <Route
          path="/manage-categories/edit/:id"
          element={<EditCategoryPage />}
        />
        <Route path="/manage-featured" element={<ManageFeaturedProducts />} />
        <Route
          path="/manage-favourites"
          element={<ManageFavouriteCategories />}
        />
        <Route
          path="/manage-favourites/add"
          element={<AddFavouriteCategoryItemPage />}
        />
        <Route
          path="/manage-featured/add"
          element={<AddFeaturedProductPage />}
        />
        <Route path="/manage-hero" element={<ManageHeroBanners />} />
        <Route path="/manage-hero/add" element={<ManageHeroBanner />} />
        <Route path="/manage-hero/edit/:id" element={<ManageHeroBanner />} />
        <Route path="/manage-promo" element={<ManagePromoBanners />} />
        <Route path="/manage-promo/add" element={<ManagePromoBanner />} />
        <Route path="/manage-promo/edit/:id" element={<ManagePromoBanner />} />
        <Route path="/manage-brands" element={<ManageBrands />} />
        <Route path="/manage-brands/add" element={<AddBrandPage />} />
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
