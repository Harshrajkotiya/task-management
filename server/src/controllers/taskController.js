const { admin, db } = require('../config/firebase');

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
        history: [{
          action: `Task created by ${req.user.username || 'Admin'}`,
          timestamp: new Date()
        }]
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
        // Regular user check: can only update tasks they created OR tasks assigned to them
        if (task.createdBy !== userId && task.assignedTo !== userId) {
          return res.status(403).json({ message: 'Access forbidden: You can only update tasks you created or are assigned to' });
        }

        // If it's THEIR task (created by them), they can update anything
        if (task.createdBy === userId) {
          finalUpdates = { ...updates };
        } 
        // If it's ONLY assigned to them, they can ONLY update status
        else if (task.assignedTo === userId) {
          if (updates.status) {
            const allowedStatuses = ['Pending', 'In Progress', 'Completed'];
            if (!allowedStatuses.includes(updates.status)) {
              return res.status(400).json({ message: 'Invalid status value' });
            }
            finalUpdates = { status: updates.status };
          } else {
            return res.status(400).json({ message: 'Users can only update the task status of tasks assigned to them' });
          }
        }
      }

      // Tracking history if status changes
      if (finalUpdates.status && finalUpdates.status !== task.status) {
        const historyEntry = {
          action: `Status updated to ${finalUpdates.status} by ${req.user.username || 'User'}`,
          timestamp: new Date()
        };
        
        // Use array union to add to history or initialize if it doesn't exist
        finalUpdates.history = admin.firestore.FieldValue.arrayUnion(historyEntry);
      }

      finalUpdates.updatedAt = new Date();
      await docRef.update(finalUpdates);

      // Fetch the updated document to return the full state including history
      const updatedDoc = await docRef.get();
      
      res.json({
        id: updatedDoc.id,
        ...updatedDoc.data(),
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

      const task = doc.data();
      const userId = req.user.id;
      const userRole = req.user.role;

      if (userRole !== 'admin' && task.createdBy !== userId) {
        return res.status(403).json({ message: 'Access forbidden: You can only delete tasks you created' });
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
