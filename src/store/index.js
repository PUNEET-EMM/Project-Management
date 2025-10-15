import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import usersReducer from './slices/usersSlice';
import projectsReducer from './slices/projectsSlice';
import tasksReducer from './slices/tasksSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    projects: projectsReducer,
    tasks: tasksReducer,
    ui: uiReducer,
  },
});