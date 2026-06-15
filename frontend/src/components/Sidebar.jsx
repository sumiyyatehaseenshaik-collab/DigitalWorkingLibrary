import React from 'react';
import { NavLink } from 'react-router-dom';
import { api } from '../services/api';
import { LayoutDashboard, BookOpen, Clock, Sparkles, User, Shield, Gem } from 'lucide-react';

const Sidebar = () => {
  const user = api.getCurrentUser();

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/books', label: 'Browse Library', icon: BookOpen },
    { to: '/borrowed', label: 'Borrowed Books', icon: Clock },
    { to: '/search', label: 'Semantic Search', icon: Sparkles },
    { to: '/profile', label: 'Personal Shelf', icon: User },
  ];

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-64 bg-[#0d0b09] border-r border-coffee-850 flex flex-col z-40 shadow-premium">
      {/* Brand Logo header */}
      <div className="h-20 border-b border-coffee-850 px-6 flex items-center gap-3">
        <div className="h-9 w-9 bg-biscuit/10 border border-biscuit/20 rounded-lg flex items-center justify-center shadow-inner">
          <Gem className="h-4.5 w-4.5 text-biscuit" />
        </div>
        <div className="flex flex-col">
          <h1 className="font-serif text-[13px] font-extrabold tracking-widest text-cream uppercase leading-none">
            Digital Working Library
          </h1>
          <span className="text-[9px] text-[#c6a67a] font-mono tracking-widest uppercase mt-1">
            DIGITAL LIBRARY
          </span>
        </div>
      </div>

      {/* Nav List links */}
      <nav className="flex-1 py-8 px-4 flex flex-col gap-2.5 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4.5 py-3.5 rounded-xl text-xs font-bold font-mono tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-biscuit text-black shadow-premium-hover scale-[1.02]'
                    : 'text-beige hover:text-cream hover:bg-coffee-900/50'
                }`
              }
            >
              <Icon className="h-4.5 w-4.5 flex-shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}

        {/* Separator for Admin Section */}
        {user?.role === 'ADMIN' && (
          <>
            <div className="h-[1px] bg-coffee-850 my-5 mx-3"></div>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4.5 py-3.5 rounded-xl text-xs font-bold font-mono tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-cream text-black shadow-premium-hover scale-[1.02]'
                    : 'text-biscuit hover:text-cream hover:bg-coffee-900/50 border border-biscuit/20'
                }`
              }
            >
              <Shield className="h-4.5 w-4.5 flex-shrink-0" />
              <span>Admin Panel</span>
            </NavLink>
          </>
        )}
      </nav>

      {/* System Footer info */}
      <div className="p-6 border-t border-coffee-850 flex flex-col gap-1">
        <span className="text-[9px] text-coffee-700 font-mono leading-none">SYS CORE v1.0.0</span>
        <span className="text-[8px] text-coffee-700 font-mono leading-none mt-1">CONNECTED ON PORT 8080</span>
      </div>
    </aside>
  );
};

export default Sidebar;
