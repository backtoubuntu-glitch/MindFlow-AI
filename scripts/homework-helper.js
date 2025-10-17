// AI Homework Helper - Khensani's Supercharged Learning Brain
class HomeworkHelper {
    constructor() {
        this.currentSubject = null;
        this.difficultyLevel = 'beginner';
        this.stepByStepMode = true;
        this.learningStyle = 'visual';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadLearningPreferences();
        console.log('🧠 AI Homework Helper Initialized');
    }

    setupEventListeners() {
        // Global keyboard shortcut for help
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'h') {
                this.showHelpModal();
            }
        });
    }

    async solveProblem(problem, subject = 'math') {
        this.currentSubject = subject;
        
        // Show loading state
        this.showThinkingIndicator();

        try {
            // Simulate AI processing
            const solution = await this.processWithAI(problem, subject);
            
            // Display solution based on learning style
            this.displaySolution(problem, solution);
            
            // Track learning progress
            this.trackLearningProgress(subject, problem);
            
            return solution;
        } catch (error) {
            this.showError('Sorry, I had trouble understanding that problem. Could you rephrase it?');
            return null;
        }
    }

    async processWithAI(problem, subject) {
        // Simulate AI processing time
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock AI responses based on subject and problem type
        return this.generateAISolution(problem, subject);
    }

    generateAISolution(problem, subject) {
        const solutions = {
            math: {
                basic: {
                    problem: "What's 15 × 8?",
                    solution: {
                        steps: [
                            "First, break it down: 15 × 8 = (10 + 5) × 8",
                            "Multiply each part: 10 × 8 = 80 and 5 × 8 = 40", 
                            "Add them together: 80 + 40 = 120",
                            "So, 15 × 8 = 120"
                        ],
                        answer: "120",
                        explanation: "We used the distributive property to make multiplication easier!",
                        visual: "📊 Imagine 15 groups of 8. That's 10 groups of 8 (80) plus 5 groups of 8 (40)."
                    }
                }
            },
            science: {
                biology: {
                    problem: "What is photosynthesis?",
                    solution: {
                        steps: [
                            "Photosynthesis is how plants make their own food",
                            "It requires: sunlight, water, and carbon dioxide",
                            "The process produces: glucose (food) and oxygen",
                            "Chemical equation: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂"
                        ],
                        answer: "Process where plants convert light energy to chemical energy",
                        explanation: "Plants are like nature's solar panels!",
                        visual: "🌿 Sunlight + Water + CO₂ → Food + Oxygen"
                    }
                }
            }
        };

        // Find the best matching solution
        let bestMatch = null;
        let highestScore = 0;

        for (const [category, problems] of Object.entries(solutions[subject] || {})) {
            const score = this.calculateSimilarity(problem, problems.problem);
            if (score > highestScore) {
                highestScore = score;
                bestMatch = problems.solution;
            }
        }

        return bestMatch || this.generateGenericSolution(problem, subject);
    }

    calculateSimilarity(problem1, problem2) {
        // Simple similarity calculation
        const words1 = problem1.toLowerCase().split(' ');
        const words2 = problem2.toLowerCase().split(' ');
        const commonWords = words1.filter(word => words2.includes(word));
        return commonWords.length / Math.max(words1.length, words2.length);
    }

    generateGenericSolution(problem, subject) {
        return {
            steps: [
                "Let me help you understand this concept...",
                "This is a great question about " + subject,
                "The key is to break it down into smaller parts",
                "Practice makes perfect - keep trying!"
            ],
            answer: "I need more context to solve this precisely",
            explanation: "Could you provide more details or rephrase the question?",
            visual: "💡 Remember: Every expert was once a beginner!"
        };
    }

    displaySolution(problem, solution) {
        const modal = this.createSolutionModal(problem, solution);
        document.body.appendChild(modal);
        this.showModal(modal);
    }

    createSolutionModal(problem, solution) {
        const modal = document.createElement('div');
        modal.className = 'homework-helper-modal';
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 2000;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        `;

        modal.innerHTML = `
            <div class='modal-header' style='display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;'>
                <h3 style='color: #8B5FBF; margin: 0;'>🧠 Khensani's Solution</h3>
                <button onclick='this.parentElement.parentElement.remove()' style='background: none; border: none; font-size: 1.5rem; cursor: pointer;'>&times;</button>
            </div>
            
            <div class='problem-section' style='margin-bottom: 1.5rem;'>
                <h4 style='color: #333;'>Your Question:</h4>
                <p style='background: #f8f9fa; padding: 1rem; border-radius: 8px;'>${problem}</p>
            </div>
            
            <div class='solution-section'>
                <h4 style='color: #28a745;'>Step-by-Step Solution:</h4>
                <ol style='margin-left: 1.5rem; margin-bottom: 1.5rem;'>
                    ${solution.steps.map(step => `<li style='margin-bottom: 0.5rem;'>${step}</li>`).join('')}
                </ol>
                
                <div style='background: #d4edda; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;'>
                    <strong>Answer:</strong> ${solution.answer}
                </div>
                
                <div style='background: #e3f2fd; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;'>
                    <strong>Explanation:</strong> ${solution.explanation}
                </div>
                
                ${solution.visual ? `
                    <div style='background: #fff3cd; padding: 1rem; border-radius: 8px;'>
                        <strong>Visual Aid:</strong> ${solution.visual}
                    </div>
                ` : ''}
            </div>
            
            <div class='modal-footer' style='margin-top: 1.5rem; display: flex; gap: 1rem; justify-content: flex-end;'>
                <button onclick='this.closest(".homework-helper-modal").remove()' class='btn-small'>Close</button>
                <button onclick='window.homeworkHelper.showSimilarProblems()' class='btn-primary'>Practice Similar Problems</button>
            </div>
        `;

        return modal;
    }

    showThinkingIndicator() {
        // Show a loading indicator
        const loader = document.createElement('div');
        loader.id = 'khensani-thinking';
        loader.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #8B5FBF;
            color: white;
            padding: 1rem;
            border-radius: 10px;
            z-index: 1999;
            box-shadow: 0 5px 15px rgba(139, 95, 191, 0.3);
        `;
        loader.innerHTML = `
            <div style='display: flex; align-items: center; gap: 0.5rem;'>
                <div class='thinking-dots'></div>
                <span>Khensani is thinking...</span>
            </div>
        `;
        
        document.body.appendChild(loader);
        
        // Auto-remove after 5 seconds (safety)
        setTimeout(() => {
            if (document.getElementById('khensani-thinking')) {
                document.getElementById('khensani-thinking').remove();
            }
        }, 5000);
    }

    showSimilarProblems() {
        const problems = {
            math: [
                "What's 12 × 7?",
                "Solve: 2/5 + 1/3",
                "Calculate the area of a rectangle with length 8 and width 5"
            ],
            science: [
                "What are the three states of matter?",
                "Explain how plants make food",
                "What is the water cycle?"
            ]
        };

        const subjectProblems = problems[this.currentSubject] || problems.math;
        const randomProblems = subjectProblems.sort(() => 0.5 - Math.random()).slice(0, 3);

        alert(`🧠 PRACTICE PROBLEMS (${this.currentSubject.toUpperCase()}):\n\n${randomProblems.join('\n')}\n\nTry solving these to strengthen your understanding!`);
    }

    showHelpModal() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 2000;
            max-width: 500px;
            width: 90%;
        `;

        modal.innerHTML = `
            <h3 style='color: #8B5FBF; margin-bottom: 1rem;'>🆘 Homework Helper</h3>
            <p>Need help with your homework? I can assist with:</p>
            <ul style='margin: 1rem 0;'>
                <li>Mathematics problems and calculations</li>
                <li>Science concepts and explanations</li>
                <li>Step-by-step solutions</li>
                <li>Visual learning aids</li>
                <li>Practice problems</li>
            </ul>
            <p><strong>Shortcut:</strong> Press Ctrl+H anytime for help!</p>
            <div style='margin-top: 1.5rem; text-align: right;'>
                <button onclick='this.parentElement.parentElement.remove()' class='btn-primary'>Got it!</button>
            </div>
        `;

        document.body.appendChild(modal);
    }

    showError(message) {
        alert(`❌ ${message}`);
    }

    trackLearningProgress(subject, problem) {
        console.log(`📚 Learning tracked: ${subject} - ${problem.substring(0, 50)}...`);
        
        // Notify Khensani
        if (window.khensani) {
            window.khensani.addMessage('system', `Great job working on ${subject}! I see you're making progress.`);
        }
    }

    loadLearningPreferences() {
        // Load from localStorage or server
        const prefs = localStorage.getItem('khensani-learning-prefs');
        if (prefs) {
            const { difficulty, style, stepMode } = JSON.parse(prefs);
            this.difficultyLevel = difficulty || this.difficultyLevel;
            this.learningStyle = style || this.learningStyle;
            this.stepByStepMode = stepMode !== undefined ? stepMode : this.stepByStepMode;
        }
    }

    saveLearningPreferences() {
        const prefs = {
            difficulty: this.difficultyLevel,
            style: this.learningStyle,
            stepMode: this.stepByStepMode
        };
        localStorage.setItem('khensani-learning-prefs', JSON.stringify(prefs));
    }
}

// Global instance
window.homeworkHelper = new HomeworkHelper(); 
