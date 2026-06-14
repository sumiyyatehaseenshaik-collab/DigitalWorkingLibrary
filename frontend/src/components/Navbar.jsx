import React from 'react';
import { api } from '../services/api';
import { LogOut, User, Shield, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ pageTitle = "Digital Library Core" }) => {
  const navigate = useNavigate();
  const user = api.getCurrentUser();

  const handleLogout = () => {
    api.logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 right-0 left-64 h-20 bg-[#181411]/90 backdrop-blur-md border-b border-coffee-850 z-30 px-8 flex items-center justify-between shadow-premium transition-all">
      {/* Title / Section Name */}
      <div className="flex items-center gap-3">
        <BookOpen className="h-5 w-5 text-biscuit" />
        <h2 className="font-serif text-lg font-bold tracking-tight text-cream capitalize">
          {pageTitle}
        </h2>
      </div>

      {/* Action panel & profile info */}
      <div className="flex items-center gap-6">
        {/* User Card info */}
        {user && (
          <div className="flex items-center gap-3 bg-coffee-900 border border-coffee-850 px-4.5 py-2 rounded-xl">
            <div className="flex flex-col text-right">
              <span className="text-xs font-bold text-cream leading-none">{user.username}</span>
              <span className="text-[10px] text-biscuit font-mono uppercase mt-0.5 tracking-wider">
                {user.role}
              </span>
            </div>
            <div className="h-8.5 w-8.5 bg-coffee-800 border border-coffee-850 rounded-lg flex items-center justify-center relative shadow-inner">
              {user.role === 'ADMIN' ? (
                <Shield className="h-4 w-4 text-biscuit" />
              ) : (
                <User className="h-4 w-4 text-beige" />
              )}
            </div>
          </div>
        )}

        {/* Logout Toggle */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center h-10 w-10 rounded-xl bg-coffee-900 border border-coffee-850 text-[#d2a679] hover:bg-[#c6a67a] hover:text-black hover:border-[#c6a67a] active:scale-[0.96] transition-all cursor-pointer shadow-premium"
          title="Sign out of database"
        >
          <LogOut className="h-4.5 w-4.5" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
