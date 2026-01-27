import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MainLayout from '../components/common/MainLayout';
import { useAuth } from '../context/AuthContext';
import taskService from '../services/taskService';
import { toast } from 'react-toastify';
import StatCard from '../components/common/StatCard';
import Modal from '../components/common/Modal';
import TaskForm from '../components/TaskForm';
import Button from '../components/common/Button';
import { Plus, Table as TableIcon, Edit, Trash2, Eye } from 'lucide-react';

const Tasks = () => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState({}); // To map userId to username
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
    fetchUsers();
    
    // Check if redirected from dashboard to open create modal
    if (location.state?.openCreateModal && isAdmin) {
      setIsCreateModalOpen(true);
    }
  }, [isAdmin, location.state]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTasks();
      setTasks(data);
      updateStats(data);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
     try {
       const userList = await taskService.getUsers();
       const userMap = {};
       userList.forEach(u => userMap[u.id] = u.username);
       setUsers(userMap);
     } catch (error) {}
  };

  const updateStats = (taskList) => {
    setStats({
      total: taskList.length,
      pending: taskList.filter(t => t.status === 'Pending').length,
      inProgress: taskList.filter(t => t.status === 'In Progress').length,
      completed: taskList.filter(t => t.status === 'Completed').length,
    });
  };

  const handleCreateTask = async (taskData) => {
    try {
      await taskService.createTask(taskData);
      toast.success('Task created successfully');
      setIsCreateModalOpen(false);
      fetchTasks();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to create task');
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await taskService.updateTask(selectedTask.id, taskData);
      toast.success('Task updated successfully');
      setIsEditModalOpen(false);
      setIsUpdateStatusModalOpen(false);
      fetchTasks();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskService.deleteTask(id);
      toast.success('Task deleted successfully');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'All') return true;
    return task.status === filter;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending': return 'bg-orange-50 text-orange-500 border-orange-100';
      case 'In Progress': return 'bg-indigo-50 text-[#5D5CDE] border-[#E1E0FF]';
      case 'Completed': return 'bg-emerald-50 text-emerald-500 border-emerald-100';
      default: return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header Section */}
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-1">{isAdmin ? "Tasks Management" : "My Tasks"}</h2>
            <p className="text-gray-400 text-sm">Track and update your assigned tasks.</p>
          </div>
          {isAdmin && (
             <Button onClick={() => setIsCreateModalOpen(true)} className="!w-auto flex items-center gap-2">
               <Plus className="w-4 h-4" /> Create Task
             </Button>
          )}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title={isAdmin ? "Total Tasks" : "My Tasks"} value={stats.total} colorClass="blue" />
          <StatCard title="Pending Tasks" value={stats.pending} colorClass="orange" />
          <StatCard title="In Progress" value={stats.inProgress} colorClass="purple" />
          <StatCard title="Completed Tasks" value={stats.completed} colorClass="green" />
        </div>

        {/* List Section */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-8">
          <div className="flex items-center gap-2 mb-8 border-b border-gray-50 pb-6">
            {['All', 'Pending', 'In Progress', 'Completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  filter === tab 
                    ? 'bg-[#F3F4FF] text-[#5D5CDE]' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-[10px] font-bold uppercase tracking-widest border-b border-gray-50">
                  <th className="pb-4 px-4">Assigned To</th>
                  <th className="pb-4 px-4">Task Title</th>
                  <th className="pb-4 px-4">Assigned By</th>
                  <th className="pb-4 px-4">Status</th>
                  <th className="pb-4 px-4">Created On</th>
                  <th className="pb-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {filteredTasks.length > 0 ? filteredTasks.map((task) => (
                  <tr key={task.id} className="border-b border-gray-50 group hover:bg-gray-50/50 transition-colors">
                    <td className="py-5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400">
                          {task.assignedTo?.substring(0, 4).toUpperCase() || "USR"}
                        </div>
                        <span className="font-bold text-gray-900">{users[task.assignedTo] || "User"}</span>
                      </div>
                    </td>
                    <td className="py-5 px-4 font-medium">{task.title}</td>
                    <td className="py-5 px-4 text-xs font-medium">{users[task.createdBy] || "Admin"}</td>
                    <td className="py-5 px-4">
                       <span className={`px-4 py-1.5 rounded-lg border text-[10px] font-extrabold uppercase tracking-wider ${getStatusStyle(task.status)}`}>
                        {task.status}
                       </span>
                    </td>
                    <td className="py-5 px-4 text-xs font-medium text-gray-400">
                      {task.createdAt?.seconds ? new Date(task.createdAt.seconds * 1000).toLocaleDateString() : new Date().toLocaleDateString()}
                    </td>
                    <td className="py-5 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => { setSelectedTask(task); setIsUpdateStatusModalOpen(true); }}
                          className="px-4 py-2 bg-indigo-50 text-[#5D5CDE] text-[10px] font-bold rounded-xl hover:bg-[#5D5CDE] hover:text-white transition-all shadow-sm"
                        >
                          Update Status
                        </button>
                        {isAdmin && (
                          <>
                            <button 
                              onClick={() => { setSelectedTask(task); setIsEditModalOpen(true); }}
                              className="p-2 text-gray-400 hover:text-[#5D5CDE] hover:bg-indigo-50 rounded-lg transition-all"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteTask(task.id)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="py-20 text-center">
                       <div className="flex flex-col items-center gap-4">
                         <TableIcon className="w-12 h-12 text-gray-100" />
                         <p className="text-gray-400 font-medium">No tasks found matching your criteria.</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Task">
        <TaskForm onSubmit={handleCreateTask} />
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Task">
        <TaskForm initialData={selectedTask} onSubmit={handleUpdateTask} />
      </Modal>

      <Modal isOpen={isUpdateStatusModalOpen} onClose={() => setIsUpdateStatusModalOpen(false)} title="Update Progress">
        <TaskForm initialData={selectedTask} onSubmit={handleUpdateTask} isStatusOnly={true} />
      </Modal>
    </MainLayout>
  );
};

export default Tasks;
