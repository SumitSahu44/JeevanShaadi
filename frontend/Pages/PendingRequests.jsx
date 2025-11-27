import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import io from 'socket.io-client';
import { setPendingRequests } from '../src/store/chatSlice';
import { ChevronLeft, User, MessageCircle, Check, X, Clock, MapPin, Globe } from 'lucide-react';

const socket = io('http://localhost:4000', { 
  auth: { token: localStorage.getItem('token') } 
});

const PendingRequests = () => {
  const { token } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    fetchRequests();

    const handleNewRequest = () => {
      toast.info('New chat request received!');
      fetchRequests();
    };

    socket.on('newRequest', handleNewRequest);
    return () => socket.off('newRequest', handleNewRequest);
  }, [token, navigate]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'}/api/chat/requests/pending`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        dispatch(setPendingRequests(res.data.data));
        setRequests(res.data.data);
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Error fetching requests';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId, action, senderId, senderName) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'}/api/chat/requests/${requestId}/action`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        if (action === 'accept') {
          toast.success(`Chat accepted with ${senderName}!`);
          if (res.data.data.chatRoomId) {
            navigate(`/chat/${res.data.data.chatRoomId}`);
          } else {
            navigate('/chat');
          }
        } else {
          toast.info(`Request from ${senderName} rejected.`);
        }
        fetchRequests();
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Error processing request';
      toast.error(errMsg);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors p-2 rounded-lg hover:bg-gray-100"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Pending Chat Requests</h1>
            <div className="w-24"></div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center justify-between">
              <p className="text-red-800 text-sm font-medium">{error}</p>
              <button onClick={fetchRequests} className="ml-4 text-red-600 hover:text-red-800 text-sm font-medium underline">
                Retry
              </button>
            </div>
          )}

          {requests.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Requests</h3>
              <p className="text-gray-500 mb-6">Check back later for new connection requests.</p>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md"
              >
                Explore Matches
              </button>
            </div>
          ) : (
            <>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-blue-800 font-medium flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  You have {requests.length} pending chat request{requests.length !== 1 ? 's' : ''}.
                </p>
              </div>

              <div className="space-y-6">
                {requests.map((req) => {
                  const sender = req.senderId || {};
                  const placeholderImage = 'https://t4.ftcdn.net/jpg/05/42/36/11/360_F_542361185_VFRJWpR2FH5OiAEVveWO7oZnfSccZfD3.jpg';
                  const timeAgo = req.createdAt ? new Date(req.createdAt).toLocaleString() : 'Just now';

                  // SAFE ACCESS: Backend uses Capitalized keys like Name, City, etc.
                  const name = sender.Name || sender.name || 'Unknown User';
                  const age = sender.age || sender.Age || 'N/A';
                  const gender = sender.gender || sender.Gender || '';
                  const city = sender.city || sender.City || 'N/A';
                  const state = sender.state || sender.State || 'N/A';
                  const religion = sender.religion || sender.Religion || '';
                  const community = sender.community || sender.Community || 'N/A';
                  const profileImage = sender.profileImage || sender.ProfileImage || placeholderImage;
                  const userId = sender.userId || sender._id || req.senderId;

                  return (
                    <div
                      key={req._id}
                      className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col lg:flex-row gap-4 p-4 lg:p-6 hover:shadow-xl transition-all duration-400 hover:-translate-y-1 relative max-w-4xl mx-auto"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Profile Photo */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={profileImage}
                          alt={name}
                          className="w-24 h-24 lg:w-28 lg:h-28 rounded-2xl object-cover shadow-lg group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => { e.target.src = placeholderImage; }}
                        />
                        <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Pending
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 relative z-10">
                        <div className="lg:col-span-2 space-y-1 mb-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg lg:text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                              {name}
                              <span className="ml-2 text-sm text-gray-500 font-normal">
                                (ID: {userId})
                              </span>
                            </h3>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <MessageCircle className="w-4 h-4 text-blue-500 fill-current" />
                              <span>Chat Request</span>
                            </div>
                          </div>
                        </div>

                        {/* Left Column */}
                        <div className="space-y-2">
                          {gender && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl text-sm text-indigo-700 font-medium border border-indigo-200">
                              <User className="w-4 h-4" />
                              {gender} • {age} yrs
                            </div>
                          )}
                          <div className="space-y-1 text-sm">
                            <p className="flex items-center gap-2 text-gray-700">
                              <MapPin className="w-4 h-4 text-gray-900 font-bold" />
                              <span className="truncate">{city}, {state}</span>
                            </p>
                            {religion && (
                              <p className="flex items-center gap-2 text-gray-700">
                                <Globe className="w-4 h-4 text-gray-900 font-bold" />
                                {religion}, {community}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-1 text-sm text-gray-700 lg:text-right">
                          <p className="flex items-start gap-2">
                            <MessageCircle className="w-4 h-4 text-gray-900 font-bold mt-0.5 flex-shrink-0" />
                            <span className="bg-gray-50 px-3 py-2 rounded-lg text-xs italic flex-1 min-w-0">
                              {req.message || 'Wants to chat with you!'}
                            </span>
                          </p>
                          <p className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {timeAgo}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col items-end gap-3 pt-2 lg:pt-0 relative z-10">
                        <button
                          onClick={() => handleAction(req._id, 'accept', sender._id || userId, name)}
                          className="w-full lg:w-auto px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Accept & Chat
                        </button>
                        <button
                          onClick={() => handleAction(req._id, 'reject', sender._id || userId, name)}
                          className="w-full lg:w-auto px-6 py-2 border-2 border-red-200 text-red-700 rounded-xl text-sm font-semibold hover:bg-red-50 hover:border-red-300 transition-all duration-300 flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default PendingRequests;