import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ProtectedRoute, PublicRoute, AdminRoute } from './components/ProtectedRoute';
import { UnauthorizedAccess } from './components/RoleBasedComponents';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#F8F7FF]">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            }
          />

          {/* Admin Only Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">Admin Panel</h1>
                  <p className="mt-4">This is an admin-only page.</p>
                </div>
              </AdminRoute>
            }
          />

          {/* Unauthorized Access */}
          <Route path="/unauthorized" element={<UnauthorizedAccess />} />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* 404 */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;
