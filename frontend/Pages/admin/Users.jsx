// src/Pages/admin/Users.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { 
  Search, Edit, Eye, Trash2, User, Mail, Phone, 
  Calendar, Award, X, MapPin, Briefcase 
} from 'lucide-react';
import Sidebar from '../../Components/admin/Sidebar';
import DataTable from '../../Components/admin/DataTable';
import api from '../../src/utils/api';

// --- Premium Modal Component (Responsive) ---
const Modal = ({ children, onClose, title, wide = false }) => (
  <div 
    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 transition-all animate-in fade-in duration-200"
    onClick={onClose}
  >
    <div
      className={`bg-white rounded-2xl shadow-2xl w-full ${wide ? 'max-w-4xl' : 'max-w-lg'} max-h-[85vh] flex flex-col transform transition-all scale-100`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Modal Header */}
      <div className="flex items-center justify-between px-5 py-4 md:px-6 md:py-5 border-b border-slate-100 bg-slate-50/80 rounded-t-2xl sticky top-0 z-10 backdrop-blur-md">
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        <button 
          onClick={onClose} 
          className="p-2 bg-white border border-slate-200 text-slate-400 rounded-full hover:bg-slate-50 hover:text-slate-600 transition shadow-sm active:scale-95"
        >
          <X size={18} />
        </button>
      </div>
      
      {/* Modal Body (Scrollable) */}
      <div className="p-5 md:p-8 overflow-y-auto custom-scrollbar">
        {children}
      </div>
    </div>
  </div>
);

// --- Form Components ---
const Input = ({ label, type = 'text', value = '', onChange, icon: Icon, placeholder }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide ml-1">{label}</label>
    <div className="relative group">
      {Icon && <Icon className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm text-slate-800 font-medium placeholder:text-slate-400`}
        placeholder={placeholder}
      />
    </div>
  </div>
);

const InfoCard = ({ label, value, icon: Icon, subValue }) => (
  <div className="flex items-start gap-3 p-3 md:p-4 bg-slate-50 border border-slate-100 rounded-xl hover:border-indigo-100 transition-colors group">
    <div className="mt-1 p-2 bg-white rounded-lg border border-slate-100 shadow-sm text-indigo-600 group-hover:text-indigo-700 group-hover:shadow-md transition-all">
      {Icon ? <Icon size={18} /> : <div className="w-[18px] h-[18px]" />}
    </div>
    <div className="flex-1 min-w-0"> {/* min-w-0 ensures text truncation works if needed */}
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-slate-900 break-words">{value || '—'}</p>
      {subValue && <p className="text-xs text-slate-500 mt-1">{subValue}</p>}
    </div>
  </div>
);

const Users = () => {
  // State
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0); 
  const [pageSize] = useState(10);
  
  // Search State
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', mobile: '' });

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);

  // --- API Fetch ---
  const fetchUsers = async (pageNum = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: pageSize.toString(),
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await api.get(`/admin/users?${params}`);
      
      setUsers(response.data.users || []);
      setTotalPages(response.data.totalPages || 1);
      setTotalUsers(response.data.totalUsers || 0); 
      setPage(pageNum);
      setError(null);
    } catch (error) {
      console.error(error);
      setError('Failed to load users data.');
    } finally {
      setLoading(false);
    }
  };

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(1); 
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Initial Load
  useEffect(() => {
    if(!searchTerm) fetchUsers(page);
  }, [page]); 


  // --- Actions ---
  const handleEdit = (user) => {
    setEditingUser(user);
    setEditForm({ name: user.Name || '', email: user.email || '', mobile: user.mobile || '' });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    try {
      await api.patch(`/admin/users/${editingUser._id}`, editForm);
      setIsEditModalOpen(false);
      fetchUsers(page);
    } catch (error) {
      alert(error.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete "${user.Name || user.email}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/users/${user._id}`);
      fetchUsers(page);
    } catch (error) {
      alert(error.response?.data?.message || 'Delete failed');
    }
  };

  const handleView = (user) => {
    setViewingUser(user);
    setIsViewModalOpen(true);
  };

  // --- Table Configuration ---
  const columns = useMemo(() => [
    { 
      key: 'name', 
      label: 'User Profile', 
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm border border-slate-200 shadow-sm shrink-0">
            {u.Name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <div className="font-semibold text-slate-800 text-sm">{u.Name || 'Unknown'}</div>
            <div className="text-xs text-slate-500 font-mono">ID: {u._id.slice(-6)}</div>
          </div>
        </div>
      ) 
    },
    { 
      key: 'contact', 
      label: 'Contact Info', 
      render: (u) => (
        <div className="flex flex-col gap-1">
          <span className="text-sm text-slate-600 flex items-center gap-1.5 font-medium break-all">
            <Mail size={13} className="text-slate-400 shrink-0" /> {u.email}
          </span>
          <span className="text-xs text-slate-500 flex items-center gap-1.5">
            <Phone size={13} className="text-slate-400 shrink-0" /> {u.mobile || '—'}
          </span>
        </div>
      ) 
    },
    { 
      key: 'createdAt', 
      label: 'Joined Date', 
      render: (u) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 text-xs font-semibold border border-slate-200 whitespace-nowrap">
          <Calendar size={12} className="text-slate-400" />
          {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      ) 
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (user) => (
        <div className="flex justify-end items-center gap-2">
          {/* View Button */}
          <button 
            onClick={(e) => { e.stopPropagation(); handleView(user); }} 
            className="group flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-lg transition-all hover:bg-indigo-600 hover:text-white hover:border-indigo-600 shadow-sm"
          >
            <Eye size={14} className="text-indigo-600 group-hover:text-white transition-colors" />
            <span className="hidden lg:inline">View</span>
          </button>
          
          {/* Delete Button */}
          <button 
            onClick={(e) => { e.stopPropagation(); handleDelete(user); }} 
            className="group flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 rounded-lg transition-all hover:bg-rose-600 hover:text-white hover:border-rose-600 shadow-sm"
          >
            <Trash2 size={14} className="text-rose-600 group-hover:text-white transition-colors" />
            <span className="hidden lg:inline">Delete</span>
          </button>
        </div>
      ),
    },
  ], []);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      
      {/* Responsive Main Container 
        - ml-0 on mobile (full width)
        - md:ml-64 on desktop (push right for sidebar)
        - pt-20 on mobile (clearance for mobile header/hamburger)
        - md:pt-8 on desktop (standard spacing)
      */}
      <main className="ml-0 md:ml-64 pt-20 md:pt-8 p-4 md:p-10 transition-all duration-300">
        
        {/* Page Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 mt-1.5 text-sm">Monitor, update and manage registered user profiles.</p>
        </div>

        {/* Controls Bar (Responsive: Stack on mobile, Row on desktop) */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all shadow-sm"
            />
          </div>
          
          <div className="flex items-center justify-between sm:justify-end gap-2">
             <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-semibold border border-indigo-100 shadow-sm w-full sm:w-auto text-center">
                Total Users: <span className="text-indigo-900">{totalUsers}</span>
             </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-2 animate-in fade-in">
             <span className="w-2 h-2 bg-red-500 rounded-full shrink-0"></span>
             {error}
          </div>
        )}

        {/* Data Table */}
        <DataTable 
          columns={columns} 
          data={users} 
          loading={loading}
          pagination={{
            currentPage: page,
            totalPages: totalPages,
            totalItems: totalUsers,
            itemsPerPage: pageSize
          }}
          onPageChange={(newPage) => fetchUsers(newPage)}
        />
      </main>

      {/* --- Edit Modal --- */}
      {isEditModalOpen && (
        <Modal title="Edit User Details" onClose={() => setIsEditModalOpen(false)}>
          <div className="space-y-5">
            <Input label="Full Name" icon={User} value={editForm.name} onChange={(v) => setEditForm({ ...editForm, name: v })} placeholder="John Doe" />
            <Input label="Email Address" type="email" icon={Mail} value={editForm.email} onChange={(v) => setEditForm({ ...editForm, email: v })} placeholder="john@example.com" />
            <Input label="Phone Number" icon={Phone} value={editForm.mobile} onChange={(v) => setEditForm({ ...editForm, mobile: v })} placeholder="+91 98765 43210" />
            
            <div className="pt-4 flex justify-end gap-3">
              <button onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 text-slate-600 text-sm font-medium hover:bg-slate-50 rounded-xl transition">
                Cancel
              </button>
              <button onClick={handleSaveEdit} className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-200 transition">
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* --- View Modal (Responsive Grid) --- */}
      {isViewModalOpen && viewingUser && (
        <Modal title="User Profile" onClose={() => setIsViewModalOpen(false)} wide>
          <div className="flex flex-col md:flex-row gap-8">
            
            {/* Sidebar / Profile Header */}
            {/* Stack on mobile, Sidebar on desktop */}
            <div className="md:w-1/3 flex flex-col items-center text-center border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-6">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-2xl md:text-3xl font-bold mb-4 shadow-inner border border-indigo-100">
                 {viewingUser.Name?.[0]?.toUpperCase() || 'U'}
              </div>
              <h4 className="text-xl font-bold text-slate-900">{viewingUser.Name || 'Unknown User'}</h4>
              <span className="inline-flex mt-2 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-100">
                Active Account
              </span>
              <p className="text-sm text-slate-500 mt-4 px-2 leading-relaxed italic">
                {viewingUser.aboutYourself ? `"${viewingUser.aboutYourself}"` : "No bio available."}
              </p>
            </div>

            {/* Main Info Grid */}
            <div className="md:w-2/3 space-y-6">
              <div>
                <h5 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <User size={16} className="text-indigo-500" /> Personal Details
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                   <InfoCard label="Email" value={viewingUser.email} icon={Mail} />
                   <InfoCard label="Phone" value={viewingUser.mobile} icon={Phone} />
                   <InfoCard label="Joined" value={new Date(viewingUser.createdAt).toLocaleDateString()} icon={Calendar} />
                   <InfoCard label="City" value={viewingUser.city} subValue={viewingUser.state} icon={MapPin} />
                </div>
              </div>

              {viewingUser.profileFor && (
                <div>
                  <h5 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2 mt-6">
                    <Briefcase size={16} className="text-indigo-500" /> Professional & Other
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                     <InfoCard label="Education" value={viewingUser.highestQualification} icon={Award} />
                     <InfoCard label="Work" value={viewingUser.workDetails} icon={Briefcase} />
                     <InfoCard label="Income" value={viewingUser.income ? `₹${viewingUser.income}` : null} />
                     <InfoCard label="Profile For" value={viewingUser.profileFor} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Users;