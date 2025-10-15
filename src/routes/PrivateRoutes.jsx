import { Routes, Route, Navigate } from "react-router-dom";
import Main from "../pages/private/Main";
import ProjectList from "../pages/private/Project/ProjectList";
import TasksView from "../pages/private/Tasks/TasksView";
import TeamsView from "../pages/private/Teams/TeamsView";
import ReportsView from "../pages/private/Reports/ReportsView";
import RoleManagement from "../pages/private/Admin/RoleManagement";





export default function PrivateRoutes() {

    return (
        <Routes>

            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<Main />} />
            <Route path="project" element={<ProjectList />} />
            <Route path="tasksview" element={<TasksView />} />
            <Route path="teams" element={<TeamsView />} />
            <Route path="reports" element={<ReportsView />} />
            <Route path="role-management" element={<RoleManagement />} />

        </Routes>
    );
}