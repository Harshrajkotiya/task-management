import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ClipboardList, PlusCircle } from 'lucide-react';
import MainLayout from '../components/common/MainLayout';
import StatCard from '../components/common/StatCard';
import Modal from '../components/common/Modal';
import DeleteModal from '../components/common/DeleteModal';
import TaskForm from '../components/TaskForm';
import TaskDetailPanel from '../components/TaskDetailPanel';
import Button from '../components/common/Button';
import taskService from '../services/taskService';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Data State
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  });

  // UI State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [tasksData, usersList] = await Promise.all([
        taskService.getTasks(),
        taskService.getUsers(),
      ]);

      setTasks(tasksData);
      updateStats(tasksData);

      const userMap = {};
      usersList.forEach((u) => (userMap[u.id] = u.username));
      setUsers(userMap);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (taskList) => {
    setStats({
      total: taskList.length,
      pending: taskList.filter((t) => t.status === 'Pending').length,
      inProgress: taskList.filter((t) => t.status === 'In Progress').length,
      completed: taskList.filter((t) => t.status === 'Completed').length,
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
      const updatedData = await taskService.updateTask(
        selectedTask.id,
        taskData
      );
      toast.success('Task updated successfully');
      setIsEditModalOpen(false);
      setIsUpdateStatusModalOpen(false);

      if (selectedTask) {
        setSelectedTask(updatedData);
      }

      fetchInitialData();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDeleteTaskConfirm = async () => {
    if (!selectedTask) return;
    try {
      setDeleteLoading(true);
      await taskService.deleteTask(selectedTask.id);
      toast.success('Task deleted successfully');
      setIsDeleteModalOpen(false);
      setIsDetailOpen(false);
      setSelectedTask(null);
      fetchInitialData();
    } catch (error) {
      toast.error('Failed to delete task');
    } finally {
      setDeleteLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-[#FFFBEB] text-[#F59E0B] border-[#FDE68A]';
      case 'In Progress':
        return 'bg-[#F5F3FF] text-[#5856D6] border-[#DDD6FE]';
      case 'Completed':
        return 'bg-[#ECFDF5] text-[#10B981] border-[#A7F3D0]';
      default:
        return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'All') return true;
    return task.status === filter;
  });

  return (
    <MainLayout>
      <div className="p-10 h-full overflow-y-auto custom-scrollbar">
        <header className="mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <StatCard
            title={isAdmin ? 'Total Tasks' : 'My Tasks'}
            value={stats.total}
            subtitle={
              isAdmin ? 'All tasks created so far' : 'All tasks assigned to you'
            }
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
            subtitle="Tasks currently being worked on"
            colorClass="purple"
          />
          <StatCard
            title="Completed Tasks"
            value={stats.completed}
            subtitle="Tasks finished successfully"
            colorClass="green"
          />
        </div>

        {!isAdmin && (
          <section className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">My Tasks</h3>

            <div className="flex gap-8 items-start">
              <div
                className={`${isDetailOpen ? 'w-3/5' : 'w-full'} bg-white rounded-3xl border border-[#E6E6E6] overflow-hidden transition-all duration-500`}
              >
                <div className="px-6 py-6 border-b border-[#F3F4F6] flex items-center gap-3">
                  {['All', 'Pending', 'In Progress', 'Completed'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setFilter(tab)}
                      className={`px-5 py-2 cursor-pointer rounded-xl text-[14px] font-bold transition-all border ${
                        filter === tab
                          ? 'bg-white text-[#5856D6] border-[#5856D6]'
                          : 'text-[#9CA3AF] border-[#E6E6E6] hover:bg-gray-50'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[#9CA3AF] text-[11px] font-bold uppercase tracking-widest border-b border-[#F3F4F6]">
                      <th className="py-6 px-6">Task ID</th>
                      <th className="py-6 px-6">Task Title</th>
                      <th className="py-6 px-6">Assigned To</th>
                      <th className="py-6 px-6">Status</th>
                      <th className="py-6 px-6">Created On</th>
                      <th className="py-6 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 font-bold">
                    {filteredTasks.map((task) => (
                      <tr
                        key={task.id}
                        className="border-b border-[#F3F4F6] hover:bg-gray-50/30 transition-colors group"
                      >
                        <td className="py-6 px-6 font-bold text-[14px] text-black">
                          #TSK{task.id?.substring(0, 6).toUpperCase()}
                        </td>
                        <td className="py-6 px-6 font-bold text-gray-900 text-[14px]">
                          {task.title}
                        </td>
                        <td className="py-6 px-6 font-bold text-gray-700 text-[14px]">
                          {users[task.assignedTo] || 'User'}
                        </td>
                        <td className="py-6 px-6">
                          <span
                            className={`px-4 py-1.5 rounded-xl border text-[11px] font-bold tracking-wider ${getStatusStyle(task.status)}`}
                          >
                            {task.status}
                          </span>
                        </td>
                        <td className="py-6 px-6 font-bold text-[#9CA3AF] text-[13px]">
                          {task.createdAt?.seconds
                            ? new Date(
                                task.createdAt.seconds * 1000
                              ).toLocaleDateString('en-GB')
                            : '02 Mar 2026'}
                        </td>
                        <td className="py-6 px-6 text-center">
                          <button
                            className="px-6 py-2 rounded-xl bg-[#F3F4F6] hover:bg-gray-200 text-gray-800 text-xs transition-all cursor-pointer font-bold"
                            onClick={() => {
                              setSelectedTask(task);
                              setIsDetailOpen(true);
                            }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {isDetailOpen && (
                <div className="w-2/5 animate-in slide-in-from-right duration-500">
                  <TaskDetailPanel
                    task={selectedTask}
                    users={users}
                    isAdmin={isAdmin}
                    currentUser={user}
                    onClose={() => setIsDetailOpen(false)}
                    onUpdateStatus={() => setIsUpdateStatusModalOpen(true)}
                    onEdit={() => setIsEditModalOpen(true)}
                    onDelete={() => setIsDeleteModalOpen(true)}
                  />
                </div>
              )}
            </div>
          </section>
        )}

        <section>
          <h3 className="text-xl font-bold text-gray-900 mb-8 px-2 tracking-tight">
            Quick actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              onClick={() => (isAdmin ? navigate('/tasks') : null)}
              className="bg-white p-12 rounded-[3.5rem] border border-[#E6E6E6] shadow-sm hover:shadow-xl hover:shadow-[#5D5CDE]/10 transition-all cursor-pointer flex items-center gap-8 group"
            >
              <div className="p-5 bg-indigo-50 rounded-[1.5rem] group-hover:bg-[#5D5CDE] transition-colors shadow-sm">
                <ClipboardList className="w-10 h-10 text-[#5D5CDE] group-hover:text-white" />
              </div>
              <div>
                <h4 className="font-extrabold text-gray-900 text-2xl mb-1">
                  {isAdmin ? 'All tasks' : 'My Task list'}
                </h4>
                <p className="text-[#9CA3AF] text-xs font-medium">
                  View and manage {isAdmin ? 'all posted' : 'your assigned'}{' '}
                  tasks
                </p>
              </div>
            </div>

            <div
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-white p-12 rounded-[3.5rem] border border-[#E6E6E6] shadow-sm hover:shadow-xl hover:shadow-[#5D5CDE]/10 transition-all cursor-pointer flex items-center gap-8 group"
            >
              <div className="p-5 bg-indigo-50 rounded-[1.5rem] group-hover:bg-[#5D5CDE] transition-colors shadow-sm">
                <PlusCircle className="w-10 h-10 text-[#5D5CDE] group-hover:text-white" />
              </div>
              <div>
                <h4 className="font-extrabold text-gray-900 text-2xl mb-1">
                  Create Task
                </h4>
                <p className="text-[#9CA3AF] text-xs font-medium">
                  Create new task and post
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Task"
      >
        <TaskForm onSubmit={handleCreateTask} />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Task"
      >
        <TaskForm initialData={selectedTask} onSubmit={handleUpdateTask} />
      </Modal>

      <Modal
        isOpen={isUpdateStatusModalOpen}
        onClose={() => setIsUpdateStatusModalOpen(false)}
        title="Task Status"
      >
        <TaskForm
          initialData={selectedTask}
          onSubmit={handleUpdateTask}
          isStatusOnly={true}
        />
      </Modal>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteTaskConfirm}
        loading={deleteLoading}
      />
    </MainLayout>
  );
};

export default Dashboard;
