const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { db } = require('../config/firebase');

const authController = {
  /**
   * Register a new user
   */
  signup: async (req, res) => {
    try {
      const { email, password, displayName, role } = req.body;

      // Check if user already exists
      const userRef = db.collection('users').where('email', '==', email);
      const snapshot = await userRef.get();

      if (!snapshot.empty) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user in Firestore
      const newUser = {
        email,
        password: hashedPassword,
        displayName,
        role: role || 'user', // Default to user
        createdAt: new Date(),
      };

      const docRef = await db.collection('users').add(newUser);

      // Generate JWT
      const token = jwt.sign(
        { id: docRef.id, email, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        token,
        user: { id: docRef.id, email, displayName, role: newUser.role }
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  /**
   * Login user
   */
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user in Firestore
      const userRef = db.collection('users').where('email', '==', email);
      const snapshot = await userRef.get();

      if (snapshot.empty) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();

      // Check password
      const isMatch = await bcrypt.compare(password, userData.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Generate JWT
      const token = jwt.sign(
        { id: userDoc.id, email: userData.email, role: userData.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: userDoc.id,
          email: userData.email,
          displayName: userData.displayName,
          role: userData.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = authController;
