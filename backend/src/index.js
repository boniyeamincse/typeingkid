import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import lessonRoutes from './routes/lessonRoutes.js';
import educatorRoutes from './routes/educatorRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import practiceRoutes from './routes/practiceRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/educator', educatorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/practice', practiceRoutes);

app.get('/', (req, res) => {
  res.send('TypeMaster API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
