// src/Components/admin/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // --- 1. Auto-close on route change (Mobile) ---
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // --- 2. Lock body scroll when mobile menu is open ---
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  // --- 3. Menu Configuration ---
  const menuItems = [
    { 
      title: 'Dashboard', 
      path: '/admin/5173/90179bd8-8734-4f3f-aac6-b9d7825f71c9', 
      icon: LayoutDashboard 
    },
    { 
      title: 'Users', 
      path: '/admin/users/5173/90179bd8-8734-4f3f-aac6-b9d7825f71c9', 
      icon: Users 
    },
    // Add more links here...
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
  };

  // --- 4. Sidebar Content (Shared between Mobile & Desktop) ---
  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0F172A] text-white">
      {/* Header / Logo */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">Admin Panel</h2>
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">JeevanShaadi</p>
          </div>
        </div>
        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsOpen(false)} 
          className="ml-auto md:hidden text-slate-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
          Main Menu
        </p>
        
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group relative flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ease-in-out border border-transparent
                ${isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40 border-indigo-500/30'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white hover:border-slate-700/50'
                }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-5 w-5 ${isActive ? 'text-indigo-100' : 'text-slate-500 group-hover:text-indigo-400'} transition-colors duration-300`} />
                <span className="font-medium text-sm tracking-wide">{item.title}</span>
              </div>
              
              {isActive && (
                <ChevronRight className="h-4 w-4 text-indigo-200 animate-in slide-in-from-left-1 fade-in duration-300" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      {/* <div className="p-4 border-t border-slate-800/50 bg-slate-900/50">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-3 text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-300 group border border-transparent hover:border-red-500/20"
        >
          <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-sm">Sign Out</span>
        </button>
      </div> */}
    </div>
  );

  return (
    <>
      {/* --- Mobile Trigger (Hamburger) --- */}
      {/* Visible only on mobile */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-40 p-2.5 bg-white text-slate-700 rounded-xl shadow-lg md:hidden hover:bg-slate-50 active:scale-95 transition-all"
        aria-label="Open Menu"
      >
        <Menu size={24} />
      </button>

      {/* --- Mobile Backdrop --- */}
      {/* Visible only when menu is open on mobile */}
      <div 
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setIsOpen(false)}
      />

      {/* --- Sidebar Container --- */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 md:w-64 transform transition-transform duration-300 ease-out shadow-2xl md:shadow-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0
        `}
      >
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;