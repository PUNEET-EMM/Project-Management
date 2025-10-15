import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { X } from 'lucide-react';

export default function ProjectModal({ project, onClose, onSave }) {
  const users = useSelector((state) => state.users.users);
  const currentUser = useSelector((state) => state.auth.user);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Planning',
    dueDate: '',
    members: [],
  });

  useEffect(() => {
    if (project) {
      setFormData(project);
    }
  }, [project]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const projectData = {
      id: project?.id || Date.now().toString(),
      name: formData.name || '',
      description: formData.description || '',
      status: formData.status,
      dueDate: formData.dueDate || '',
      createdBy: project?.createdBy || currentUser.id,
      members: formData.members || [],
      createdAt: project?.createdAt || new Date().toISOString(),
    };

    onSave(projectData);
  };

  const handleMemberToggle = (userId) => {
    const members = formData.members || [];
    if (members.includes(userId)) {
      setFormData({ ...formData, members: members.filter((id) => id !== userId) });
    } else {
      setFormData({ ...formData, members: [...members, userId] });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            {project ? 'Edit Project' : 'New Project'}
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
              Project Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                <option value="Planning">Planning</option>
                <option value="Active">Active</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
              </select>
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
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Team Members
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border border-slate-300 dark:border-slate-600 rounded-lg">
              {users.map((user) => (
                <label
                  key={user.id}
                  className="flex items-center gap-2 p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.members?.includes(user.id)}
                    onChange={() => handleMemberToggle(user.id)}
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
              {project ? 'Update Project' : 'Create Project'}
            </button>
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