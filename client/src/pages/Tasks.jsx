import { useState, useEffect } from 'react';
import MainLayout from '../components/common/MainLayout';
import { useAuth } from '../context/AuthContext';
import taskService from '../services/taskService';
import { toast } from 'react-toastify';
import PageHeader from '../components/common/PageHeader';
import Modal from '../components/common/Modal';
import DeleteModal from '../components/common/DeleteModal';
import TaskForm from '../components/TaskForm';
import UpdateStatusForm from '../components/UpdateStatusForm';
import TaskDetailPanel from '../components/TaskDetailPanel';
import TaskList from '../components/common/TaskList';

const Tasks = () => {
  const { user, isAdmin } = useAuth();

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
  const [isDetailOpen, setIsDetailOpen] = useState(false);
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

  return (
    <MainLayout>
      <div
        className={`flex h-full gap-10 relative overflow-hidden transition-all duration-500`}
      >
        <div className="flex-1 space-y-10 animate-fade-in overflow-y-auto custom-scrollbar">
          {/* Header Section */}
          <PageHeader
            title="All Tasks"
            subtitle="Manage, assign, and track tasks across your team."
          />
          <div className="flex gap-8 items-start">
            {/* List Section */}
            <div className={`${isDetailOpen ? 'w-3/5' : 'w-full'}`}>
              <TaskList
                tasks={tasks}
                users={users}
                isAdmin={isAdmin}
                onCreate={() => setIsCreateModalOpen(true)}
                onView={(task) => {
                  setSelectedTask(task);
                  setIsDetailOpen(true);
                }}
                onUpdateStatus={(task) => {
                  setSelectedTask(task);
                  setIsUpdateStatusModalOpen(true);
                }}
              />
            </div>
            {/* Detail Section (Admin Only - Panel) */}
            {isAdmin && isDetailOpen && (
              <div
                className={`right-0 h-full w-[400px] z-30 transition-transform duration-300 transform ${isDetailOpen ? 'translate-x-0' : 'translate-x-full'}`}
              >
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
        </div>
      </div>

      {/* Detail Modal (User Only) */}
      {!isAdmin && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title="Task Details"
        >
          <TaskDetailPanel
            task={selectedTask}
            users={users}
            isAdmin={isAdmin}
            currentUser={user}
            onClose={() => setIsDetailOpen(false)}
            onUpdateStatus={() => setIsUpdateStatusModalOpen(true)}
            onEdit={() => setIsEditModalOpen(true)}
            onDelete={() => setIsDeleteModalOpen(true)}
            showHeader={false}
          />
        </Modal>
      )}
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
        <UpdateStatusForm
          task={selectedTask}
          users={users}
          onSubmit={handleUpdateTask}
          onCancel={() => setIsUpdateStatusModalOpen(false)}
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

export default Tasks;
