import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { X } from 'lucide-react';
import Select from 'react-select';
import { getUserProjects } from '../../../utils/permissions';

export default function TaskModal({ task, onClose, onSave, onDelete }) {
  const users = useSelector((state) => state.users.users);
  const allProjects = useSelector((state) => state.projects.projects);
  const currentUser = useSelector((state) => state.auth.user);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: { value: 'To Do', label: 'To Do' },
    priority: { value: 'Medium', label: 'Medium' },
    projectId: null,
    assignedTo: [],
    dueDate: '',
  });

  const userProjects = currentUser ? getUserProjects(currentUser, allProjects) : [];

  // Convert projects to options format
  const projectOptions = userProjects.map((project) => ({
    value: project.id,
    label: project.name,
  }));

  const statusOptions = [
    { value: 'To Do', label: 'To Do' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Review', label: 'Review' },
    { value: 'Done', label: 'Done' },
  ];

  const priorityOptions = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
    { value: 'Critical', label: 'Critical' },
  ];

  // Convert users to options format for multi-select
  const userOptions = users.map((user) => ({
    value: user.id,
    label: user.name,
  }));

  useEffect(() => {
    if (task) {
      setFormData({
        ...task,
        status: { value: task.status, label: task.status },
        priority: { value: task.priority, label: task.priority },
        projectId: projectOptions.find((p) => p.value === task.projectId) || null,
        assignedTo: userOptions.filter((u) => task.assignedTo.includes(u.value)),
      });
    } else if (userProjects.length > 0) {
      setFormData((prev) => ({
        ...prev,
        projectId: projectOptions[0],
      }));
    }
  }, [task, userProjects.length]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const taskData = {
      id: task?.id || Date.now().toString(),
      title: formData.title || '',
      description: formData.description || '',
      status: formData.status.value,
      priority: formData.priority.value,
      projectId: formData.projectId?.value || '',
      assignedTo: formData.assignedTo.map((user) => user.value),
      dueDate: formData.dueDate || '',
      createdBy: task?.createdBy || currentUser.id,
      createdAt: task?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(taskData);
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
            <Select
              value={formData.projectId}
              onChange={(selected) => setFormData({ ...formData, projectId: selected })}
              options={projectOptions}
              classNamePrefix="custom-select"
              className="custom-select-container"
              placeholder="Select Project"
              isSearchable={true}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Status
              </label>
              <Select
                value={formData.status}
                onChange={(selected) => setFormData({ ...formData, status: selected })}
                options={statusOptions}
                classNamePrefix="custom-select"
                className="custom-select-container"
                isSearchable={false}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Priority
              </label>
              <Select
                value={formData.priority}
                onChange={(selected) => setFormData({ ...formData, priority: selected })}
                options={priorityOptions}
                classNamePrefix="custom-select"
                className="custom-select-container"
                isSearchable={false}
              />
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
            <Select
              value={formData.assignedTo}
              onChange={(selected) => setFormData({ ...formData, assignedTo: selected || [] })}
              options={userOptions}
              classNamePrefix="custom-select"
              className="custom-select-container"
              placeholder="Select users..."
              isSearchable={true}
              isMulti
              closeMenuOnSelect={false}
            />
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