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
app.use(express.static(path.join(__dirname, '..')));

// Enhanced tracking storage with safety features
const studentLocations = new Map();
const userSessions = new Map();

// Track connection health
const connectionHealth = new Map();

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('🎯 TRACKER CONNECTION:', socket.id);
    
    // Health check interval
    const healthInterval = setInterval(() => {
        connectionHealth.set(socket.id, Date.now());
    }, 30000);

    // Send current locations to new client
    socket.emit('all-locations', Array.from(studentLocations.entries()));
    socket.emit('tracker-status', { 
        status: 'active', 
        studentsTracked: studentLocations.size,
        message: 'MindFlow Tracker Active 🎯'
    });

    // Handle student registration
    socket.on('student-register', (data) => {
        console.log('👤 STUDENT REGISTERED:', data.studentId, data.name);
        userSessions.set(data.studentId, {
            ...data,
            socketId: socket.id,
            registeredAt: new Date().toISOString(),
            lastActive: new Date().toISOString()
        });
        
        // Notify all clients
        io.emit('student-joined', {
            studentId: data.studentId,
            name: data.name,
            timestamp: new Date().toISOString()
        });
    });

    // Enhanced location tracking
    socket.on('student-location', (data) => {
        console.log('📍 LOCATION UPDATE:', data.studentId, data.location);
        
        // Validate data
        if (!data.studentId || !data.location) {
            console.log('❌ INVALID LOCATION DATA');
            return;
        }

        // Store enhanced location data
        studentLocations.set(data.studentId, {
            studentId: data.studentId,
            name: data.name || 'Unknown Student',
            location: data.location,
            socketId: socket.id,
            lastUpdate: new Date().toISOString(),
            accuracy: data.accuracy || 'high',
            battery: data.battery || 'unknown'
        });

        // Update last active
        if (userSessions.has(data.studentId)) {
            userSessions.get(data.studentId).lastActive = new Date().toISOString();
        }

        // Broadcast to all connected clients
        io.emit('location-update', {
            studentId: data.studentId,
            name: data.name,
            location: data.location,
            timestamp: new Date().toISOString(),
            type: 'location_update'
        });
    });

    // Handle location requests
    socket.on('get-locations', () => {
        socket.emit('all-locations', Array.from(studentLocations.entries()));
    });

    // Enhanced emergency alerts
    socket.on('emergency-alert', (data) => {
        console.log('🚨 EMERGENCY ALERT:', data);
        io.emit('emergency-alert', {
            ...data,
            timestamp: new Date().toISOString(),
            alertId: 'emergency-' + Date.now(),
            severity: 'high'
        });
        
        // Log emergency for safety
        console.log('🚨 SAFETY LOG - Emergency:', JSON.stringify(data));
    });

    // Enhanced class alerts (teacher broadcasts)
    socket.on('class-alert', (data) => {
        console.log('📢 CLASS ALERT:', data);
        io.emit('class-alert', {
            ...data,
            timestamp: new Date().toISOString(),
            alertId: 'class-' + Date.now(),
            from: data.teacher || 'System'
        });
    });

    // Track student activity (heartbeat)
    socket.on('student-heartbeat', (data) => {
        if (userSessions.has(data.studentId)) {
            userSessions.get(data.studentId).lastActive = new Date().toISOString();
        }
    });

    // Handle disconnection with cleanup
    socket.on('disconnect', () => {
        console.log('❌ DISCONNECTED:', socket.id);
        clearInterval(healthInterval);
        connectionHealth.delete(socket.id);
        
        // Find and remove locations for this socket
        const disconnectedStudents = [];
        for (let [studentId, location] of studentLocations.entries()) {
            if (location.socketId === socket.id) {
                disconnectedStudents.push(studentId);
                studentLocations.delete(studentId);
            }
        }
        
        // Notify about disconnections
        if (disconnectedStudents.length > 0) {
            io.emit('students-disconnected', {
                students: disconnectedStudents,
                timestamp: new Date().toISOString()
            });
        }
    });
});

// Enhanced HTTP Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.get('/learning', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'advanced-learning.html'));
});

app.get('/mobile', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'mobile-learning.html'));
});

// Tracker API Routes
app.get('/api/tracker/status', (req, res) => {
    res.json({
        status: 'active',
        server: 'MindFlow Tracker',
        version: '2.0.0',
        studentsTracked: studentLocations.size,
        activeConnections: io.engine.clientsCount,
        userSessions: userSessions.size,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

app.get('/api/tracker/locations', (req, res) => {
    const locations = Array.from(studentLocations.entries()).map(([id, data]) => ({
        studentId: id,
        name: data.name,
        location: data.location,
        lastUpdate: data.lastUpdate,
        accuracy: data.accuracy
    }));
    res.json(locations);
});

app.get('/api/tracker/students', (req, res) => {
    const students = Array.from(userSessions.entries()).map(([id, data]) => ({
        studentId: id,
        name: data.name,
        registeredAt: data.registeredAt,
        lastActive: data.lastActive
    }));
    res.json(students);
});

app.get('/api/tracker/health', (req, res) => {
    res.json({
        status: 'healthy',
        tracker: 'operational',
        websocket: 'active',
        memory: process.memoryUsage(),
        timestamp: new Date().toISOString()
    });
});

// Start enhanced server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🎯 MIND-FLOW TRACKER ACTIVATED on port ${PORT}`);
    console.log(`📍 Tracker Status: http://localhost:${PORT}/api/tracker/status`);
    console.log(`📊 Locations API: http://localhost:${PORT}/api/tracker/locations`);
    console.log(`👥 Students API: http://localhost:${PORT}/api/tracker/students`);
    console.log(`❤️ Health Check: http://localhost:${PORT}/api/tracker/health`);
    console.log(`🌐 WebSocket Ready: ws://localhost:${PORT}`);
    console.log(`🚀 TRACKER SYSTEM: BATTLE READY!`);
});
