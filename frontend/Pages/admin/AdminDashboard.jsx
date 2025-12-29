import React, { useEffect, useState } from 'react';
import { 
  Users, Calendar, Clock, MapPin, 
  BarChart3, ArrowUpRight, Sparkles, Menu, X 
} from 'lucide-react';
import { 
  LineChart as RechartsLine, Line, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart 
} from 'recharts';
import Sidebar from '../../Components/admin/Sidebar'; // Ensure this path is correct
import api from '../../src/utils/api'; 

// --- Custom Chart Tooltip ---
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white p-3 rounded-lg shadow-xl text-xs z-50">
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
  
  // Mobile Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Replace these with your actual endpoints
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row relative">
      
      {/* --- Mobile Sidebar Overlay --- */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- Sidebar (Responsive) --- */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:shadow-none lg:static lg:block ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full overflow-y-auto">
             {/* Pass a prop to Sidebar if it needs to close on link click */}
            <Sidebar onClose={() => setIsSidebarOpen(false)} /> 
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 w-full min-h-screen transition-all duration-300">
        
        {/* Mobile Header (Hamburger) */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Admin Panel</h1>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Content Container */}
        <div className="p-4 md:p-8 lg:p-10 max-w-[1600px] mx-auto">
          
          {loading ? (
            <div className="h-[80vh] flex flex-col items-center justify-center">
              <div className="relative flex items-center justify-center">
                <div className="absolute animate-ping h-8 w-8 rounded-full bg-indigo-400 opacity-75"></div>
                <div className="relative inline-flex rounded-full h-8 w-8 bg-indigo-600"></div>
              </div>
              <p className="mt-4 text-slate-500 font-medium tracking-wide text-sm">PREPARING INSIGHTS...</p>
            </div>
          ) : error ? (
            <div className="h-[80vh] flex items-center justify-center">
              <div className="bg-white border border-red-100 shadow-sm rounded-2xl p-8 text-center max-w-md mx-4">
                <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 size={20} />
                </div>
                <h3 className="text-gray-900 font-bold text-lg mb-2">Something went wrong</h3>
                <p className="text-gray-500 mb-6 text-sm">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-6 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition"
                >
                  Reload Page
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Dashboard Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                    Dashboard
                  </h1>
                  <p className="text-slate-500 mt-2 flex items-center gap-2 text-sm font-medium">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Welcome back, here's what's happening today.
                  </p>
                </div>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
                {/* Card 1 */}
                <div className="group bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Profiles</p>
                      <h3 className="text-2xl md:text-3xl font-bold text-slate-900">{stats?.totalProfiles?.toLocaleString() || 0}</h3>
                    </div>
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                      <Users size={20} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                      <ArrowUpRight size={12} /> +2.4%
                    </span>
                    <span className="text-slate-400 text-xs">from last month</span>
                  </div>
                </div>

                {/* Card 2 (Avg Age) */}
                <div className="group bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Avg. Age</p>
                      <h3 className="text-2xl md:text-3xl font-bold text-slate-900">{stats?.avgAge || 0} <span className="text-lg text-slate-400 font-medium">yrs</span></h3>
                    </div>
                    <div className="p-3 bg-violet-50 text-violet-600 rounded-xl group-hover:bg-violet-600 group-hover:text-white transition-colors duration-300">
                      <Calendar size={20} />
                    </div>
                  </div>
                  <div className="mt-4 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-violet-500 h-full rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>

                {/* Card 3 (Placeholder for layout balance) */}
                 <div className="group bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 sm:col-span-2 lg:col-span-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Active Now</p>
                      <h3 className="text-2xl md:text-3xl font-bold text-slate-900">124</h3>
                    </div>
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                      <Clock size={20} />
                    </div>
                  </div>
                   <div className="mt-4 flex items-center gap-2">
                    <div className="flex -space-x-2">
                       {[1,2,3,4].map(i => (
                         <div key={i} className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white"></div>
                       ))}
                    </div>
                    <span className="text-slate-400 text-xs ml-2">users online</span>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8">
                
                {/* City Chart */}
                <div className="bg-white p-5 md:p-8 rounded-3xl shadow-sm border border-slate-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
                    <h3 className="text-lg font-bold text-slate-900">Demographics</h3>
                    <select className="text-xs font-medium text-slate-500 bg-slate-50 border-none rounded-lg py-1 px-3 outline-none cursor-pointer hover:bg-slate-100 transition w-full sm:w-auto">
                      <option>By City</option>
                    </select>
                  </div>
                  <div className="h-[250px] md:h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={cityData} barSize={40} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#64748B', fontSize: 11 }} 
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#64748B', fontSize: 11 }} 
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
                <div className="bg-white p-5 md:p-8 rounded-3xl shadow-sm border border-slate-100">
                   <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-900">Age Distribution</h3>
                    <div className="flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-violet-500"></span>
                       <span className="text-xs text-slate-500 font-medium">Active</span>
                    </div>
                  </div>
                  <div className="h-[250px] md:h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={ageData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
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
                          tick={{ fill: '#64748B', fontSize: 11 }} 
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#64748B', fontSize: 11 }} 
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
                
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-slate-50/50 text-slate-400 text-xs uppercase tracking-wider">
                        <th className="p-4 md:p-5 font-semibold">User Profile</th>
                        <th className="p-4 md:p-5 font-semibold">Location</th>
                        <th className="p-4 md:p-5 font-semibold">Age</th>
                        <th className="p-4 md:p-5 font-semibold">Joined</th>
                        <th className="p-4 md:p-5 font-semibold text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {recentUsers.length > 0 ? (
                        recentUsers.map((user) => {
                          const age = calculateAge(user.dob);
                          return (
                            <tr key={user._id} className="hover:bg-slate-50/80 transition-colors duration-200 group">
                              <td className="p-4 md:p-5">
                                <div className="flex items-center gap-3 md:gap-4">
                                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-sm font-bold shadow-md shadow-indigo-200 flex-shrink-0">
                                    {user.Name?.[0]?.toUpperCase() || 'U'}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-semibold text-slate-800 text-sm truncate">{user.Name || '—'}</p>
                                    <p className="text-xs text-slate-500 font-medium truncate max-w-[120px] md:max-w-none">{user.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 md:p-5">
                                <div className="flex items-center gap-2 text-slate-600 text-sm">
                                  <MapPin size={14} className="text-slate-400 flex-shrink-0" />
                                  <span className="truncate max-w-[100px] md:max-w-none">{user.city}, {user.state}</span>
                                </div>
                              </td>
                              <td className="p-4 md:p-5">
                                <span className="text-sm text-slate-700 font-medium bg-slate-100 px-2 py-1 rounded-md whitespace-nowrap">
                                  {age} yrs
                                </span>
                              </td>
                              <td className="p-4 md:p-5 text-sm text-slate-500 whitespace-nowrap">
                                {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                              </td>
                              <td className="p-4 md:p-5 text-right">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 whitespace-nowrap">
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
                      
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;