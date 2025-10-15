import { useState } from 'react';
import { useSelector } from 'react-redux';
import { getUserTasks } from '../../../utils/permissions';
import { Calendar, User, Filter, Edit2 } from 'lucide-react';
import Select from 'react-select';

export default function TaskTable({ onEditTask }) {
  const allTasks = useSelector((state) => state.tasks.tasks);
  const currentUser = useSelector((state) => state.auth.user);
  const users = useSelector((state) => state.users.users);
  const projects = useSelector((state) => state.projects.projects);
  const [statusFilter, setStatusFilter] = useState({ value: 'All', label: 'All Status' });
  const [priorityFilter, setPriorityFilter] = useState({ value: 'All', label: 'All Priorities' });

  if (!currentUser) return null;

  const userTasks = getUserTasks(currentUser, allTasks);

  const filteredTasks = userTasks.filter((task) => {
    if (statusFilter.value !== 'All' && task.status !== statusFilter.value) return false;
    if (priorityFilter.value !== 'All' && task.priority !== priorityFilter.value) return false;
    return true;
  });

  const statusOptions = [
    { value: 'All', label: 'All Status' },
    { value: 'To Do', label: 'To Do' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Review', label: 'Review' },
    { value: 'Done', label: 'Done' },
  ];

  const priorityOptions = [
    { value: 'All', label: 'All Priorities' },
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
    { value: 'Critical', label: 'Critical' },
  ];

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
      {/* Filters */}
      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 flex-1">
          <Filter className="w-5 h-5 text-slate-600 dark:text-slate-400 flex-shrink-0" />
          <div className="flex-1 sm:flex-none sm:w-48">
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              options={statusOptions}
              classNamePrefix="custom-select"
              className="custom-select-container"
              isSearchable={false}
            />
          </div>
        </div>

        <div className="flex-1 sm:flex-none sm:w-48">
          <Select
            value={priorityFilter}
            onChange={setPriorityFilter}
            options={priorityOptions}
            classNamePrefix="custom-select"
            className="custom-select-container"
            isSearchable={false}
          />
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
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
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        statusColors[task.status]
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        priorityColors[task.priority]
                      }`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <User className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{getAssigneeNames(task.assignedTo)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      <Calendar className="w-4 h-4" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onEditTask(task)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg transition whitespace-nowrap"
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

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4"
          >
            {/* Task Title & Description */}
            <div className="mb-3">
              <h3 className="font-semibold text-slate-800 dark:text-white text-lg mb-1">
                {task.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                {task.description}
              </p>
            </div>

            {/* Project */}
            <div className="mb-3">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                Project
              </span>
              <p className="text-sm text-slate-800 dark:text-white mt-1">
                {getProjectName(task.projectId)}
              </p>
            </div>

            {/* Status & Priority */}
            <div className="flex flex-wrap gap-2 mb-3">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                  statusColors[task.status]
                }`}
              >
                {task.status}
              </span>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                  priorityColors[task.priority]
                }`}
              >
                {task.priority}
              </span>
            </div>

            {/* Assigned To */}
            <div className="mb-3">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <User className="w-4 h-4 flex-shrink-0" />
                <span className="break-words">{getAssigneeNames(task.assignedTo)}</span>
              </div>
            </div>

            {/* Due Date */}
            <div className="mb-4">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => onEditTask(task)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg transition font-medium"
            >
              <Edit2 className="w-4 h-4" />
              Edit Task
            </button>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 text-center">
          <p className="text-slate-600 dark:text-slate-400">
            No tasks found matching your filters.
          </p>
        </div>
      )}
    </div>
  );
}