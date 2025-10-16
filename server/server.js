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
app.use(express.static(path.join(__dirname, '../public')));

// Store student locations in memory (for demo)
// In production, use Redis or database
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
    
    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('❌ Disconnected:', socket.id);
        
        // Remove locations for this socket (optional)
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
        message: 'SmartPath with Khensani - Tracking Server',
        status: 'Running',
        studentsTracked: studentLocations.size
    });
});

app.get('/api/locations', (req, res) => {
    res.json(Array.from(studentLocations.entries()));
});

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        timestamp: new Date().toISOString(),
        connections: io.engine.clientsCount
    });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 SmartPath Server running on port ${PORT}`);
    console.log(`📍 API Health: http://localhost:${PORT}/api/health`);
    console.log(`🗺️ Locations API: http://localhost:${PORT}/api/locations`);
});