import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useDispatch, useSelector } from 'react-redux';
import { updateTaskStatus } from '../../../store/slices/tasksSlice';
import { canUpdateTaskStatus, getUserTasks } from '../../../utils/permissions';
import { Calendar, User, AlertCircle } from 'lucide-react';

const columns = [
  { id: 'To Do', label: 'To Do', color: 'bg-slate-100 dark:bg-slate-700' },
  { id: 'In Progress', label: 'In Progress', color: 'bg-blue-100 dark:bg-blue-900' },
  { id: 'Review', label: 'Review', color: 'bg-yellow-100 dark:bg-yellow-900' },
  { id: 'Done', label: 'Done', color: 'bg-green-100 dark:bg-green-900' },
];

export default function KanbanBoard({ onEditTask }) {
  const dispatch = useDispatch();
  const allTasks = useSelector((state) => state.tasks.tasks);
  const currentUser = useSelector((state) => state.auth.user);
  const users = useSelector((state) => state.users.users);
  const projects = useSelector((state) => state.projects.projects);

  if (!currentUser) return null;

  const userTasks = getUserTasks(currentUser, allTasks);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId;
    const task = userTasks.find((t) => t.id === taskId);

    if (task && canUpdateTaskStatus(currentUser.role, task, currentUser.id)) {
      dispatch(updateTaskStatus({ taskId, status: newStatus }));
    }
  };

  const getTasksByStatus = (status) => {
    return userTasks.filter((task) => task.status === status);
  };

  const priorityColors = {
    Low: 'bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-200',
    Medium: 'bg-blue-200 text-blue-700 dark:bg-blue-700 dark:text-blue-200',
    High: 'bg-orange-200 text-orange-700 dark:bg-orange-700 dark:text-orange-200',
    Critical: 'bg-red-200 text-red-700 dark:bg-red-700 dark:text-red-200',
  };

  const getAssigneeNames = (assignedTo) => {
    return users
      .filter((u) => assignedTo.includes(u.id))
      .map((u) => u.name.split(' ')[0])
      .join(', ');
  };

  const getProjectName = (projectId) => {
    return projects.find((p) => p.id === projectId)?.name || 'Unknown';
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((column) => {
          const tasks = getTasksByStatus(column.id);
          return (
            <div key={column.id} className="flex flex-col">
              <div className={`${column.color} rounded-t-xl p-4`}>
                <h3 className="font-semibold text-slate-800 dark:text-white flex items-center justify-between">
                  {column.label}
                  <span className="bg-white dark:bg-slate-800 px-2 py-1 rounded-full text-sm">
                    {tasks.length}
                  </span>
                </h3>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 p-2 space-y-3 bg-slate-50 dark:bg-slate-800/50 rounded-b-xl min-h-[500px] ${
                      snapshot.isDraggingOver ? 'bg-slate-100 dark:bg-slate-700/50' : ''
                    }`}
                  >
                    {tasks.map((task, index) => {
                      const canDrag = canUpdateTaskStatus(currentUser.role, task, currentUser.id);

                      return (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                          isDragDisabled={!canDrag}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => onEditTask(task)}
                              className={`bg-white dark:bg-slate-800 rounded-lg p-4 shadow hover:shadow-md transition cursor-pointer ${
                                snapshot.isDragging ? 'shadow-2xl rotate-2' : ''
                              } ${!canDrag ? 'opacity-60' : ''}`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-semibold text-slate-800 dark:text-white text-sm line-clamp-2">
                                  {task.title}
                                </h4>
                                <span
                                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                                    priorityColors[task.priority]
                                  }`}
                                >
                                  {task.priority}
                                </span>
                              </div>

                              <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                                {task.description}
                              </p>

                              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500 mb-2">
                                <AlertCircle className="w-3 h-3" />
                                {getProjectName(task.projectId)}
                              </div>

                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(task.dueDate).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </div>
                                <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                                  <User className="w-3 h-3" />
                                  {getAssigneeNames(task.assignedTo)}
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}