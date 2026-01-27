import { useAuth } from '../context/AuthContext';
import { Shield, AlertCircle } from 'lucide-react';
import Button from './common/Button';

/**
 * UnauthorizedAccess component
 * Displays when user tries to access forbidden resources
 */
export const UnauthorizedAccess = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F7FF] p-4">
      <div className="max-w-md w-full bg-white shadow-xl shadow-indigo-100 rounded-3xl p-10 text-center border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-50 rounded-2xl">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-400 text-sm mb-8">
          You don't have permission to access this resource. 
          Please contact your administrator if you believe this is an error.
        </p>
        <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
          <p className="text-sm text-gray-400 flex justify-between items-center">
            <span>Your current role</span>
            <span className="font-bold text-[#5D5CDE] uppercase tracking-wider">{user?.role || 'Unknown'}</span>
          </p>
        </div>
        <Button onClick={() => window.location.href = '/dashboard'}>
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

/**
 * RoleGate component
 * Conditionally renders children based on user role
 */
export const RoleGate = ({ children, allowedRoles, fallback = null }) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return fallback;
  }

  return children;
};

/**
 * AdminOnly component
 * Shows content only to admins
 */
export const AdminOnly = ({ children, fallback = null }) => {
  return <RoleGate allowedRoles={['admin']} fallback={fallback}>{children}</RoleGate>;
};

/**
 * RoleBadge component
 * Displays user role as a badge
 */
export const RoleBadge = ({ role }) => {
  const isAdmin = role === 'admin';
  
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
        isAdmin
          ? 'bg-purple-100 text-purple-800'
          : 'bg-blue-100 text-blue-800'
      }`}
    >
      <Shield className="w-3 h-3" />
      {role.toUpperCase()}
    </span>
  );
};
