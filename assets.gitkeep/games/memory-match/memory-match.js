class MemoryMatch {
    constructor() {
        this.cards = [];
        this.flippedCards = [];
        this.moves = 0;
        this.matches = 0;
        this.timeLeft = 60;
        this.timer = null;
        this.gameActive = false;
        
        this.themes = {
            math: ['+', '-', '×', '÷', '=', 'π', '√', '∞'],
            science: ['🔬', '🧪', '⚗️', '🌡️', '🧫', '🔭', '⚛️', '🧲'],
            animals: ['🦁', '🐘', '🦒', '🦓', '🐆', '🦏', '🐊', '🦜']
        };
        
        this.sounds = this.loadSounds();
        this.init();
    }

    loadSounds() {
        return {
            flip: new Audio('../../assets/audio/game-sounds/memory-match/card-flip.mp3'),
            match: new Audio('../../assets/audio/game-sounds/memory-match/match-success.mp3'),
            complete: new Audio('../../assets/audio/game-sounds/memory-match/game-complete.mp3'),
            background: new Audio('../../assets/audio/background-music/chill-study.mp3')
        };
    }

    init() {
        this.generateCards();
        this.renderBoard();
        this.setupEventListeners();
    }

    generateCards() {
        const theme = document.getElementById('themeSelect').value;
        const symbols = this.themes[theme];
        
        // Duplicate symbols to create pairs
        this.cards = [...symbols, ...symbols]
            .map((symbol, index) => ({
                id: index,
                symbol: symbol,
                flipped: false,
                matched: false
            }))
            .sort(() => Math.random() - 0.5); // Shuffle
    }

    renderBoard() {
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.innerHTML = '';

        this.cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            if (card.flipped || card.matched) {
                cardElement.classList.add('flipped');
                cardElement.textContent = card.symbol;
            }
            if (card.matched) {
                cardElement.classList.add('matched');
            }
            
            cardElement.addEventListener('click', () => this.flipCard(card.id));
            gameBoard.appendChild(cardElement);
        });
    }

    flipCard(cardId) {
        if (!this.gameActive) {
            this.startGame();
        }

        const card = this.cards.find(c => c.id === cardId);
        
        // Prevent flipping if: card already flipped/matched, or two cards already flipped
        if (card.flipped || card.matched || this.flippedCards.length === 2) {
            return;
        }

        card.flipped = true;
        this.flippedCards.push(card);
        this.playSound('flip');
        this.renderBoard();

        if (this.flippedCards.length === 2) {
            this.moves++;
            document.getElementById('moves').textContent = this.moves;
            this.checkMatch();
        }
    }

    checkMatch() {
        const [card1, card2] = this.flippedCards;
        
        if (card1.symbol === card2.symbol) {
            // Match found
            card1.matched = true;
            card2.matched = true;
            this.matches++;
            document.getElementById('matches').textContent = this.matches;
            this.playSound('match');
            
            this.flippedCards = [];
            
            if (this.matches === 8) {
                this.endGame();
            }
        } else {
            // No match - flip back after delay
            setTimeout(() => {
                card1.flipped = false;
                card2.flipped = false;
                this.flippedCards = [];
                this.renderBoard();
            }, 1000);
        }
    }

    startGame() {
        this.gameActive = true;
        this.startTimer();
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.timeLeft--;
            document.getElementById('timer').textContent = this.timeLeft;
            
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    endGame() {
        this.gameActive = false;
        clearInterval(this.timer);
        this.playSound('complete');
        
        document.getElementById('finalTime').textContent = 60 - this.timeLeft;
        document.getElementById('finalMoves').textContent = this.moves;
        document.getElementById('results').style.display = 'block';
        
        // Save score to leaderboard
        this.saveScore();
    }

    saveScore() {
        const scores = JSON.parse(localStorage.getItem('memoryMatchScores') || '[]');
        scores.push({
            moves: this.moves,
            time: 60 - this.timeLeft,
            date: new Date().toLocaleDateString(),
            theme: document.getElementById('themeSelect').value
        });
        localStorage.setItem('memoryMatchScores', JSON.stringify(scores));
    }

    resetGame() {
        clearInterval(this.timer);
        this.moves = 0;
        this.matches = 0;
        this.timeLeft = 60;
        this.flippedCards = [];
        this.gameActive = false;
        
        document.getElementById('moves').textContent = '0';
        document.getElementById('matches').textContent = '0';
        document.getElementById('timer').textContent = '60';
        document.getElementById('results').style.display = 'none';
        
        this.generateCards();
        this.renderBoard();
    }

    playSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play().catch(e => console.log('Audio play failed:', e));
        }
    }

    setupEventListeners() {
        document.getElementById('themeSelect').addEventListener('change', () => {
            this.resetGame();
        });
    }
}

// Global functions for HTML onclick
function goBack() {
    window.location.href = '../../index.html';
}

function resetGame() {
    memoryGame.resetGame();
}

// Initialize game when page loads
const memoryGame = new MemoryMatch();