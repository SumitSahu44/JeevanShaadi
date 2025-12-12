import { useState, useEffect, useRef, useLayoutEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import io from 'socket.io-client';
import { setRooms, setMessages, addMessage, clearMessages, removeMessage, updateMessage } from '../src/store/chatSlice';
import { SendHorizontal, Search, MoreVertical, ArrowLeft, Edit2, Trash2, Check, X, ChevronDown, Menu } from 'lucide-react';

const socket = io('http://localhost:4000', {
  auth: { token: localStorage.getItem('token') }
});

const Chat = () => {
  const { roomId } = useParams();
  const { token, user } = useSelector(state => state.user);
  const { rooms, messages } = useSelector(state => state.chat);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [myTyping, setMyTyping] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [showSidebar, setShowSidebar] = useState(true);
  const [showDropdown, setShowDropdown] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const currentRoom = useMemo(() => rooms.find(r => r._id.toString() === roomId), [rooms, roomId]);

  const getProfilePic = (participant) => {
    return participant?.profileImage || 'https://via.placeholder.com/40x40?text=PP';
  };

  const otherParticipant = useMemo(() =>
    currentRoom?.participants?.find(p => p?._id?.toString() !== user?.id?.toString()),
    [currentRoom, user]
  );

  const otherProfilePic = useMemo(() => getProfilePic(otherParticipant), [otherParticipant]);

  const userNameMap = useMemo(() => {
    const map = new Map();
    rooms.forEach(room => {
      room.participants?.forEach(participant => {
        if (participant?._id && (participant.Name || participant.name)) {
          map.set(participant._id.toString(), participant.Name || participant.name);
        }
      });
    });
    if (user?.id && (user.Name || user.name)) {
      map.set(user.id.toString(), user.Name || user.name);
    }
    return map;
  }, [rooms, user]);

  const getNameWithFallback = (senderId) => {
    if (!senderId?._id) return 'Unknown';
    const idStr = senderId._id.toString();
    const mappedName = userNameMap.get(idStr);
    if (mappedName) {
      return idStr === user?.id?.toString() ? 'You' : mappedName;
    }
    return senderId.Name || senderId.name || 'Unknown';
  };

  const handleNewMessage = useCallback((msg) => {
    console.log('Received message in room', msg.roomId, 'from', msg.senderId?._id, 'content:', msg.content); // Debug log added
    if (msg.senderId && !msg.senderId.Name && !msg.senderId.name) {
      const fallbackName = getNameWithFallback(msg.senderId);
      if (fallbackName !== 'Unknown') {
        msg.senderId.Name = fallbackName;
      }
    }
    dispatch(addMessage(msg));
    // Update the corresponding room's lastMessage and updatedAt
    dispatch(setRooms(rooms.map(r =>
      r._id.toString() === msg.roomId ? { ...r, lastMessage: msg, updatedAt: new Date(msg.createdAt) } : r
    )));
  }, [dispatch, getNameWithFallback, rooms]);

  const handleTyping = useCallback(({ isTyping, roomId: msgRoomId }) => {
    console.log('Typing event:', isTyping, 'in room', msgRoomId); // Debug log added
    if (msgRoomId === roomId) {
      setTyping(isTyping);
    }
  }, [roomId]);

  const handleRequestAccepted = useCallback(({ roomId: newRoom, senderId }) => {
    fetchRooms();
    if (!roomId && newRoom) navigate(`/chat/${newRoom}`);
  }, [roomId, navigate]);

  const handleMessageDeleted = useCallback((deletedMsgId) => {
    dispatch(removeMessage(deletedMsgId));
  }, [dispatch]);

  const handleMessageUpdated = useCallback((updatedMsg) => {
    if (updatedMsg.senderId && !updatedMsg.senderId.Name && !updatedMsg.senderId.name) {
      const fallbackName = getNameWithFallback(updatedMsg.senderId);
      if (fallbackName !== 'Unknown') {
        updatedMsg.senderId.Name = fallbackName;
      }
    }
    dispatch(updateMessage(updatedMsg));
  }, [dispatch, getNameWithFallback]);

  const handleUserOnline = useCallback((userId) => {
    setOnlineUsers(prev => new Set([...prev, userId]));
  }, []);

  const handleUserOffline = useCallback((userId) => {
    setOnlineUsers(prev => {
      const newSet = new Set(prev);
      newSet.delete(userId);
      return newSet;
    });
  }, []);

  const handleOnlineUsers = useCallback((users) => {
    setOnlineUsers(new Set(users));
  }, []);

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);

  useLayoutEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (roomId && isMobile) {
      setShowSidebar(false);
    }
  }, [roomId, isMobile]);

  // Socket reconnect helper
  const reconnectSocket = useCallback(() => {
    const newToken = localStorage.getItem('token');
    if (newToken && socket.auth.token !== newToken) {
      console.log('Reconnecting socket with new token'); // Debug log
      socket.auth = { token: newToken };
      socket.connect();
    }
  }, []);

  useEffect(() => {
    if (token && user?.id) {
      fetchRooms();
      reconnectSocket(); // Reconnect if token changed
    }
    socket.on('newMessage', handleNewMessage);
    socket.on('typing', handleTyping);
    socket.on('requestAccepted', handleRequestAccepted);
    socket.on('messageDeleted', handleMessageDeleted);
    socket.on('messageUpdated', handleMessageUpdated);
    socket.on('userOnline', handleUserOnline);
    socket.on('userOffline', handleUserOffline);
    socket.on('onlineUsers', handleOnlineUsers);
    socket.on('connect', () => console.log('Socket connected/reconnected')); // Debug log
    socket.on('disconnect', () => console.log('Socket disconnected')); // Debug log
    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('typing', handleTyping);
      socket.off('requestAccepted', handleRequestAccepted);
      socket.off('messageDeleted', handleMessageDeleted);
      socket.off('messageUpdated', handleMessageUpdated);
      socket.off('userOnline', handleUserOnline);
      socket.off('userOffline', handleUserOffline);
      socket.off('onlineUsers', handleOnlineUsers);
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [socket, roomId, navigate, user, handleNewMessage, handleTyping, handleRequestAccepted, handleMessageDeleted, handleMessageUpdated, handleUserOnline, handleUserOffline, handleOnlineUsers, token, reconnectSocket]);

  useEffect(() => {
    if (roomId) {
      setRoom(roomId);
      setEditingMessageId(null);
      setTyping(false);
      setMyTyping(false);
      if (isMobile) {
        setShowSidebar(false);
      }
    } else {
      dispatch(clearMessages());
      setTyping(false);
      setMyTyping(false);
      setShowSidebar(true);
    }
  }, [roomId, dispatch, isMobile]);

  const fetchRooms = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/chat/rooms',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) dispatch(setRooms(res.data.data));
    } catch (err) {
      console.error('Error fetching rooms:', err);
      // toast.error('Error fetching chats');
    }
  }, [token, user?.id, dispatch]);
  

  const setRoom = useCallback(async (id) => {
    console.log('Joining room:', id, 'User:', user?.id); // Debug log added
    socket.emit('joinRoom', id);
    try {
      const res = await axios.get(`http://localhost:4000/api/chat/rooms/${id}/messages`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        const messagesData = res.data.data;
        dispatch(setMessages(messagesData));
        // Update the room's lastMessage and updatedAt if there are messages
        if (messagesData.length > 0) {
          const lastMsg = messagesData[messagesData.length - 1];
          dispatch(setRooms(rooms.map(r =>
            r._id.toString() === id ? { ...r, lastMessage: lastMsg, updatedAt: new Date(lastMsg.createdAt) } : r
          )));
        }
      }
    } catch (err) {
      console.error('Error loading messages:', err);
      toast.error('Error loading messages');
    }
  }, [socket, token, dispatch, rooms, user]);

  const sendMessage = useCallback(() => {
    if (!input.trim() || !roomId) return;
    if (editingMessageId) {
      socket.emit('updateMessage', { roomId, messageId: editingMessageId, content: input });
      setEditingMessageId(null);
    } else {
      socket.emit('sendMessage', { roomId, content: input });
    }
    setInput('');
    if (myTyping) {
      setMyTyping(false);
      socket.emit('typing', { roomId, isTyping: false });
    }
    setTimeout(scrollToBottom, 100);
  }, [input, roomId, editingMessageId, myTyping, socket, scrollToBottom]);

  const startEdit = useCallback((msgId, currentContent) => {
    setEditingMessageId(msgId);
    setEditedContent(currentContent);
    setInput(currentContent);
    setShowDropdown(null);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingMessageId(null);
    setInput('');
    if (myTyping) {
      setMyTyping(false);
      socket.emit('typing', { roomId, isTyping: false });
    }
  }, [myTyping, roomId, socket]);

  // Updated deleteMessage to trigger confirmation modal
  const deleteMessage = useCallback((msgId) => {
    setMessageToDelete(msgId);
    setShowDeleteConfirm(true);
  }, []);

  // New function to confirm and perform deletion
  const confirmDeleteMessage = useCallback(async () => {
    if (!messageToDelete || !roomId) return;
    try {
      await axios.delete(`http://localhost:4000/api/chat/rooms/${roomId}/messages/${messageToDelete}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      socket.emit('deleteMessage', { roomId, messageId: messageToDelete });
      toast.success('Message deleted');
      setShowDeleteConfirm(false);
      setMessageToDelete(null);
      setShowDropdown(null);
    } catch (err) {
      console.error('Error deleting message:', err);
      toast.error('Error deleting message');
      setShowDeleteConfirm(false);
      setMessageToDelete(null);
    }
  }, [messageToDelete, roomId, token, socket]);

  // New function to cancel deletion
  const cancelDeleteMessage = useCallback(() => {
    setShowDeleteConfirm(false);
    setMessageToDelete(null);
  }, []);

  const handleInput = useCallback((e) => {
    const newValue = e.target.value;
    setInput(newValue);
    if (!roomId) return;
    const isTypingNow = !!newValue.trim();
    if (isTypingNow !== myTyping) {
      setMyTyping(isTypingNow);
      socket.emit('typing', { roomId, isTyping: isTypingNow });
    }
  }, [roomId, myTyping, socket]);

  const otherUser = useCallback((room) => {
    if (!user?.id || !room.participants || room.participants.length < 2) {
      return 'Unknown User';
    }
    const userIdStr = user.id.toString();
    const participant = room.participants.find(p => p && p._id && p._id.toString() !== userIdStr);
    return participant?.Name || participant?.name || 'Unknown User';
  }, [user]);

  const getSenderName = useCallback((senderId) => {
    if (!user || !senderId) {
      return 'Unknown';
    }
    const senderIdStr = senderId._id ? senderId._id.toString() : null;
    const userIdStr = user.id ? user.id.toString() : null;
    const fallbackName = getNameWithFallback(senderId);
    if (senderIdStr === userIdStr) return 'You';
    return fallbackName;
  }, [user, getNameWithFallback]);

  const isOwnMessage = useCallback((msg) => {
    const senderIdStr = msg.senderId?._id ? msg.senderId._id.toString() : null;
    const userIdStr = user?.id ? user.id.toString() : null;
    return senderIdStr === userIdStr;
  }, [user]);

  const isUserOnline = useCallback((userId) => {
    return onlineUsers.has(userId?.toString());
  }, [onlineUsers]);

  const getLastSeen = useCallback((participant) => {
    if (!participant?.lastTime) return 'last seen recently';
    const lastSeenDate = new Date(participant.lastSeen);
    const now = new Date();
    const diffMs = now - lastSeenDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return 'last seen just now';
    if (diffMins < 60) return `last seen ${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `last seen ${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'last seen yesterday';
    if (diffDays < 7) return `last seen ${diffDays} days ago`;
    return `last seen ${lastSeenDate.toLocaleDateString()}`;
  }, []);

  const formatMessageTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="flex h-[90vh] bg-[#f0f2f5] overflow-hidden relative">
      {/* Sidebar */}
      <div className={`
        fixed md:static left-0 top-0 z-50 md:z-auto
        h-[90vh] flex flex-col bg-white border-r border-gray-200 overflow-hidden shadow-lg md:shadow-none
        w-80 md:w-[350px] lg:w-[400px] xl:w-[450px]
        transition-transform duration-300 ease-in-out
        ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:block
      `}>
        {/* Header */}
        <div className="bg-white px-4 py-4 flex items-center justify-between border-b border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <h2 className="text-gray-800 text-lg font-semibold">Messages</h2>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-indigo-600 hover:text-indigo-700 transition-colors text-sm font-medium"
          >
            Dashboard
          </button>
        </div>
      
        {/* Quick Actions */}
        <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
          <Link
            to="/pending-requests"
            className="block w-full px-3 py-2.5 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors text-sm font-medium bg-white shadow-sm"
          >
            Pending Requests
          </Link>
        </div>
        {/* Chats List */}
        <div className="flex-1 overflow-y-auto">
          {rooms.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="text-indigo-500" size={24} />
              </div>
              <p className="text-gray-600 text-sm font-medium">No conversations yet</p>
            </div>
          ) : (
            <div>
              {rooms.map(room => {
                const otherParticipant = room.participants.find(p => p._id.toString() !== user?.id?.toString());
                const lastMessageContent = room.lastMessage ? (room.lastMessage.content.length > 30 ? room.lastMessage.content.substring(0, 30) + '...' : room.lastMessage.content) : 'Tap to open chat';
                const lastTime = room.lastMessage ? formatMessageTime(room.lastMessage.createdAt) : '';
                const isActive = room._id.toString() === roomId;
                const otherUserId = otherParticipant?._id?.toString();
                const isOnline = isUserOnline(otherUserId);
                return (
                  <div
                    key={room._id}
                    onClick={() => {
                      navigate(`/chat/${room._id}`);
                      if (isMobile) setShowSidebar(false);
                    }}
                    className={`flex items-center px-4 py-3.5 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                      isActive ? 'bg-indigo-50 border-l-2 border-indigo-500' : ''
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                        {otherUser(room).charAt(0).toUpperCase()}
                      </div>
                      {isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>}
                    </div>
                    <div className="flex-1 min-w-0 ml-4 border-b border-transparent pb-3.5">
                      <div className="flex justify-between items-baseline">
                        <h4 className="font-semibold text-gray-900 text-sm truncate">{otherUser(room)}</h4>
                        <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{lastTime}</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-1 line-clamp-1">{lastMessageContent}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {/* Mobile Backdrop */}
      {isMobile && showSidebar && roomId && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}
      {/* Chat Window */}
      <div className={`${!showSidebar || roomId ? 'flex' : 'hidden'} md:flex flex-1 flex-col bg-[#efeae2] transition-all duration-300`}>
        {roomId ? (
          <>
            {/* Header */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                  onClick={() => {
                    navigate('/chat');
                    setShowSidebar(true);
                  }}
                  className="md:hidden p-2.5 hover:bg-gray-100 rounded-full transition-colors -ml-1"
                >
                  <ArrowLeft size={20} className="text-gray-600" />
                </button>
                {currentRoom && (
                  <>
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold shadow-sm">
                        {otherUser(currentRoom).charAt(0).toUpperCase()}
                      </div>
                      {isUserOnline(otherParticipant?._id?.toString()) && (
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 ml-3">
                      <h4 className="font-semibold text-gray-900 text-base truncate">{otherUser(currentRoom)}</h4>
                      {typing ? (
                        <p className="text-xs text-indigo-600 font-medium">typing...</p>
                      ) : isUserOnline(otherParticipant?._id?.toString()) ? (
                        <p className="text-xs text-green-600 font-medium">online</p>
                      ) : (
                        <p className="text-xs text-gray-500">{getLastSeen(otherParticipant)}</p>
                      )}
                    </div>
                  </>
                )}
              </div>
              {roomId && (
                <button
                  className="md:hidden p-2.5 hover:bg-gray-100 rounded-full transition-colors"
                  onClick={() => setShowSidebar(!showSidebar)}
                >
                  <Menu size={20} className="text-gray-600" />
                </button>
              )}
            </div>
            {/* Messages Area */}
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
            >
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg border">
                      <SendHorizontal size={28} className="text-gray-400" />
                    </div>
                    <p className="text-gray-600 text-sm font-medium">No messages yet</p>
                    <p className="text-gray-500 text-xs mt-1">Send a message to start the conversation</p>
                  </div>
                </div>
              ) : (
                messages.map(msg => {
                  if (!msg.senderId) {
                    return (
                      <div key={msg._id} className="flex justify-start mb-1">
                        <div className="max-w-[85%] sm:max-w-[75%] md:max-w-[65%] bg-white shadow-sm rounded-xl rounded-tr-lg px-4 py-3 border border-gray-100">
                          <p className="text-sm text-gray-800 break-words">{msg.content}</p>
                          <div className="text-xs text-gray-400 mt-2 text-right">
                            {formatMessageTime(msg.createdAt)}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  const isOwn = isOwnMessage(msg);
                  return (
                    <div key={msg._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-1 group`}>
                      <div className={`relative max-w-[85%] sm:max-w-[75%] md:max-w-[65%] px-4 py-2 rounded-xl shadow-lg transition-all ${
                        isOwn
                          ? 'bg-indigo-500 rounded-bl-lg text-white'
                          : 'bg-white rounded-tr-lg border border-gray-100'
                      }`}>
                        {editingMessageId === msg._id ? (
                          <div className="space-y-2">
                            <input
                              value={input}
                              onChange={(e) => setInput(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                              autoFocus
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={sendMessage}
                                className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1 shadow-sm"
                              >
                                <Check size={14} />
                                Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-300 transition-colors flex items-center justify-center gap-1"
                              >
                                <X size={14} />
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className={`text-sm break-words ${isOwn ? 'text-white' : 'text-gray-800'}`}>{msg.content}</p>
                            <div className="flex items-center justify-between gap-1 mt-2">
                              <span className={`text-xs flex-1 ${isOwn ? 'text-indigo-100' : 'text-gray-400'}`}>
                                {formatMessageTime(msg.createdAt)}
                              </span>
                              {isOwn && (
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => startEdit(msg._id, msg.content)}
                                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                                    title="Edit"
                                  >
                                    <Edit2 size={12} className="text-indigo-100" />
                                  </button>
                                  <button
                                    onClick={() => deleteMessage(msg._id)}
                                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 size={12} className="text-red-300" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
            {/* Input Area */}
            <div className="bg-white px-4 py-3 border-t border-gray-200 shadow-sm">
              {editingMessageId && (
                <div className="px-3 py-2 mb-3 bg-indigo-50 rounded-lg flex items-center justify-between border border-indigo-200">
                  <div className="flex items-center gap-2 text-indigo-700">
                    <Edit2 size={16} />
                    <span className="text-sm font-medium">Editing message</span>
                  </div>
                  <button onClick={cancelEdit} className="text-indigo-600 hover:text-indigo-800 p-1">
                    <X size={18} />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <input
                    value={input}
                    onChange={handleInput}
                    onKeyPress={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    placeholder="Type a message"
                    className="w-full px-4 py-3 bg-gray-50 text-gray-800 rounded-full focus:outline-none text-sm placeholder-gray-500 border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm transition-colors"
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="p-3 bg-indigo-600 hover:bg-indigo-700 rounded-full transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                >
                  <SendHorizontal size={20} className="text-white" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md px-4">
              <div className="w-48 h-48 sm:w-64 sm:h-64 mx-auto mb-8 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-blue-50 to-transparent rounded-full"></div>
                <div className="absolute inset-8 bg-white rounded-full flex items-center justify-center shadow-xl border border-gray-200">
                  <SendHorizontal size={80} className="text-gray-400" />
                </div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-light text-gray-800 mb-3">Welcome to Messages</h3>
              <p className="text-gray-600 text-base leading-relaxed mb-6">
                Send and receive messages with your contacts.
              </p>
              <div className="space-y-2 text-gray-500 text-sm">
                <p>Select a chat to start messaging</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <div className="text-center mb-4">
              <Trash2 size={48} className="text-red-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Message?</h3>
              <p className="text-sm text-gray-600">This action cannot be undone. Are you sure you want to delete this message?</p>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDeleteMessage}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteMessage}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;