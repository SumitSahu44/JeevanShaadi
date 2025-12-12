import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Axios Instance Create karna
const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
});

const AdminLogin = () => {
    const navigate = useNavigate();
    
    // Form State
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    
    // UI States
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Type karte waqt purana error hata dein
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // 1. SPACE HATANA (TRIM) - Sabse Important Step
        const payload = {
            email: formData.email.trim(),
            password: formData.password.trim()
        };

        // Debugging ke liye: Console me check karein kya ja raha hai
        console.log("Attempting Login with:", payload);

        try {
            // 2. EXPLICIT HEADERS ADD KIYE
            const response = await api.post('/api/admin/login', payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log("Login Success:", response.data);
            
            // Token Save karein
            localStorage.setItem('adminToken', response.data.token);
            
            // Redirect
            navigate('/admin');

        } catch (err) {
            console.error("Login Error Details:", err.response);
            
            // Error Message Set karna
            const errorMessage = err.response?.data?.message || 'Server Connection Failed';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-lg rounded-lg">
                <div>
                    <h2 className="text-center text-3xl font-bold text-gray-900">
                        Admin Login
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your credentials to access the dashboard
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm">
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="admin@example.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                        ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;