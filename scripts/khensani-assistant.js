// Khensani AI Assistant - The Heart of MindFlow-AI
class KhensaniAssistant {
    constructor() {
        this.isActive = false;
        this.userName = null;
        this.userRole = null;
        this.init();
    }

    init() {
        this.createChatInterface();
        this.loadUserPreferences();
        this.setupEventListeners();
        console.log('🤖 Khensani AI Assistant Initialized');
    }

    createChatInterface() {
        const chatHTML = \
            <div class='khensani-chat' id='khensaniChat'>
                <div class='khensani-avatar'></div>
                <div class='khensani-message'>Hi! I'm Khensani 👋</div>
            </div>
            <div class='khensani-modal' id='khensaniModal' style='display: none;'>
                <div class='modal-content'>
                    <div class='modal-header'>
                        <h3>Khensani AI Assistant</h3>
                        <button class='close-modal'>&times;</button>
                    </div>
                    <div class='chat-messages' id='chatMessages'></div>
                    <div class='chat-input'>
                        <input type='text' id='chatInput' placeholder='Ask Khensani anything...'>
                        <button id='sendMessage'>Send</button>
                    </div>
                </div>
            </div>
        \;
        
        document.body.insertAdjacentHTML('beforeend', chatHTML);
        this.addModalStyles();
    }

    addModalStyles() {
        const styles = \
            .khensani-modal {
                position: fixed;
                bottom: 80px;
                right: 20px;
                width: 350px;
                height: 500px;
                background: white;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                z-index: 1001;
                display: flex;
                flex-direction: column;
            }
            .modal-content {
                display: flex;
                flex-direction: column;
                height: 100%;
            }
            .modal-header {
                background: linear-gradient(135deg, #8B5FBF, #20c997);
                color: white;
                padding: 1rem;
                border-radius: 15px 15px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .chat-messages {
                flex: 1;
                padding: 1rem;
                overflow-y: auto;
            }
            .chat-input {
                padding: 1rem;
                border-top: 1px solid #eee;
                display: flex;
                gap: 0.5rem;
            }
            #chatInput {
                flex: 1;
                padding: 0.5rem;
                border: 1px solid #ddd;
                border-radius: 20px;
            }
        \;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    setupEventListeners() {
        document.getElementById('khensaniChat').addEventListener('click', () => {
            this.toggleChat();
        });

        document.getElementById('sendMessage').addEventListener('click', () => {
            this.sendMessage();
        });

        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        document.querySelector('.close-modal').addEventListener('click', () => {
            this.closeChat();
        });
    }

    toggleChat() {
        const modal = document.getElementById('khensaniModal');
        if (modal.style.display === 'none') {
            modal.style.display = 'block';
            this.isActive = true;
            this.showWelcomeMessage();
        } else {
            this.closeChat();
        }
    }

    closeChat() {
        document.getElementById('khensaniModal').style.display = 'none';
        this.isActive = false;
    }

    showWelcomeMessage() {
        const messages = document.getElementById('chatMessages');
        const welcomeText = this.getWelcomeMessage();
        
        messages.innerHTML = \
            <div class='message khensani-message'>
                <strong>Khensani:</strong> \
            </div>
        \;
    }

    getWelcomeMessage() {
        const path = window.location.pathname;
        
        if (path.includes('parent.html')) {
            return 'Hello! I\\'m here to help you track your child\\'s progress and ensure their safety. How can I assist you today?';
        } else if (path.includes('teacher.html')) {
            return 'Welcome, Teacher! I can help you manage your classroom, track attendance, and communicate with parents. What do you need help with?';
        } else if (path.includes('student.html')) {
            return 'Hi there! I\\'m Khensani, your learning assistant. I can help with homework, explain concepts, and keep you safe. What would you like to learn today?';
        } else if (path.includes('science')) {
            return 'Ready to explore science? I can explain complex concepts, help with experiments, and make learning fun!';
        } else if (path.includes('math')) {
            return 'Mathematics is amazing! I can help solve problems, explain formulas, and make numbers exciting!';
        } else {
            return 'Welcome to MindFlow-AI! I\\'m Khensani, your AI learning assistant. How can I help you learn and grow today?';
        }
    }

    async sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message) return;

        // Add user message to chat
        this.addMessage('user', message);
        input.value = '';

        // Show Khensani is typing
        this.showTypingIndicator();

        // Get AI response (simulated for now)
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateResponse(message);
            this.addMessage('khensani', response);
        }, 1000);
    }

    addMessage(sender, text) {
        const messages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = \message \-message\;
        messageDiv.innerHTML = \<strong>\:</strong> \\;
        
        messages.appendChild(messageDiv);
        messages.scrollTop = messages.scrollHeight;
    }

    showTypingIndicator() {
        const messages = document.getElementById('chatMessages');
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typingIndicator';
        typingDiv.className = 'message khensani-message';
        typingDiv.innerHTML = '<strong>Khensani:</strong> <em>is typing...</em>';
        
        messages.appendChild(typingDiv);
        messages.scrollTop = messages.scrollHeight;
    }

    hideTypingIndicator() {
        const typing = document.getElementById('typingIndicator');
        if (typing) {
            typing.remove();
        }
    }

    generateResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        // Subject-specific responses
        if (lowerMessage.includes('math') || lowerMessage.includes('calculate')) {
            return 'I love mathematics! I can help you with calculations, explain concepts, or practice problems. What specific math topic are you working on?';
        } else if (lowerMessage.includes('science') || lowerMessage.includes('experiment')) {
            return 'Science is fascinating! I can explain scientific concepts, help design experiments, or discuss recent discoveries. What science topic interests you?';
        } else if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
            return 'I\\'m here to help! I can assist with learning concepts, tracking progress, safety features, or navigating the platform. What do you need help with?';
        } else if (lowerMessage.includes('safe') || lowerMessage.includes('emergency')) {
            return 'Your safety is my priority. The emergency button alerts trusted contacts immediately. For non-emergencies, I can help you contact teachers or parents.';
        } else if (lowerMessage.includes('progress') || lowerMessage.includes('grade')) {
            return 'I can show you your learning progress, suggest areas for improvement, and celebrate your achievements! Check your dashboard for detailed analytics.';
        } else {
            return 'That\\'s an interesting question! I\\'m here to help you learn and stay safe. Could you tell me more about what you\\'d like to know?';
        }
    }

    // Progress celebration
    celebrateAchievement(achievement) {
        if (this.isActive) {
            this.addMessage('khensani', \🎉 Amazing! You just earned the \"\\" achievement! Keep up the great work!\);
        }
    }

    // Safety alert
    sendSafetyAlert(alert) {
        if (this.isActive) {
            this.addMessage('khensani', \🚨 Safety Alert: \. I\\'m here to help if you need assistance.\);
        }
    }

    // Learning encouragement
    provideEncouragement() {
        const encouragements = [
            'You\\'re doing great! Learning takes time and practice.',
            'Every expert was once a beginner. Keep going!',
            'Mistakes are proof that you\\'re trying. Well done!',
            'Your brain is growing stronger with every challenge!',
            'I\\'m proud of your progress today!'
        ];
        return encouragements[Math.floor(Math.random() * encouragements.length)];
    }
}

// Initialize Khensani when page loads
document.addEventListener('DOMContentLoaded', function() {
    window.khensani = new KhensaniAssistant();
}); 
