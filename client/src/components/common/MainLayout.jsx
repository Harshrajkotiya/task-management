import { LayoutDashboard, ListTodo, LogOut, Search } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully');
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    ...(user?.role === 'admin'
      ? [{ icon: ListTodo, label: 'Tasks', path: '/tasks' }]
      : []),
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E6E6E6] flex flex-col z-20">
        <div className="p-8">
          <h1 className="text-xl font-bold text-[#111827]">Task Management</h1>
        </div>

        <nav className="flex-1 px-6 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${
                  isActive
                    ? 'bg-[#F3F4F6] text-black'
                    : 'text-gray-400 hover:bg-[#F3F4F6] hover:text-gray-600'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`w-5 h-5 ${isActive ? 'text-[#5D5CDE]' : 'text-gray-400 opacity-60'}`}
                  />
                  <span className="text-[15px]">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-8">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-5 py-4 w-full rounded-2xl text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all duration-200"
          >
            <LogOut className="w-5 h-5 opacity-60" />
            <span className="text-[15px] font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-[#E6E6E6] flex items-center justify-between px-10 shrink-0">
          {/* Search Bar */}
          <div className="relative w-[450px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search here..."
              className="w-full pl-14 pr-6 py-3 bg-white border-transparent rounded-[1.5rem] text-sm focus:outline-none shadow-sm placeholder:text-gray-300"
            />
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-4 bg-white/50 py-2 px-3 rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm">
              <img
                src={`https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=5D5CDE&color=fff`}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm font-bold text-gray-700">
              {user?.role === 'admin' ? 'Admin' : 'User'}
            </span>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-hidden p-4">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
