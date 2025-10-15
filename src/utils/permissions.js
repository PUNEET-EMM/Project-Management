
export const canManageRoles = (role) => {
  return role === 'Admin';
};

export const canManageAllProjects = (role) => {
  return role === 'Admin';
};

export const canManageProjects = (role) => {
  return role === 'Admin' || role === 'Project Manager';
};

export const canManageAllTasks = (role) => {
  return role === 'Admin';
};

export const canManageTasks = (role) => {
  return role === 'Admin' || role === 'Project Manager';
};

export const canUpdateTaskStatus = (role, task, userId) => {
  if (role === 'Admin' || role === 'Project Manager') return true;
  if (role === 'Developer') return task.assignedTo.includes(userId);
  return false;
};

export const canViewReports = (role) => {
  return role === 'Admin' || role === 'Project Manager';
};

export const canManageTeams = (role) => {
  return role === 'Admin' || role === 'Project Manager';
};

export const isReadOnly = (role) => {
  return role === 'Viewer';
};

export const getUserProjects = (user, allProjects) => {
  if (user.role === 'Admin') {
    return allProjects;
  }
  return allProjects.filter(
    (p) => p.members.includes(user.id) || p.createdBy === user.id
  );
};

export const getUserTasks = (user, allTasks) => {
  if (user.role === 'Admin') {
    return allTasks;
  }
  if (user.role === 'Project Manager') {
    return allTasks;
  }
  return allTasks.filter((t) => t.assignedTo.includes(user.id));
};
