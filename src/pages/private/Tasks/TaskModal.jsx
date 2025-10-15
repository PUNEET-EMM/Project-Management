import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { X } from 'lucide-react';
import { getUserProjects } from '../../../utils/permissions';

export default function TaskModal({ task, onClose, onSave, onDelete }) {
  const users = useSelector((state) => state.users.users);
  const allProjects = useSelector((state) => state.projects.projects);
  const currentUser = useSelector((state) => state.auth.user);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Medium',
    projectId: '',
    assignedTo: [],
    dueDate: '',
  });

  const userProjects = currentUser ? getUserProjects(currentUser, allProjects) : [];

  useEffect(() => {
    if (task) {
      setFormData(task);
    } else if (userProjects.length > 0) {
      setFormData((prev) => ({ ...prev, projectId: userProjects[0].id }));
    }
  }, [task, userProjects.length]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const taskData = {
      id: task?.id || Date.now().toString(),
      title: formData.title || '',
      description: formData.description || '',
      status: formData.status,
      priority: formData.priority,
      projectId: formData.projectId || '',
      assignedTo: formData.assignedTo || [],
      dueDate: formData.dueDate || '',
      createdBy: task?.createdBy || currentUser.id,
      createdAt: task?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(taskData);
  };

  const handleAssigneeToggle = (userId) => {
    const assignedTo = formData.assignedTo || [];
    if (assignedTo.includes(userId)) {
      setFormData({ ...formData, assignedTo: assignedTo.filter((id) => id !== userId) });
    } else {
      setFormData({ ...formData, assignedTo: [...assignedTo, userId] });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            {task ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Task Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Description
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Project
            </label>
            <select
              required
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            >
              <option value="">Select Project</option>
              {userProjects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Due Date
            </label>
            <input
              type="date"
              required
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Assign To
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border border-slate-300 dark:border-slate-600 rounded-lg">
              {users.map((user) => (
                <label
                  key={user.id}
                  className="flex items-center gap-2 p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.assignedTo?.includes(user.id)}
                    onChange={() => handleAssigneeToggle(user.id)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-slate-800 dark:text-white">{user.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              {task ? 'Update Task' : 'Create Task'}
            </button>
            {task && onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this task?')) {
                    onDelete(task.id);
                  }
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}