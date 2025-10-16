// SmartPath Tracker Manager - Central Hub for All User Types
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
        this.updateDashboard();
    }

    connectToServer() {
        this.socket = io('https://your-smartpath-server.railway.app');
        this.socket.on('connect', () => {
            this.isConnected = true;
            this.updateStatus('Connected to SmartPath', 'success');
            console.log('🔗 Connected to SmartPath server');
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

    setupParentFeatures() {
        console.log('👨‍👩‍👧‍👦 Setting up parent tracking features');
        this.loadChildrenList();
        setInterval(() => {
            if (this.isConnected) {
                this.socket.emit('request-locations', { parentId: this.userId });
            }
        }, 10000);
    }

    setupTeacherFeatures() {
        console.log('👨‍🏫 Setting up classroom monitoring features');
        this.loadClassRoster();
        this.startAttendanceMonitoring();
        this.setupEmergencyBroadcast();
    }

    setupStudentFeatures() {
        console.log('🎓 Setting up student safety features');
        this.startLocationSharing();
        this.setupEmergencyButton();
        this.setupAutomaticCheckins();
    }

    handleLocationUpdate(data) {
        const { studentId, location, studentName } = data;
        this.connectedStudents.set(studentId, {
            ...location,
            name: studentName,
            lastUpdate: new Date()
        });
        this.updateUserInterface();
    }

    handleSafetyAlert(data) {
        const { studentId, alertType, message, location } = data;
        console.log(\🚨 Safety Alert: \ - \\);
        this.showAlertNotification(alertType, message, studentId);
        this.updateDashboard();
    }

    handleEmergencyAlert(data) {
        const { studentId, emergencyType, location, timestamp } = data;
        console.log(\🚨🚨 EMERGENCY: \ from student \\);
        this.triggerEmergencyProtocol(emergencyType, studentId, location);
    }

    handleAttendanceUpdate(data) {
        const { present, absent, classId } = data;
        if (this.userType === 'teacher') {
            this.updateAttendanceDisplay(present, absent);
        }
    }

    loadChildrenList() {
        const children = [
            { id: '1', name: 'Khensani M.', grade: '4', avatar: '👦' },
            { id: '2', name: 'Lerato B.', grade: '3', avatar: '👧' }
        ];
        this.renderChildrenList(children);
    }

    loadClassRoster() {
        const students = [
            { id: '1', name: 'Khensani M.', present: true },
            { id: '2', name: 'Lerato B.', present: true },
            { id: '3', name: 'Thabo K.', present: false },
            { id: '4', name: 'Zanele N.', present: true }
        ];
        this.renderClassRoster(students);
    }

    startLocationSharing() {
        if (!navigator.geolocation) {
            console.warn('GPS not available');
            return;
        }
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

    setupEmergencyButton() {
        const emergencyBtn = document.getElementById('emergency-btn');
        if (emergencyBtn) {
            emergencyBtn.addEventListener('click', () => {
                this.triggerEmergencyAlert();
            });
        }
    }

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

    sendClassAlert(message, alertType = 'info') {
        if (!this.isConnected) return;
        this.socket.emit('class-alert', {
            teacherId: this.userId,
            message: message,
            alertType: alertType,
            timestamp: Date.now()
        });
    }

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
        this.connectedStudents.forEach((student, studentId) => {
            const statusElement = document.getElementById(\child-status-\\);
            if (statusElement) {
                const timeAgo = this.getTimeAgo(student.lastUpdate);
                statusElement.innerHTML = \📍 \ - Updated \\;
                statusElement.className = \status-indicator active\;
            }
        });
    }

    updateTeacherUI() {
        const presentCount = Array.from(this.connectedStudents.values()).length;
        const totalStudents = 4;
        const presentElement = document.getElementById('present-count');
        const absentElement = document.getElementById('absent-count');
        if (presentElement) presentElement.textContent = presentCount;
        if (absentElement) absentElement.textContent = totalStudents - presentCount;
    }

    updateStudentUI() {
        const statusElement = document.getElementById('student-status');
        if (statusElement) {
            statusElement.innerHTML = this.isConnected ? 
                '🟢 Location Sharing Active' : 
                '🔴 Location Sharing Offline';
        }
    }

    getTimeAgo(timestamp) {
        const seconds = Math.floor((new Date() - timestamp) / 1000);
        if (seconds < 60) return 'just now';
        if (seconds < 3600) return \\ minutes ago\;
        if (seconds < 86400) return \\ hours ago\;
        return \\ days ago\;
    }

    updateStatus(message, type = 'info') {
        const statusElement = document.getElementById('connection-status');
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.className = \status-\\;
        }
    }

    showAlertNotification(type, message, studentId) {
        const alertDiv = document.createElement('div');
        alertDiv.className = \lert-notification \\;
        alertDiv.innerHTML = \
            <div class=\"alert-icon\">\</div>
            <div class=\"alert-content\">
                <div class=\"alert-title\">\</div>
                <div class=\"alert-message\">\</div>
            </div>
            <button class=\"alert-dismiss\" onclick=\"this.parentElement.remove()\">×</button>
        \;
        const container = document.getElementById('alert-container');
        if (container) {
            container.appendChild(alertDiv);
        }
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

    openTracker(studentId = null) {
        let url = 'tracker/map.html';
        if (studentId) {
            url += \?track=\\;
        }
        window.open(url, '_blank');
    }

    navigateTo(page) {
        window.location.href = page;
    }
}

function detectUserType() {
    const path = window.location.pathname;
    if (path.includes('parent.html')) return 'parent';
    if (path.includes('teacher.html')) return 'teacher';
    if (path.includes('student.html')) return 'student';
    return 'guest';
}

function getUserId() {
    return Math.random().toString(36).substr(2, 9);
}

document.addEventListener('DOMContentLoaded', function() {
    const userType = detectUserType();
    const userId = getUserId();
    window.trackerManager = new TrackerManager();
    window.trackerManager.init(userType, userId);
});
