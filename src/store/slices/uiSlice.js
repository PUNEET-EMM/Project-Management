import { createSlice } from '@reduxjs/toolkit';

const loadUIFromStorage = () => {
  try {
    const stored = localStorage.getItem('ui');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load UI from storage:', error);
  }
  return { theme: 'light', sidebarOpen: true, currentView: 'kanban' };
};

const initialState = loadUIFromStorage();

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('ui', JSON.stringify(state));
      document.documentElement.classList.toggle('dark');
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
      localStorage.setItem('ui', JSON.stringify(state));
    },
    setView: (state, action) => {
      state.currentView = action.payload;
      localStorage.setItem('ui', JSON.stringify(state));
    },
  },
});

export const { toggleTheme, toggleSidebar, setView } = uiSlice.actions;
export default uiSlice.reducer;
