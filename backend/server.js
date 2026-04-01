const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');



// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// Serve uploaded content statically
app.use('/uploads', express.static('uploads'));

// Load routers
const auth = require('./routes/authRoutes');
const users = require('./routes/userRoutes');
const courses = require('./routes/courseRoutes');
const content = require('./routes/contentRoutes');
const assessments = require('./routes/assessmentRoutes');
const progress = require('./routes/progressRoutes');
const reports = require('./routes/reportRoutes');
const notifications = require('./routes/notificationRoutes');
const dashboard = require('./routes/dashboardRoutes');

// Mount routers
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/courses', courses);
app.use('/api/content', content);
app.use('/api/assessments', assessments);
app.use('/api/progress', progress);
app.use('/api/reports', reports);
app.use('/api/notifications', notifications);
app.use('/api/dashboard', dashboard);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server Error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));

// In server.js, update your CORS configuration
const cors = require('cors');

// Dynamic CORS configuration
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.FRONTEND_URL]  // Your Vercel URL will go here
  : ['http://localhost:3000', 'http://localhost:3001'];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
