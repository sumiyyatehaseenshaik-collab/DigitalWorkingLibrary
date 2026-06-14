import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { api } from './services/api';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BooksPage from './pages/BooksPage';
import BookDetailsPage from './pages/BookDetailsPage';
import BorrowedBooksPage from './pages/BorrowedBooksPage';
import ProfilePage from './pages/ProfilePage';
import AdminPanelPage from './pages/AdminPanelPage';

const AppLayout = ({ children }) => {
  const location = useLocation();
  const user = api.getCurrentUser();

  // Determine navbar page titles dynamically
  const getPageTitle = (pathname) => {
    if (pathname.startsWith('/dashboard')) return 'Vault Core Command';
    if (pathname.startsWith('/books/')) return 'Volume Specifications';
    if (pathname.startsWith('/books')) return 'Library Archives Catalogue';
    if (pathname.startsWith('/borrowed')) return 'Active Leased Shelf';
    
    if (pathname.startsWith('/profile')) return 'Personal Reading Timeline';
    if (pathname.startsWith('/admin')) return 'Administrative Command Core';
    return 'Digital Library Node';
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage || !user) {
    return <div className="min-h-screen bg-coffee-950 text-cream">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-coffee-950 text-cream flex">
      {/* Fixed Left luxury sidebar nav */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        {/* Fixed Top headers */}
        <Navbar pageTitle={getPageTitle(location.pathname)} />

        {/* Dynamic Inner page views */}
        <main className="flex-grow pt-28 pb-12 px-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

const App = () => {
  const [authState, setAuthState] = useState(Date.now());

  useEffect(() => {
    const handleAuthChange = () => {
      setAuthState(Date.now());
    };
    window.addEventListener('auth-change', handleAuthChange);
    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  return (
    <Router key={authState}>
      <AppLayout>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Secure Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/books" 
            element={
              <ProtectedRoute>
                <BooksPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/books/:id" 
            element={
              <ProtectedRoute>
                <BookDetailsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/borrowed" 
            element={
              <ProtectedRoute>
                <BorrowedBooksPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Panel Protect */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminPanelPage />
              </ProtectedRoute>
            } 
          />

          {/* Route fallback redirects */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AppLayout>
    </Router>
  );
};

export default App;
