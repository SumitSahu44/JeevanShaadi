import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import io from 'socket.io-client';
import { setUser } from '../src/store/userSlice';

const socket = io('https://jeevanshaadi.onrender.com', { 
  auth: { token: localStorage.getItem('token') } 
});

const Profile = () => {
  const { id } = useParams();
  const { token, user } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && !user) {
      axios.get(`https://jeevanshaadi.onrender.com/api/profile/${token.userId || user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => dispatch(setUser({ token, user: res.data }))).catch(() => {});
    }

    axios.get(`https://jeevanshaadi.onrender.com/api/profile/${id}`, { 
      headers: { Authorization: `Bearer ${token}` } 
    }).then(res => {
      if (res.data) setProfile(res.data);
      setLoading(false);
    }).catch(err => {
      toast.error('Profile not found');
      setLoading(false);
    });
  }, [id, token, user, dispatch]);

const sendRequest = async () => {
  try {
    const res = await axios.post('https://jeevanshaadi.onrender.com/api/chat/requests/send', 
      { receiverId: id }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.data.success) {
      toast.success('Chat request sent!');
      // Force socket reconnect if needed
      socket.connect();
    }
  } catch (err) {
    toast.error(err.response?.data?.message || 'Error sending request');
  }
};

  if (loading) return <div>Loading profile...</div>;
  if (!profile) return <div>Profile not found</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>{profile.name || 'User Name'}</h1>
      <img src={profile.profilePic || ''} alt="Profile" style={{ width: '200px', height: '200px', borderRadius: '50%' }} />
      <p>{profile.bio || 'Bio here'}</p>
      <button onClick={sendRequest} style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
        Send Chat Request
      </button>
      <button onClick={() => navigate('/dashboard')} style={{ padding: '10px 20px', marginLeft: '10px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '5px' }}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default Profile;