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

// Store student locations in memory
const studentLocations = new Map();

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('New connection:', socket.id);
    socket.emit('all-locations', Array.from(studentLocations.entries()));

    socket.on('student-location', (data) => {
        studentLocations.set(data.studentId, {
            ...data.location,
            socketId: socket.id,
            lastUpdate: new Date().toISOString()
        });
        io.emit('location-update', data);
    });

    socket.on('disconnect', () => {
        for (let [studentId, location] of studentLocations.entries()) {
            if (location.socketId === socket.id) {
                studentLocations.delete(studentId);
            }
        }
    });
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.get('/learning', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'advanced-learning.html'));
});

app.get('/mobile', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'mobile-learning.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`MindFlow AI running on port ${PORT}`);
});
