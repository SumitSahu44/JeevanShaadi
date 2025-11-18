import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
    const isAuthenticated = !!localStorage.getItem('adminToken');
    
    return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default AdminRoute;