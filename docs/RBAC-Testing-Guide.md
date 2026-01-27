# RBAC Testing Guide

This guide will help you test the Role-Based Access Control implementation.

## Prerequisites

1. Both frontend and backend servers running:

   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev

   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

2. Firebase project configured with Firestore enabled

---

## Test 1: User Registration and Login

### 1.1 Create Admin User

1. Navigate to `http://localhost:5173/signup`
2. Fill in the form:
   - **Display Name**: Admin User
   - **Email**: admin@test.com
   - **Password**: admin123
   - **Role**: Admin
3. Click "Sign Up"
4. **Expected**: Redirect to dashboard with admin badge visible

### 1.2 Create Regular User

1. Logout (click Logout button)
2. Navigate to `http://localhost:5173/signup`
3. Fill in the form:
   - **Display Name**: Regular User
   - **Email**: user@test.com
   - **Password**: user123
   - **Role**: User
4. Click "Sign Up"
5. **Expected**: Redirect to dashboard with user badge visible

---

## Test 2: Route Protection

### 2.1 Test Unauthenticated Access

1. Logout if logged in
2. Try to navigate to `http://localhost:5173/dashboard`
3. **Expected**: Redirect to `/login`

### 2.2 Test Admin Route (as User)

1. Login as regular user (user@test.com)
2. Try to navigate to `http://localhost:5173/admin`
3. **Expected**: Redirect to `/dashboard`

### 2.3 Test Admin Route (as Admin)

1. Login as admin (admin@test.com)
2. Navigate to `http://localhost:5173/admin`
3. **Expected**: Access granted, page displays

### 2.4 Test Public Route Redirect

1. Login as any user
2. Try to navigate to `http://localhost:5173/login`
3. **Expected**: Redirect to `/dashboard`

---

## Test 3: API Access Control

Use a tool like **Postman**, **Insomnia**, or **curl** for these tests.

### 3.1 Test Unauthenticated API Access

```bash
curl http://localhost:5000/api/tasks
```

**Expected Response**:

```json
{
  "message": "No token, authorization denied"
}
```

**Status**: 401

### 3.2 Test Authenticated API Access

1. Login via API to get token:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"user123"}'
```

2. Copy the token from response
3. Use token to access tasks:

```bash
curl http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected**: Success (200) with tasks array

### 3.3 Test Admin-Only Endpoint (as User)

```bash
curl http://localhost:5000/api/tasks/users/all \
  -H "Authorization: Bearer USER_TOKEN_HERE"
```

**Expected Response**:

```json
{
  "message": "Access forbidden: insufficient permissions"
}
```

**Status**: 403

### 3.4 Test Admin-Only Endpoint (as Admin)

```bash
curl http://localhost:5000/api/tasks/users/all \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

**Expected**: Success (200) with users array

---

## Test 4: Task Permissions

### 4.1 Create Tasks

**As User**:

1. Login as user@test.com
2. Create a task via API:

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "User Task",
    "description": "Created by user",
    "status": "todo",
    "priority": "medium"
  }'
```

**Expected**: Success (201), task created

**As Admin**:

1. Login as admin@test.com
2. Create a task assigned to the user:

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Admin Task for User",
    "description": "Created by admin",
    "status": "todo",
    "priority": "high",
    "assignedTo": "USER_ID_HERE"
  }'
```

**Expected**: Success (201), task created

### 4.2 View Tasks

**As User**:

```bash
curl http://localhost:5000/api/tasks \
  -H "Authorization: Bearer USER_TOKEN"
```

**Expected**: Only tasks assigned to or created by the user

**As Admin**:

```bash
curl http://localhost:5000/api/tasks \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Expected**: All tasks in the system

### 4.3 Update Task

**User Updates Own Task**:

```bash
curl -X PUT http://localhost:5000/api/tasks/TASK_ID \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "in-progress"}'
```

**Expected**: Success (200)

**User Tries to Update Another User's Task**:

```bash
curl -X PUT http://localhost:5000/api/tasks/OTHER_USER_TASK_ID \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

**Expected**: 403 Forbidden

**Admin Updates Any Task**:

```bash
curl -X PUT http://localhost:5000/api/tasks/ANY_TASK_ID \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

**Expected**: Success (200)

### 4.4 Delete Task

**User Tries to Delete Task**:

```bash
curl -X DELETE http://localhost:5000/api/tasks/TASK_ID \
  -H "Authorization: Bearer USER_TOKEN"
```

**Expected**: 403 Forbidden

**Admin Deletes Task**:

```bash
curl -X DELETE http://localhost:5000/api/tasks/TASK_ID \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Expected**: Success (200)

### 4.5 Task Reassignment

**User Tries to Reassign Task**:

```bash
curl -X PUT http://localhost:5000/api/tasks/TASK_ID \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"assignedTo": "ANOTHER_USER_ID"}'
```

**Expected**: 403 Forbidden (only admins can reassign)

**Admin Reassigns Task**:

```bash
curl -X PUT http://localhost:5000/api/tasks/TASK_ID \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"assignedTo": "ANOTHER_USER_ID"}'
```

**Expected**: Success (200)

---

## Test 5: UI Role-Based Rendering

### 5.1 Dashboard View

**As User**:

1. Login as user@test.com
2. View dashboard
3. **Expected**:
   - User badge displayed
   - "Admin Panel" card shows "This section is only available to administrators"
   - Access permissions show user limitations

**As Admin**:

1. Login as admin@test.com
2. View dashboard
3. **Expected**:
   - Admin badge displayed
   - "Admin Panel" card is fully accessible with purple styling
   - Access permissions show full admin capabilities

### 5.2 Conditional UI Elements

Check that:

- Delete buttons are hidden/disabled for users
- Reassign options only available to admins
- Admin-only sections use `<AdminOnly>` component
- Role badges display correctly

---

## Test 6: Error Handling

### 6.1 Invalid Token

1. Manually edit localStorage token to invalid value
2. Try to access `/api/tasks`
3. **Expected**: 401 Unauthorized, auto-logout, redirect to login

### 6.2 Expired Token

1. Wait for token to expire (24 hours) or manually set expiry
2. Try to access protected route
3. **Expected**: 401 Unauthorized, auto-logout

### 6.3 Network Errors

1. Stop backend server
2. Try to login
3. **Expected**: Toast error message displayed

---

## Test 7: Security Checks

### 7.1 Password Hashing

1. Check Firestore users collection
2. Verify passwords are hashed (not plain text)
3. **Expected**: Passwords stored as bcrypt hashes

### 7.2 Token in Headers

1. Open browser DevTools > Network
2. Make an authenticated request
3. Check request headers
4. **Expected**: `Authorization: Bearer <token>` present

### 7.3 CORS

1. Try to access API from different origin
2. **Expected**: CORS headers allow access (configured in server)

---

## Checklist

Use this checklist to verify all RBAC features:

### Authentication

- [ ] User can sign up
- [ ] User can login
- [ ] User can logout
- [ ] Invalid credentials rejected
- [ ] Passwords are hashed
- [ ] JWT tokens generated

### Route Protection

- [ ] Unauthenticated users redirected to login
- [ ] Authenticated users can access dashboard
- [ ] Non-admins cannot access admin routes
- [ ] Admins can access all routes

### API Access Control

- [ ] Unauthenticated requests return 401
- [ ] Users can view only their tasks
- [ ] Admins can view all tasks
- [ ] Users cannot delete tasks
- [ ] Admins can delete tasks
- [ ] Users cannot reassign tasks
- [ ] Admins can reassign tasks

### UI Rendering

- [ ] Role badges display correctly
- [ ] Admin-only UI hidden from users
- [ ] Conditional rendering works
- [ ] Error messages clear and helpful

### Error Handling

- [ ] Invalid tokens handled gracefully
- [ ] Network errors show toast notifications
- [ ] 403 errors show unauthorized page
- [ ] Auto-logout on token expiration

---

## Troubleshooting

### Issue: "No token, authorization denied"

**Solution**: Ensure you're logged in and token is in localStorage

### Issue: "Access forbidden"

**Solution**: Check user role matches required permission

### Issue: Tasks not filtering correctly

**Solution**: Verify Firestore query in `taskController.js`

### Issue: Routes not protecting

**Solution**: Check `ProtectedRoute` and `AdminRoute` components are wrapping routes

### Issue: Token not attaching to requests

**Solution**: Verify `api.js` interceptor is configured correctly

---

## Success Criteria

All tests should pass with:

- ✅ Proper authentication flow
- ✅ Role-based route protection
- ✅ API access control working
- ✅ UI rendering based on roles
- ✅ Graceful error handling
- ✅ Security best practices followed
