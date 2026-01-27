const { db } = require('../config/firebase');

const taskController = {
  /**
   * Create a new task
   * Access: Admin only
   */
  createTask: async (req, res) => {
    try {
      const { title, description, status, assignedTo } = req.body;
      const createdBy = req.user.id;

      // Validation
      if (!title || !description) {
        return res.status(400).json({ message: 'Title and description are required' });
      }

      const newTask = {
        title,
        description,
        status: status || 'Pending', // Default to Pending
        assignedTo: assignedTo || createdBy,
        createdBy,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await db.collection('tasks').add(newTask);

      res.status(201).json({
        id: docRef.id,
        ...newTask,
      });
    } catch (error) {
      console.error('Create task error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  /**
   * Get all tasks
   * Admin: Can see all tasks
   * User: Can only see tasks assigned to them
   */
  getAllTasks: async (req, res) => {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;

      let tasksQuery = db.collection('tasks');

      if (userRole !== 'admin') {
        tasksQuery = tasksQuery.where('assignedTo', '==', userId);
      }

      const snapshot = await tasksQuery.orderBy('createdAt', 'desc').get();
      const tasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      res.json(tasks);
    } catch (error) {
      console.error('Get tasks error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  /**
   * Update task
   * Admin: Can update any field
   * User: Can only update 'status' field for assigned tasks
   */
  updateTask: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;
      const updates = req.body;

      const docRef = db.collection('tasks').doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        return res.status(404).json({ message: 'Task not found' });
      }

      const task = doc.data();

      // Check access and apply restrictions
      let finalUpdates = {};

      if (userRole === 'admin') {
        // Admin can update anything
        finalUpdates = { ...updates };
      } else {
        // Regular user check
        if (task.assignedTo !== userId) {
          return res.status(403).json({ message: 'Access forbidden: You can only update your assigned tasks' });
        }

        // User can ONLY update status
        if (updates.status) {
          const allowedStatuses = ['Pending', 'In Progress', 'Completed'];
          if (!allowedStatuses.includes(updates.status)) {
            return res.status(400).json({ message: 'Invalid status value' });
          }
          finalUpdates = { status: updates.status };
        } else {
          return res.status(400).json({ message: 'Users can only update the task status' });
        }
        
        // Ensure no other fields are updated by a regular user
        const updateFields = Object.keys(updates);
        if (updateFields.length > 1 || (updateFields.length === 1 && updateFields[0] !== 'status')) {
             return res.status(403).json({ message: 'Regular users are only permitted to update the status field' });
        }
      }

      finalUpdates.updatedAt = new Date();
      await docRef.update(finalUpdates);

      res.json({
        id,
        ...task,
        ...finalUpdates,
      });
    } catch (error) {
      console.error('Update task error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  /**
   * Delete task
   * Access: Admin only
   */
  deleteTask: async (req, res) => {
    try {
      const { id } = req.params;

      const docRef = db.collection('tasks').doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        return res.status(404).json({ message: 'Task not found' });
      }

      await docRef.delete();

      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error('Delete task error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  /**
   * Get task by ID
   */
  getTaskById: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;

      const doc = await db.collection('tasks').doc(id).get();

      if (!doc.exists) {
        return res.status(404).json({ message: 'Task not found' });
      }

      const task = { id: doc.id, ...doc.data() };

      if (userRole !== 'admin' && task.assignedTo !== userId) {
        return res.status(403).json({ message: 'Access forbidden' });
      }

      res.json(task);
    } catch (error) {
      console.error('Get task error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  /**
   * Get all users (for assignment)
   */
  getAllUsers: async (req, res) => {
    try {
      const snapshot = await db.collection('users').get();
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        email: doc.data().email,
        username: doc.data().username,
        role: doc.data().role,
      }));

      res.json(users);
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
};

module.exports = taskController;
