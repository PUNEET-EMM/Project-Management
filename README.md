# Project Management Dashboard

A modern, role-based project management dashboard built with React, Redux, and Tailwind CSS. This application provides comprehensive project tracking, task management, and team collaboration features with an intuitive drag-and-drop interface.

## 🚀 Features

- **Role-Based Access Control** - Different permissions for Admin, Project Manager, Developer, and Viewer roles
- **Project Management** - Create, track, and manage multiple projects
- **Task Management** - Organize tasks with drag-and-drop Kanban boards
- **Team Collaboration** - Assign tasks and projects to team members
- **Analytics Dashboard** - Visualize project progress and team performance
- **Responsive Design** - Fully responsive UI that works on all devices

## 🛠️ Tech Stack

### Frontend Framework
- **React 19.1.1** - Modern UI library with latest features
- **React Router DOM 7.9.4** - Client-side routing and navigation
- **Vite 7.1.7** - Fast build tool and development server

### State Management
- **Redux Toolkit 2.9.0** - Efficient Redux state management
- **React Redux 9.2.0** - React bindings for Redux

### UI & Styling
- **Tailwind CSS 4.1.14** - Utility-first CSS framework
- **Lucide React 0.545.0** - Beautiful icon library
- **React Select 5.10.2** - Advanced select components

### Forms & Validation
- **Formik 2.4.6** - Form management library
- **Yup 1.7.1** - Schema validation

### Visualization & Interaction
- **Recharts 3.2.1** - Composable charting library
- **@hello-pangea/dnd 18.0.1** - Drag and drop functionality

### Development Tools
- **ESLint 9.36.0** - Code linting
- **TypeScript Types** - Type definitions for React

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager

## ⚙️ Installation & Setup

1. **Clone the repository**
```bash
   git clone https://github.com/PUNEET-EMM/Project-Management.git
   cd Project-Management
```

2. **Install dependencies**
```bash
   npm install
```

3. **Start the development server**
```bash
   npm run dev
```

4. **Access the application**
   - Open your browser and navigate to `http://localhost:5173`

## 📜 Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build

```

## 👥 Role-Based Access Control

| Role | View Projects | Create Projects | Edit Projects | Delete Projects | Manage Users | View Tasks | Create/Edit Tasks | View Analytics |
|------|--------------|----------------|---------------|-----------------|--------------|------------|-------------------|----------------|
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Project Manager** | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| **Developer** | ✅ (Assigned) | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ (Assigned) | ❌ |
| **Viewer** | ✅ (Assigned) | ❌ | ❌ | ❌ | ❌ | ✅ (Read-only) | ❌ | ❌ |

## 🔐 Demo Credentials

Use these credentials to test different user roles:

| Email | Password | Role |
|-------|----------|------|
| alice@example.com | admin123 | Admin |
| bob@example.com | manager123 | Project Manager |
| charlie@example.com | dev123 | Developer |
| diana@example.com | dev123 | Developer |
| eve@example.com | viewer123 | Viewer |

## 📊 Data Structure

### Users
- **id**: Unique identifier
- **name**: User's full name
- **email**: User's email address
- **role**: Admin, Project Manager, Developer, or Viewer
- **assignedProjects**: Array of project IDs

### Projects
- **id**: Unique identifier
- **name**: Project name
- **description**: Project description
- **status**: Active, Planning, or Completed
- **dueDate**: Project deadline
- **createdBy**: User ID of creator
- **members**: Array of assigned user IDs
- **createdAt**: Creation timestamp

### Tasks
- **id**: Unique identifier
- **title**: Task title
- **description**: Task details
- **status**: To Do, In Progress, Review, or Done
- **priority**: Critical, High, Medium, or Low
- **projectId**: Associated project ID
- **assignedTo**: Array of assigned user IDs
- **dueDate**: Task deadline
- **createdBy**: User ID of creator
- **createdAt/updatedAt**: Timestamps

## 🎨 Key Features Explained

### Drag and Drop
Tasks can be dragged between different status columns (To Do, In Progress, Review, Done) using an intuitive interface powered by @hello-pangea/dnd.

### Real-time Filtering
Filter projects and tasks by status, priority, assigned members, and date ranges.

### Data Visualization
View project progress, task distribution, and team performance through interactive charts built with Recharts.

### Form Validation
All forms include comprehensive validation using Formik and Yup to ensure data integrity.


## 🚀 Building for Production
```bash
npm run build
```




