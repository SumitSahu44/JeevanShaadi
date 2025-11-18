import { Routes, Route } from 'react-router-dom';
import AdminRoute from './Components/admin/AdminRoute';
import AdminLogin from './Pages/admin/Login';
import AdminDashboard from './Pages/admin/Dashboard';
import AdminUsers from './Pages/admin/Users';

// Add these to your existing routes
<Route path="/admin">
    <Route path="login" element={<AdminLogin />} />
    <Route element={<AdminRoute />}>
        <Route path="" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
    </Route>
</Route>