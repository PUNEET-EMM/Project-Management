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
      <div className="p-4 sm:p-6">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-2">
            Role Management
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Manage user roles and permissions across the platform
          </p>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
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
                      <div className="flex flex-wrap items-center gap-2">
                        {editingUser === user.id ? (
                          <>
                            <button
                              onClick={() => handleRoleUpdate(user.id)}
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition whitespace-nowrap"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingUser(null)}
                              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white text-sm rounded-lg transition whitespace-nowrap"
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
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition whitespace-nowrap"
                            >
                              Edit Role
                            </button>
                            {currentUser?.id !== user.id && (
                              <button
                                onClick={() => handleImpersonate(user)}
                                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition flex items-center gap-1.5 whitespace-nowrap"
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

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 sm:p-5"
            >
              {/* User Header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 dark:text-white text-lg">
                    {user.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                </div>
              </div>

              {/* Role Section */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2 block">
                  Role
                </label>
                {editingUser === user.id ? (
                  <Select
                    value={selectedRole}
                    onChange={setSelectedRole}
                    options={roleOptions}
                    classNamePrefix="custom-select"
                    className="custom-select-container"
                    isSearchable={false}
                    menuPlacement="auto"
                  />
                ) : (
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${roleColors[user.role]}`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    {user.role}
                  </span>
                )}
              </div>

              {/* Projects Section */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2 block">
                  Assigned Projects
                </label>
                <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <FolderKanban className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="break-words">
                    {getUserProjectNames(user.assignedProjects) || 'None'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                {editingUser === user.id ? (
                  <>
                    <button
                      onClick={() => handleRoleUpdate(user.id)}
                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingUser(null)}
                      className="flex-1 px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white text-sm font-medium rounded-lg transition"
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
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
                    >
                      Edit Role
                    </button>
                    {currentUser?.id !== user.id && (
                      <button
                        onClick={() => handleImpersonate(user)}
                        className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition flex items-center justify-center gap-2"
                      >
                        <UserCircle className="w-4 h-4" />
                        Impersonate
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}