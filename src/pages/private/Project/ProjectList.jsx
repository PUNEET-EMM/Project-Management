import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addProject, updateProject, deleteProject } from '../../../store/slices/projectsSlice';
import { canManageAllProjects, canManageProjects, isReadOnly, getUserProjects } from '../../../utils/permissions';
import { Plus, Edit2, Trash2, Calendar, Users as UsersIcon, Filter } from 'lucide-react';
import ProjectModal from './ProjectModal';
import Layout from '../Layout/Layout';

export default function ProjectList() {
    const dispatch = useDispatch();
    const allProjects = useSelector((state) => state.projects.projects);
    const currentUser = useSelector((state) => state.auth.user);
    const users = useSelector((state) => state.users.users);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [statusFilter, setStatusFilter] = useState('All');

    if (!currentUser) return null;

    const userProjects = canManageAllProjects(currentUser.role)
        ? allProjects
        : getUserProjects(currentUser, allProjects);

    const filteredProjects =
        statusFilter === 'All'
            ? userProjects
            : userProjects.filter((p) => p.status === statusFilter);

    const statusColors = {
        Planning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        Active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        'On Hold': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
        Completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    };

    const canEdit = canManageProjects(currentUser.role);
    const readOnly = isReadOnly(currentUser.role);

    const handleEdit = (project) => {
        if (canManageAllProjects(currentUser.role) || project.createdBy === currentUser.id) {
            setEditingProject(project);
            setIsModalOpen(true);
        }
    };

    const handleDelete = (projectId) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            dispatch(deleteProject(projectId));
        }
    };

    const handleSaveProject = (project) => {
        if (editingProject) {
            dispatch(updateProject(project));
        } else {
            dispatch(addProject(project));
        }
        setIsModalOpen(false);
        setEditingProject(null);
    };

    const getMemberNames = (memberIds) => {
        return users
            .filter((u) => memberIds.includes(u.id))
            .map((u) => u.name)
            .join(', ');
    };

    return (
        <Layout>

            <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Projects</h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            Manage and track all your projects
                        </p>
                    </div>
                    {canEdit && !readOnly && (
                        <button
                            onClick={() => {
                                setEditingProject(null);
                                setIsModalOpen(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                        >
                            <Plus className="w-5 h-5" />
                            New Project
                        </button>
                    )}
                </div>

                <div className="mb-6 flex items-center gap-3">
                    <Filter className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    >
                        <option value="All">All Status</option>
                        <option value="Planning">Planning</option>
                        <option value="Active">Active</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => {
                        const canEditThis =
                            canManageAllProjects(currentUser.role) || project.createdBy === currentUser.id;

                        return (
                            <div
                                key={project.id}
                                className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
                                        {project.name}
                                    </h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
                                        {project.status}
                                    </span>
                                </div>

                                <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                                    {project.description}
                                </p>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                        <Calendar className="w-4 h-4" />
                                        Due: {new Date(project.dueDate).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                        <UsersIcon className="w-4 h-4" />
                                        {project.members.length} members
                                    </div>
                                </div>

                                {canEditThis && !readOnly && (
                                    <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                                        <button
                                            onClick={() => handleEdit(project)}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg transition"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(project.id)}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg transition"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {isModalOpen && (
                    <ProjectModal
                        project={editingProject}
                        onClose={() => {
                            setIsModalOpen(false);
                            setEditingProject(null);
                        }}
                        onSave={handleSaveProject}
                    />
                )}
            </div>
        </Layout>

    );
}