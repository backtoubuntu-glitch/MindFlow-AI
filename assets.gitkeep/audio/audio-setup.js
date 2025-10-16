// Audio file configuration for MindFlow
const AUDIO_CONFIG = {
    focus: {
        alpha: './assets/audio/focus-alpha.mp3',
        ambient: './assets/audio/focus-ambient.mp3',
        description: 'Alpha waves (10Hz) for deep concentration'
    },
    study: {
        beta: './assets/audio/study-beta.mp3', 
        melodic: './assets/audio/study-melodic.mp3',
        description: 'Beta waves (15Hz) for active learning'
    },
    relax: {
        theta: './assets/audio/relax-theta.mp3',
        nature: './assets/audio/relax-nature.mp3',
        description: 'Theta waves (6Hz) for relaxation'
    },
    notifications: {
        bell: './assets/audio/notification-bell.mp3',
        achievement: './assets/audio/achievement-unlock.mp3',
        timer: './assets/audio/timer-complete.mp3'
    }
};

// Audio preloader
class AudioPreloader {
    constructor() {
        this.audioElements = {};
        this.loaded = false;
    }

    async preloadAudio() {
        const audioFiles = [
            'focus-alpha', 'focus-ambient',
            'study-beta', 'study-melodic', 
            'relax-theta', 'relax-nature',
            'notification-bell', 'achievement-unlock', 'timer-complete'
        ];

        for (const file of audioFiles) {
            try {
                const audio = new Audio();
                audio.src = `./assets/audio/${file}.mp3`;
                audio.preload = 'auto';
                this.audioElements[file] = audio;
                
                // Wait for audio to load
                await new Promise((resolve) => {
                    audio.addEventListener('canplaythrough', resolve, { once: true });
                    audio.addEventListener('error', resolve, { once: true }); // Continue even if error
                });
            } catch (error) {
                console.warn(`Could not load audio file: ${file}`, error);
            }
        }
        
        this.loaded = true;
        console.log('🎵 Audio files preloaded');
    }

    getAudio(fileName) {
        return this.audioElements[fileName];
    }
}

// Global audio preloader instance
window.audioPreloader = new AudioPreloader();