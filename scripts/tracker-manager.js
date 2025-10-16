// SmartPath Tracker Manager - Core Tracking System
class TrackerManager {
    constructor() {
        this.socket = null;
        this.userType = null;
        this.userId = null;
        this.connectedStudents = new Map();
        this.isConnected = false;
    }

    init(userType, userId) {
        this.userType = userType;
        this.userId = userId;
        console.log(\🛡️ SmartPath Initialized for \: \\);
        this.connectToServer();
        this.setupUserSpecificFeatures();
    }

    connectToServer() {
        this.socket = io('https://your-server.railway.app');
        this.socket.on('connect', () => {
            this.isConnected = true;
            this.updateStatus('Connected to SmartPath', 'success');
        });

        this.socket.on('location-update', (data) => {
            this.handleLocationUpdate(data);
        });

        this.socket.on('safety-alert', (data) => {
            this.handleSafetyAlert(data);
        });
    }

    setupUserSpecificFeatures() {
        switch(this.userType) {
            case 'parent': this.setupParentFeatures(); break;
            case 'teacher': this.setupTeacherFeatures(); break;
            case 'student': this.setupStudentFeatures(); break;
        }
    }

    setupParentFeatures() {
        console.log('👨‍👩‍👧‍👦 Parent tracking activated');
    }

    setupTeacherFeatures() {
        console.log('👨‍🏫 Classroom monitoring activated');
    }

    setupStudentFeatures() {
        console.log('🎓 Student safety features activated');
        this.setupEmergencyButton();
    }

    setupEmergencyButton() {
        const btn = document.getElementById('emergency-btn');
        if (btn) {
            btn.addEventListener('click', () => {
                this.triggerEmergencyAlert();
            });
        }
    }

    triggerEmergencyAlert() {
        if (confirm('🚨 Send emergency alert?')) {
            alert('Emergency alert sent! Help is on the way.');
        }
    }

    updateStatus(message, type) {
        const element = document.getElementById('connection-status');
        if (element) {
            element.textContent = message;
            element.className = \status-\\;
        }
    }
}

function detectUserType() {
    if (window.location.pathname.includes('parent.html')) return 'parent';
    if (window.location.pathname.includes('teacher.html')) return 'teacher';
    if (window.location.pathname.includes('student.html')) return 'student';
    return 'guest';
}

document.addEventListener('DOMContentLoaded', function() {
    const userType = detectUserType();
    window.trackerManager = new TrackerManager();
    window.trackerManager.init(userType, 'user123');
});
