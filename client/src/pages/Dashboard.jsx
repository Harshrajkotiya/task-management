import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ClipboardList, PlusCircle, UserCheck } from 'lucide-react';
import MainLayout from '../components/common/MainLayout';
import StatCard from '../components/common/StatCard';
import taskService from '../services/taskService';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const tasks = await taskService.getTasks();
      const newStats = {
        total: tasks.length,
        pending: tasks.filter(t => t.status === 'Pending').length,
        inProgress: tasks.filter(t => t.status === 'In Progress').length,
        completed: tasks.filter(t => t.status === 'Completed').length,
      };
      setStats(newStats);
    } catch (error) {
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-10 animate-fade-in">
        <header>
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h2>
          <p className="text-gray-400 text-sm">Welcome back, {user?.username}!</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title={isAdmin ? "Total Tasks" : "My Tasks"} 
            value={stats.total} 
            subtitle={isAdmin ? "All tasks created so far" : "All tasks assigned to you"}
            colorClass="blue"
          />
          <StatCard 
            title="Pending Tasks" 
            value={stats.pending} 
            subtitle="Tasks waiting to be started"
            colorClass="orange"
          />
          <StatCard 
            title="In Progress" 
            value={stats.inProgress} 
            subtitle={isAdmin ? "Tasks currently being worked on" : "Tasks you're currently working on"}
            colorClass="purple"
          />
          <StatCard 
            title="Completed Tasks" 
            value={stats.completed} 
            subtitle="Tasks finished successfully"
            colorClass="green"
          />
        </div>

        {/* Quick Actions / Activity Section */}
        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-6">Quick actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              onClick={() => navigate('/tasks')}
              className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100 transition-all cursor-pointer flex items-center gap-6 group"
            >
              <div className="p-4 bg-indigo-50 rounded-2xl group-hover:bg-[#5D5CDE] transition-colors">
                <ClipboardList className="w-6 h-6 text-[#5D5CDE] group-hover:text-white" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">All tasks</h4>
                <p className="text-gray-400 text-xs mt-1">View and manage all posted tasks</p>
              </div>
            </div>

            {isAdmin && (
              <div 
                onClick={() => navigate('/tasks', { state: { openCreateModal: true } })}
                className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100 transition-all cursor-pointer flex items-center gap-6 group"
              >
                <div className="p-4 bg-indigo-50 rounded-2xl group-hover:bg-[#5D5CDE] transition-colors">
                  <PlusCircle className="w-6 h-6 text-[#5D5CDE] group-hover:text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Create Task</h4>
                  <p className="text-gray-400 text-xs mt-1">Create new task and post</p>
                </div>
              </div>
            )}

            {!isAdmin && (
              <div 
                className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6 opacity-60 grayscale"
              >
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <UserCheck className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-400 text-lg">Admin View</h4>
                  <p className="text-gray-400 text-xs mt-1">Restricted to administrators</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
