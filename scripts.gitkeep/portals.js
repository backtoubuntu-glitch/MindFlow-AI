// ==================== PORTAL MANAGEMENT ====================
let currentSection = 'dashboard';
let selectedChild = 'sarah';

// Show/hide content sections
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all sidebar buttons
    document.querySelectorAll('.sidebar-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Activate corresponding sidebar button
    const activeBtn = document.querySelector(`.sidebar-btn[onclick="showSection('${sectionId}')"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    currentSection = sectionId;
}

// ==================== STUDENT PORTAL FUNCTIONS ====================
function simulateStudyProgress() {
    // This would connect to a backend in production
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        const currentWidth = parseInt(bar.style.width) || 0;
        const newWidth = Math.min(currentWidth + Math.random() * 10, 100);
        bar.style.width = `${newWidth}%`;
    });
    
    showNotification('Study progress updated!', 'success');
}

// ==================== TEACHER PORTAL FUNCTIONS ====================
function createAssignment() {
    showNotification('Create Assignment feature coming soon!', 'info');
    // In production, this would open a modal for assignment creation
}

function sendAnnouncement() {
    showNotification('Send Announcement feature coming soon!', 'info');
    // In production, this would open a modal for announcements
}

function messageStudent(studentName) {
    showNotification(`Messaging ${studentName}... Feature coming soon!`, 'info');
}

// ==================== PARENT PORTAL FUNCTIONS ====================
function selectChild(childId) {
    selectedChild = childId;
    
    // Update active child in sidebar
    document.querySelectorAll('.child-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const selectedItem = document.querySelector(`.child-item[onclick="selectChild('${childId}')"]`);
    if (selectedItem) {
        selectedItem.classList.add('active');
    }
    
    // Update content based on selected child
    updateChildProgress(childId);
}

function updateChildProgress(childId) {
    // This would fetch real data in production
    const progressElements = {
        'sarah': { math: 88, programming: 92, science: 76 },
        'mike': { math: 72, programming: 65, science: 81 }
    };
    
    const progress = progressElements[childId] || progressElements.sarah;
    
    // Update progress bars
    const mathBar = document.querySelector('.metric:nth-child(1) .progress-fill');
    const programmingBar = document.querySelector('.metric:nth-child(2) .progress-fill');
    const scienceBar = document.querySelector('.metric:nth-child(3) .progress-fill');
    
    if (mathBar) mathBar.style.width = `${progress.math}%`;
    if (programmingBar) programmingBar.style.width = `${progress.programming}%`;
    if (scienceBar) scienceBar.style.width = `${progress.science}%`;
    
    // Update metric values
    const mathValue = document.querySelector('.metric:nth-child(1) .metric-value');
    const programmingValue = document.querySelector('.metric:nth-child(2) .metric-value');
    const scienceValue = document.querySelector('.metric:nth-child(3) .metric-value');
    
    if (mathValue) mathValue.textContent = `${progress.math}%`;
    if (programmingValue) programmingValue.textContent = `${progress.programming}%`;
    if (scienceValue) scienceValue.textContent = `${progress.science}%`;
    
    showNotification(`Now viewing ${childId === 'sarah' ? 'Sarah' : 'Mike'}'s progress`, 'info');
}

function contactTeacher() {
    showNotification('Contact Teacher feature coming soon!', 'info');
}

function sendMessageToTeacher() {
    const messageInput = document.querySelector('.message-input');
    if (messageInput && messageInput.value.trim()) {
        showNotification('Message sent to teacher!', 'success');
        messageInput.value = '';
    } else {
        showNotification('Please enter a message', 'warning');
    }
}

// ==================== PROGRESS SIMULATION ====================
function simulateWeeklyProgress() {
    const studyBars = document.querySelectorAll('.study-bar');
    studyBars.forEach(bar => {
        const randomHeight = 30 + Math.random() * 70;
        bar.style.height = `${randomHeight}%`;
        
        // Update study time
        const studyTime = bar.nextElementSibling;
        if (studyTime) {
            const hours = (randomHeight / 100 * 3).toFixed(1);
            studyTime.textContent = `${hours}h`;
        }
    });
}

// ==================== ACHIEVEMENT SYSTEM ====================
function awardAchievement(achievementName) {
    showNotification(`🎉 Achievement Unlocked: ${achievementName}`, 'success');
}

// ==================== PORTAL INITIALIZATION ====================
function initializePortal() {
    console.log(`🏠 Portal Initialized: ${document.body.className}`);
    
    // Set up initial state
    if (document.body.classList.contains('student-portal')) {
        showSection('dashboard');
        simulateStudyProgress();
    } else if (document.body.classList.contains('teacher-portal')) {
        showSection('overview');
    } else if (document.body.classList.contains('parent-portal')) {
        showSection('progress');
        selectChild('sarah');
        simulateWeeklyProgress();
    }
    
    // Add interactive elements
    addPortalInteractivity();
}

function addPortalInteractivity() {
    // Add click effects to cards
    document.querySelectorAll('.subject-card-portal, .stat-card, .feature-card').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Add hover effects to buttons
    document.querySelectorAll('.action-btn, .sidebar-btn, .music-btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        btn.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// ==================== REAL-TIME UPDATES ====================
function startRealTimeUpdates() {
    // Simulate real-time activity updates
    setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance every interval
            simulateNewActivity();
        }
    }, 10000); // Every 10 seconds
}

function simulateNewActivity() {
    const activities = [
        'completed a math assignment',
        'started a new programming lesson',
        'achieved a new high score in chess',
        'watched a science video',
        'solved a complex problem'
    ];
    
    const students = ['Sarah M.', 'John D.', 'Mike L.', 'Emma W.', 'Alex K.'];
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    const randomStudent = students[Math.floor(Math.random() * students.length)];
    
    // This would update the activity feed in production
    console.log(`📚 ${randomStudent} ${randomActivity}`);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializePortal();
    startRealTimeUpdates();
});