
import React, { useEffect, useState } from 'react';
import { 
  Users, Calendar, Clock, MapPin, Heart, Briefcase, 
  GraduationCap, IndianRupee, Activity, BarChart3 
} from 'lucide-react';
import { LineChart as RechartsLine, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import TopNav from '../../Components/admin/TopNav';
import Sidebar from '../../Components/admin/Sidebar';
import api from '../../src/utils/api'; // आपका path

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
        const [statsRes, usersRes, cityRes, ageRes] = await Promise.all([
          api.get('/admin/dashboard/stats'),
          api.get('/admin/users?limit=5'),
          api.get('/admin/dashboard/city-distribution'),
          api.get('/admin/dashboard/age-distribution')
        ]);

        setStats(statsRes.data.stats);
        setRecentUsers(usersRes.data.users || []);

        // City Distribution (Top 5)
        setCityData(cityRes.data.cities?.slice(0, 5).map(c => ({
          name: c.city,
          count: c.count
        })) || []);

        // Age Groups
        setAgeData(ageRes.data.ages || []);
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const calculateAge = (dob) => {
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
        <Sidebar />
        {/* <TopNav /> */}
        <main className="ml-64 pt-5 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
            <p className="ml-4 text-xl text-gray-600">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
        <Sidebar />
        {/* <TopNav /> */}
        <main className="ml-64 pt-5 p-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <Sidebar />
      {/* <TopNav /> */}

      <main className="ml-64 pt-5 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <BarChart3 className="h-10 w-10 text-indigo-600" />
            JeevanShaadi Admin 
          </h1>
          <p className="text-gray-600">Real-time insights from your matrimony platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">Total Profiles</p>
                <p className="text-3xl font-bold text-indigo-600 mt-1">{stats?.totalProfiles || 0}</p>
              </div>
              <Users className="h-8 w-8 text-indigo-600" />
            </div>
          </div>

          {/* <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">Active Users</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats?.activeUsers || 0}</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </div> */}

          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">Avg. Age</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{stats?.avgAge || 0}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </div>

        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* City Distribution */}
          <div className="bg-white p-6 rounded-2xl shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-indigo-600" />
              Top 5 Cities
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={cityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Age Distribution */}
          <div className="bg-white p-6 rounded-2xl shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-600" />
              Age Groups
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <RechartsLine data={ageData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6' }} />
              </RechartsLine>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-600" />
            Recent Profiles
          </h3>
          <div className="space-y-4">
            {recentUsers.length > 0 ? (
              recentUsers.map((user) => {
                const age = calculateAge(user.dob);
                return (
                  <div key={user._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {user.Name?.[0] || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{user.Name || '—'}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex gap-3 text-xs text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {user.city}, {user.state}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {age} yrs
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-gray-600">{new Date(user.createdAt).toLocaleDateString('en-IN')}</p>
                      <p className="text-xs text-indigo-600 font-medium">{user.profileFor}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500 py-8">No recent users</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;