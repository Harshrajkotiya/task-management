# Schema Update: displayName → username

## Change Summary

Updated the user schema field from `displayName` to `username` across the entire codebase.

## Files Modified

### Backend (3 files)

1. **`server/src/controllers/authController.js`**
   - Updated signup endpoint to accept `username` instead of `displayName`
   - Updated login response to return `username`
2. **`server/src/controllers/taskController.js`**
   - Updated getAllUsers to return `username` field

### Frontend (4 files)

3. **`client/src/context/AuthContext.jsx`**
   - Updated signup function parameter from `displayName` to `username`
4. **`client/src/pages/Signup.jsx`**
   - Changed form field from "Display Name" to "Username"
   - Updated state variable from `displayName` to `username`
5. **`client/src/pages/Dashboard.jsx`**
   - Updated all references to display `user?.username`

### Documentation (3 files)

6. **`docs/RBAC.md`**
   - Updated test user examples to use `username`
7. **`docs/RBAC-QuickReference.md`**
   - Updated code example to use `user?.username`
8. **`docs/Subtask4-RBAC-Summary.md`**
   - Updated test user examples to use `username`

## Database Schema

### Updated Firestore `users` Collection

| Field       | Type            | Description                  |
| :---------- | :-------------- | :--------------------------- |
| `uid`       | String (Doc ID) | Unique Firebase Auth ID      |
| `email`     | String          | User's email address         |
| `username`  | String          | **Updated from displayName** |
| `role`      | String          | `admin` or `user`            |
| `createdAt` | Timestamp       | Date of registration         |

## API Changes

### Signup Endpoint

**Before:**

```json
{
  "email": "user@test.com",
  "password": "password123",
  "displayName": "John Doe",
  "role": "user"
}
```

**After:**

```json
{
  "email": "user@test.com",
  "password": "password123",
  "username": "John Doe",
  "role": "user"
}
```

### Response Format

**Before:**

```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@test.com",
    "displayName": "John Doe",
    "role": "user"
  }
}
```

**After:**

```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@test.com",
    "username": "John Doe",
    "role": "user"
  }
}
```

## Migration Notes

### For Existing Data

If you have existing users in Firestore with `displayName` field:

1. **Option 1: Manual Migration**
   - Update each document in Firestore to rename `displayName` to `username`

2. **Option 2: Migration Script**

   ```javascript
   // Run this once to migrate existing data
   const users = await db.collection("users").get();
   const batch = db.batch();

   users.docs.forEach((doc) => {
     const data = doc.data();
     if (data.displayName) {
       batch.update(doc.ref, {
         username: data.displayName,
         displayName: admin.firestore.FieldValue.delete(),
       });
     }
   });

   await batch.commit();
   ```

3. **Option 3: Support Both Fields (Temporary)**
   - Keep both fields during transition
   - Read from `username` first, fallback to `displayName`
   - Gradually migrate users

### Breaking Changes

⚠️ **This is a breaking change** if you have:

- Existing users in the database
- Mobile apps or other clients using the old API
- Cached user data in localStorage

### Recommended Actions

1. Clear localStorage on all clients
2. Migrate existing Firestore data
3. Update any external integrations
4. Test signup and login flows

## Testing Checklist

- [x] Backend accepts `username` in signup
- [x] Backend returns `username` in login response
- [x] Frontend signup form uses "Username" label
- [x] Frontend displays username correctly
- [x] Documentation updated
- [ ] Existing Firestore data migrated (if applicable)
- [ ] All clients updated (if applicable)

## Compatibility

- ✅ New users: Fully compatible
- ⚠️ Existing users: Requires data migration
- ⚠️ Old clients: Will break if not updated

---

**Date:** 2026-01-27  
**Status:** ✅ Complete
