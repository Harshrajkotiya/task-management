# Role-Based Access Control (RBAC) Documentation

## Overview

This application implements comprehensive Role-Based Access Control (RBAC) to restrict API and UI access based on user roles: **Admin** and **User**.

## User Roles

### Admin

- **Full Access**: Can view, create, update, and delete all tasks
- **User Management**: Can view all users and assign tasks to anyone
- **System Control**: Access to admin-only routes and features

### User

- **Limited Access**: Can only view tasks assigned to them or created by them
- **Task Management**: Can create and update their own tasks
- **Restrictions**: Cannot delete tasks or reassign tasks to others

---

## Backend Implementation

### 1. Authentication Middleware (`authMiddleware.js`)

**Purpose**: Validates JWT tokens and extracts user information.

```javascript
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contains: id, email, role
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
```

### 2. Role Middleware (`roleMiddleware`)

**Purpose**: Restricts access to specific roles.

```javascript
const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access forbidden" });
    }
    next();
  };
};
```

**Usage Example**:

```javascript
router.delete("/:id", roleMiddleware(["admin"]), taskController.deleteTask);
```

### 3. Task Controller Access Rules

| Action              | Admin       | User                       | Implementation              |
| ------------------- | ----------- | -------------------------- | --------------------------- |
| **View All Tasks**  | ✓ All tasks | ✓ Only assigned/created    | Firestore query filter      |
| **View Task by ID** | ✓ Any task  | ✓ Only if assigned/created | Permission check            |
| **Create Task**     | ✓           | ✓                          | No restriction              |
| **Update Task**     | ✓ Any task  | ✓ Only own tasks           | Permission check            |
| **Reassign Task**   | ✓           | ✗                          | Role check                  |
| **Delete Task**     | ✓           | ✗                          | `roleMiddleware(['admin'])` |
| **View Users**      | ✓           | ✗                          | `roleMiddleware(['admin'])` |

### 4. Protected Routes

```javascript
// Public
POST /api/auth/signup
POST /api/auth/login

// Protected (All authenticated users)
GET  /api/tasks              // Filtered by role
GET  /api/tasks/:id          // Permission check
POST /api/tasks              // All users
PUT  /api/tasks/:id          // Permission check

// Admin Only
DELETE /api/tasks/:id
GET    /api/tasks/users/all
```

---

## Frontend Implementation

### 1. Route Protection Components

#### `ProtectedRoute`

Redirects to `/login` if user is not authenticated.

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

#### `AdminRoute`

Redirects to `/dashboard` if user is not an admin.

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

#### `PublicRoute`

Redirects to `/dashboard` if user is already logged in.

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

### 2. Role-Based UI Components

#### `RoleGate`

Conditionally renders content based on user role.

```jsx
<RoleGate allowedRoles={["admin"]} fallback={<p>Access Denied</p>}>
  <AdminPanel />
</RoleGate>
```

#### `AdminOnly`

Shorthand for admin-only content.

```jsx
<AdminOnly fallback={<p>Admin only</p>}>
  <button>Delete All Tasks</button>
</AdminOnly>
```

#### `RoleBadge`

Displays user role as a styled badge.

```jsx
<RoleBadge role={user?.role} />
```

### 3. API Service with Auto-Authentication

The `api.js` service automatically:

- Attaches JWT token to all requests
- Handles 401 errors by clearing credentials
- Redirects to login on authentication failure

```javascript
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## Error Handling

### Backend Errors

| Status Code | Meaning      | Example                    |
| ----------- | ------------ | -------------------------- |
| **401**     | Unauthorized | No token or invalid token  |
| **403**     | Forbidden    | Insufficient permissions   |
| **404**     | Not Found    | Task doesn't exist         |
| **500**     | Server Error | Database or internal error |

### Frontend Error Handling

All API errors are caught and displayed using **React Toastify**:

```javascript
try {
  await taskService.deleteTask(id);
  toast.success("Task deleted");
} catch (error) {
  toast.error(error.response?.data?.message || "Failed to delete");
}
```

---

## Testing RBAC

### 1. Create Test Users

**Admin User**:

```bash
POST /api/auth/signup
{
  "email": "admin@test.com",
  "password": "admin123",
  "username": "Admin User",
  "role": "admin"
}
```

**Regular User**:

```bash
POST /api/auth/signup
{
  "email": "user@test.com",
  "password": "user123",
  "username": "Regular User",
  "role": "user"
}
```

### 2. Test Scenarios

#### Scenario 1: User tries to delete a task

- **Expected**: 403 Forbidden
- **Test**: Login as user, attempt `DELETE /api/tasks/:id`

#### Scenario 2: User tries to view another user's task

- **Expected**: 403 Forbidden or empty result
- **Test**: Login as user, attempt `GET /api/tasks/:id` for unassigned task

#### Scenario 3: Admin deletes any task

- **Expected**: 200 Success
- **Test**: Login as admin, `DELETE /api/tasks/:id`

#### Scenario 4: User accesses admin route

- **Expected**: Redirect to `/dashboard`
- **Test**: Login as user, navigate to `/admin`

---

## Security Best Practices

1. **JWT Tokens**: Expire after 24 hours
2. **Password Hashing**: bcrypt with 10 salt rounds
3. **Environment Variables**: All secrets in `.env`
4. **HTTPS**: Use in production
5. **Token Storage**: localStorage (consider httpOnly cookies for production)
6. **Input Validation**: Validate all user inputs
7. **Firestore Rules**: Backend + Firestore security rules (double layer)

---

## Future Enhancements

- [ ] Refresh token mechanism
- [ ] More granular permissions (e.g., task viewer, task editor)
- [ ] Audit logging for admin actions
- [ ] Rate limiting on API endpoints
- [ ] Two-factor authentication
- [ ] Session management (logout all devices)
