// Basic functionality
console.log('MindFlow app loaded!');

// Loading screen simulation
window.addEventListener('load', function() {
    setTimeout(function() {
        document.getElementById('loadingScreen').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
    }, 2000);
});

// Grade Selection System
function selectGrade(grade) {
    console.log('Selected grade:', grade);
    
    // Save selected grade to localStorage
    localStorage.setItem('selectedGrade', grade);
    localStorage.setItem('userProgress', JSON.stringify({
        grade: grade,
        joined: new Date().toISOString(),
        subjects: {
            mathematics: { progress: 0, lastAccessed: null },
            sciences: { progress: 0, lastAccessed: null },
            english: { progress: 0, lastAccessed: null },
            social_sciences: { progress: 0, lastAccessed: null }
        },
        totalProgress: 0
    }));
    
    // Show loading feedback
    const gradeBtn = event.target.closest('.grade-btn');
    if (gradeBtn) {
        const originalHTML = gradeBtn.innerHTML;
        gradeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        gradeBtn.disabled = true;
        
        setTimeout(() => {
            // Redirect to grade dashboard
            window.location.href = `grade-${grade}.html`;
        }, 1000);
    } else {
        // Redirect to grade dashboard
        window.location.href = `grade-${grade}.html`;
    }
}

// Check if user has selected a grade
function checkUserProgress() {
    const selectedGrade = localStorage.getItem('selectedGrade');
    if (selectedGrade) {
        console.log('Welcome back Grade', selectedGrade, 'learner!');
        
        // Update UI to show returning user
        const gradeSelection = document.querySelector('.grade-selection');
        if (gradeSelection) {
            const welcomeBack = document.createElement('div');
            welcomeBack.className = 'welcome-back';
            welcomeBack.innerHTML = `
                <p>👋 Welcome back, Grade ${selectedGrade} learner!</p>
                <button onclick="goToDashboard(${selectedGrade})" class="quick-btn">
                    Continue Learning
                </button>
            `;
            gradeSelection.insertBefore(welcomeBack, gradeSelection.firstChild);
        }
    }
}

function goToDashboard(grade) {
    window.location.href = `grade-${grade}.html`;
}

// Portal navigation with grade context
function enterPortal(portalType) {
    const selectedGrade = localStorage.getItem('selectedGrade');
    const gradeContext = selectedGrade ? `?grade=${selectedGrade}` : '';
    
    const portalPages = {
        'student': 'student.html',
        'teacher': 'teacher.html', 
        'parent': 'parent.html',
        'chess': 'chess.html',
        'memory-match': 'assets/games/memory-match/memory-match.html',
        'math-pop': 'assets/games/math-pop/math-pop.html'
    };
    
    if (portalPages[portalType]) {
        // Add loading state to button if possible
        const button = event.target.closest('button');
        if (button) {
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            button.disabled = true;
            
            setTimeout(() => {
                window.location.href = portalPages[portalType] + gradeContext;
            }, 500);
        } else {
            window.location.href = portalPages[portalType] + gradeContext;
        }
    } else {
        alert('This portal is coming soon! Stay tuned for updates.');
    }
}

// Modal functions
function openKhensaniChat() {
    document.getElementById('khensaniModal').style.display = 'block';
    // Focus on input field
    setTimeout(() => {
        document.getElementById('chatInput').focus();
    }, 100);
}

function closeModal() {
    document.getElementById('khensaniModal').style.display = 'none';
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    const chatContainer = document.querySelector('.chat-container');
    
    if (message) {
        // Add user message
        const userMessage = document.createElement('div');
        userMessage.className = 'user-message';
        userMessage.innerHTML = `<strong>You:</strong> ${message}`;
        userMessage.style.background = '#e8f5e8';
        userMessage.style.padding = '10px 15px';
        userMessage.style.borderRadius = '10px';
        userMessage.style.marginBottom = '10px';
        userMessage.style.textAlign = 'right';
        chatContainer.appendChild(userMessage);
        
        // Clear input
        input.value = '';
        
        // Simulate AI thinking
        const thinking = document.createElement('div');
        thinking.innerHTML = '<em>Khensani is thinking...</em>';
        thinking.style.color = '#666';
        thinking.style.textAlign = 'center';
        thinking.style.padding = '10px';
        chatContainer.appendChild(thinking);
        
        // Scroll to bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        // Simulate AI response after delay
        setTimeout(() => {
            thinking.remove();
            
            const aiResponse = getAIResponse(message);
            const aiMessage = document.createElement('div');
            aiMessage.className = 'ai-message';
            aiMessage.innerHTML = `<strong>Khensani:</strong> ${aiResponse}`;
            chatContainer.appendChild(aiMessage);
            
            // Scroll to bottom again
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }, 1500);
    }
}

// Simple AI response system
function getAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    const selectedGrade = localStorage.getItem('selectedGrade') || '4';
    
    // Subject-specific responses
    if (lowerMessage.includes('math') || lowerMessage.includes('calculate') || lowerMessage.includes('number')) {
        const mathResponses = [
            `I can help with Grade ${selectedGrade} mathematics! Try our Math Pop game for arithmetic practice.`,
            `For mathematics help, I recommend starting with basic operations and working up to more complex problems.`,
            `Mathematics is all about patterns and logic. What specific topic are you struggling with?`
        ];
        return mathResponses[Math.floor(Math.random() * mathResponses.length)];
    }
    
    if (lowerMessage.includes('science') || lowerMessage.includes('experiment') || lowerMessage.includes('biology')) {
        const scienceResponses = [
            `Science is fascinating! Grade ${selectedGrade} covers basic physics, chemistry, and biology concepts.`,
            `I love helping with sciences! Have you tried our memory match game with science symbols?`,
            `The scientific method is key: observe, question, hypothesize, experiment, and conclude!`
        ];
        return scienceResponses[Math.floor(Math.random() * scienceResponses.length)];
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return `Hello! I'm Khensani, your AI learning assistant. I can help you with mathematics, sciences, and much more. What would you like to learn about today?`;
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('how') || lowerMessage.includes('what')) {
        return `I can help you with:
• Mathematics problems and concepts
• Science explanations and experiments  
• Learning strategies and study tips
• Navigating the MindFlow platform

What specific help do you need?`;
    }
    
    // Default responses
    const defaultResponses = [
        `That's an interesting question! As a Grade ${selectedGrade} learner, I recommend starting with our curriculum-aligned games and study materials.`,
        `I'd love to help you learn more about that! Have you explored our grade-specific learning materials?`,
        `Great question! For Grade ${selectedGrade}, we focus on building strong foundations in mathematics and sciences.`,
        `I'm here to help you succeed! Try our interactive games to make learning more engaging and fun.`,
        `Learning is a journey! I recommend starting with our mathematics or science sections for Grade ${selectedGrade}.`
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('khensaniModal');
    if (event.target == modal) {
        closeModal();
    }
}

// Handle Enter key in chat
document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }
    
    // Initialize user progress check
    checkUserProgress();
    
    // Add smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Utility function for navigation
function goHome() {
    window.location.href = 'index.html';
}

// Progress tracking functions
function updateUserProgress(subject, progress) {
    try {
        const userProgress = JSON.parse(localStorage.getItem('userProgress') || '{}');
        if (!userProgress.subjects) {
            userProgress.subjects = {};
        }
        
        userProgress.subjects[subject] = {
            progress: progress,
            lastAccessed: new Date().toISOString()
        };
        
        // Calculate total progress
        const subjects = Object.values(userProgress.subjects);
        const totalProgress = subjects.reduce((sum, subj) => sum + (subj.progress || 0), 0) / subjects.length;
        userProgress.totalProgress = Math.round(totalProgress);
        
        localStorage.setItem('userProgress', JSON.stringify(userProgress));
        console.log(`Progress updated: ${subject} - ${progress}%`);
        
        return userProgress;
    } catch (error) {
        console.error('Error updating progress:', error);
        return null;
    }
}

// Get current progress
function getCurrentProgress() {
    try {
        return JSON.parse(localStorage.getItem('userProgress') || '{}');
    } catch (error) {
        console.error('Error reading progress:', error);
        return {};
    }
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        selectGrade,
        updateUserProgress,
        getCurrentProgress,
        enterPortal
    };
}