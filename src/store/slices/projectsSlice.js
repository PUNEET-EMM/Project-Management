import { createSlice } from '@reduxjs/toolkit';
import { mockProjects } from '../../data/data';

const loadProjectsFromStorage = () => {
  try {
    const stored = localStorage.getItem('projects');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load projects from storage:', error);
  }
  return mockProjects;
};

const initialState = {
  projects: loadProjectsFromStorage(),
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    addProject: (state, action) => {
      state.projects.push(action.payload);
      localStorage.setItem('projects', JSON.stringify(state.projects));
    },
    updateProject: (state, action) => {
      const index = state.projects.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = action.payload;
        localStorage.setItem('projects', JSON.stringify(state.projects));
      }
    },
    deleteProject: (state, action) => {
      state.projects = state.projects.filter((p) => p.id !== action.payload);
      localStorage.setItem('projects', JSON.stringify(state.projects));
    },
  },
});

export const { addProject, updateProject, deleteProject } = projectsSlice.actions;
export default projectsSlice.reducer;
