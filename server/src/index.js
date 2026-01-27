const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const authRoutes = require('./routes/authRoutes');

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Task Management API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
