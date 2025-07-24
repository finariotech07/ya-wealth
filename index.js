const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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