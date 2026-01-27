import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ClipboardList,
  PlusCircle,
  Table as TableIcon,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  Filter
} from 'lucide-react';
import MainLayout from '../components/common/MainLayout';
import StatCard from '../components/common/StatCard';
import QuickActionCard from '../components/common/QuickActionCard';
import PageHeader from '../components/common/PageHeader';
import TaskList from '../components/common/TaskList';
import Modal from '../components/common/Modal';
import TaskForm from '../components/TaskForm';
import UpdateStatusForm from '../components/UpdateStatusForm';
import TaskDetailDrawer from '../components/TaskDetailDrawer';
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
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });

  // UI State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

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
      toast.error('Failed to load dashboard data');
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
      fetchInitialData(); // Refresh all
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

      // Update local state for the task in both the list and the drawer
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

  return (
    <MainLayout>
      <div className={`flex h-full gap-8 relative overflow-hidden transition-all duration-300 ${isDetailDrawerOpen ? 'mr-[400px]' : ''}`}>
        <div className="flex-1 space-y-10 animate-fade-in overflow-y-auto pr-4 custom-scrollbar">
          <PageHeader title="Dashboard" />

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title={isAdmin ? "Total Tasks" : "My Tasks"}
              value={stats.total}
              subtitle={isAdmin ? "All tasks created so far" : "All tasks assigned to you"}
              color="#3B82F6"
            />
            <StatCard title="Pending Tasks" value={stats.pending} subtitle="Tasks waiting to be started" color="#F59E0B" />
            <StatCard title="In Progress" value={stats.inProgress} subtitle="Tasks currently being worked on" color="#8B5CF6" />
            <StatCard title="Completed Tasks" value={stats.completed} subtitle="Tasks finished successfully" color="#10B981" />
          </div>

          {!isAdmin && (
            <section className="space-y-6">
              <PageHeader
                title="My Tasks"
                subtitle="Track and update your assigned tasks."
              />

              <TaskList
                tasks={tasks}
                users={users}
                isAdmin={false}
                onView={(task) => {
                  setSelectedTask(task);
                  setIsDetailDrawerOpen(true);
                }}
                onUpdateStatus={(task) => {
                  setSelectedTask(task);
                  setIsUpdateStatusModalOpen(true);
                }}
              />
            </section>
          )}
          {isAdmin && (
            <section>
              <h3 className="text-base font-semibold text-gray-900 mb-6">Quick actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <QuickActionCard
                  title={isAdmin ? "All tasks" : "My Task list"}
                  subtitle={`View and manage ${isAdmin ? "all posted" : "your assigned"} tasks`}
                  icon={ClipboardList}
                  onClick={() => navigate(isAdmin ? '/tasks' : '#')}
                />

                <QuickActionCard
                  title="Create Task"
                  subtitle="Create new task and post"
                  icon={PlusCircle}
                  onClick={() => setIsCreateModalOpen(true)}
                />
              </div>
            </section>
          )}
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
        <UpdateStatusForm
          task={selectedTask}
          users={users}
          onSubmit={handleUpdateTask}
          onCancel={() => setIsUpdateStatusModalOpen(false)}
        />
      </Modal>
    </MainLayout>
  );
};

export default Dashboard;
