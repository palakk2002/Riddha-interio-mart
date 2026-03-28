import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './modules/user/components/Navbar';
import Footer from './modules/user/components/Footer';
import BottomNavbar from './modules/user/components/BottomNavbar';
import UserRoutes from './modules/user/routes';
import AdminRoutes from './modules/admin/routes';
import SellerRoutes from './modules/seller/routes';

function App() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const isSellerPath = location.pathname.startsWith('/seller');
  const isAuthPath = location.pathname === '/login' || location.pathname === '/signup' || 
                      location.pathname.endsWith('/login') || location.pathname.endsWith('/signup');
  const isDashboardLayout = isAdminPath || isSellerPath || isAuthPath;

  return (
    <div className={`min-h-screen flex flex-col user-theme bg-white border-deep-espresso/5 ${!isDashboardLayout ? 'pb-24 md:pb-0' : ''}`}>
      {!isDashboardLayout && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/seller/*" element={<SellerRoutes />} />
          <Route path="/*" element={<UserRoutes />} />
        </Routes>
      </main>
      {!isDashboardLayout && <Footer />}
      {!isDashboardLayout && <BottomNavbar />}
    </div>
  );
}

export default App;
