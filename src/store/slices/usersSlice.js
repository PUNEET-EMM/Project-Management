import { createSlice } from '@reduxjs/toolkit';
import { mockUsers } from '../../data/data';

const loadUsersFromStorage = () => {
  try {
    const stored = localStorage.getItem('users');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load users from storage:', error);
  }
  return mockUsers;
};

const initialState = {
  users: loadUsersFromStorage(),
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    updateUserRole: (state, action) => {
      const { userId, role } = action.payload;
      const user = state.users.find((u) => u.id === userId);
      if (user) {
        user.role = role;
        localStorage.setItem('users', JSON.stringify(state.users));
      }
    },
    addUser: (state, action) => {
      state.users.push(action.payload);
      localStorage.setItem('users', JSON.stringify(state.users));
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex((u) => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
        localStorage.setItem('users', JSON.stringify(state.users));
      }
    },
  },
});

export const { updateUserRole, addUser, updateUser } = usersSlice.actions;
export default usersSlice.reducer;
