import { useSelector } from 'react-redux';
import { getUserTasks, getUserProjects } from '../../utils/permissions';
import { FolderKanban, CheckSquare, Users, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import Layout from './Layout/Layout';

export default function Main() {
  const allTasks = useSelector((state) => state.tasks.tasks);
  const allProjects = useSelector((state) => state.projects.projects);
  const users = useSelector((state) => state.users.users);
  const currentUser = useSelector((state) => state.auth.user);

  if (!currentUser) return null;

  const userTasks = getUserTasks(currentUser, allTasks);
  const userProjects = getUserProjects(currentUser, allProjects);

  const myTasks = userTasks.filter((t) => t.assignedTo.includes(currentUser.id));
  const overdueTasks = myTasks.filter((t) => new Date(t.dueDate) < new Date() && t.status !== 'Done');
  const upcomingTasks = [...myTasks]
    .filter((t) => {
      const dueDate = new Date(t.dueDate);
      const today = new Date();
      const weekFromNow = new Date();
      weekFromNow.setDate(today.getDate() + 7);
      return dueDate >= today && dueDate <= weekFromNow && t.status !== 'Done';
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const recentProjects = [...userProjects]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const stats = [
    {
      label: 'My Tasks',
      value: myTasks.length,
      subtext: `${myTasks.filter((t) => t.status === 'Done').length} completed`,
      icon: CheckSquare,
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: 'My Projects',
      value: userProjects.length,
      subtext: `${userProjects.filter((p) => p.status === 'Active').length} active`,
      icon: FolderKanban,
      color: 'from-green-500 to-green-600',
    },
    {
      label: 'Team Members',
      value: users.length,
      subtext: 'across all roles',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
    },
    {
      label: 'Completion Rate',
      value: myTasks.length > 0
        ? `${Math.round((myTasks.filter((t) => t.status === 'Done').length / myTasks.length) * 100)}%`
        : '0%',
      subtext: 'personal progress',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
    },
  ];

  const statusColors = {
    'To Do': 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
    'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    Review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    Done: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  };

  const projectStatusColors = {
    Planning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    Active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'On Hold': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    Completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  };

  const priorityColors = {
    Low: 'text-slate-600 dark:text-slate-400',
    Medium: 'text-blue-600 dark:text-blue-400',
    High: 'text-orange-600 dark:text-orange-400',
    Critical: 'text-red-600 dark:text-red-400',
  };

  return (
    <Layout>
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
          Welcome back, {currentUser.name.split(' ')[0]}!
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Here's what's happening with your projects today
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-white/80 text-sm mb-1">{stat.label}</p>
                  <p className="text-4xl font-bold">{stat.value}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <p className="text-white/70 text-sm">{stat.subtext}</p>
            </div>
          );
        })}
      </div>

      {overdueTasks.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            <h2 className="text-xl font-semibold text-red-900 dark:text-red-100">
              Overdue Tasks ({overdueTasks.length})
            </h2>
          </div>
          <div className="space-y-2">
            {overdueTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg"
              >
                <div>
                  <p className="font-medium text-slate-800 dark:text-white">{task.title}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
              Upcoming Tasks
            </h2>
          </div>
          {upcomingTasks.length > 0 ? (
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-slate-800 dark:text-white">
                      {task.title}
                    </h3>
                    <span className={`text-xs font-medium ${priorityColors[task.priority]}`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 line-clamp-1">
                    {task.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
                      {task.status}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-500">
                      Due {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 dark:text-slate-500">
              No upcoming tasks this week
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <FolderKanban className="w-6 h-6 text-green-600 dark:text-green-400" />
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
              Recent Projects
            </h2>
          </div>
          {recentProjects.length > 0 ? (
            <div className="space-y-3">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-slate-800 dark:text-white">
                      {project.name}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${projectStatusColors[project.status]}`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-500">
                    <span>{project.members.length} members</span>
                    <span>Due {new Date(project.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 dark:text-slate-500">
              No projects available
            </div>
          )}
        </div>
      </div>
    </div>
    </Layout>
  );
}