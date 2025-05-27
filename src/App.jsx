import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageWrapper from '@/components/layout/PageWrapper';

import HomePage from '@/pages/HomePage';
import AboutUsPage from '@/pages/AboutUsPage';
import ProductsPage from '@/pages/ProductsPage';
import FeedbackPage from '@/pages/FeedbackPage';
import ContactUsPage from '@/pages/ContactUsPage';
import TermsConditionsPage from '@/pages/TermsConditionsPage';
import LoginPage from '@/pages/LoginPage';
import SignUpPage from '@/pages/SignUpPage';
import CustomerDashboard from '@/pages/dashboards/CustomerDashboard';
import HousewifeDashboard from '@/pages/dashboards/HousewifeDashboard';
import VendorDashboard from '@/pages/dashboards/VendorDashboard';
import DeliveryPartnerDashboard from '@/pages/dashboards/DeliveryPartnerDashboard';
import AdminDashboard from '@/pages/dashboards/AdminDashboard';

const ProtectedRoute = ({ children, allowedUserTypes }) => {
  const user = JSON.parse(localStorage.getItem('dabbaDelightUser'));
  if (!user || !allowedUserTypes.includes(user.userType)) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  React.useEffect(() => {
    const html = document.documentElement;
    html.style.scrollBehavior = 'smooth';
    return () => {
      html.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          <PageWrapper>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/contact" element={<ContactUsPage />} />
              <Route path="/terms" element={<TermsConditionsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              
              <Route 
                path="/dashboard/customer" 
                element={
                  <ProtectedRoute allowedUserTypes={['customer']}>
                    <CustomerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/housewife" 
                element={
                  <ProtectedRoute allowedUserTypes={['housewife']}>
                    <HousewifeDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/vendor" 
                element={
                  <ProtectedRoute allowedUserTypes={['vendor']}>
                    <VendorDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/delivery" 
                element={
                  <ProtectedRoute allowedUserTypes={['deliveryPartner']}>
                    <DeliveryPartnerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/admin" 
                element={
                  <ProtectedRoute allowedUserTypes={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="/dashboard" element={<NavigateToDashboard />} />
            </Routes>
          </PageWrapper>
        </main>
        <Footer />
        <Toaster />
      </div>
    </Router>
  );
}

const NavigateToDashboard = () => {
  const user = JSON.parse(localStorage.getItem('dabbaDelightUser'));
  if (!user) return <Navigate to="/login" replace />;

  switch (user.userType) {
    case 'customer':
      return <Navigate to="/dashboard/customer" replace />;
    case 'housewife':
      return <Navigate to="/dashboard/housewife" replace />;
    case 'vendor':
      return <Navigate to="/dashboard/vendor" replace />;
    case 'deliveryPartner':
      return <Navigate to="/dashboard/delivery" replace />;
    case 'admin':
      return <Navigate to="/dashboard/admin" replace />;
    default:
      return <Navigate to="/" replace />;
  }
};

export default App;