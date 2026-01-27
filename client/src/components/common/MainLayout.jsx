import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardList, 
  LogOut, 
  Search, 
  User as UserIcon,
  ChevronDown
} from 'lucide-react';
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
    ...(user?.role === 'admin' ? [{ icon: ClipboardList, label: 'Tasks', path: '/tasks' }] : []),
  ];

  return (
    <div className="flex h-screen bg-[#F8F7FF] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col z-20">
        <div className="p-8">
          <h1 className="text-2xl font-extrabold text-[#111827] tracking-tight">
            Task <span className="text-[#5D5CDE]">Management</span>
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-[#F3F4FF] text-[#5D5CDE] font-bold' 
                  : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}
              `}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-10 shrink-0">
          {/* Search Bar */}
          <div className="relative w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#5D5CDE] transition-colors" />
            <input 
              type="text" 
              placeholder="Search here..." 
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-full text-sm focus:outline-none focus:bg-white focus:border-[#E1E0FF] transition-all"
            />
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900 leading-none mb-1">{user?.username}</p>
              <p className="text-[10px] text-[#5D5CDE] font-bold uppercase tracking-widest">{user?.role}</p>
            </div>
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-[#F3F4FF] border border-[#E1E0FF] flex items-center justify-center overflow-hidden">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-5 h-5 text-[#5D5CDE]" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 cursor-pointer" />
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
