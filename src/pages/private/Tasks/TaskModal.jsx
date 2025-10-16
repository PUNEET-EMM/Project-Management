import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { X } from 'lucide-react';
import Select from 'react-select';
import { getUserProjects } from '../../../utils/permissions';

const taskValidationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Task title must be at least 3 characters')
    .max(100, 'Task title must be less than 100 characters')
    .required('Task title is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters')
    .required('Description is required'),
  status: Yup.object()
    .shape({
      value: Yup.string().required(),
      label: Yup.string().required(),
    })
    .required('Status is required'),
  priority: Yup.object()
    .shape({
      value: Yup.string().required(),
      label: Yup.string().required(),
    })
    .required('Priority is required'),
  projectId: Yup.object()
    .shape({
      value: Yup.string().required(),
      label: Yup.string().required(),
    })
    .nullable()
    .required('Project is required'),
  assignedTo: Yup.array()
    .min(1, 'Please assign at least one user')
    .required('Assignment is required'),
  dueDate: Yup.date()
    .min(new Date(), 'Due date must be in the future')
    .required('Due date is required'),
});

export default function TaskModal({ task, onClose, onSave, onDelete }) {
  const users = useSelector((state) => state.users.users);
  const allProjects = useSelector((state) => state.projects.projects);
  const currentUser = useSelector((state) => state.auth.user);

  const userProjects = currentUser ? getUserProjects(currentUser, allProjects) : [];

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

  const userOptions = users.map((user) => ({
    value: user.id,
    label: user.name,
  }));

  const initialValues = {
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status 
      ? { value: task.status, label: task.status }
      : { value: 'To Do', label: 'To Do' },
    priority: task?.priority
      ? { value: task.priority, label: task.priority }
      : { value: 'Medium', label: 'Medium' },
    projectId: task?.projectId
      ? projectOptions.find((p) => p.value === task.projectId) || null
      : projectOptions[0] || null,
    assignedTo: task?.assignedTo
      ? userOptions.filter((u) => task.assignedTo.includes(u.value))
      : [],
    dueDate: task?.dueDate || '',
  };

  const handleSubmit = (values, { setSubmitting }) => {
    if (!currentUser) {
      setSubmitting(false);
      return;
    }

    const taskData = {
      id: task?.id || Date.now().toString(),
      title: values.title,
      description: values.description,
      status: values.status.value,
      priority: values.priority.value,
      projectId: values.projectId?.value || '',
      assignedTo: values.assignedTo.map((user) => user.value),
      dueDate: values.dueDate,
      createdBy: task?.createdBy || currentUser.id,
      createdAt: task?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(taskData);
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
            {task ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={taskValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue, isSubmitting, errors, touched }) => (
            <Form className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Task Title
                </label>
                <Field
                  type="text"
                  name="title"
                  className="w-full px-3 sm:px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter task title"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Description
                </label>
                <Field
                  as="textarea"
                  name="description"
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Enter task description"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Project
                </label>
                <Select
                  value={values.projectId}
                  onChange={(selected) => setFieldValue('projectId', selected)}
                  options={projectOptions}
                  classNamePrefix="custom-select"
                  className="custom-select-container"
                  placeholder="Select Project"
                  isSearchable={true}
                />
                <ErrorMessage
                  name="projectId"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Status
                  </label>
                  <Select
                    value={values.status}
                    onChange={(selected) => setFieldValue('status', selected)}
                    options={statusOptions}
                    classNamePrefix="custom-select"
                    className="custom-select-container"
                    isSearchable={false}
                  />
                  <ErrorMessage
                    name="status"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Priority
                  </label>
                  <Select
                    value={values.priority}
                    onChange={(selected) => setFieldValue('priority', selected)}
                    options={priorityOptions}
                    classNamePrefix="custom-select"
                    className="custom-select-container"
                    isSearchable={false}
                  />
                  <ErrorMessage
                    name="priority"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Due Date
                </label>
                <Field
                  type="date"
                  name="dueDate"
                  className="w-full px-3 sm:px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <ErrorMessage
                  name="dueDate"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Assign To
                </label>
                <Select
                  value={values.assignedTo}
                  onChange={(selected) => setFieldValue('assignedTo', selected || [])}
                  options={userOptions}
                  classNamePrefix="custom-select"
                  className="custom-select-container"
                  placeholder="Select users..."
                  isSearchable={true}
                  isMulti
                  closeMenuOnSelect={false}
                />
                <ErrorMessage
                  name="assignedTo"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition font-medium"
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
                    className="w-full sm:w-auto px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium"
                  >
                    Delete
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:flex-1 px-4 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-lg transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}