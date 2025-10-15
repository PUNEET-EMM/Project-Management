import { LayoutDashboard, FolderKanban, CheckSquare, Users, BarChart3, Shield } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { canManageRoles, canViewReports } from '../../../utils/permissions';

export default function Sidebar() {
  const { sidebarOpen } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: LayoutDashboard, show: true },
    { id: 'project', label: 'Projects', icon: FolderKanban, show: true },
    { id: 'tasksview', label: 'Tasks', icon: CheckSquare, show: true },
    { id: 'teams', label: 'Teams', icon: Users, show: true },
    { id: 'reports', label: 'Reports', icon: BarChart3, show: user ? canViewReports(user.role) : false },
    { id: 'role-management', label: 'Role Management', icon: Shield, show: user ? canManageRoles(user.role) : false },
  ];

  const handleNavigate = (path) => {
    navigate(`/dashboard/${path}`);
  };

  const getCurrentPage = () => {
    const pathParts = location.pathname.split('/');
    // Get the part after 'dashboard'
    return pathParts[2] || 'main';
  };

  if (!sidebarOpen) return null;

  return (
    <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex-shrink-0">
      <nav className="p-4 space-y-1">
        {menuItems
          .filter((item) => item.show)
          .map((item) => {
            const Icon = item.icon;
            const isActive = getCurrentPage() === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
      </nav>
    </aside>
  );
}