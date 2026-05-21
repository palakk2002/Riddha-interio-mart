# Dynamic vs Static Module Report

This report analyzes the `Riddha-interio-mart` project to identify which components are connected to backend APIs (dynamic) and which rely on hardcoded or dummy data (static).

## 📊 Overview

| Module Type | Completion % | Description |
|---|---|---|
| **Fully Dynamic** | 75% | Connected to MongoDB via Express APIs |
| **Partially Dynamic** | 15% | Mix of API data and static UI definitions |
| **Static / Dummy Data** | 10% | Uses local `data/` files instead of APIs |

---

## 🟢 Fully Dynamic Modules (API Connected)
These modules are successfully connected to backend services and reflect real-time database changes.

1. **User Authentication & Profiles**
   - Login, Signup, Profile updates.
   - Address management (fetching and saving via `/address` API).
2. **Product Catalog & Management**
   - Admin and Seller product uploads, inventory management, and updates.
   - Home page product grids (fetches `/products` and slices data).
   - Product detail pages (`/products/:id`).
3. **Cart & Checkout Workflow**
   - Adding/removing items (`/cart` API).
   - Dynamic pricing calculation (`/orders/calculate-pricing`).
4. **Order Management**
   - Order history, tracking, and backend order creation.
   - Bulk orders management.
5. **Admin Dashboard**
   - Analytics, User management, Seller approvals, Category/Brand management.
6. **Wallet & Delivery Management**
   - Earnings, payouts, and delivery boy assignments.

---

## 🟡 Partially Dynamic / Mixed Modules
These modules fetch some data from APIs but still rely on hardcoded assets or logic.

1. **Home Page (`HomePage.jsx`)**
   - **Dynamic:** Products, Home Banners (`/home-banner`).
   - **Static:** `PromoGrid`, `TrustBar`, `ExpressDeliveryBanner`, `CategoryQuickAccess` (hardcoded UI components without CMS control).
2. **Product Listing Page**
   - **Dynamic:** Product list (`api.get('/products')`).
   - **Static:** Category Sidebar filters (`../data/categories.js`). This means if an Admin adds a new category dynamically, the sidebar won't update unless the code is changed.

---

## 🔴 Static Modules & Dummy Data
These components currently use local `.js` files or hardcoded arrays instead of a database connection.

1. **Frontend Categories & Subcategories**
   - Files: `frontend/src/modules/user/data/categories.js` & `subcategories.js`.
   - Issue: The frontend uses these for navigation instead of the dynamic `/category` API.
2. **Brand Definitions**
   - File: `frontend/src/modules/user/data/brandData.js`.
   - Issue: Brands are hardcoded for certain frontend views.
3. **Professional Registrations**
   - Pages: `ContractorRegistration`, `DesignerRegistration`, `BuilderRegistration`.
   - Issue: Forms exist but the API connection is missing (e.g., `// In a real app, this would call an endpoint like /api/professionals/register`).
4. **Coming Soon Pages**
   - Some modules (like `/comingsoon`) are placeholders.

---

## 📋 Recommendations for "De-Staticizing"
*   **Categories:** Replace `import { categories } from '../data/categories'` with an API call to `api.get('/categories')` in `ProductListingPage.jsx`.
*   **Brands:** Fetch brands dynamically from the database instead of `brandData.js`.
*   **Registrations:** Implement the backend routes for Contractor, Designer, and Builder roles in `userRoutes.js` and connect them.
