const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());
// Serve static files from the parent directory (where your HTML files are)
app.use(express.static(path.join(__dirname, '..')));

// Store student locations in memory
const studentLocations = new Map();

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('🔗 New connection:', socket.id);

    // Send current locations to new client
    socket.emit('all-locations', Array.from(studentLocations.entries()));

    // Handle student location updates
    socket.on('student-location', (data) => {
        console.log('📍 Location update:', data.studentId, data.location);
        
        // Store location
        studentLocations.set(data.studentId, {
            ...data.location,
            socketId: socket.id,
            lastUpdate: new Date().toISOString()
        });

        // Broadcast to all connected clients
        io.emit('location-update', data);
    });

    // Handle location requests
    socket.on('get-locations', () => {
        socket.emit('all-locations', Array.from(studentLocations.entries()));
    });

    // Handle emergency alerts
    socket.on('emergency-alert', (data) => {
        console.log('🚨 EMERGENCY ALERT:', data);
        io.emit('emergency-alert', data);
    });

    // Handle class alerts (teacher broadcasts)
    socket.on('class-alert', (data) => {
        console.log('📢 CLASS ALERT:', data);
        io.emit('class-alert', data);
    });

    // Handle user registration
    socket.on('user-register', (data) => {
        console.log('👤 User registered:', data.userType, data.userId);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('❌ Disconnected:', socket.id);
        
        // Remove locations for this socket
        for (let [studentId, location] of studentLocations.entries()) {
            if (location.socketId === socket.id) {
                studentLocations.delete(studentId);
            }
        }
    });
});

// HTTP Routes
app.get('/', (req, res) => {
    res.json({
        message: 'MindFlow AI - Learning Platform Server',
        status: 'Running',
        studentsTracked: studentLocations.size,
        connections: io.engine.clientsCount
    });
});

app.get('/api/locations', (req, res) => {
    res.json(Array.from(studentLocations.entries()));
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        connections: io.engine.clientsCount,
        studentsTracked: studentLocations.size
    });
});

// Serve the main learning hub
app.get('/learning', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'advanced-learning.html'));
});

app.get('/mobile', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'mobile-learning.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 MindFlow AI Server running on port ${PORT}`);
    console.log(`📍 API Health: http://localhost:${PORT}/api/health`);
    console.log(`🗺️ Locations API: http://localhost:${PORT}/api/locations`);
    console.log(`🌐 WebSocket: ws://localhost:${PORT}`);
});
