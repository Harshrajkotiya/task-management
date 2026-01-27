# Task Management Dashboard

A full-stack Task Management Dashboard with Role-Based Access Control, built with React, Node.js, and Firebase Firestore.

## Project Structure

- `client/`: React frontend built with Vite, Tailwind CSS, and React Router
- `server/`: Node.js Express backend with JWT authentication
- `docs/`: Comprehensive documentation

## Prerequisites

- Node.js (v18 or later)
- Firebase Account

## Getting Started

### Backend Setup

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your Firebase configuration and JWT secret.
4. Start the server (development mode):
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your Firebase configuration.
4. Start the frontend (development mode):
   ```bash
   npm run dev
   ```

## Features

- ✅ **User Authentication** (Firebase + JWT)
  - Secure signup and login
  - Password hashing with bcrypt
  - JWT token-based authentication
- ✅ **Role-Based Access Control (RBAC)**
  - Admin and User roles
  - Protected API endpoints
  - Role-based UI rendering
  - Graceful unauthorized access handling
- ✅ **Firebase Firestore Integration**
  - Real-time data storage
  - Secure Firestore rules
  - Collections: users, tasks
- ✅ **Modern UI/UX**
  - Tailwind CSS styling
  - Lucide React icons
  - React Toastify notifications
  - Responsive design

- 🚧 **Task Dashboard** (In Progress)
  - CRUD operations
  - Task filtering by role
  - Real-time updates

## Tech Stack

### Frontend

- React 19
- Vite
- React Router DOM
- Tailwind CSS v4
- Lucide React (Icons)
- React Toastify
- Axios

### Backend

- Node.js
- Express
- Firebase Admin SDK
- JSON Web Tokens (JWT)
- bcryptjs
- CORS

## Documentation

- **[RBAC Documentation](docs/RBAC.md)**: Comprehensive guide to Role-Based Access Control
- **[RBAC Quick Reference](docs/RBAC-QuickReference.md)**: Common patterns and usage
- **[Firestore Schema](docs/firestore-schema.md)**: Database structure
- **[Subtask 4 Summary](docs/Subtask4-RBAC-Summary.md)**: Implementation summary

## User Roles

### Admin

- View all tasks
- Create, update, and delete any task
- Assign tasks to any user
- Access admin-only routes

### User

- View tasks assigned to them
- Create new tasks
- Update their own tasks
- Limited access to system features

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Tasks (Protected)

- `GET /api/tasks` - Get all tasks (filtered by role)
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task (Admin only)
- `GET /api/tasks/users/all` - Get all users (Admin only)

## Linting & Formatting

- Frontend: ESLint + Prettier
- Backend: ESLint

## Security Features

- JWT token validation
- Password hashing (bcrypt)
- Role-based middleware
- Protected routes
- Secure Firestore rules
- Environment variable protection

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.
