// ==================== CHESS GAME VARIABLES ====================
let game = null;
let board = null;
let isTutorEnabled = true;
let difficulty = 2;
let moveHistory = [];

// ==================== CHESS GAME INITIALIZATION ====================
function initializeChessGame() {
    // Initialize chess.js game
    game = new Chess();
    
    // Initialize chessboard
    board = Chessboard('chessboard', {
        position: 'start',
        draggable: true,
        dropOffBoard: 'snapback',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd
    });
    
    updateGameStatus();
    updateMoveHistory();
    
    console.log('♟️ Chess game initialized');
    console.log('🤖 AI Tutor: ' + (isTutorEnabled ? 'Enabled' : 'Disabled'));
    console.log('🎯 Difficulty: ' + getDifficultyName(difficulty));
}

// ==================== CHESS BOARD EVENT HANDLERS ====================
function onDragStart(source, piece, position, orientation) {
    // Do not pick up pieces if the game is over
    if (game.game_over()) return false;
    
    // Only pick up pieces for the side to move
    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false;
    }
}

function onDrop(source, target) {
    // See if the move is legal
    const move = game.move({
        from: source,
        to: target,
        promotion: 'q' // Always promote to queen for simplicity
    });
    
    // Illegal move
    if (move === null) return 'snapback';
    
    // Add to move history
    moveHistory.push(move);
    updateMoveHistory();
    
    // Update game status
    updateGameStatus();
    
    // If tutor is enabled, provide feedback
    if (isTutorEnabled) {
        provideMoveFeedback(move);
    }
    
    // Make AI move after a short delay
    setTimeout(makeAIMove, 500);
}

function onSnapEnd() {
    board.position(game.fen());
}

// ==================== AI MOVE GENERATION ====================
function makeAIMove() {
    if (game.game_over()) return;
    
    // Simple AI based on difficulty
    const moves = game.moves();
    if (moves.length === 0) return;
    
    let move;
    
    switch(difficulty) {
        case 1: // Beginner - random moves
            move = moves[Math.floor(Math.random() * moves.length)];
            break;
        case 2: // Intermediate - slightly better moves
            move = getIntermediateMove(moves);
            break;
        case 3: // Advanced - good moves
            move = getAdvancedMove(moves);
            break;
        case 4: // Expert - best available moves
            move = getExpertMove(moves);
            break;
        default:
            move = moves[Math.floor(Math.random() * moves.length)];
    }
    
    game.move(move);
    moveHistory.push(move);
    
    // Update board and status
    board.position(game.fen());
    updateMoveHistory();
    updateGameStatus();
    
    // Provide AI move explanation
    if (isTutorEnabled) {
        provideAIMoveExplanation(move);
    }
}

function getIntermediateMove(moves) {
    // Prefer captures and checks
    const captures = moves.filter(m => m.flags.includes('c'));
    const checks = moves.filter(m => m.san.includes('+'));
    
    if (captures.length > 0) return captures[Math.floor(Math.random() * captures.length)];
    if (checks.length > 0) return checks[Math.floor(Math.random() * checks.length)];
    
    return moves[Math.floor(Math.random() * moves.length)];
}

function getAdvancedMove(moves) {
    // More sophisticated move selection
    const ratedMoves = moves.map(move => {
        let score = 0;
        
        // Prefer captures
        if (move.flags.includes('c')) score += 10;
        
        // Prefer checks
        if (move.san.includes('+')) score += 5;
        
        // Prefer center control
        const centerSquares = ['d4', 'd5', 'e4', 'e5', 'c4', 'c5', 'f4', 'f5'];
        if (centerSquares.includes(move.to)) score += 3;
        
        // Prefer development in opening
        if (moveHistory.length < 10) {
            if (move.piece === 'n' || move.piece === 'b') score += 2;
        }
        
        return { move, score };
    });
    
    ratedMoves.sort((a, b) => b.score - a.score);
    return ratedMoves[0].move;
}

function getExpertMove(moves) {
    // Even more sophisticated (simplified)
    return getAdvancedMove(moves);
}

// ==================== TUTOR FEEDBACK SYSTEM ====================
function provideMoveFeedback(move) {
    const feedback = generateMoveFeedback(move);
    addTutorMessage(feedback);
}

function provideAIMoveExplanation(move) {
    const explanation = generateAIMoveExplanation(move);
    addTutorMessage(explanation);
}

function generateMoveFeedback(move) {
    const feedbacks = [
        `Good move! ${move.san} develops your ${move.piece === 'n' ? 'knight' : move.piece === 'b' ? 'bishop' : 'piece'}.`,
        `Nice! ${move.san} controls important squares.`,
        `Interesting move: ${move.san}. Let's see how this affects the position.`,
        `Well played! ${move.san} follows good chess principles.`
    ];
    
    // Special feedback for specific moves
    if (move.flags.includes('c')) {
        return `Excellent capture! ${move.san} wins material.`;
    }
    if (move.san.includes('+')) {
        return `Check! ${move.san} puts pressure on the opponent's king.`;
    }
    
    return feedbacks[Math.floor(Math.random() * feedbacks.length)];
}

function generateAIMoveExplanation(move) {
    const explanations = [
        `I played ${move.san} to control the center and develop my pieces.`,
        `With ${move.san}, I'm preparing to castle and connect my rooks.`,
        `This move ${move.san} creates threats while improving my position.`,
        `I chose ${move.san} to respond to your last move and maintain balance.`
    ];
    
    if (move.flags.includes('c')) {
        return `I'm capturing with ${move.san} to win material and gain an advantage.`;
    }
    if (move.san.includes('+')) {
        return `Check! ${move.san} attacks your king and forces you to respond.`;
    }
    
    return explanations[Math.floor(Math.random() * explanations.length)];
}

// ==================== GAME CONTROLS ====================
function newGame() {
    game = new Chess();
    board.position('start');
    moveHistory = [];
    updateMoveHistory();
    updateGameStatus();
    addTutorMessage("New game started! You're playing white. Good luck!");
}

function undoMove() {
    if (moveHistory.length === 0) return;
    
    // Undo last two moves (player and AI)
    game.undo();
    if (moveHistory.length > 1) game.undo();
    
    moveHistory = moveHistory.slice(0, -2);
    board.position(game.fen());
    updateMoveHistory();
    updateGameStatus();
    addTutorMessage("Move undone. Let's try a different approach!");
}

function hint() {
    if (game.game_over()) return;
    
    const moves = game.moves();
    if (moves.length === 0) return;
    
    const bestMove = getAdvancedMove(moves);
    addTutorMessage(`Hint: Consider playing ${bestMove.san}. This move develops your pieces and controls important squares.`);
}

function analyzePosition() {
    const evaluation = evaluatePosition();
    addTutorMessage(`Position analysis: ${evaluation}`);
}

function evaluatePosition() {
    const evaluations = [
        "The position is roughly equal. Both sides have chances.",
        "You have a slight advantage due to better piece development.",
        "The position is complex with opportunities for both players.",
        "You're controlling the center well. Keep developing your pieces!",
        "Consider castling soon to ensure your king's safety."
    ];
    
    return evaluations[Math.floor(Math.random() * evaluations.length)];
}

// ==================== TUTOR SETTINGS ====================
function toggleTutor() {
    isTutorEnabled = !isTutorEnabled;
    const tutorBtn = document.getElementById('tutorBtn');
    if (tutorBtn) {
        tutorBtn.innerHTML = `<i class="fas fa-robot"></i> AI Tutor: ${isTutorEnabled ? 'ON' : 'OFF'}`;
    }
    
    addTutorMessage(`AI Tutor ${isTutorEnabled ? 'enabled' : 'disabled'}.`);
}

function changeDifficulty() {
    const select = document.getElementById('difficulty');
    if (select) {
        difficulty = parseInt(select.value);
        addTutorMessage(`Difficulty set to ${getDifficultyName(difficulty)}.`);
    }
}

function getDifficultyName(level) {
    const names = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
    return names[level - 1] || 'Intermediate';
}

// ==================== LEARNING TOPICS ====================
function explainConcept(concept) {
    const explanations = {
        openings: `**Chess Openings**: The opening is the first phase of the game. Good opening principles: 1) Control the center, 2) Develop your pieces, 3) Castle early, 4) Don't move the same piece multiple times. Try the Italian Game: 1.e4 e5 2.Nf3 Nc6 3.Bc4`,
        
        tactics: `**Chess Tactics**: Tactics are short-term sequences that gain an advantage. Common tactics: Forks (attack two pieces), Pins (immobilize a piece), Skews (attack a piece through another). Practice spotting these patterns!`,
        
        endgame: `**Endgame Strategy**: In the endgame, the king becomes an active piece. Key principles: Activate your king, create passed pawns, and know basic checkmates like King + Queen vs King.`,
        
        strategy: `**Chess Strategy**: Long-term planning in chess. Consider: Piece activity, pawn structure, king safety, and control of key squares. Always have a plan!`
    };
    
    addTutorMessage(explanations[concept] || "I'd be happy to explain that concept. What specifically would you like to know?");
}

// ==================== UI UPDATES ====================
function updateGameStatus() {
    const statusElement = document.getElementById('gameStatus');
    if (!statusElement) return;
    
    let status = '';
    
    if (game.in_checkmate()) {
        status = `Checkmate! ${game.turn() === 'w' ? 'Black' : 'White'} wins.`;
    } else if (game.in_draw()) {
        status = 'Game drawn.';
    } else if (game.in_check()) {
        status = `Check! ${game.turn() === 'w' ? 'White' : 'Black'} to move.`;
    } else {
        status = `${game.turn() === 'w' ? 'White' : 'Black'} to move.`;
    }
    
    statusElement.textContent = status;
}

function updateMoveHistory() {
    const movesList = document.getElementById('movesList');
    if (!movesList) return;
    
    movesList.innerHTML = '';
    
    for (let i = 0; i < moveHistory.length; i += 2) {
        const moveNumber = Math.floor(i / 2) + 1;
        const whiteMove = moveHistory[i].san;
        const blackMove = moveHistory[i + 1] ? moveHistory[i + 1].san : '';
        
        const moveElement = document.createElement('div');
        moveElement.style.cssText = 'display: flex; justify-content: space-between; padding: 2px 0;';
        moveElement.innerHTML = `
            <span class="move-number">${moveNumber}.</span>
            <span>${whiteMove}</span>
            <span>${blackMove}</span>
        `;
        
        movesList.appendChild(moveElement);
    }
    
    movesList.scrollTop = movesList.scrollHeight;
}

function addTutorMessage(message) {
    const tutorMessages = document.getElementById('tutorMessages');
    if (!tutorMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'tutor-message ai';
    messageDiv.innerHTML = `<strong>Khensani:</strong> ${message}`;
    tutorMessages.appendChild(messageDiv);
    
    tutorMessages.scrollTop = tutorMessages.scrollHeight;
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    // Wait for chessboard to load
    setTimeout(initializeChessGame, 100);
    
    // Start tips carousel
    startTipsCarousel();
});

function startTipsCarousel() {
    const tips = document.querySelectorAll('.tip');
    let currentTip = 0;
    
    setInterval(() => {
        tips.forEach(tip => tip.classList.remove('active'));
        tips[currentTip].classList.add('active');
        currentTip = (currentTip + 1) % tips.length;
    }, 5000); // Change tip every 5 seconds
}