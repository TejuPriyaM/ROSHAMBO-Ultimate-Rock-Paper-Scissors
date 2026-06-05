/* ==========================================================================
   ROSHAMBO GAME PLAY & AUDIO SYNTH ENGINE
   ========================================================================== */

// 1. Game State variables (persistent via localStorage)
let state = {
    userScore: parseInt(localStorage.getItem('roshambo_userScore')) || 0,
    compScore: parseInt(localStorage.getItem('roshambo_compScore')) || 0,
    winStreak: parseInt(localStorage.getItem('roshambo_winStreak')) || 0,
    soundEnabled: localStorage.getItem('roshambo_soundEnabled') !== 'false', // default true
    history: JSON.parse(localStorage.getItem('roshambo_history')) || []
};

// 2. DOM Elements Selection
const choices = document.querySelectorAll(".choice");
const msg = document.getElementById("msg");
const userScorePara = document.getElementById("user-score");
const compScorePara = document.getElementById("comp-score");
const winStreakPara = document.getElementById("win-streak");
const soundToggleBtn = document.getElementById("sound-toggle");
const resetBtn = document.getElementById("reset-btn");
const nextBtn = document.getElementById("next-btn");

const selectionView = document.getElementById("selection-view");
const battleView = document.getElementById("battle-view");
const playerBattleCard = document.getElementById("player-battle-card");
const compBattleCard = document.getElementById("comp-battle-card");
const historyList = document.getElementById("history-list");

// 3. Web Audio Synth Engine
let audioCtx = null;

const initAudio = () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
};

const playTone = (freq, type, duration, startVol, endVol, delay = 0) => {
    if (!state.soundEnabled) return;
    try {
        initAudio();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.type = type || 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);
        
        gainNode.gain.setValueAtTime(startVol || 0.1, audioCtx.currentTime + delay);
        gainNode.gain.exponentialRampToValueAtTime(endVol || 0.001, audioCtx.currentTime + delay + duration);
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.start(audioCtx.currentTime + delay);
        osc.stop(audioCtx.currentTime + delay + duration);
    } catch (e) {
        console.warn("Audio Context disabled or not initialized.", e);
    }
};

const sounds = {
    hover: () => playTone(800, 'sine', 0.05, 0.02, 0.001),
    select: () => {
        playTone(440, 'triangle', 0.12, 0.08, 0.001);
        playTone(660, 'triangle', 0.12, 0.06, 0.001, 0.06);
    },
    tick: () => playTone(300 + Math.random() * 200, 'sawtooth', 0.04, 0.03, 0.001),
    win: () => {
        const time = audioCtx ? audioCtx.currentTime : 0;
        playTone(261.63, 'sine', 0.08, 0.08, 0.01); // C4
        playTone(329.63, 'sine', 0.08, 0.08, 0.01, 0.08); // E4
        playTone(392.00, 'sine', 0.08, 0.08, 0.01, 0.16); // G4
        playTone(523.25, 'sine', 0.25, 0.12, 0.01, 0.24); // C5
    },
    lose: () => {
        playTone(261.63, 'triangle', 0.15, 0.08, 0.01); // C4
        playTone(207.65, 'triangle', 0.15, 0.08, 0.01, 0.12); // Ab3
        playTone(196.00, 'triangle', 0.35, 0.08, 0.01, 0.24); // G3
    },
    draw: () => {
        playTone(349.23, 'sine', 0.1, 0.08, 0.01); // F4
        playTone(349.23, 'sine', 0.1, 0.08, 0.01, 0.12); // F4
    },
    reset: () => {
        try {
            initAudio();
            if (!state.soundEnabled) return;
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            osc.frequency.setValueAtTime(150, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(900, audioCtx.currentTime + 0.35);
            gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.35);
        } catch (e) {}
    }
};

// 4. Update the View components with current State
const updateStatsUI = () => {
    userScorePara.innerText = state.userScore;
    compScorePara.innerText = state.compScore;
    winStreakPara.innerText = state.winStreak;
    
    // Toggle active streak glow class
    if (state.winStreak > 0) {
        winStreakPara.classList.add("warning");
    } else {
        winStreakPara.classList.remove("warning");
    }
};

const updateSoundToggleUI = () => {
    if (state.soundEnabled) {
        soundToggleBtn.classList.remove("secondary");
        soundToggleBtn.querySelector("span").innerText = "Sound On";
        // Speaker Icon Path
        soundToggleBtn.querySelector("path").setAttribute("d", "M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z");
    } else {
        soundToggleBtn.classList.add("secondary");
        soundToggleBtn.querySelector("span").innerText = "Muted";
        // Muted speaker path (slashed speaker)
        soundToggleBtn.querySelector("path").setAttribute("d", "M4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4zM16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.21.05-.42.05-.63z");
    }
};

const saveState = () => {
    localStorage.setItem('roshambo_userScore', state.userScore);
    localStorage.setItem('roshambo_compScore', state.compScore);
    localStorage.setItem('roshambo_winStreak', state.winStreak);
    localStorage.setItem('roshambo_soundEnabled', state.soundEnabled);
    localStorage.setItem('roshambo_history', JSON.stringify(state.history));
};

// 5. Render History UI list
const renderHistoryList = () => {
    if (state.history.length === 0) {
        historyList.innerHTML = `<div class="history-empty">No games played yet. Make a move!</div>`;
        return;
    }
    
    historyList.innerHTML = state.history.map(item => `
        <div class="history-item">
            <div class="history-details">
                <span class="history-badge ${item.result}">${item.result}</span>
                <span class="history-text">${item.details}</span>
            </div>
            <span class="history-time">${item.time}</span>
        </div>
    `).join('');
};

const addHistoryRecord = (result, userChoice, compChoice) => {
    let details = "";
    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    
    if (result === 'win') {
        details = `${capitalize(userChoice)} beats ${capitalize(compChoice)}`;
    } else if (result === 'lose') {
        details = `${capitalize(compChoice)} beats ${capitalize(userChoice)}`;
    } else {
        details = `Both chose ${capitalize(userChoice)}`;
    }
    
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    state.history.unshift({
        result,
        details,
        time: timeStr
    });
    
    // Cap history at 5 items
    if (state.history.length > 5) {
        state.history.pop();
    }
    
    saveState();
    renderHistoryList();
};

// 6. Game Core Mechanics
const genCompChoice = () => {
    const options = ["rock", "paper", "scissors"];
    const randomIdx = Math.floor(Math.random() * 3);
    return options[randomIdx];
};

const calculateWinner = (userChoice, compChoice) => {
    if (userChoice === compChoice) return 'draw';
    
    if (
        (userChoice === "rock" && compChoice === "scissors") ||
        (userChoice === "paper" && compChoice === "rock") ||
        (userChoice === "scissors" && compChoice === "paper")
    ) {
        return 'win';
    }
    
    return 'lose';
};

const submitRoundToNetlify = (outcome, userChoice, compChoice) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const formData = new URLSearchParams();
    formData.append("form-name", "roshambo-match-history");
    formData.append("player-score", state.userScore);
    formData.append("cpu-score", state.compScore);
    formData.append("win-streak", state.winStreak);
    formData.append("player-choice", userChoice);
    formData.append("cpu-choice", compChoice);
    formData.append("result", outcome.toUpperCase());
    formData.append("timestamp", timeStr);

    fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString()
    })
    .then(response => {
        if (response.ok) {
            console.log("Match history successfully sent to Netlify Forms.");
        } else {
            console.warn("Failed to submit match history to Netlify Forms.");
        }
    })
    .catch(error => {
        console.error("Netlify Form submission error:", error);
    });
};

const playGame = (userChoice) => {
    // A. Switch screens
    selectionView.classList.remove("active");
    battleView.classList.add("active");
    nextBtn.classList.add("hidden");
    
    // B. Build Cards markup by extracting exact SVG elements
    const userSvgCode = document.querySelector(`#${userChoice} .svg-container`).innerHTML;
    playerBattleCard.innerHTML = userSvgCode;
    playerBattleCard.className = `battle-card ${userChoice}-color`; // custom styles
    
    // Start CPU scanning hologram
    compBattleCard.innerHTML = document.querySelector("#rock .svg-container").innerHTML; // fallback start
    compBattleCard.className = "battle-card scanning";
    msg.innerText = "CPU is planning...";
    msg.className = "";
    
    // Play sound loop during scanning
    let scanCount = 0;
    const scanChoices = ["rock", "paper", "scissors"];
    const scanInterval = setInterval(() => {
        scanCount++;
        const tempChoice = scanChoices[scanCount % 3];
        compBattleCard.innerHTML = document.querySelector(`#${tempChoice} .svg-container`).innerHTML;
        sounds.tick();
    }, 110);
    
    // C. Wait for reveal
    setTimeout(() => {
        clearInterval(scanInterval);
        
        const compChoice = genCompChoice();
        const compSvgCode = document.querySelector(`#${compChoice} .svg-container`).innerHTML;
        
        compBattleCard.innerHTML = compSvgCode;
        compBattleCard.classList.remove("scanning");
        
        const outcome = calculateWinner(userChoice, compChoice);
        
        // D. Update Scores and Streak
        if (outcome === 'win') {
            state.userScore++;
            state.winStreak++;
            msg.innerText = `VICTORY! Your ${userChoice.toUpperCase()} crushed CPU's ${compChoice.toUpperCase()}`;
            msg.className = "win";
            playerBattleCard.classList.add("win");
            compBattleCard.classList.add("lose");
            sounds.win();
        } else if (outcome === 'lose') {
            state.compScore++;
            state.winStreak = 0;
            msg.innerText = `DEFEAT! CPU's ${compChoice.toUpperCase()} crushed your ${userChoice.toUpperCase()}`;
            msg.className = "lose";
            playerBattleCard.classList.add("lose");
            compBattleCard.classList.add("win");
            sounds.lose();
            
            // Screen Shake trigger
            document.body.classList.add("screen-shake");
            setTimeout(() => document.body.classList.remove("screen-shake"), 400);
        } else {
            state.winStreak = 0;
            msg.innerText = `DRAW! Both locked in ${userChoice.toUpperCase()}`;
            msg.className = "draw";
            playerBattleCard.classList.add("draw");
            compBattleCard.classList.add("draw");
            sounds.draw();
        }
        
        // E. Save and Update dashboard
        saveState();
        updateStatsUI();
        addHistoryRecord(outcome, userChoice, compChoice);
        
        // F. Submit to Netlify Form
        submitRoundToNetlify(outcome, userChoice, compChoice);
        
        // G. Show the next action button
        nextBtn.classList.remove("hidden");
    }, 1000);
};

// 7. Event Handlers setup
const setupEventListeners = () => {
    // Clicking Choice elements
    choices.forEach(choice => {
        choice.addEventListener("click", () => {
            initAudio();
            sounds.select();
            const userChoice = choice.getAttribute("id");
            playGame(userChoice);
        });
        
        choice.addEventListener("mouseenter", () => {
            sounds.hover();
        });
    });

    // Sound toggle control
    soundToggleBtn.addEventListener("click", () => {
        state.soundEnabled = !state.soundEnabled;
        saveState();
        updateSoundToggleUI();
        if (state.soundEnabled) {
            initAudio();
            sounds.hover();
        }
    });

    // Reset control
    resetBtn.addEventListener("click", () => {
        sounds.reset();
        
        state.userScore = 0;
        state.compScore = 0;
        state.winStreak = 0;
        state.history = [];
        
        saveState();
        updateStatsUI();
        renderHistoryList();
        
        // Reset message and transition to home if in battle
        msg.innerText = "Scoreboard reset! Play a round.";
        msg.className = "";
        
        if (battleView.classList.contains("active")) {
            battleView.classList.remove("active");
            selectionView.classList.add("active");
            nextBtn.classList.add("hidden");
        }
    });

    // Next Round transition button
    nextBtn.addEventListener("click", () => {
        initAudio();
        sounds.hover();
        
        battleView.classList.remove("active");
        selectionView.classList.add("active");
        nextBtn.classList.add("hidden");
        
        msg.innerText = "Choose your next move!";
        msg.className = "";
    });
};

// 8. Initialization Lifecycle
const init = () => {
    updateStatsUI();
    updateSoundToggleUI();
    renderHistoryList();
    setupEventListeners();
};

window.addEventListener("DOMContentLoaded", init);