import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MainLayout from '../components/common/MainLayout';
import { useAuth } from '../context/AuthContext';
import taskService from '../services/taskService';
import { toast } from 'react-toastify';
import StatCard from '../components/common/StatCard';
import Modal from '../components/common/Modal';
import TaskForm from '../components/TaskForm';
import TaskDetailDrawer from '../components/TaskDetailDrawer';
import Button from '../components/common/Button';
import { Plus, Table as TableIcon, Edit, Trash2, Eye } from 'lucide-react';

const Tasks = () => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  
  // Data State
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });

  // UI State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, [isAdmin]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [tasksData, usersList] = await Promise.all([
        taskService.getTasks(),
        taskService.getUsers()
      ]);
      
      setTasks(tasksData);
      updateStats(tasksData);
      
      const userMap = {};
      usersList.forEach(u => userMap[u.id] = u.username);
      setUsers(userMap);
    } catch (error) {
      toast.error('Failed to load tasks data');
    } finally {
      setLoading(false);
    }
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
      fetchInitialData();
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
      
      if (selectedTask) {
        const updatedTask = { ...selectedTask, ...taskData };
        setSelectedTask(updatedTask);
      }
      
      fetchInitialData();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskService.deleteTask(id);
      toast.success('Task deleted successfully');
      setIsDetailDrawerOpen(false);
      fetchInitialData();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending': return 'bg-orange-50 text-orange-500 border-orange-100 font-extrabold';
      case 'In Progress': return 'bg-indigo-50 text-[#5D5CDE] border-[#E1E0FF] font-extrabold';
      case 'Completed': return 'bg-emerald-50 text-emerald-500 border-emerald-100 font-extrabold';
      default: return 'bg-gray-50 text-gray-500 border-gray-100 font-extrabold';
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'All') return true;
    return task.status === filter;
  });

  return (
    <MainLayout>
      <div className={`flex h-full gap-8 relative overflow-hidden transition-all duration-300 ${isDetailDrawerOpen ? 'mr-[400px]' : ''}`}>
        <div className="flex-1 space-y-8 animate-fade-in overflow-y-auto pr-4 custom-scrollbar">
          {/* Header Section */}
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">All Tasks</h2>
              <p className="text-gray-400 text-sm">Manage, assign, and track tasks across your team.</p>
            </div>
          </div>

          {/* List Section */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-8">
            <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-6">
              <div className="flex bg-white p-1 rounded-2xl border border-gray-100">
                {['All', 'Pending', 'In Progress', 'Completed'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                      filter === tab ? 'bg-indigo-50 text-[#5D5CDE]' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <Button onClick={() => setIsCreateModalOpen(true)} className="!w-auto flex items-center gap-2 !px-8">
                Create Task
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 text-[10px] font-bold uppercase tracking-widest border-b border-gray-50">
                    <th className="pb-6 px-4">Assigned To</th>
                    <th className="pb-6 px-4">Task Title</th>
                    <th className="pb-6 px-4">Assigned By</th>
                    <th className="pb-6 px-4">Status</th>
                    <th className="pb-6 px-4">Created On</th>
                    <th className="pb-6 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  {filteredTasks.map((task) => (
                    <tr key={task.id} className="border-b border-gray-50/50 hover:bg-gray-50/30 transition-colors group">
                      <td className="py-5 px-4 font-bold text-gray-400">#TSK{task.id?.substring(0, 6).toUpperCase()}</td>
                      <td className="py-5 px-4 font-bold text-gray-900">{task.title}</td>
                      <td className="py-5 px-4 font-bold text-gray-600">{users[task.assignedTo] || 'User'}</td>
                      <td className="py-5 px-4">
                        <span className={`px-4 py-1.5 rounded-xl border text-[10px] uppercase tracking-wider ${getStatusStyle(task.status)}`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="py-5 px-4 font-bold text-gray-400 text-xs">
                        {task.createdAt?.seconds ? new Date(task.createdAt.seconds * 1000).toLocaleDateString('en-GB') : '---'}
                      </td>
                      <td className="py-5 px-4 text-right">
                        <Button 
                          variant="secondary" 
                          className="!w-auto bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 !py-2 !px-8 text-xs font-bold text-gray-900 shadow-none"
                          onClick={() => { setSelectedTask(task); setIsDetailDrawerOpen(true); }}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Task Detail Drawer */}
        <div className={`fixed top-0 right-0 h-full w-[400px] z-30 transition-transform duration-300 transform ${isDetailDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
           <TaskDetailDrawer 
            task={selectedTask}
            users={users}
            isAdmin={isAdmin}
            currentUser={user}
            onClose={() => setIsDetailDrawerOpen(false)}
            onUpdateStatus={() => setIsUpdateStatusModalOpen(true)}
            onEdit={() => setIsEditModalOpen(true)}
            onDelete={() => handleDeleteTask(selectedTask.id)}
           />
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create Task">
        <TaskForm onSubmit={handleCreateTask} />
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Task">
        <TaskForm initialData={selectedTask} onSubmit={handleUpdateTask} />
      </Modal>

      <Modal isOpen={isUpdateStatusModalOpen} onClose={() => setIsUpdateStatusModalOpen(false)} title="Task Status">
        <TaskForm initialData={selectedTask} onSubmit={handleUpdateTask} isStatusOnly={true} />
      </Modal>
    </MainLayout>
  );
};

export default Tasks;
