import { createSlice } from '@reduxjs/toolkit';
import { mockTasks } from '../../data/data';

const loadTasksFromStorage = () => {
  try {
    const stored = localStorage.getItem('tasks');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load tasks from storage:', error);
  }
  return mockTasks;
};

const initialState = {
  tasks: loadTasksFromStorage(),
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload);
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = { ...action.payload, updatedAt: new Date().toISOString() };
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    },
    updateTaskStatus: (state, action) => {
      const { taskId, status } = action.payload;
      const task = state.tasks.find((t) => t.id === taskId);
      if (task) {
        task.status = status;
        task.updatedAt = new Date().toISOString();
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
  },
});

export const { addTask, updateTask, deleteTask, updateTaskStatus } = tasksSlice.actions;
export default tasksSlice.reducer;
