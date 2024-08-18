require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const credentials = require('./middleware/credentials');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(logger);
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Serve static files from the public and views/css directories
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'views', 'css')));
app.use('/img', express.static(path.join(__dirname, 'views', 'img')));
app.use('/js', express.static(path.join(__dirname, 'views', 'js')));
app.use('/scss', express.static(path.join(__dirname, 'views', 'scss')));
app.use('/fonts', express.static(path.join(__dirname, 'views', 'fonts')));


// Routes to serve additional HTML pages
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});
app.get('/tables', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'tables.html'));
});
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});
app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'profile.html'));
});
app.get('/rtl', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'rtl.html'));
});
app.get('/sign-in', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'sign-in.html'));
});
app.get('/sign-up', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'sign-up.html'));
});
app.get('/virtual-reality', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'virtual-reality.html'));
});
app.get('/billing', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'billing.html'));
});

// API routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

// Apply JWT verification middleware for protected routes
app.use(verifyJWT);
app.use('/user', require('./routes/api/user'));
app.use('/client', require('./routes/api/client'));
app.use('/api/demandeur', require('./routes/api/demandeur'));
app.use('/api/ticket', require('./routes/api/ticket'));

// Handle 404 errors
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

// Error handling middleware
app.use(errorHandler);

// Start the server
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
