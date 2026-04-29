import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './modules/user/components/Navbar';
import Footer from './modules/user/components/Footer';
import BottomNavbar from './modules/user/components/BottomNavbar';
import UserRoutes from './modules/user/routes';
import AdminRoutes from './modules/admin/routes';
import SellerRoutes from './modules/seller/routes';
import DeliveryRoutes from './modules/delivery/routes';
// import { Toaster } from 'react-hot-toast'; // Triggering re-save for Vite
import PincodeModal from './modules/user/components/PincodeModal';
import DeliveryBar from './modules/user/components/DeliveryBar';

function App() {
  const [showPincodeModal, setShowPincodeModal] = useState(false);
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const isSellerPath = location.pathname.startsWith('/seller');
  const isDeliveryPath = location.pathname.startsWith('/delivery');
  const isAuthPath = location.pathname === '/login' || location.pathname === '/signup' || 
                      location.pathname.endsWith('/login') || location.pathname.endsWith('/signup') ||
                      location.pathname === '/search';
  const isDashboardLayout = isAdminPath || isSellerPath || isDeliveryPath || isAuthPath;
  const isProductPage = location.pathname.startsWith('/product/');
  const isCheckoutPath = ['/cart', '/address', '/payment'].includes(location.pathname);

  useEffect(() => {
    // Check if pincode is set in localStorage
    const savedPincode = localStorage.getItem('userPincode');
    if (!savedPincode && !isDashboardLayout) {
      setShowPincodeModal(true);
    }
  }, [isDashboardLayout]);

  const handlePincodeComplete = () => {
    setShowPincodeModal(false);
  };

  return (
    <div className={`min-h-screen flex flex-col user-theme bg-white border-deep-espresso/5 ${(!isDashboardLayout && !isCheckoutPath) ? 'pb-24 md:pb-0' : ''}`}>
      {/* <Toaster position="top-center" reverseOrder={false} /> */}
      {showPincodeModal && <PincodeModal onComplete={handlePincodeComplete} />}
      
      {!isDashboardLayout && (
        <>
          {isProductPage ? (
            <>
              <div className="sticky top-0 z-50 shadow-sm">
                <Navbar />
              </div>
              <DeliveryBar />
            </>
          ) : (
            <div className={`sticky top-0 z-50 shadow-sm ${location.pathname === '/cart' ? 'hidden md:block' : ''}`}>
              <Navbar />
              <DeliveryBar />
            </div>
          )}
        </>
      )}

      <main className="flex-grow">
        <Routes>
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/seller/*" element={<SellerRoutes />} />
          <Route path="/delivery/*" element={<DeliveryRoutes />} />
          <Route path="/*" element={<UserRoutes />} />
        </Routes>
      </main>
      {!isDashboardLayout && <Footer />}
      {!isDashboardLayout && <BottomNavbar />}
    </div>
  );
}

export default App;
