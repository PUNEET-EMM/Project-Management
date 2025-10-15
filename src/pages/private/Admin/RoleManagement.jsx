import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserRole } from '../../../store/slices/usersSlice';
import { impersonate } from '../../../store/slices/authSlice';
import { User, Shield, Mail, FolderKanban, UserCircle } from 'lucide-react';
import Select from 'react-select';
import Layout from '../Layout/Layout';

export default function RoleManagement() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const projects = useSelector((state) => state.projects.projects);
  const currentUser = useSelector((state) => state.auth.user);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState({ value: 'Viewer', label: 'Viewer' });

  const roleColors = {
    Admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'Project Manager': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    Developer: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Viewer: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
  };

  const roleOptions = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Project Manager', label: 'Project Manager' },
    { value: 'Developer', label: 'Developer' },
    { value: 'Viewer', label: 'Viewer' },
  ];

  const handleRoleUpdate = (userId) => {
    dispatch(updateUserRole({ userId, role: selectedRole.value }));
    setEditingUser(null);
  };

  const handleImpersonate = (user) => {
    dispatch(impersonate(user));
  };

  const getUserProjectNames = (projectIds) => {
    return projects
      .filter((p) => projectIds.includes(p.id))
      .map((p) => p.name)
      .join(', ');
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
            Role Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage user roles and permissions across the platform
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Assigned Projects
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-medium text-slate-800 dark:text-white">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {editingUser === user.id ? (
                        <div className="w-52">
                          <Select
                            value={selectedRole}
                            onChange={setSelectedRole}
                            options={roleOptions}
                            classNamePrefix="custom-select"
                            className="custom-select-container"
                            isSearchable={false}
                            menuPlacement="auto"
                          />
                        </div>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}
                        >
                          <Shield className="w-3 h-3" />
                          {user.role}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <FolderKanban className="w-4 h-4" />
                        <span className="truncate max-w-xs">
                          {getUserProjectNames(user.assignedProjects) || 'None'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {editingUser === user.id ? (
                          <>
                            <button
                              onClick={() => handleRoleUpdate(user.id)}
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingUser(null)}
                              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white text-sm rounded-lg transition"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditingUser(user.id);
                                setSelectedRole({ value: user.role, label: user.role });
                              }}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition"
                            >
                              Edit Role
                            </button>
                            {currentUser?.id !== user.id && (
                              <button
                                onClick={() => handleImpersonate(user)}
                                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition flex items-center gap-1.5"
                              >
                                <UserCircle className="w-4 h-4" />
                                Impersonate
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}