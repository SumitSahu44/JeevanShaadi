import { createSlice, createAction } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: { 
    rooms: [], 
    pendingRequests: [], 
    currentRoom: null, 
    messages: [] 
  },
  reducers: {
    setPendingRequests: (state, action) => { 
      state.pendingRequests = action.payload; 
    },
    setRooms: (state, action) => { 
      state.rooms = action.payload; 
    },
    setMessages: (state, action) => { 
      state.messages = action.payload; 
    },
    addMessage: (state, action) => { 
      state.messages.push(action.payload); 
    },
    clearMessages: (state) => { 
      state.messages = []; 
    },
    removeMessage: (state, action) => { 
      state.messages = state.messages.filter(m => m._id !== action.payload); 
    },
    updateMessage: (state, action) => { 
      state.messages = state.messages.map(m => 
        m._id === action.payload._id ? action.payload : m
      ); 
    }
  }
});

export const { 
  setPendingRequests, 
  setRooms, 
  setMessages, 
  addMessage, 
  clearMessages, 
  removeMessage, 
  updateMessage 
} = chatSlice.actions;

export default chatSlice.reducer;