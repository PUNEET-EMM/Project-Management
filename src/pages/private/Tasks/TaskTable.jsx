import { useState } from 'react';
import { useSelector } from 'react-redux';
import { getUserTasks } from '../../../utils/permissions';
import { Calendar, User, Filter, Edit2 } from 'lucide-react';

export default function TaskTable({ onEditTask }) {
  const allTasks = useSelector((state) => state.tasks.tasks);
  const currentUser = useSelector((state) => state.auth.user);
  const users = useSelector((state) => state.users.users);
  const projects = useSelector((state) => state.projects.projects);
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  if (!currentUser) return null;

  const userTasks = getUserTasks(currentUser, allTasks);

  const filteredTasks = userTasks.filter((task) => {
    if (statusFilter !== 'All' && task.status !== statusFilter) return false;
    if (priorityFilter !== 'All' && task.priority !== priorityFilter) return false;
    return true;
  });

  const statusColors = {
    'To Do': 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
    'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    Review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    Done: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  };

  const priorityColors = {
    Low: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
    Medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    High: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    Critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  const getAssigneeNames = (assignedTo) => {
    return users
      .filter((u) => assignedTo.includes(u.id))
      .map((u) => u.name)
      .join(', ');
  };

  const getProjectName = (projectId) => {
    return projects.find((p) => p.id === projectId)?.name || 'Unknown';
  };

  return (
    <div>
      <div className="mb-4 flex gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          >
            <option value="All">All Status</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Review">Review</option>
            <option value="Done">Done</option>
          </select>
        </div>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
        >
          <option value="All">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                  Task
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                  Project
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                  Priority
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                  Assigned To
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                  Due Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredTasks.map((task) => (
                <tr
                  key={task.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-800 dark:text-white">
                        {task.title}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">
                        {task.description}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {getProjectName(task.projectId)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusColors[task.status]
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        priorityColors[task.priority]
                      }`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <User className="w-4 h-4" />
                      {getAssigneeNames(task.assignedTo)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Calendar className="w-4 h-4" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onEditTask(task)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg transition"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}