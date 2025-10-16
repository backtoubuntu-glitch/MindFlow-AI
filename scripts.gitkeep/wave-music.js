// ==================== WAVE MUSIC SYSTEM ====================
class WaveMusicPlayer {
    constructor() {
        this.audioContext = null;
        this.isPlaying = false;
        this.currentSource = null;
        this.currentTrack = null;
        this.audioElements = {};
        
        this.initializeAudioElements();
    }
    
    initializeAudioElements() {
        // Create audio elements for different wave types
        // In a real implementation, these would be actual audio files
        this.audioElements = {
            'focus': this.createFocusWave(),
            'study': this.createStudyWave(),
            'relax': this.createRelaxWave()
        };
    }
    
    createFocusWave() {
        // Simulate focus wave (alpha waves ~10Hz)
        // In production, this would be pre-recorded or generated audio
        return this.generateBinauralBeat(10, 200, 210);
    }
    
    createStudyWave() {
        // Simulate study wave (beta waves ~15Hz)
        return this.generateBinauralBeat(15, 200, 215);
    }
    
    createRelaxWave() {
        // Simulate relaxation wave (theta waves ~6Hz)
        return this.generateBinauralBeat(6, 200, 206);
    }
    
    generateBinauralBeat(frequency, baseFreqLeft, baseFreqRight) {
        // This is a simplified simulation
        // In a real implementation, this would generate actual binaural beats
        const audio = new Audio();
        // In production, this would be replaced with actual audio files or Web Audio API generation
        return audio;
    }
    
    async play(trackType) {
        if (this.isPlaying) {
            this.stop();
        }
        
        try {
            // Initialize AudioContext if not already done
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            // Resume context if suspended
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            this.currentTrack = trackType;
            this.isPlaying = true;
            
            // Update UI
            this.updateMusicUI(true);
            
            // Show notification
            showNotification(`Now playing: ${this.getTrackName(trackType)}`, 'success');
            
            console.log(`🎵 Playing: ${this.getTrackName(trackType)}`);
            
        } catch (error) {
            console.error('Error playing music:', error);
            showNotification('Music playback error. Using simulation mode.', 'warning');
            this.simulatePlayback(trackType);
        }
    }
    
    simulatePlayback(trackType) {
        // Fallback simulation for browsers without Web Audio API support
        this.currentTrack = trackType;
        this.isPlaying = true;
        this.updateMusicUI(true);
        showNotification(`Simulating: ${this.getTrackName(trackType)}`, 'info');
    }
    
    stop() {
        this.isPlaying = false;
        this.currentTrack = null;
        
        if (this.currentSource) {
            this.currentSource.stop();
            this.currentSource = null;
        }
        
        this.updateMusicUI(false);
        console.log('🎵 Music stopped');
    }
    
    updateMusicUI(playing) {
        const musicPlayer = document.getElementById('musicPlayer');
        const currentTrack = document.getElementById('currentTrack');
        const playBtn = document.getElementById('playBtn');
        
        if (musicPlayer) {
            musicPlayer.style.display = playing ? 'flex' : 'none';
        }
        
        if (currentTrack && this.currentTrack) {
            currentTrack.textContent = this.getTrackName(this.currentTrack);
        }
        
        if (playBtn) {
            playBtn.innerHTML = playing ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
        }
    }
    
    getTrackName(trackType) {
        const trackNames = {
            'focus': 'Focus Waves - Alpha',
            'study': 'Study Beats - Beta', 
            'relax': 'Relaxation Flow - Theta'
        };
        return trackNames[trackType] || 'Unknown Track';
    }
    
    getCurrentTrackInfo() {
        return {
            isPlaying: this.isPlaying,
            currentTrack: this.currentTrack,
            trackName: this.currentTrack ? this.getTrackName(this.currentTrack) : 'None'
        };
    }
}

// ==================== GLOBAL MUSIC PLAYER INSTANCE ====================
const waveMusicPlayer = new WaveMusicPlayer();

// ==================== MUSIC CONTROL FUNCTIONS ====================
function playMusic(trackType) {
    waveMusicPlayer.play(trackType);
}

function stopMusic() {
    waveMusicPlayer.stop();
}

function toggleMusic() {
    if (waveMusicPlayer.isPlaying) {
        stopMusic();
    } else {
        playMusic('focus'); // Default to focus waves
    }
}

function togglePlay() {
    toggleMusic();
}

// ==================== MUSIC PRESETS ====================
const musicPresets = {
    'math': 'focus',
    'programming': 'study', 
    'reading': 'focus',
    'creative': 'relax',
    'exam-prep': 'focus',
    'break': 'relax'
};

function setMusicForActivity(activity) {
    const trackType = musicPresets[activity] || 'focus';
    playMusic(trackType);
}

// ==================== VOLUME CONTROL ====================
function setVolume(volume) {
    // This would control the actual audio volume in production
    console.log(`🔊 Volume set to: ${volume}%`);
    showNotification(`Volume: ${volume}%`, 'info');
}

// ==================== MUSIC VISUALIZATION ====================
class MusicVisualizer {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.analyser = null;
        this.dataArray = null;
        this.isVisualizing = false;
    }
    
    initialize(canvasElement) {
        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext('2d');
        
        // This would connect to the audio analyser in production
        console.log('🎨 Music visualizer initialized');
    }
    
    startVisualization() {
        this.isVisualizing = true;
        this.draw();
    }
    
    stopVisualization() {
        this.isVisualizing = false;
    }
    
    draw() {
        if (!this.isVisualizing || !this.ctx) return;
        
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Clear canvas
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, width, height);
        
        // Draw visualization (simplified for demo)
        this.ctx.fillStyle = 'rgba(253, 187, 45, 0.6)';
        
        // Create wave pattern
        for (let i = 0; i < width; i += 5) {
            const amplitude = Math.sin((Date.now() / 1000) * 2 + i * 0.1) * 20;
            this.ctx.fillRect(i, height / 2 - amplitude, 3, amplitude * 2);
        }
        
        if (this.isVisualizing) {
            requestAnimationFrame(() => this.draw());
        }
    }
}

// ==================== STUDY TIMER INTEGRATION ====================
class StudyTimer {
    constructor() {
        this.isRunning = false;
        this.startTime = null;
        this.duration = 25 * 60 * 1000; // 25 minutes default
        this.timerInterval = null;
    }
    
    start(durationMinutes = 25) {
        this.duration = durationMinutes * 60 * 1000;
        this.startTime = Date.now();
        this.isRunning = true;
        
        // Start focus music
        playMusic('focus');
        
        this.timerInterval = setInterval(() => {
            this.updateTimer();
        }, 1000);
        
        showNotification(`Study timer started: ${durationMinutes} minutes`, 'success');
    }
    
    stop() {
        this.isRunning = false;
        this.startTime = null;
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        // Stop music
        stopMusic();
        
        showNotification('Study timer stopped', 'info');
    }
    
    updateTimer() {
        if (!this.isRunning || !this.startTime) return;
        
        const elapsed = Date.now() - this.startTime;
        const remaining = this.duration - elapsed;
        
        if (remaining <= 0) {
            this.complete();
            return;
        }
        
        // Update timer display if exists
        this.updateTimerDisplay(remaining);
    }
    
    updateTimerDisplay(remainingMs) {
        const minutes = Math.floor(remainingMs / 60000);
        const seconds = Math.floor((remainingMs % 60000) / 1000);
        
        const timerDisplay = document.getElementById('studyTimerDisplay');
        if (timerDisplay) {
            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }
    
    complete() {
        this.stop();
        showNotification('🎉 Study session complete! Take a break!', 'success');
        
        // Play completion sound or switch to relaxation music
        playMusic('relax');
    }
}

// ==================== GLOBAL STUDY TIMER ====================
const studyTimer = new StudyTimer();

// ==================== EXPORT FUNCTIONS FOR HTML ====================
window.playMusic = playMusic;
window.stopMusic = stopMusic;
window.toggleMusic = toggleMusic;
window.togglePlay = togglePlay;
window.setMusicForActivity = setMusicForActivity;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎵 Wave Music System Initialized');
    console.log('⏰ Study Timer: Ready');
});