// src/Components/admin/Sidebar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  LogOut,
  MessageSquare,
  BarChart3,
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { title: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { title: 'Users', path: '/admin/users', icon: Users },
    // { title: 'Inquiries', path: '/admin/inquiries', icon: MessageSquare },
    // { title: 'Statistics', path: '/admin/statistics', icon: BarChart3 },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-zinc-900 text-white flex flex-col">
      {/* Logo / Title */}
      <div className="p-5 border-b border-zinc-800">
        <h2 className="text-2xl font-bold tracking-tight">Admin Panel</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors
                ${isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-zinc-800">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-zinc-800 hover:text-red-300 rounded-lg transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;