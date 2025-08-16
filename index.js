const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ['http://localhost:3000','http//localhost:4000'], // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false // Set to false when using origin: '*'
}));

// Serve static files from public
app.use(express.static(path.join(__dirname, 'public')));

// Import auth routes
const authRoutes = require('./routes/auth.routes');
const newsRoutes = require('./routes/news.routes');
const blogRoutes = require('./routes/blog.routes');
const contactRoutes = require('./routes/contact.routes');
const advisoryRoutes = require('./routes/advisory.routes');

// Use auth routes
app.use('/api', authRoutes);
app.use('/api', newsRoutes);
app.use('/api', blogRoutes);
app.use('/api', contactRoutes);
app.use('/api', advisoryRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to YaWealth backend!');
});

// Centralized error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        // Optionally include stack in development
        ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 
