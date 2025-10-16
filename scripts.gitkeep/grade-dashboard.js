// Grade Dashboard Functionality
console.log('Grade dashboard loaded!');

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    loadUserProgress();
});

function initializeDashboard() {
    const selectedGrade = localStorage.getItem('selectedGrade');
    if (!selectedGrade) {
        // Redirect to home if no grade selected
        window.location.href = 'index.html';
        return;
    }
    
    // Update grade info in header
    const gradeTitle = document.querySelector('.grade-info h1');
    if (gradeTitle) {
        gradeTitle.textContent = `🎓 Grade ${selectedGrade} Dashboard`;
    }
}

function loadUserProgress() {
    const userProgress = getCurrentProgress();
    const selectedGrade = localStorage.getItem('selectedGrade');
    
    if (userProgress && userProgress.subjects) {
        // Update progress bars
        Object.keys(userProgress.subjects).forEach(subject => {
            const progress = userProgress.subjects[subject].progress || 0;
            updateProgressBar(subject, progress);
        });
        
        // Update overall progress
        if (userProgress.totalProgress !== undefined) {
            updateOverallProgress(userProgress.totalProgress);
        }
    }
}

function updateProgressBar(subject, progress) {
    const progressElement = document.querySelector(`.subject-card.${subject} .progress`);
    const progressText = document.querySelector(`.subject-card.${subject} .progress-text`);
    
    if (progressElement) {
        progressElement.style.width = `${progress}%`;
    }
    
    if (progressText) {
        progressText.textContent = `${progress}% Complete`;
    }
}

function updateOverallProgress(progress) {
    const progressCircle = document.querySelector('.progress-circle');
    const progressValue = document.querySelector('.progress-value');
    
    if (progressCircle) {
        progressCircle.style.background = `conic-gradient(#4CAF50 ${progress}%, #e0e0e0 ${progress}%)`;
    }
    
    if (progressValue) {
        progressValue.textContent = `${progress}%`;
    }
}

// Navigation Functions
function goHome() {
    window.location.href = 'index.html';
}

function openSubject(subject, grade) {
    console.log(`Opening ${subject} for grade ${grade}`);
    // For now, show a message - we'll build actual subject pages later
    alert(`🎯 ${subject.charAt(0).toUpperCase() + subject.slice(1)} for Grade ${grade} is coming soon!\n\nWe're building comprehensive learning materials for this subject.`);
}

function openStudyMaterial(subject, grade) {
    alert(`📚 Study materials for ${subject} (Grade ${grade}) are under development!\n\nComing soon: Notes, videos, and interactive lessons.`);
}

function openPractice(subject, grade) {
    alert(`✏️ Practice exercises for ${subject} (Grade ${grade}) are coming soon!\n\nWe're creating curriculum-aligned practice problems.`);
}

function openGames(subject, grade) {
    // Redirect to appropriate game based on subject
    const gameMap = {
        'mathematics': 'math-pop',
        'sciences': 'memory-match',
        'english': 'memory-match',
        'social_sciences': 'memory-match'
    };
    
    const game = gameMap[subject] || 'memory-match';
    window.location.href = `../assets/games/${game}/${game}.html?grade=${grade}&subject=${subject}`;
}

function openGame(gameType) {
    const selectedGrade = localStorage.getItem('selectedGrade');
    const gamePages = {
        'memory-match': '../assets/games/memory-match/memory-match.html',
        'math-pop': '../assets/games/math-pop/math-pop.html',
        'quiz-dash': '../assets/games/quiz-dash/quiz-dash.html'
    };
    
    if (gamePages[gameType]) {
        window.location.href = `${gamePages[gameType]}?grade=${selectedGrade}`;
    } else {
        alert('This game is coming soon! We're working hard to bring you more educational games.');
    }
}

// Progress tracking functions (compatible with main.js)
function getCurrentProgress() {
    try {
        return JSON.parse(localStorage.getItem('userProgress') || '{}');
    } catch (error) {
        console.error('Error reading progress:', error);
        return {};
    }
}

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
        const totalProgress = subjects.reduce((sum, subj) => sum + (subj.progress || 0), 0) / Math.max(subjects.length, 1);
        userProgress.totalProgress = Math.round(totalProgress);
        
        localStorage.setItem('userProgress', JSON.stringify(userProgress));
        
        // Update UI
        updateProgressBar(subject, progress);
        updateOverallProgress(userProgress.totalProgress);
        
        return userProgress;
    } catch (error) {
        console.error('Error updating progress:', error);
        return null;
    }
}

// Simulate progress for demo purposes
function simulateProgress() {
    const subjects = ['mathematics', 'sciences'];
    subjects.forEach(subject => {
        const randomProgress = Math.floor(Math.random() * 50) + 10; // 10-60%
        updateUserProgress(subject, randomProgress);
    });
}

// Auto-simulate some progress for demo (remove in production)
setTimeout(simulateProgress, 1000);