import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, updateTask, deleteTask } from '../../../store/slices/tasksSlice';
import { setView } from '../../../store/slices/uiSlice';
import { canManageTasks, isReadOnly } from '../../../utils/permissions';
import { Plus, LayoutGrid, List } from 'lucide-react';
import KanbanBoard from './KanbanBoard';
import TaskTable from './TaskTable';
import TaskModal from './TaskModal';
import Layout from '../Layout/Layout';

export default function TasksView() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const { currentView } = useSelector((state) => state.ui);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  if (!currentUser) return null;

  const canManage = canManageTasks(currentUser.role);
  const readOnly = isReadOnly(currentUser.role);

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = (task) => {
    if (editingTask) {
      dispatch(updateTask(task));
    } else {
      dispatch(addTask(task));
    }
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId) => {
    dispatch(deleteTask(taskId));
    setIsModalOpen(false);
    setEditingTask(null);
  };

  return (
            <Layout>
    
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Tasks</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Organize and track your team's work
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg shadow p-1">
            <button
              onClick={() => dispatch(setView('kanban'))}
              className={`p-2 rounded transition ${
                currentView === 'kanban'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => dispatch(setView('table'))}
              className={`p-2 rounded transition ${
                currentView === 'table'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
          {canManage && !readOnly && (
            <button
              onClick={() => {
                setEditingTask(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              <Plus className="w-5 h-5" />
              New Task
            </button>
          )}
        </div>
      </div>

      {currentView === 'kanban' ? (
        <KanbanBoard onEditTask={handleEditTask} />
      ) : (
        <TaskTable onEditTask={handleEditTask} />
      )}

      {isModalOpen && (
        <TaskModal
          task={editingTask}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTask(null);
          }}
          onSave={handleSaveTask}
          onDelete={canManage ? handleDeleteTask : undefined}
        />
      )}
    </div>
            </Layout>
    
  );
}