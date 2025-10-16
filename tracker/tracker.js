// SmartPath with Khensani - Real-time Tracker
class SmartPathTracker {
    constructor() {
        this.map = null;
        this.socket = null;
        this.studentMarkers = new Map();
        this.isTracking = false;
        this.simulationInterval = null;
        
        this.init();
    }

    init() {
        this.initializeMap();
        this.connectToServer();
        this.setupEventListeners();
    }

    initializeMap() {
        // Centered on a typical school location (adjust coordinates as needed)
        this.map = L.map('map').setView([-25.7489, 28.2295], 16);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        // Add school boundary
        const schoolBounds = [
            [-25.7495, 28.2285],
            [-25.7495, 28.2315],
            [-25.7480, 28.2315],
            [-25.7480, 28.2285]
        ];

        this.schoolZone = L.polygon(schoolBounds, {
            color: 'green',
            fillColor: 'green',
            fillOpacity: 0.1,
            weight: 2
        }).addTo(this.map);

        // Add school building
        L.marker([-25.7489, 28.2295])
            .addTo(this.map)
            .bindPopup('🏫 Main School Building')
            .openPopup();
    }

    connectToServer() {
        // Connect to our backend server
        this.socket = io('https://your-server.railway.app'); // Update with your server URL
        
        this.socket.on('connect', () => {
            this.updateStatus('Connected to SmartPath network');
            console.log('Connected to server');
        });

        this.socket.on('location-update', (data) => {
            this.updateStudentLocation(data.studentId, data.location);
        });

        this.socket.on('all-locations', (locations) => {
            locations.forEach(([studentId, location]) => {
                this.updateStudentLocation(studentId, location);
            });
        });

        this.socket.on('disconnect', () => {
            this.updateStatus('Disconnected - using demo mode');
        });
    }

    updateStudentLocation(studentId, location) {
        const latLng = [location.lat, location.lng];
        
        if (this.studentMarkers.has(studentId)) {
            // Update existing marker
            this.studentMarkers.get(studentId).setLatLng(latLng);
        } else {
            // Create new marker
            const marker = L.marker(latLng, {
                icon: L.divIcon({
                    className: 'student-marker',
                    html: '👤',
                    iconSize: [30, 30]
                })
            }).addTo(this.map);
            
            marker.bindPopup(`<b>Student ${studentId}</b><br>Tracked by SmartPath`);
            this.studentMarkers.set(studentId, marker);
        }

        // Update info panel
        this.updateStudentInfo(studentId, location);
        
        // Check safety zone
        this.checkSafetyZone(studentId, latLng);
    }

    updateStudentInfo(studentId, location) {
        const studentElement = document.getElementById(`student${studentId}`);
        if (studentElement) {
            const locationElement = studentElement.querySelector('.location');
            const timeElement = studentElement.querySelector('.time');
            
            locationElement.textContent = `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
            timeElement.textContent = new Date().toLocaleTimeString();
        }
    }

    checkSafetyZone(studentId, location) {
        if (!this.schoolZone.getBounds().contains(location)) {
            this.triggerSafetyAlert(studentId, location);
        }
    }

    triggerSafetyAlert(studentId, location) {
        alert(`🚨 SAFETY ALERT: Student ${studentId} left school zone!`);
        
        // Visual alert on map
        const marker = this.studentMarkers.get(studentId);
        if (marker) {
            marker.setIcon(L.divIcon({
                className: 'alert-marker',
                html: '🚨',
                iconSize: [35, 35]
            }));
        }
    }

    // REAL GPS TRACKING
    async startRealTracking() {
        if (!navigator.geolocation) {
            alert('GPS not supported on this device');
            return;
        }

        this.isTracking = true;
        this.updateStatus('Active GPS Tracking - Live');

        // For demo purposes, we'll simulate multiple students
        // In real app, each device would have unique student ID
        const studentIds = ['1', '2'];
        
        studentIds.forEach(studentId => {
            navigator.geolocation.watchPosition(
                (position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        timestamp: Date.now()
                    };

                    // Send to server
                    if (this.socket.connected) {
                        this.socket.emit('student-location', {
                            studentId: studentId,
                            location: location
                        });
                    }
                    
                    // Update locally
                    this.updateStudentLocation(studentId, location);
                },
                (error) => {
                    console.error('GPS Error:', error);
                    this.updateStatus('GPS Error - Using demo simulation');
                    this.startSimulation();
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        });
    }

    // DEMO SIMULATION
    startSimulation() {
        this.isTracking = true;
        this.updateStatus('Demo Simulation Active');
        
        const studentIds = ['1', '2'];
        const baseLocations = {
            '1': [-25.7489, 28.2295],
            '2': [-25.7485, 28.2302]
        };

        this.simulationInterval = setInterval(() => {
            studentIds.forEach(studentId => {
                const baseLocation = baseLocations[studentId];
                const randomMove = [
                    baseLocation[0] + (Math.random() - 0.5) * 0.0005,
                    baseLocation[1] + (Math.random() - 0.5) * 0.0005
                ];

                const location = {
                    lat: randomMove[0],
                    lng: randomMove[1],
                    timestamp: Date.now()
                };

                // Send to server
                if (this.socket.connected) {
                    this.socket.emit('student-location', {
                        studentId: studentId,
                        location: location
                    });
                }

                // Update locally
                this.updateStudentLocation(studentId, location);
            });
        }, 3000);
    }

    stopTracking() {
        this.isTracking = false;
        if (this.simulationInterval) {
            clearInterval(this.simulationInterval);
        }
        this.updateStatus('Tracking Stopped');
    }

    updateStatus(message) {
        document.getElementById('status').textContent = `Status: ${message}`;
    }

    setupEventListeners() {
        document.getElementById('startBtn').addEventListener('click', () => {
            this.startRealTracking();
        });

        document.getElementById('simulateBtn').addEventListener('click', () => {
            this.startSimulation();
        });
    }
}

// Initialize tracker when page loads
let tracker;
document.addEventListener('DOMContentLoaded', () => {
    tracker = new SmartPathTracker();
});

// Global functions for HTML buttons
function startRealTracking() {
    if (tracker) tracker.startRealTracking();
}

function startSimulation() {
    if (tracker) tracker.startSimulation();
}

function stopTracking() {
    if (tracker) tracker.stopTracking();
}