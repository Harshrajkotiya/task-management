import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MainLayout from '../components/common/MainLayout';
import { useAuth } from '../context/AuthContext';
import taskService from '../services/taskService';
import { toast } from 'react-toastify';
import StatCard from '../components/common/StatCard';
import PageHeader from '../components/common/PageHeader';
import Modal from '../components/common/Modal';
// import DeleteModal from '../components/common/DeleteModal';
import TaskForm from '../components/TaskForm';
import UpdateStatusForm from '../components/UpdateStatusForm';
import TaskDetailDrawer from '../components/TaskDetailDrawer';
import Button from '../components/common/Button';
import TaskList from '../components/common/TaskList';
import { Plus, Table as TableIcon } from 'lucide-react';

const Tasks = () => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  // Data State
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);


  // UI State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, [isAdmin]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [tasksData, usersList] = await Promise.all([
        taskService.getTasks(),
        taskService.getUsers(),
      ]);

      setTasks(tasksData);

      const userMap = {};
      usersList.forEach((u) => (userMap[u.id] = u.username));
      setUsers(userMap);
    } catch (error) {
      toast.error('Failed to load tasks data');
    } finally {
      setLoading(false);
    }
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

  const handleDeleteTaskConfirm = async () => {
    if (!selectedTask) return;
    try {
      setDeleteLoading(true);
      await taskService.deleteTask(selectedTask.id);
      toast.success('Task deleted successfully');
      setIsDeleteModalOpen(false);
      setIsDetailDrawerOpen(false);
      setSelectedTask(null);
      fetchInitialData();
    } catch (error) {
      toast.error('Failed to delete task');
    } finally {
      setDeleteLoading(false);
    }
  };



  return (
    <MainLayout>
      <div
        className={`flex h-full gap-10 relative overflow-hidden transition-all duration-500 ${isDetailDrawerOpen ? 'mr-[450px]' : ''}`}
      >
        <div className="flex-1 space-y-10 animate-fade-in overflow-y-auto custom-scrollbar">
          {/* Header Section */}
          <PageHeader
            title="All Tasks"
            subtitle="Manage, assign, and track tasks across your team."
          />

          <TaskList
            tasks={tasks}
            users={users}
            isAdmin={isAdmin}
            onCreate={() => setIsCreateModalOpen(true)}
            onView={(task) => {
              setSelectedTask(task);
              setIsDetailDrawerOpen(true);
            }}
            onUpdateStatus={(task) => {
              setSelectedTask(task);
              setIsUpdateStatusModalOpen(true);
            }}
          />
        </div >

        {/* Task Detail Panel (Slides in) */}
        < div
          className={`fixed top-0 right-0 h-full w-[450px] z-30 shadow-2xl transition-transform duration-500 transform ${isDetailDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <TaskDetailDrawer
            task={selectedTask}
            users={users}
            isAdmin={isAdmin}
            currentUser={user}
            onClose={() => setIsDetailDrawerOpen(false)}
            onUpdateStatus={() => setIsUpdateStatusModalOpen(true)}
            onEdit={() => setIsEditModalOpen(true)}
            onDelete={() => setIsDeleteModalOpen(true)}
          />
        </div >
      </div >

      {/* Modals */}
      < Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Task"
      >
        <TaskForm onSubmit={handleCreateTask} />
      </Modal >

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
        <UpdateStatusForm
          task={selectedTask}
          users={users}
          onSubmit={handleUpdateTask}
          onCancel={() => setIsUpdateStatusModalOpen(false)}
        />
      </Modal>

      {/* <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteTaskConfirm}
        loading={deleteLoading}
      /> */}
    </MainLayout >
  );
};

export default Tasks;
