// SmartPath Tracker Manager - Central Hub for All User Types
class TrackerManager {
    constructor() {
        this.socket = null;
        this.userType = null;
        this.userId = null;
        this.connectedStudents = new Map();
        this.isConnected = false;
    }

    // Initialize tracker based on user type
    init(userType, userId) {
        this.userType = userType;
        this.userId = userId;
        
        console.log(`🛡️ SmartPath Initialized for ${userType}: ${userId}`);
        
        this.connectToServer();
        this.setupUserSpecificFeatures();
        this.updateDashboard();
    }

    connectToServer() {
        // Connect to SmartPath server (update URL when deployed)
        this.socket = io('https://your-smartpath-server.railway.app');
        
        this.socket.on('connect', () => {
            this.isConnected = true;
            this.updateStatus('Connected to SmartPath', 'success');
            console.log('🔗 Connected to SmartPath server');
            
            // Register user type with server
            this.socket.emit('user-register', {
                userType: this.userType,
                userId: this.userId
            });
        });

        this.socket.on('location-update', (data) => {
            this.handleLocationUpdate(data);
        });

        this.socket.on('safety-alert', (data) => {
            this.handleSafetyAlert(data);
        });

        this.socket.on('emergency-alert', (data) => {
            this.handleEmergencyAlert(data);
        });

        this.socket.on('attendance-update', (data) => {
            this.handleAttendanceUpdate(data);
        });

        this.socket.on('disconnect', () => {
            this.isConnected = false;
            this.updateStatus('Disconnected - Limited functionality', 'warning');
        });
    }

    // USER-SPECIFIC FEATURES SETUP
    setupUserSpecificFeatures() {
        switch(this.userType) {
            case 'parent':
                this.setupParentFeatures();
                break;
            case 'teacher':
                this.setupTeacherFeatures();
                break;
            case 'student':
                this.setupStudentFeatures();
                break;
        }
    }

    // PARENT-SPECIFIC FEATURES
    setupParentFeatures() {
        console.log('👨‍👩‍👧‍👦 Setting up parent tracking features');
        
        // Load parent's children list
        this.loadChildrenList();
        
        // Set up periodic location requests for tracked children
        setInterval(() => {
            if (this.isConnected) {
                this.socket.emit('request-locations', { parentId: this.userId });
            }
        }, 10000);
    }

    // TEACHER-SPECIFIC FEATURES  
    setupTeacherFeatures() {
        console.log('👨‍🏫 Setting up classroom monitoring features');
        
        // Load class roster
        this.loadClassRoster();
        
        // Set up attendance monitoring
        this.startAttendanceMonitoring();
        
        // Emergency broadcast capability
        this.setupEmergencyBroadcast();
    }

    // STUDENT-SPECIFIC FEATURES
    setupStudentFeatures() {
        console.log('🎓 Setting up student safety features');
        
        // Start sharing location
        this.startLocationSharing();
        
        // Set up emergency button
        this.setupEmergencyButton();
        
        // Automatic check-ins
        this.setupAutomaticCheckins();
    }

    // LOCATION UPDATE HANDLER
    handleLocationUpdate(data) {
        const { studentId, location, studentName } = data;
        
        // Update connected students map
        this.connectedStudents.set(studentId, {
            ...location,
            name: studentName,
            lastUpdate: new Date()
        });

        // Update UI based on user type
        this.updateUserInterface();
    }

    // SAFETY ALERT HANDLER
    handleSafetyAlert(data) {
        const { studentId, alertType, message, location } = data;
        
        console.log(`🚨 Safety Alert: ${alertType} - ${message}`);
        
        // Show alert to user
        this.showAlertNotification(alertType, message, studentId);
        
        // Update dashboard
        this.updateDashboard();
    }

    // EMERGENCY ALERT HANDLER
    handleEmergencyAlert(data) {
        const { studentId, emergencyType, location, timestamp } = data;
        
        console.log(`🚨🚨 EMERGENCY: ${emergencyType} from student ${studentId}`);
        
        // Critical emergency - immediate action required
        this.triggerEmergencyProtocol(emergencyType, studentId, location);
    }

    // ATTENDANCE UPDATE HANDLER
    handleAttendanceUpdate(data) {
        const { present, absent, classId } = data;
        
        if (this.userType === 'teacher') {
            this.updateAttendanceDisplay(present, absent);
        }
    }

    // PARENT: LOAD CHILDREN LIST
    loadChildrenList() {
        // Mock data - in real app, fetch from API
        const children = [
            { id: '1', name: 'Khensani M.', grade: '4', avatar: '👦' },
            { id: '2', name: 'Lerato B.', grade: '3', avatar: '👧' }
        ];
        
        // Update UI
        this.renderChildrenList(children);
    }

    // TEACHER: LOAD CLASS ROSTER
    loadClassRoster() {
        // Mock class data
        const students = [
            { id: '1', name: 'Khensani M.', present: true },
            { id: '2', name: 'Lerato B.', present: true },
            { id: '3', name: 'Thabo K.', present: false },
            { id: '4', name: 'Zanele N.', present: true }
        ];
        
        this.renderClassRoster(students);
    }

    // STUDENT: START LOCATION SHARING
    startLocationSharing() {
        if (!navigator.geolocation) {
            console.warn('GPS not available');
            return;
        }

        // Share location every 30 seconds
        setInterval(() => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        timestamp: Date.now()
                    };

                    if (this.isConnected) {
                        this.socket.emit('student-location', {
                            studentId: this.userId,
                            location: location,
                            userType: 'student'
                        });
                    }
                },
                (error) => {
                    console.error('GPS Error:', error);
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        }, 30000);
    }

    // STUDENT: EMERGENCY BUTTON
    setupEmergencyButton() {
        const emergencyBtn = document.getElementById('emergency-btn');
        if (emergencyBtn) {
            emergencyBtn.addEventListener('click', () => {
                this.triggerEmergencyAlert();
            });
        }
    }

    // STUDENT: TRIGGER EMERGENCY
    triggerEmergencyAlert() {
        if (!this.isConnected) {
            alert('Cannot send emergency - no connection');
            return;
        }

        if (confirm('🚨 Are you sure you want to send an EMERGENCY alert?')) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    this.socket.emit('emergency-alert', {
                        studentId: this.userId,
                        emergencyType: 'student_emergency',
                        location: location,
                        timestamp: Date.now()
                    });

                    alert('🚨 Emergency alert sent! Help is on the way.');
                },
                (error) => {
                    // Send without location if GPS fails
                    this.socket.emit('emergency-alert', {
                        studentId: this.userId,
                        emergencyType: 'student_emergency',
                        timestamp: Date.now()
                    });
                    
                    alert('🚨 Emergency alert sent! Help is on the way.');
                }
            );
        }
    }

    // TEACHER: SEND CLASS ALERT
    sendClassAlert(message, alertType = 'info') {
        if (!this.isConnected) return;

        this.socket.emit('class-alert', {
            teacherId: this.userId,
            message: message,
            alertType: alertType,
            timestamp: Date.now()
        });
    }

    // UI UPDATE METHODS
    updateUserInterface() {
        switch(this.userType) {
            case 'parent':
                this.updateParentUI();
                break;
            case 'teacher':
                this.updateTeacherUI();
                break;
            case 'student':
                this.updateStudentUI();
                break;
        }
    }

    updateParentUI() {
        // Update children status
        this.connectedStudents.forEach((student, studentId) => {
            const statusElement = document.getElementById(`child-status-${studentId}`);
            if (statusElement) {
                const timeAgo = this.getTimeAgo(student.lastUpdate);
                statusElement.innerHTML = `📍 ${student.name} - Updated ${timeAgo}`;
                statusElement.className = `status-indicator active`;
            }
        });
    }

    updateTeacherUI() {
        // Update class overview
        const presentCount = Array.from(this.connectedStudents.values()).length;
        const totalStudents = 4; // Mock total - should come from class data
        
        const presentElement = document.getElementById('present-count');
        const absentElement = document.getElementById('absent-count');
        
        if (presentElement) presentElement.textContent = presentCount;
        if (absentElement) absentElement.textContent = totalStudents - presentCount;
    }

    updateStudentUI() {
        // Update student's own status
        const statusElement = document.getElementById('student-status');
        if (statusElement) {
            statusElement.innerHTML = this.isConnected ? 
                '🟢 Location Sharing Active' : 
                '🔴 Location Sharing Offline';
        }
    }

    // HELPER METHODS
    getTimeAgo(timestamp) {
        const seconds = Math.floor((new Date() - timestamp) / 1000);
        
        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
        return `${Math.floor(seconds / 86400)} days ago`;
    }

    updateStatus(message, type = 'info') {
        const statusElement = document.getElementById('connection-status');
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.className = `status-${type}`;
        }
    }

    showAlertNotification(type, message, studentId) {
        // Create notification element
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert-notification ${type}`;
        alertDiv.innerHTML = `
            <div class="alert-icon">${this.getAlertIcon(type)}</div>
            <div class="alert-content">
                <div class="alert-title">${this.getAlertTitle(type)}</div>
                <div class="alert-message">${message}</div>
            </div>
            <button class="alert-dismiss" onclick="this.parentElement.remove()">×</button>
        `;

        // Add to notifications container
        const container = document.getElementById('alert-container');
        if (container) {
            container.appendChild(alertDiv);
        }

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (alertDiv.parentElement) {
                alertDiv.remove();
            }
        }, 10000);
    }

    getAlertIcon(type) {
        const icons = {
            'safety': '🚨',
            'emergency': '🚑',
            'info': 'ℹ️',
            'warning': '⚠️',
            'success': '✅'
        };
        return icons[type] || '🔔';
    }

    getAlertTitle(type) {
        const titles = {
            'safety': 'Safety Alert',
            'emergency': 'EMERGENCY',
            'info': 'Information',
            'warning': 'Warning',
            'success': 'Success'
        };
        return titles[type] || 'Notification';
    }

    // OPEN TRACKER MAP
    openTracker(studentId = null) {
        let url = 'tracker/map.html';
        if (studentId) {
            url += `?track=${studentId}`;
        }
        window.open(url, '_blank');
    }

    // NAVIGATION
    navigateTo(page) {
        window.location.href = page;
    }
}

// Global helper function to detect user type from page
function detectUserType() {
    const path = window.location.pathname;
    if (path.includes('parent.html')) return 'parent';
    if (path.includes('teacher.html')) return 'teacher';
    if (path.includes('student.html')) return 'student';
    return 'guest';
}

// Global helper function to get user ID (mock for demo)
function getUserId() {
    // In real app, get from authentication
    return Math.random().toString(36).substr(2, 9);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    const userType = detectUserType();
    const userId = getUserId();
    
    window.trackerManager = new TrackerManager();
    window.trackerManager.init(userType, userId);
});