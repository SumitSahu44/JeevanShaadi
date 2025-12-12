import React, { useEffect, useState } from 'react';
import { 
  Users, Calendar, Clock, MapPin, 
  BarChart3, ArrowUpRight, Sparkles 
} from 'lucide-react';
import { 
  LineChart as RechartsLine, Line, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart 
} from 'recharts';
import Sidebar from '../../Components/admin/Sidebar';
import api from '../../src/utils/api'; 

// --- Custom Chart Tooltip for Premium Look ---
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white p-3 rounded-lg shadow-xl text-xs">
        <p className="font-semibold mb-1">{label}</p>
        <p className="text-indigo-300">
          Count: <span className="text-white font-bold">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [ageData, setAgeData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulating API call for UI testing - Replace with your actual API calls
        const [statsRes, usersRes, cityRes, ageRes] = await Promise.all([
          api.get('/admin/dashboard/stats'),
          api.get('/admin/users?limit=5'),
          api.get('/admin/dashboard/city-distribution'),
          api.get('/admin/dashboard/age-distribution')
        ]);

        setStats(statsRes.data.stats);
        setRecentUsers(usersRes.data.users || []);
        
        setCityData(cityRes.data.cities?.slice(0, 5).map(c => ({
          name: c.city,
          count: c.count
        })) || []);

        setAgeData(ageRes.data.ages || []);
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar />
        <main className="flex-1 ml-64 flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center">
            <div className="absolute animate-ping h-8 w-8 rounded-full bg-indigo-400 opacity-75"></div>
            <div className="relative inline-flex rounded-full h-8 w-8 bg-indigo-600"></div>
          </div>
          <p className="mt-4 text-slate-500 font-medium tracking-wide text-sm">PREPARING INSIGHTS...</p>
        </main>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar />
        <main className="flex-1 ml-64 p-10 flex items-center justify-center">
          <div className="bg-white border border-red-100 shadow-sm rounded-2xl p-8 text-center max-w-md">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 size={20} />
            </div>
            <h3 className="text-gray-900 font-bold text-lg mb-2">Something went wrong</h3>
            <p className="text-gray-500 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition"
            >
              Reload Page
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      
      <main className="ml-64 p-8 lg:p-10">
        
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-slate-500 mt-2 flex items-center gap-2 text-sm font-medium">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Welcome back, here's what's happening today.
            </p>
          </div>
          {/* <div className="text-right hidden md:block">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Last Updated</p>
            <p className="text-slate-700 font-medium">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div> */}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Card 1: Total Profiles */}
          <div className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Profiles</p>
                <h3 className="text-3xl font-bold text-slate-900">{stats?.totalProfiles?.toLocaleString() || 0}</h3>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                <Users size={22} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                <ArrowUpRight size={12} /> +2.4%
              </span>
              <span className="text-slate-400 text-xs">from last month</span>
            </div>
          </div>

          {/* Card 2: Active Users (Placeholder or Real) */}
          {/* <div className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Active Users</p>
                <h3 className="text-3xl font-bold text-slate-900">{stats?.activeUsers?.toLocaleString() || 0}</h3>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                <Clock size={22} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                <ArrowUpRight size={12} /> +12%
              </span>
              <span className="text-slate-400 text-xs">engagement rate</span>
            </div>
          </div> */}

          {/* Card 3: Avg Age */}
          <div className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Avg. Age</p>
                <h3 className="text-3xl font-bold text-slate-900">{stats?.avgAge || 0} <span className="text-lg text-slate-400 font-medium">yrs</span></h3>
              </div>
              <div className="p-3 bg-violet-50 text-violet-600 rounded-xl group-hover:bg-violet-600 group-hover:text-white transition-colors duration-300">
                <Calendar size={22} />
              </div>
            </div>
            <div className="mt-4 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-violet-500 h-full rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          
          {/* City Chart */}
          <div className="bg-white p-6 lg:p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-slate-900">Demographics</h3>
              <select className="text-xs font-medium text-slate-500 bg-slate-50 border-none rounded-lg py-1 px-3 outline-none cursor-pointer hover:bg-slate-100 transition">
                <option>By City</option>
              </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cityData} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748B', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748B', fontSize: 12 }} 
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                  <Bar 
                    dataKey="count" 
                    fill="#6366F1" 
                    radius={[6, 6, 6, 6]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Age Chart */}
          <div className="bg-white p-6 lg:p-8 rounded-3xl shadow-sm border border-slate-100">
             <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-slate-900">Age Distribution</h3>
              <div className="flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-violet-500"></span>
                 <span className="text-xs text-slate-500 font-medium">Active Profiles</span>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ageData}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis 
                    dataKey="range" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748B', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748B', fontSize: 12 }} 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#8B5CF6" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorCount)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Profiles List */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">Recent Registrations</h3>
            <button className="text-sm text-indigo-600 font-semibold hover:text-indigo-800 transition">View All</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="p-5 font-semibold">User Profile</th>
                  <th className="p-5 font-semibold">Location</th>
                  <th className="p-5 font-semibold">Age</th>
                  <th className="p-5 font-semibold">Joined</th>
                  <th className="p-5 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentUsers.length > 0 ? (
                  recentUsers.map((user) => {
                    const age = calculateAge(user.dob);
                    return (
                      <tr key={user._id} className="hover:bg-slate-50/80 transition-colors duration-200 group">
                        <td className="p-5">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-sm font-bold shadow-md shadow-indigo-200">
                              {user.Name?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800 text-sm">{user.Name || '—'}</p>
                              <p className="text-xs text-slate-500 font-medium">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-5">
                          <div className="flex items-center gap-2 text-slate-600 text-sm">
                            <MapPin size={14} className="text-slate-400" />
                            {user.city}, {user.state}
                          </div>
                        </td>
                        <td className="p-5">
                          <span className="text-sm text-slate-700 font-medium bg-slate-100 px-2 py-1 rounded-md">
                            {age} yrs
                          </span>
                        </td>
                        <td className="p-5 text-sm text-slate-500">
                          {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                        </td>
                        <td className="p-5 text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                            {user.profileFor || 'Self'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-400 text-sm">
                      No recent profiles found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;