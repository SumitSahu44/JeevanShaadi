import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TopNav from '../../Components/admin/TopNav';
import Sidebar from '../../Components/admin/Sidebar';
import DataTable from '../../Components/admin/DataTable';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL
});

const Inquiries = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const columns = [
        { key: '_id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'message', label: 'Message' },
        { 
            key: 'status',
            label: 'Status',
            render: (inquiry) => (
                <span className={`px-2 py-1 rounded text-sm ${
                    inquiry.status === 'resolved' 
                        ? 'bg-green-100 text-green-800'
                        : inquiry.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                }`}>
                    {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                </span>
            )
        },
        { 
            key: 'createdAt', 
            label: 'Created At',
            render: (inquiry) => new Date(inquiry.createdAt).toLocaleDateString()
        }
    ];

    useEffect(() => {
        fetchInquiries();
    }, [page]);

    const fetchInquiries = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/api/admin/inquiries?page=${page}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            
            if (response.data.status === 'success') {
                setInquiries(response.data.inquiries || []);
                setTotalPages(response.data.totalPages || 1);
                setError(null);
            } else {
                setError('Failed to fetch inquiries');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Error fetching inquiries');
            console.error('Error fetching inquiries:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (inquiry) => {
        const newStatus = inquiry.status === 'pending' ? 'resolved' : 'pending';
        try {
            await api.patch(
                `/api/admin/inquiries/${inquiry._id}/status`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('adminToken')}`
                    }
                }
            );
            fetchInquiries();
        } catch (error) {
            console.error('Error updating inquiry status:', error);
            alert(error.response?.data?.message || 'Failed to update inquiry status');
        }
    };

    const handleDelete = async (inquiry) => {
        if (window.confirm('Are you sure you want to delete this inquiry?')) {
            try {
                await api.delete(`/api/admin/inquiries/${inquiry._id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('adminToken')}`
                    }
                });
                fetchInquiries();
            } catch (error) {
                console.error('Error deleting inquiry:', error);
                alert(error.response?.data?.message || 'Failed to delete inquiry');
            }
        }
    };

    const actions = [
        {
            label: 'Toggle Status',
            onClick: handleStatusChange,
            className: (inquiry) => 
                `px-3 py-1 rounded ${
                    inquiry.status === 'resolved'
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`,
            text: (inquiry) => inquiry.status === 'resolved' ? 'Mark Pending' : 'Resolve'
        },
        {
            label: 'Delete',
            onClick: handleDelete,
            className: 'px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200',
            text: 'Delete'
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Sidebar />
                <TopNav />
                <main className="ml-64 pt-16 p-6">
                    <div className="flex items-center justify-center h-64">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Sidebar />
            <TopNav />
            <main className="ml-64 pt-16 p-6">
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-900">Inquiries</h1>
                </div>

                {error && (
                    <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                <div className="bg-white rounded-lg shadow">
                    <DataTable
                        columns={columns}
                        data={inquiries}
                        onPageChange={setPage}
                        currentPage={page}
                        totalPages={totalPages}
                        actions={actions}
                    />
                </div>
            </main>
        </div>
    );
};

export default Inquiries;