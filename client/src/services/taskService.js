import api from './api';

const taskService = {
  // Get all tasks (Admin sees all, User sees assigned)
  getTasks: async () => {
    const response = await api.get('/tasks');
    return response.data;
  },

  // Create task (Admin only)
  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  // Update task (Admin can update all, User only status)
  updateTask: async (id, updates) => {
    const response = await api.put(`/tasks/${id}`, updates);
    return response.data;
  },

  // Delete task (Admin only)
  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  // Get all users (Admin only - for assignment)
  getUsers: async () => {
    const response = await api.get('/tasks/users/all');
    return response.data;
  }
};

export default taskService;
