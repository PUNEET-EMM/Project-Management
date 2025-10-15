import { Moon, Sun, Menu, LogOut, User } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme, toggleSidebar } from '../../../store/slices/uiSlice';
import { logout } from '../../../store/slices/authSlice';

export default function Header() {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);

  const roleColors = {
    Admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'Project Manager': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    Developer: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Viewer: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
  };

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">
              ProjectHub
            </h1>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              ) : (
                <Sun className="w-5 h-5 text-slate-400" />
              )}
            </button>

            {/* User Info */}
            <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-slate-800 dark:text-white">
                    {user?.name}
                  </p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${roleColors[user?.role || 'Viewer']}`}
                  >
                    {user?.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => dispatch(logout())}
              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}