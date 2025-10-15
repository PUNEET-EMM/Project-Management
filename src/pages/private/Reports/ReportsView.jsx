import { useSelector } from 'react-redux';
import { getUserTasks, getUserProjects, canViewReports } from '../../../utils/permissions';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Layout from '../Layout/Layout';


export default function ReportsView() {
  const allTasks = useSelector((state) => state.tasks.tasks);
  const allProjects = useSelector((state) => state.projects.projects);
  const users = useSelector((state) => state.users.users);
  const currentUser = useSelector((state) => state.auth.user);

  if (!currentUser || !canViewReports(currentUser.role)) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-yellow-600 dark:text-yellow-400 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
            Access Restricted
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            You don't have permission to view reports
          </p>
        </div>
      </div>
    );
  }

  const userTasks = getUserTasks(currentUser, allTasks);
  const userProjects = getUserProjects(currentUser, allProjects);

  const taskStatusData = [
    { name: 'To Do', value: userTasks.filter((t) => t.status === 'To Do').length, color: '#64748b' },
    { name: 'In Progress', value: userTasks.filter((t) => t.status === 'In Progress').length, color: '#3b82f6' },
    { name: 'Review', value: userTasks.filter((t) => t.status === 'Review').length, color: '#f59e0b' },
    { name: 'Done', value: userTasks.filter((t) => t.status === 'Done').length, color: '#10b981' },
  ];

  const projectStatusData = [
    { name: 'Planning', value: userProjects.filter((p) => p.status === 'Planning').length },
    { name: 'Active', value: userProjects.filter((p) => p.status === 'Active').length },
    { name: 'On Hold', value: userProjects.filter((p) => p.status === 'On Hold').length },
    { name: 'Completed', value: userProjects.filter((p) => p.status === 'Completed').length },
  ];

  const topContributors = users
    .map((user) => ({
      name: user.name,
      completed: userTasks.filter((t) => t.assignedTo.includes(user.id) && t.status === 'Done').length,
      inProgress: userTasks.filter((t) => t.assignedTo.includes(user.id) && t.status === 'In Progress').length,
    }))
    .filter((u) => u.completed > 0 || u.inProgress > 0)
    .sort((a, b) => b.completed - a.completed)
    .slice(0, 5);

  const priorityData = [
    { name: 'Low', value: userTasks.filter((t) => t.priority === 'Low').length, color: '#64748b' },
    { name: 'Medium', value: userTasks.filter((t) => t.priority === 'Medium').length, color: '#3b82f6' },
    { name: 'High', value: userTasks.filter((t) => t.priority === 'High').length, color: '#f97316' },
    { name: 'Critical', value: userTasks.filter((t) => t.priority === 'Critical').length, color: '#ef4444' },
  ];

  const completionRate = userTasks.length > 0
    ? Math.round((userTasks.filter((t) => t.status === 'Done').length / userTasks.length) * 100)
    : 0;

  const stats = [
    {
      label: 'Total Tasks',
      value: userTasks.length,
      icon: CheckCircle,
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Completed',
      value: userTasks.filter((t) => t.status === 'Done').length,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
    },
    {
      label: 'In Progress',
      value: userTasks.filter((t) => t.status === 'In Progress').length,
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      label: 'Completion Rate',
      value: `${completionRate}%`,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <Layout>
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
          Reports & Analytics
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Track performance and insights across your projects
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 text-white`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 mb-1 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">
            Task Status Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={taskStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {taskStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">
            Task Priority Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">
            Top Contributors
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topContributors}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Legend />
              <Bar dataKey="completed" fill="#10b981" name="Completed" />
              <Bar dataKey="inProgress" fill="#3b82f6" name="In Progress" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">
            Project Status Overview
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectStatusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="value" fill="#8b5cf6" name="Projects" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
    </Layout>
  );
}