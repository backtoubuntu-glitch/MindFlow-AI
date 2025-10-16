// Unified Communication Manager - The Nervous System of MindFlow-AI
class CommunicationManager {
    constructor() {
        this.socket = null;
        this.messages = new Map(); // userID -> message array
        this.contacts = new Map(); // userID -> contact info
        this.notifications = [];
        this.isConnected = false;
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadUserData();
        this.setupSocketConnection();
        this.setupUIListeners();
        this.loadContacts();
        console.log('💬 Communication Manager Initialized');
    }

    setupSocketConnection() {
        // Connect to our SmartPath server (simulated for now)
        this.socket = {
            emit: (event, data) => {
                console.log('📤 Emitting:', event, data);
                // Simulate server response
                this.simulateServerResponse(event, data);
            },
            on: (event, callback) => {
                console.log('📥 Listening for:', event);
            }
        };

        this.isConnected = true;
        this.showStatus('Connected to School Network', 'success');
    }

    simulateServerResponse(event, data) {
        // Simulate real-time messaging
        setTimeout(() => {
            switch(event) {
                case 'send-message':
                    this.receiveMessage({
                        id: Date.now(),
                        from: data.to, // Simulate reply
                        to: data.from,
                        message: this.generateAutoReply(data.message),
                        timestamp: new Date(),
                        type: 'text'
                    });
                    break;
                case 'absence-alert':
                    this.handleAbsenceAlert(data);
                    break;
            }
        }, 1000 + Math.random() * 2000);
    }

    generateAutoReply(message) {
        const replies = {
            teacher: [
                "Thanks for your message! I'll review this and get back to you during school hours.",
                "Message received. I'll address this in our next class.",
                "Appreciate the update. Let's discuss this further."
            ],
            parent: [
                "Thank you for reaching out. Your child's education is important to us.",
                "Message received. We'll ensure your concern is addressed.",
                "Thanks for the update. We're here to support your child's learning."
            ],
            student: [
                "Great question! Let's explore this together in our next session.",
                "Thanks for sharing. Keep up the good work!",
                "I appreciate your message. Learning is a journey we take together."
            ]
        };

        const role = this.currentUser?.role || 'teacher';
        return replies[role][Math.floor(Math.random() * replies[role].length)];
    }

    // MESSAGE MANAGEMENT
    sendMessage(toUserId, message, type = 'text') {
        if (!this.isConnected) {
            this.showError('Not connected to network');
            return false;
        }

        const messageData = {
            id: Date.now(),
            from: this.currentUser.id,
            to: toUserId,
            message: message,
            timestamp: new Date(),
            type: type,
            status: 'sent'
        };

        // Add to local storage
        this.addMessageToHistory(toUserId, messageData);
        
        // Send via socket
        this.socket.emit('send-message', messageData);

        // Update UI
        this.updateMessageUI(messageData);
        
        // Notify Khensani
        if (window.khensani) {
            window.khensani.addMessage('system', Message sent to );
        }

        return true;
    }

    receiveMessage(messageData) {
        // Add to message history
        this.addMessageToHistory(messageData.from, messageData);
        
        // Show notification
        this.showNotification({
            title: New message from ,
            message: messageData.message.substring(0, 50) + '...',
            type: 'message',
            from: messageData.from
        });

        // Update UI
        this.updateMessageUI(messageData);

        // Play notification sound
        this.playNotificationSound();

        // Notify Khensani
        if (window.khensani) {
            window.khensani.addMessage('system', New message from );
        }
    }

    addMessageToHistory(userId, messageData) {
        if (!this.messages.has(userId)) {
            this.messages.set(userId, []);
        }
        this.messages.get(userId).push(messageData);
        
        // Keep only last 100 messages per conversation
        if (this.messages.get(userId).length > 100) {
            this.messages.set(userId, this.messages.get(userId).slice(-100));
        }
    }

    // ABSENCE & ALERT SYSTEM
    reportAbsence(studentId, reason = 'Unknown') {
        const alertData = {
            studentId: studentId,
            reporterId: this.currentUser.id,
            reason: reason,
            timestamp: new Date(),
            location: this.getCurrentLocation(),
            type: 'absence'
        };

        this.socket.emit('absence-alert', alertData);
        
        // Show confirmation
        this.showAlert('Absence reported', Absence reported for , 'warning');
        
        // Log for analytics
        console.log('🚨 Absence Reported:', alertData);
    }

    handleAbsenceAlert(alertData) {
        const studentName = this.getContactName(alertData.studentId);
        const reporterName = this.getContactName(alertData.reporterId);
        
        const alertMessage = {
            title: '🚨 Student Absence Alert',
            message: ${studentName} is absent. Reported by . Reason: ,
            type: 'emergency',
            data: alertData,
            timestamp: new Date()
        };

        // Show emergency notification
        this.showNotification(alertMessage);

        // Auto-notify parents if user is teacher
        if (this.currentUser.role === 'teacher') {
            this.notifyParents(alertData.studentId, alertMessage);
        }

        // Emergency sound
        this.playEmergencySound();
    }

    notifyParents(studentId, alert) {
        // In real implementation, this would notify all parent contacts
        console.log('👨‍👩‍👧‍👦 Notifying parents of:', this.getContactName(studentId));
        
        // Simulate parent notification
        setTimeout(() => {
            this.showNotification({
                title: '📧 Parent Notified',
                message: Parents of  have been notified,
                type: 'info'
            });
        }, 2000);
    }

    // FILE SHARING SYSTEM
    async uploadFile(file, conversationId = null) {
        const formData = new FormData();
        formData.append('file', file);
        
        // Simulate upload
        this.showAlert('Uploading file...', 'Please wait', 'info');
        
        try {
            // Simulate upload delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const fileData = {
                id: Date.now(),
                name: file.name,
                type: file.type,
                size: file.size,
                url: URL.createObjectURL(file), // Local URL for demo
                uploadedBy: this.currentUser.id,
                timestamp: new Date()
            };

            // Send as message
            if (conversationId) {
                this.sendMessage(conversationId, Shared file: , 'file', fileData);
            }

            this.showAlert('File uploaded successfully!', ${file.name} is now shared, 'success');
            return fileData;
            
        } catch (error) {
            this.showError('File upload failed: ' + error.message);
            return null;
        }
    }

    // UI MANAGEMENT
    updateMessageUI(messageData) {
        // This will be implemented in the communication hub UI
        if (window.updateChatUI) {
            window.updateChatUI(messageData);
        }
    }

    showNotification(notification) {
        this.notifications.push(notification);
        
        // Show browser notification if permitted
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(notification.title, {
                body: notification.message,
                icon: '/assets/icons/mindflow-icon.png'
            });
        }

        // Update notification counter
        this.updateNotificationCounter();
        
        // Add to notification center
        this.addToNotificationCenter(notification);
    }

    updateNotificationCounter() {
        const counter = document.getElementById('notificationCounter');
        if (counter) {
            const unread = this.notifications.filter(n => !n.read).length;
            counter.textContent = unread > 0 ? unread : '';
            counter.style.display = unread > 0 ? 'block' : 'none';
        }
    }

    // UTILITIES
    loadUserData() {
        // Simulate user data - in real app, this comes from authentication
        this.currentUser = {
            id: 'user_' + Date.now(),
            name: 'Demo User',
            role: 'teacher', // Will be set based on page
            avatar: '👨‍🏫'
        };

        // Detect role from page
        const path = window.location.pathname;
        if (path.includes('student.html')) {
            this.currentUser.role = 'student';
            this.currentUser.avatar = '🎓';
            this.currentUser.name = 'Khensani Student';
        } else if (path.includes('parent.html')) {
            this.currentUser.role = 'parent';
            this.currentUser.avatar = '👨‍👩‍👧‍👦';
            this.currentUser.name = 'Concerned Parent';
        }
    }

    loadContacts() {
        // Simulate contact list
        this.contacts.set('teacher_1', { id: 'teacher_1', name: 'Mr. Johnson', role: 'teacher', avatar: '👨‍🏫', online: true });
        this.contacts.set('student_1', { id: 'student_1', name: 'Khensani M.', role: 'student', avatar: '🎓', online: true });
        this.contacts.set('student_2', { id: 'student_2', name: 'Lerato B.', role: 'student', avatar: '👧', online: false });
        this.contacts.set('parent_1', { id: 'parent_1', name: 'Mrs. M.', role: 'parent', avatar: '👩', online: true });
    }

    getContactName(userId) {
        return this.contacts.get(userId)?.name || 'Unknown User';
    }

    getCurrentLocation() {
        // Simulate location - in real app, this uses GPS
        return { lat: -25.747, lng: 28.229, name: 'School Campus' };
    }

    showStatus(message, type) {
        console.log(🔔 : );
        // Would update a status indicator in UI
    }

    showError(message) {
        this.showStatus(message, 'error');
        alert('Error: ' + message);
    }

    showAlert(title, message, type) {
        // Would show a nice alert in UI
        console.log(💡 :  - );
    }

    playNotificationSound() {
        // Simulate notification sound
        console.log('🔊 Playing notification sound');
    }

    playEmergencySound() {
        // Simulate emergency sound
        console.log('🚨 Playing emergency sound');
    }

    // PUBLIC API
    getConversationHistory(userId) {
        return this.messages.get(userId) || [];
    }

    getContacts() {
        return Array.from(this.contacts.values());
    }

    getUnreadCount() {
        return this.notifications.filter(n => !n.read).length;
    }

    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.updateNotificationCounter();
        }
    }
}

// Global communication instance
window.communicationManager = new CommunicationManager();
