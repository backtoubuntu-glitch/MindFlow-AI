class MathPop {
    constructor() {
        this.score = 0;
        this.lives = 3;
        this.timeLeft = 60;
        this.timer = null;
        this.gameActive = false;
        this.currentProblem = null;
        this.bubbles = [];
        this.bubbleSpeed = 2;
        
        this.difficulties = {
            easy: { range: [1, 10], operators: ['+', '-'] },
            medium: { range: [1, 20], operators: ['+', '-', '×'] },
            hard: { range: [1, 50], operators: ['+', '-', '×', '÷'] }
        };
        
        this.sounds = this.loadSounds();
        this.init();
    }

    loadSounds() {
        return {
            pop: new Audio('../../assets/audio/game-sounds/math-pop/bubble-pop.mp3'),
            correct: new Audio('../../assets/audio/game-sounds/math-pop/correct-answer.mp3'),
            wrong: new Audio('../../assets/audio/game-sounds/math-pop/wrong-answer.mp3'),
            lifeLost: new Audio('../../assets/audio/game-sounds/math-pop/life-lost.mp3')
        };
    }

    init() {
        this.generateProblem();
        this.setupEventListeners();
        this.startBubbleGeneration();
    }

    generateProblem() {
        const difficulty = document.getElementById('difficultySelect').value;
        const config = this.difficulties[difficulty];
        
        let a, b, operator, answer;
        
        do {
            a = Math.floor(Math.random() * (config.range[1] - config.range[0] + 1)) + config.range[0];
            b = Math.floor(Math.random() * (config.range[1] - config.range[0] + 1)) + config.range[0];
            operator = config.operators[Math.floor(Math.random() * config.operators.length)];
            
            switch(operator) {
                case '+': answer = a + b; break;
                case '-': answer = a - b; break;
                case '×': answer = a * b; break;
                case '÷': 
                    // Ensure division problems have integer results
                    answer = a;
                    a = a * b;
                    break;
            }
        } while (answer < 0 || !Number.isInteger(answer)); // Ensure positive integer answers

        this.currentProblem = { a, b, operator, answer };
        
        // Generate wrong answers
        const wrongAnswers = this.generateWrongAnswers(answer);
        const allAnswers = [answer, ...wrongAnswers].sort(() => Math.random() - 0.5);
        
        document.getElementById('currentProblem').textContent = 
            `${a} ${operator} ${b} = ?`;
        
        return allAnswers;
    }

    generateWrongAnswers(correctAnswer) {
        const wrongAnswers = new Set();
        while (wrongAnswers.size < 3) {
            const wrong = correctAnswer + Math.floor(Math.random() * 10) - 5;
            if (wrong !== correctAnswer && wrong > 0) {
                wrongAnswers.add(wrong);
            }
        }
        return Array.from(wrongAnswers);
    }

    startBubbleGeneration() {
        setInterval(() => {
            if (!this.gameActive) return;
            
            const answers = this.generateProblem();
            this.createBubbles(answers);
        }, 3000); // New problem every 3 seconds
    }

    createBubbles(answers) {
        const gameArea = document.getElementById('gameArea');
        
        answers.forEach((answer, index) => {
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            bubble.textContent = answer;
            bubble.style.left = `${Math.random() * (gameArea.offsetWidth - 60)}px`;
            bubble.style.top = '400px'; // Start from bottom
            
            bubble.addEventListener('click', () => this.popBubble(bubble, answer));
            
            gameArea.appendChild(bubble);
            this.bubbles.push({
                element: bubble,
                value: answer,
                speed: this.bubbleSpeed + Math.random() * 2,
                position: 400
            });
        });
    }

    updateBubbles() {
        this.bubbles.forEach((bubble, index) => {
            bubble.position -= bubble.speed;
            bubble.element.style.top = `${bubble.position}px`;
            
            // Remove bubbles that go off the top
            if (bubble.position < -60) {
                bubble.element.remove();
                this.bubbles.splice(index, 1);
                this.loseLife();
            }
        });
    }

    popBubble(bubbleElement, value) {
        if (!this.gameActive) {
            this.startGame();
        }

        const isCorrect = value === this.currentProblem.answer;
        
        if (isCorrect) {
            bubbleElement.classList.add('correct');
            this.score += 10;
            document.getElementById('score').textContent = this.score;
            this.playSound('correct');
        } else {
            bubbleElement.classList.add('incorrect');
            this.playSound('wrong');
            this.loseLife();
        }
        
        // Remove bubble after animation
        setTimeout(() => {
            bubbleElement.remove();
            this.bubbles = this.bubbles.filter(b => b.element !== bubbleElement);
        }, 500);
    }

    loseLife() {
        this.lives--;
        document.getElementById('lives').textContent = this.lives;
        this.playSound('lifeLost');
        
        if (this.lives <= 0) {
            this.endGame();
        }
    }

    startGame() {
        this.gameActive = true;
        this.startTimer();
        this.gameLoop();
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

    gameLoop() {
        if (!this.gameActive) return;
        
        this.updateBubbles();
        requestAnimationFrame(() => this.gameLoop());
    }

    endGame() {
        this.gameActive = false;
        clearInterval(this.timer);
        
        // Clear all bubbles
        this.bubbles.forEach(bubble => bubble.element.remove());
        this.bubbles = [];
        
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('results').style.display = 'block';
        
        this.saveScore();
    }

    saveScore() {
        const scores = JSON.parse(localStorage.getItem('mathPopScores') || '[]');
        const difficulty = document.getElementById('difficultySelect').value;
        
        scores.push({
            score: this.score,
            difficulty: difficulty,
            date: new Date().toLocaleDateString()
        });
        
        localStorage.setItem('mathPopScores', JSON.stringify(scores));
    }

    resetGame() {
        clearInterval(this.timer);
        this.score = 0;
        this.lives = 3;
        this.timeLeft = 60;
        this.gameActive = false;
        this.bubbles = [];
        
        document.getElementById('score').textContent = '0';
        document.getElementById('lives').textContent = '3';
        document.getElementById('timer').textContent = '60';
        document.getElementById('results').style.display = 'none';
        
        document.getElementById('gameArea').innerHTML = '';
        this.generateProblem();
    }

    playSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play().catch(e => console.log('Audio play failed:', e));
        }
    }

    setupEventListeners() {
        document.getElementById('difficultySelect').addEventListener('change', () => {
            this.resetGame();
        });
    }
}

// Global functions for HTML onclick
function goBack() {
    window.location.href = '../../index.html';
}

function resetGame() {
    mathGame.resetGame();
}

// Initialize game when page loads
const mathGame = new MathPop();