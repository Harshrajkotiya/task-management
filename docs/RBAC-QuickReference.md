# RBAC Quick Reference

## Backend Middleware Usage

### Protect All Routes in a Router

```javascript
const router = express.Router();
router.use(authMiddleware); // All routes now require authentication
```

### Protect Specific Route (Admin Only)

```javascript
router.delete("/:id", roleMiddleware(["admin"]), controller.delete);
```

### Protect Specific Route (Multiple Roles)

```javascript
router.get(
  "/reports",
  roleMiddleware(["admin", "manager"]),
  controller.getReports,
);
```

---

## Frontend Route Protection

### Protected Route (Any Authenticated User)

```jsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

### Admin Only Route

```jsx
<Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminPanel />
    </AdminRoute>
  }
/>
```

### Public Route (Redirect if Logged In)

```jsx
<Route
  path="/login"
  element={
    <PublicRoute>
      <Login />
    </PublicRoute>
  }
/>
```

---

## UI Component Protection

### Show Content Only to Admins

```jsx
import { AdminOnly } from "../components/RoleBasedComponents";

<AdminOnly fallback={<p>Not available</p>}>
  <button onClick={deleteAll}>Delete All</button>
</AdminOnly>;
```

### Show Content to Specific Roles

```jsx
import { RoleGate } from "../components/RoleBasedComponents";

<RoleGate allowedRoles={["admin", "manager"]}>
  <AdvancedSettings />
</RoleGate>;
```

### Display Role Badge

```jsx
import { RoleBadge } from "../components/RoleBasedComponents";

<RoleBadge role={user?.role} />;
```

---

## Access User Info in Components

```jsx
import { useAuth } from "../context/AuthContext";

function MyComponent() {
  const { user, isAdmin, logout } = useAuth();

  return (
    <div>
      <p>Welcome, {user?.username}</p>
      {isAdmin && <button>Admin Action</button>}
    </div>
  );
}
```

---

## API Service Usage

```jsx
import taskService from "../services/taskService";

// Get all tasks (automatically filtered by role)
const tasks = await taskService.getAllTasks();

// Create task
const newTask = await taskService.createTask({
  title: "New Task",
  description: "Description",
  status: "todo",
  priority: "high",
  assignedTo: userId,
  dueDate: "2024-12-31",
});

// Update task
await taskService.updateTask(taskId, { status: "completed" });

// Delete task (Admin only)
await taskService.deleteTask(taskId);

// Get all users (Admin only)
const users = await taskService.getAllUsers();
```

---

## Error Handling Pattern

```jsx
import { toast } from "react-toastify";

try {
  await taskService.deleteTask(id);
  toast.success("Task deleted successfully");
} catch (error) {
  if (error.response?.status === 403) {
    toast.error("You do not have permission to delete this task");
  } else if (error.response?.status === 401) {
    toast.error("Please log in again");
  } else {
    toast.error(error.response?.data?.message || "An error occurred");
  }
}
```

---

## Common Patterns

### Conditional Rendering Based on Role

```jsx
{
  isAdmin ? (
    <button onClick={deleteTask}>Delete</button>
  ) : (
    <button disabled>Delete (Admin Only)</button>
  );
}
```

### Disable Features for Non-Admins

```jsx
<button
  onClick={reassignTask}
  disabled={!isAdmin}
  className={!isAdmin ? "opacity-50 cursor-not-allowed" : ""}
>
  Reassign Task
</button>
```

### Show Different Content by Role

```jsx
<div>{isAdmin ? <AdminDashboard /> : <UserDashboard />}</div>
```
