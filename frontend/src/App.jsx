import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './modules/user/components/Navbar';
import Footer from './modules/user/components/Footer';
import BottomNavbar from './modules/user/components/BottomNavbar';
import UserRoutes from './modules/user/routes';
import AdminRoutes from './modules/admin/routes';

function App() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className={`min-h-screen flex flex-col bg-[#FDFBF9] ${!isAdminPath ? 'pb-24 md:pb-0' : ''}`}>
      {!isAdminPath && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/*" element={<UserRoutes />} />
        </Routes>
      </main>
      {!isAdminPath && <Footer />}
      {!isAdminPath && <BottomNavbar />}
    </div>
  );
}

export default App;
