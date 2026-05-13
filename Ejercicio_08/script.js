const STORAGE_KEY = "fitvoice-ai-data";

const defaultState = {
    reps: 0,
    totalReps: 0,
    workouts: 0,
    record: 0,
    calories: 0,
    history: [],
    settings: {
        goal: 50,
        level: "Inicial",
        routine: "Sentadillas"
    }
};

let state = loadState();
let recognition = null;
let isListening = false;
let timerSeconds = 0;
let timerInterval = null;
let lastRealtimeNumber = null;
let lastVoiceCommand = "";
let lastVoiceCommandTime = 0;

function getFreshDefaultState() {
    return JSON.parse(JSON.stringify(defaultState));
}

const elements = {
    loader: document.querySelector("#loader"),
    repCounter: document.querySelector("#repCounter"),
    micStatus: document.querySelector("#micStatus"),
    voiceTranscript: document.querySelector("#voiceTranscript"),
    startBtn: document.querySelector("#startBtn"),
    pauseBtn: document.querySelector("#pauseBtn"),
    resetBtn: document.querySelector("#resetBtn"),
    finishBtn: document.querySelector("#finishBtn"),
    manualReps: document.querySelector("#manualReps"),
    addManualBtn: document.querySelector("#addManualBtn"),
    timerDisplay: document.querySelector("#timerDisplay"),
    goalProgress: document.querySelector("#goalProgress"),
    currentExercise: document.querySelector("#currentExercise"),
    totalWorkouts: document.querySelector("#totalWorkouts"),
    personalRecord: document.querySelector("#personalRecord"),
    calories: document.querySelector("#calories"),
    performanceLevel: document.querySelector("#performanceLevel"),
    weeklyTotal: document.querySelector("#weeklyTotal"),
    weekBars: document.querySelector("#weekBars"),
    aiRecommendation: document.querySelector("#aiRecommendation"),
    aiDetail: document.querySelector("#aiDetail"),
    historyList: document.querySelector("#historyList"),
    clearHistoryBtn: document.querySelector("#clearHistoryBtn"),
    goalInput: document.querySelector("#goalInput"),
    levelSelect: document.querySelector("#levelSelect"),
    routineSelect: document.querySelector("#routineSelect"),
    heroGoal: document.querySelector("#heroGoal"),
    motivationalPhrase: document.querySelector("#motivationalPhrase")
};

document.addEventListener("DOMContentLoaded", () => {
    setupSpeechRecognition();
    bindEvents();
    render();

    setTimeout(() => {
        elements.loader.classList.add("hidden");
    }, 700);
});

function loadState() {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (!savedData) {
        return getFreshDefaultState();
    }

    try {
        const parsedData = JSON.parse(savedData);
        return {
            ...getFreshDefaultState(),
            ...parsedData,
            settings: {
                ...defaultState.settings,
                ...(parsedData.settings || {})
            }
        };
    } catch (error) {
        console.warn("No se pudo leer LocalStorage, se reinicia el progreso.", error);
        return getFreshDefaultState();
    }
}

function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function bindEvents() {
    elements.startBtn.addEventListener("click", startListening);
    elements.pauseBtn.addEventListener("click", pauseTraining);
    elements.resetBtn.addEventListener("click", resetCurrentSession);
    elements.finishBtn.addEventListener("click", finishTraining);
    elements.addManualBtn.addEventListener("click", addManualReps);
    elements.clearHistoryBtn.addEventListener("click", clearHistory);

    elements.goalInput.addEventListener("input", updateSettings);
    elements.levelSelect.addEventListener("change", updateSettings);
    elements.routineSelect.addEventListener("change", updateSettings);
}

function setupSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        elements.voiceTranscript.textContent = "Tu navegador no soporta Web Speech API. Podes usar el contador manual.";
        elements.startBtn.disabled = true;
        return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = "es-UY";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
        const lastResult = event.results[event.results.length - 1];
        const transcript = normalizeText(lastResult[0].transcript);
        elements.voiceTranscript.textContent = `Escuchado: "${transcript}"`;

        if (processRealtimeCommand(transcript)) {
            lastRealtimeNumber = null;
            return;
        }

        if (lastResult.isFinal) {
            processVoiceCommand(transcript);
            lastRealtimeNumber = null;
        } else {
            processRealtimeNumber(transcript);
        }
    };

    recognition.onerror = () => {
        elements.voiceTranscript.textContent = "No se pudo acceder al microfono. Revisar permisos del navegador.";
        stopListening(false);
    };

    recognition.onend = () => {
        if (isListening) {
            recognition.start();
        }
    };
}

function processVoiceCommand(text) {
    const normalizedText = normalizeText(text);

    const command = getVoiceCommand(normalizedText);

    if (command === "start") {
        startListening();
        return;
    }

    if (command === "pause") {
        pauseTraining();
        return;
    }

    if (command === "reset") {
        resetCurrentSession();
        return;
    }

    if (command === "finish") {
        finishTraining();
        return;
    }

    const spokenNumber = extractNumber(normalizedText);

    if (spokenNumber !== null && spokenNumber !== state.reps) {
        setReps(spokenNumber);
        playRepSound();
    }
}

function processRealtimeCommand(text) {
    const command = getVoiceCommand(text);

    if (!command || command === "start") {
        return false;
    }

    const now = Date.now();

    if (command === lastVoiceCommand && now - lastVoiceCommandTime < 1500) {
        return true;
    }

    lastVoiceCommand = command;
    lastVoiceCommandTime = now;
    processVoiceCommand(text);
    return true;
}

function getVoiceCommand(text) {
    const normalizedText = normalizeText(text);

    if (hasAnyWord(normalizedText, ["empezar", "iniciar", "comenzar", "arrancar", "seguir", "continuar"])) {
        return "start";
    }

    if (hasAnyWord(normalizedText, ["pausa", "pausar", "detener", "parar", "alto"])) {
        return "pause";
    }

    if (hasAnyWord(normalizedText, ["reiniciar", "resetear", "borrar", "cero"])) {
        return "reset";
    }

    if (hasAnyWord(normalizedText, ["termine", "terminar", "finalizar", "guardar", "listo", "fin"])) {
        return "finish";
    }

    return null;
}

function hasAnyWord(text, words) {
    return words.some((word) => new RegExp(`\\b${word}\\b`).test(text));
}

function processRealtimeNumber(text) {
    const spokenNumber = extractNumber(text);

    if (spokenNumber === null || spokenNumber === lastRealtimeNumber || spokenNumber === state.reps) {
        return;
    }

    lastRealtimeNumber = spokenNumber;
    setReps(spokenNumber);
    playRepSound();
}

function extractNumber(text) {
    const directNumbers = text.match(/\d+/g);

    if (directNumbers) {
        return Number(directNumbers[directNumbers.length - 1]);
    }

    const numberWords = {
        uno: 1,
        un: 1,
        una: 1,
        dos: 2,
        tres: 3,
        cuatro: 4,
        cinco: 5,
        seis: 6,
        siete: 7,
        ocho: 8,
        nueve: 9,
        diez: 10,
        once: 11,
        doce: 12,
        trece: 13,
        catorce: 14,
        quince: 15,
        dieciseis: 16,
        diecisiete: 17,
        dieciocho: 18,
        diecinueve: 19,
        veinte: 20
    };

    const words = text.split(/\s+/);
    const foundWord = words.findLast
        ? words.findLast((word) => numberWords[word] !== undefined)
        : [...words].reverse().find((word) => numberWords[word] !== undefined);

    return foundWord ? numberWords[foundWord] : null;
}

function normalizeText(text) {
    return text
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function startListening() {
    if (!recognition || isListening) {
        return;
    }

    isListening = true;
    recognition.start();
    startTimer();
    updateMicStatus(true);
    elements.voiceTranscript.textContent = "Escuchando... deci un numero o un comando.";
}

function stopListening(keepTimer = true) {
    isListening = false;

    if (recognition) {
        recognition.stop();
    }

    if (!keepTimer) {
        stopTimer();
    }

    updateMicStatus(false);
}

function pauseTraining() {
    stopListening(false);
    elements.voiceTranscript.textContent = "Entrenamiento en pausa.";
}

function resetCurrentSession() {
    state.reps = 0;
    timerSeconds = 0;
    lastRealtimeNumber = null;
    lastVoiceCommand = "";
    stopListening(false);
    saveState();
    render();
    elements.voiceTranscript.textContent = "Sesion reiniciada.";
}

function finishTraining() {
    if (state.reps <= 0) {
        elements.voiceTranscript.textContent = "Agrega repeticiones antes de finalizar.";
        return;
    }

    const session = {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        exercise: state.settings.routine,
        reps: state.reps,
        seconds: timerSeconds,
        date: new Date().toISOString()
    };

    state.history.unshift(session);
    state.history = state.history.slice(0, 12);
    state.workouts += 1;
    state.totalReps += state.reps;
    state.record = Math.max(state.record, state.reps);
    state.calories = Math.round(state.totalReps * 0.45);
    state.reps = 0;
    timerSeconds = 0;
    lastRealtimeNumber = null;
    lastVoiceCommand = "";

    stopListening(false);
    saveState();
    render();
    elements.voiceTranscript.textContent = "Sesion guardada en el historial.";
}

function setReps(value) {
    state.reps = Math.max(0, Math.min(Number(value), 999));
    saveState();
    render();
}

function addManualReps() {
    const amount = Number(elements.manualReps.value);

    if (!Number.isFinite(amount) || amount <= 0) {
        return;
    }

    setReps(state.reps + amount);
    playRepSound();
}

function clearHistory() {
    const confirmClear = confirm("Seguro que queres borrar el historial y estadisticas?");

    if (!confirmClear) {
        return;
    }

    const settings = state.settings;
    state = getFreshDefaultState();
    state.settings = settings;
    timerSeconds = 0;
    saveState();
    render();
}

function updateSettings() {
    state.settings.goal = Math.max(5, Number(elements.goalInput.value) || 50);
    state.settings.level = elements.levelSelect.value;
    state.settings.routine = elements.routineSelect.value;
    saveState();
    render();
}

function startTimer() {
    if (timerInterval) {
        return;
    }

    timerInterval = setInterval(() => {
        timerSeconds += 1;
        renderTimer();
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function render() {
    elements.repCounter.textContent = state.reps;
    elements.goalInput.value = state.settings.goal;
    elements.levelSelect.value = state.settings.level;
    elements.routineSelect.value = state.settings.routine;
    elements.currentExercise.textContent = state.settings.routine;
    elements.heroGoal.textContent = state.settings.goal;

    elements.totalWorkouts.textContent = state.workouts;
    elements.personalRecord.textContent = state.record;
    elements.calories.textContent = state.calories;
    elements.performanceLevel.textContent = getPerformanceLevel();

    const progress = Math.min((state.reps / state.settings.goal) * 100, 100);
    elements.goalProgress.style.width = `${progress}%`;

    renderTimer();
    renderWeekBars();
    renderHistory();
    renderRecommendation();
}

function renderTimer() {
    const minutes = String(Math.floor(timerSeconds / 60)).padStart(2, "0");
    const seconds = String(timerSeconds % 60).padStart(2, "0");
    elements.timerDisplay.textContent = `${minutes}:${seconds}`;
}

function renderWeekBars() {
    const weekData = getWeeklyData();
    const maxReps = Math.max(...weekData.map((day) => day.reps), 1);
    const total = weekData.reduce((sum, day) => sum + day.reps, 0);

    elements.weeklyTotal.textContent = total;
    elements.weekBars.innerHTML = weekData.map((day) => {
        const height = Math.max((day.reps / maxReps) * 100, day.reps > 0 ? 12 : 4);
        return `
            <div class="week-day">
                <div class="week-bar" style="height: ${height}%"></div>
                <span>${day.label}</span>
            </div>
        `;
    }).join("");
}

function getWeeklyData() {
    const labels = ["L", "M", "M", "J", "V", "S", "D"];
    const today = new Date();
    const day = today.getDay() || 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() - day + 1);
    monday.setHours(0, 0, 0, 0);

    return labels.map((label, index) => {
        const date = new Date(monday);
        date.setDate(monday.getDate() + index);

        const reps = state.history.reduce((sum, session) => {
            const sessionDate = new Date(session.date);
            const sameDay = sessionDate.toDateString() === date.toDateString();
            return sameDay ? sum + session.reps : sum;
        }, 0);

        return { label, reps };
    });
}

function renderHistory() {
    if (state.history.length === 0) {
        elements.historyList.innerHTML = `<p class="soft-text mb-0">Todavia no hay sesiones guardadas.</p>`;
        return;
    }

    elements.historyList.innerHTML = state.history.map((session) => {
        const date = new Date(session.date).toLocaleDateString("es-UY", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });

        return `
            <article class="history-item">
                <div>
                    <strong>${session.exercise}</strong>
                    <span class="d-block">${date} - ${formatDuration(session.seconds)}</span>
                </div>
                <strong>${session.reps} reps</strong>
            </article>
        `;
    }).join("");
}

function renderRecommendation() {
    const weeklyTotal = getWeeklyData().reduce((sum, day) => sum + day.reps, 0);
    const goal = state.settings.goal;
    let recommendation = "Completa tu primer entrenamiento.";
    let detail = "Cuando guardes sesiones, FitVoice AI analizara tu rendimiento localmente.";

    if (state.reps > state.record && state.record > 0) {
        recommendation = "Estas por superar tu record.";
        detail = "Finaliza la sesion para guardar este nuevo rendimiento.";
    } else if (weeklyTotal >= goal * 5) {
        recommendation = "Buen progreso esta semana.";
        detail = "Tu constancia esta alta. Podes subir la intensidad de forma gradual.";
    } else if (state.workouts >= 3 && weeklyTotal < goal * 2) {
        recommendation = "Necesitas descansar o ajustar la meta.";
        detail = "Tu semana viene liviana. Revisa si el objetivo es realista para tu nivel actual.";
    } else if (state.record >= goal) {
        recommendation = "Podria ser momento de aumentar intensidad.";
        detail = "Ya alcanzaste tu objetivo en una sesion. Proba subir 5 o 10 repeticiones.";
    } else if (state.workouts > 0) {
        recommendation = "Segui acumulando sesiones.";
        detail = "La clave es sostener el habito y mejorar de a poco.";
    }

    elements.aiRecommendation.textContent = recommendation;
    elements.aiDetail.textContent = detail;
    elements.motivationalPhrase.textContent = recommendation;
}

function getPerformanceLevel() {
    if (state.totalReps >= 900) {
        return "Elite";
    }

    if (state.totalReps >= 450) {
        return "Avanzado";
    }

    if (state.totalReps >= 150) {
        return "Intermedio";
    }

    return state.settings.level;
}

function updateMicStatus(active) {
    elements.micStatus.classList.toggle("active", active);
    elements.micStatus.classList.toggle("muted", !active);
    elements.micStatus.innerHTML = active
        ? `<i class="fa-solid fa-microphone"></i> Microfono activo`
        : `<i class="fa-solid fa-microphone-slash"></i> Microfono apagado`;
}

function formatDuration(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
}

function playRepSound() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;

    if (!AudioContext) {
        return;
    }

    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = 720;
    gain.gain.setValueAtTime(0.05, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.14);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.14);
}
