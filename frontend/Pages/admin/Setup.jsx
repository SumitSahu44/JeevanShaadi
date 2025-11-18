import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL
});

const AdminSetup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        secretKey: ''
    });

    // Check if admin already exists
    useEffect(() => {
        const checkAdminExists = async () => {
            try {
                const response = await api.get('/admin/admins');
                if (response.data.data.length > 0) {
                    navigate('/admin/login');
                }
            } catch (error) {
                if (error.response?.status !== 403) {
                    setError('Error checking admin status');
                }
            } finally {
                setLoading(false);
            }
        };

        checkAdminExists();
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await api.post('/admin/setup', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                secretKey: formData.secretKey
            });

            if (response.data.token) {
                localStorage.setItem('adminToken', response.data.token);
                navigate('/admin');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating admin account');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="text-xl">Loading...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
                <div>
                    <h2 className="text-center text-3xl font-bold text-gray-900">
                        First Admin Setup
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Create the first admin account for your application
                    </p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
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
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                value={formData.password}
                                onChange={handleChange}
                                minLength={8}
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                minLength={8}
                            />
                        </div>

                        <div>
                            <label htmlFor="secretKey" className="block text-sm font-medium text-gray-700">
                                Setup Key
                            </label>
                            <input
                                id="secretKey"
                                name="secretKey"
                                type="password"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                value={formData.secretKey}
                                onChange={handleChange}
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Enter the admin setup key provided in your environment variables
                            </p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Create Admin Account
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminSetup;