import { useSelector } from 'react-redux';
import { canManageTeams, getUserProjects } from '../../../utils/permissions';
import { Users, Mail, Shield, FolderKanban } from 'lucide-react';
import Layout from '../Layout/Layout';

export default function TeamsView() {
  const users = useSelector((state) => state.users.users);
  const allProjects = useSelector((state) => state.projects.projects);
  const currentUser = useSelector((state) => state.auth.user);

  if (!currentUser) return null;

  const userProjects = getUserProjects(currentUser, allProjects);
  const canManage = canManageTeams(currentUser.role);

  const roleColors = {
    Admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'Project Manager': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    Developer: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Viewer: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
  };

  const getProjectsForUser = (userId) => {
    return userProjects
      .filter((p) => p.members.includes(userId))
      .map((p) => p.name);
  };

  const groupedByRole = users.reduce((acc, user) => {
    if (!acc[user.role]) {
      acc[user.role] = [];
    }
    acc[user.role].push(user);
    return acc;
  }, {});

  return (
    <Layout>
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
          Teams & Members
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          View team members and their project assignments
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 mb-1">Total Team Members</p>
              <p className="text-4xl font-bold">{users.length}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <Users className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 mb-1">Active Projects</p>
              <p className="text-4xl font-bold">
                {userProjects.filter((p) => p.status === 'Active').length}
              </p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <FolderKanban className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedByRole).map(([role, members]) => (
          <div key={role} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
            <div className="bg-slate-50  dark:bg-slate-700 px-6 py-4 border-b border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
                  {role}
                </h2>
                <span className="bg-slate-200 dark:bg-slate-600 px-3 py-1 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300">
                  {members.length}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {members.map((member) => {
                  const projects = getProjectsForUser(member.id);
                  return (
                    <div
                      key={member.id}
                      className="flex  shadow items-start gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:shadow-md transition"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {member.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-800 dark:text-white mb-1">
                          {member.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-2">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{member.email}</span>
                        </div>
                        {projects.length > 0 && (
                          <div className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-500">
                            <FolderKanban className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2">
                              {projects.join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[member.role]} whitespace-nowrap`}
                      >
                        {member.role}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </Layout>
  );
}