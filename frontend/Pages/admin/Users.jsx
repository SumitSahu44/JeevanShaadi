// src/Pages/admin/Users.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { Search, Edit, Eye, Trash2, ChevronLeft, ChevronRight, User, Mail, Phone, Calendar, Award, Camera } from 'lucide-react';
import TopNav from '../../Components/admin/TopNav';
import Sidebar from '../../Components/admin/Sidebar';
import DataTable from '../../Components/admin/DataTable';
import api from '../../src/utils/api';
const Modal = ({ children, onClose, wide = false }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn" onClick={onClose}>
    <div
      className={`bg-white rounded-2xl shadow-2xl p-8 ${wide ? 'w-full max-w-5xl' : 'w-full max-w-lg'} max-h-screen overflow-y-auto transform transition-all duration-300 scale-100`}
      onClick={(e) => e.stopPropagation()}
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
      {children}
    </div>
  </div>
);

const Input = ({ label, type = 'text', value = '', onChange, icon: Icon }) => (
  <div className="relative">
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-3 h-5 w-5 text-indigo-500" />}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full pl-10 pr-4 py-3 -2 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:-indigo-500 transition-all duration-200 ${Icon ? 'pl-12' : ''}`}
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  </div>
);

const Info = ({ label, value, icon: Icon }) => (
  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
    {Icon && <Icon className="h-5 w-5 text-indigo-600" />}
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value ?? '—'}</p>
    </div>
  </div>
);

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', mobile: '' });

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);

  const columns = useMemo(() => [
    { 
      key: '_id', 
      label: 'ID', 
      render: (u) => <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{u._id.slice(-6)}</span> 
    },
    { 
      key: 'name', 
      label: 'Name', 
      render: (u) => (
        <div className="flex items-center gap-2">
          {/* <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {u.name?.[0]?.toUpperCase() || 'U'}
          </div> */}
          <span className="font-semibold text-gray-800">{u.Name || '—'}</span>
        </div>
      ) 
    },
    { key: 'email', label: 'Email', render: (u) => <span className="text-indigo-600 font-medium">{u.email}</span> },
    { key: 'phone', label: 'mobile', render: (u) => u.mobile || <span className="text-gray-400">—</span> },
    { 
      key: 'createdAt', 
      label: 'Joined', 
      render: (u) => (
        <div className="flex items-center gap-1 text-sm">
          <Calendar className="h-4 w-4 text-gray-500" />
          {new Date(u.createdAt).toLocaleDateString('en-IN')}
        </div>
      ) 
    },
    // {
    //   key: 'profile',
    //   label: 'Profile',
    //   render: (u) => {
    //     const p = u.profile || {};
    //     const filled = [p.education, p.occupation, p.annualIncome, p.aboutMe, p.photos?.length > 0].filter(Boolean).length;
    //     const percentage = (filled / 5) * 100;
    //     return (
    //       <div className="space-y-1">
    //         <div className="flex items-center justify-between text-xs">
    //           <span className="font-medium">{filled}/5 Complete</span>
    //           <span className="text-gray-500">{percentage}%</span>
    //         </div>
    //         <div className="w-full bg-gray-200 rounded-full h-2">
    //           <div 
    //             className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500"
    //             style={{ width: `${percentage}%` }}
    //           />
    //         </div>
    //         <div className="flex items-center gap-1 text-xs text-gray-500">
    //           <Camera className="h-3 w-3" />
    //           {p.photos?.length || 0} photos
    //         </div>
    //       </div>
    //     );
    //   },
    // },
    {
      key: 'actions',
      label: 'Actions',
      render: (user) => (
        <div className="flex gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); handleView(user); }} 
            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition transform hover:scale-110"
            title="View Profile"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); handleEdit(user); }} 
            className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition transform hover:scale-110"
            title="Edit User"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); handleDelete(user); }} 
            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition transform hover:scale-110"
            title="Delete User"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ], []);

  useEffect(() => {
    fetchUsers();
  }, [page, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await api.get(`/admin/users?${params}`);
      console.log(response.data);
      setUsers(response.data.users || []);
      setTotalPages(response.data.totalPages || 1);
      setError(null);
    } catch (error) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditForm({ name: user.name || '', email: user.email || '', mobile: user.mobile || '' });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    try {
      await api.patch(`/admin/users/${editingUser._id}`, editForm);
      setIsEditModalOpen(false);
      fetchUsers();
      alert('User updated successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete "${user.name || user.email}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/users/${user._id}`);
      fetchUsers();
      alert('User deleted successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Delete failed');
    }
  };

  const handleView = (user) => {
    setViewingUser(user);
    setIsViewModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <Sidebar />
      {/* <TopNav /> */}
      
      <main className="ml-64 pt-5 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Users Management</h1>
          <p className="text-gray-600">Manage and monitor all registered users</p>
        </div>

        {/* Search & Stats Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                className="w-full pl-12 pr-4 py-3 -2 -gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:-indigo-500 transition-all duration-300"
              />
            </div>
            <div className="flex gap-3">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-3 rounded-xl font-semibold shadow-md">
                Total Users: {users.length}
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 -l-4 -red-500 rounded-r-xl text-red-700 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <DataTable columns={columns} data={users} loading={loading} />
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center items-center gap-3">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))} 
            disabled={page === 1 || loading} 
            className="p-3 bg-white -2 -gray-200 rounded-xl hover:bg-indigo-50 hover:-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
          >
            <ChevronLeft className="h-5 w-5" />
            Previous
          </button>
          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i+1}
                onClick={() => setPage(i+1)}
                className={`w-10 h-10 rounded-xl font-semibold transition-all ${
                  page === i+1 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {i+1}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
            disabled={page === totalPages || loading} 
            className="p-3 bg-white -2 -gray-200 rounded-xl hover:bg-indigo-50 hover:-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
          >
            Next
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </main>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <Modal onClose={() => setIsEditModalOpen(false)}>
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Edit className="h-6 w-6 text-indigo-600" />
            Edit User
          </h3>
          <div className="space-y-5">
            <Input label="Name" icon={User} value={editForm.name} onChange={(v) => setEditForm({ ...editForm, name: v })} />
            <Input label="Email" type="email" icon={Mail} value={editForm.email} onChange={(v) => setEditForm({ ...editForm, email: v })} />
         <Input 
  label="Phone" 
  icon={Phone}   // Fixed: was mobile
  value={editForm.mobile} 
  onChange={(v) => setEditForm({ ...editForm, mobile: v })}
/> </div>
          <div className="mt-8 flex justify-end gap-3">
            <button onClick={() => setIsEditModalOpen(false)} className="px-6 py-3 -2 -gray-300 rounded-xl hover:bg-gray-50 transition">
              Cancel
            </button>
            <button onClick={handleSaveEdit} className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition">
              Save Changes
            </button>
          </div>
        </Modal>
      )}

      {/* View Modal */}
      {isViewModalOpen && viewingUser && (
        <Modal onClose={() => setIsViewModalOpen(false)} wide>
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full text-white text-2xl font-bold shadow-lg">
              {viewingUser.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mt-3">{viewingUser.name || viewingUser.email}</h3>
            <p className="text-gray-500">User Profile Details</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-indigo-600" />
                Basic Information
              </h4>
              <div className="space-y-3">
                <Info label="Email" value={viewingUser.email} icon={Mail} />
 <Info label="phone" value={viewingUser.mobile} icon={Phone} />
                <Info label="Member Since" value={new Date(viewingUser.createdAt).toLocaleDateString('en-IN')} icon={Calendar} />
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-indigo-600" />
                Profile Completion
              </h4>
              {viewingUser.profile ? (
                <div className="space-y-3">
                  <Info label="Education" value={viewingUser.highestQualification || '—'} />
                  <Info label="Occupation" value={viewingUser.workDetails || '—'} />
                  <Info label="Annual Income" value={viewingUser.income ? `₹${viewingUser.income}` : '—'} />
                  <Info label="About Me" value={viewingUser.aboutYourself || '—'} />
                  {/* <Info label="Hobbies" value={viewingUser.profile.hobbies?.join(', ') || '—'} /> */}
                  {/* <Info label="Photos" value={`${viewingUser.photos?.length || 0} uploaded`} icon={Camera} /> */}
                </div>
              ) : (
                <p className="text-gray-500 italic p-4 bg-gray-50 rounded-xl">No profile data available</p>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Users;