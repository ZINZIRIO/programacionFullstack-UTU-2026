const STORAGE_KEY = "fitvoice-ai-data";
const GEMINI_KEY_STORAGE_KEY = "fitvoice-gemini-api-key";
const GEMINI_MODEL = "gemini-2.5-flash";
const REQUIRED_STABLE_FRAMES = 4;
const REP_COOLDOWN_MS = 950;
const VOICE_COMMAND_COOLDOWN_MS = 2200;
const MIN_VOICE_CONFIDENCE = 0.35;

const defaultState = {
    reps: 0,
    totalReps: 0,
    workouts: 0,
    record: 0,
    calories: 0,
    aiCoach: null,
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
let lastVoiceCommand = "";
let lastVoiceCommandTime = 0;
let pose = null;
let isCameraActive = false;
let poseFrameId = null;
let isPoseProcessing = false;
let movementPhase = "up";
let lastRepTime = 0;
let stableDownFrames = 0;
let stableUpFrames = 0;
const metricHistory = {};

function getFreshDefaultState() {
    return JSON.parse(JSON.stringify(defaultState));
}

const elements = {
    loader: document.querySelector("#loader"),
    repCounter: document.querySelector("#repCounter"),
    micStatus: document.querySelector("#micStatus"),
    cameraStatus: document.querySelector("#cameraStatus"),
    poseVideo: document.querySelector("#poseVideo"),
    poseCanvas: document.querySelector("#poseCanvas"),
    cameraOverlay: document.querySelector("#cameraOverlay"),
    poseFeedback: document.querySelector("#poseFeedback"),
    poseQualityText: document.querySelector("#poseQualityText"),
    poseQualityBar: document.querySelector("#poseQualityBar"),
    movementPhaseText: document.querySelector("#movementPhaseText"),
    poseMetricText: document.querySelector("#poseMetricText"),
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
    aiStatus: document.querySelector("#aiStatus"),
    generateAiBtn: document.querySelector("#generateAiBtn"),
    historyList: document.querySelector("#historyList"),
    clearHistoryBtn: document.querySelector("#clearHistoryBtn"),
    goalInput: document.querySelector("#goalInput"),
    levelSelect: document.querySelector("#levelSelect"),
    routineSelect: document.querySelector("#routineSelect"),
    geminiApiKeyInput: document.querySelector("#geminiApiKeyInput"),
    geminiKeyMessage: document.querySelector("#geminiKeyMessage"),
    saveGeminiKeyBtn: document.querySelector("#saveGeminiKeyBtn"),
    clearGeminiKeyBtn: document.querySelector("#clearGeminiKeyBtn"),
    heroGoal: document.querySelector("#heroGoal"),
    motivationalPhrase: document.querySelector("#motivationalPhrase")
};

document.addEventListener("DOMContentLoaded", () => {
    setupSpeechRecognition();
    setupPoseDetection();
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
    elements.startBtn.addEventListener("click", startTraining);
    elements.pauseBtn.addEventListener("click", pauseTraining);
    elements.resetBtn.addEventListener("click", resetCurrentSession);
    elements.finishBtn.addEventListener("click", finishTraining);
    elements.addManualBtn.addEventListener("click", addManualReps);
    elements.clearHistoryBtn.addEventListener("click", clearHistory);
    elements.generateAiBtn.addEventListener("click", generateGeminiRecommendation);
    elements.saveGeminiKeyBtn.addEventListener("click", saveGeminiApiKey);
    elements.clearGeminiKeyBtn.addEventListener("click", clearGeminiApiKey);

    elements.goalInput.addEventListener("input", updateSettings);
    elements.levelSelect.addEventListener("change", updateSettings);
    elements.routineSelect.addEventListener("change", updateSettings);
}

function setupSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        elements.voiceTranscript.textContent = "Tu navegador no soporta Web Speech API. La camara puede contar repeticiones igual.";
        return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = "es-UY";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
        const lastResult = event.results[event.results.length - 1];
        const transcript = normalizeText(lastResult[0].transcript);
        const confidence = lastResult[0].confidence || 1;
        elements.voiceTranscript.textContent = `Escuchado: "${transcript}"`;

        processSpeechCommand(transcript, {
            confidence,
            isFinal: lastResult.isFinal
        });
    };

    recognition.onerror = () => {
        elements.voiceTranscript.textContent = "No se pudo acceder al microfono. Revisar permisos del navegador.";
        isListening = false;
        updateMicStatus(false);
    };

    recognition.onend = () => {
        if (isListening) {
            recognition.start();
        }
    };
}

function setupPoseDetection() {
    if (!window.Pose) {
        elements.poseFeedback.textContent = "No se pudo cargar MediaPipe Pose. Revisa la conexion a internet.";
        elements.startBtn.disabled = true;
        return;
    }

    pose = new Pose({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
    });

    pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        minDetectionConfidence: 0.55,
        minTrackingConfidence: 0.55
    });

    pose.onResults(handlePoseResults);
}

function processVoiceCommand(text) {
    const normalizedText = normalizeText(text);

    const command = getVoiceCommand(normalizedText);

    if (command === "start") {
        startTraining();
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
}

function processSpeechCommand(text, options = {}) {
    const command = getVoiceCommand(text);

    if (!command) {
        return false;
    }

    const now = Date.now();
    const isDestructiveCommand = command === "reset" || command === "finish";
    const hasLowConfidence = options.confidence < MIN_VOICE_CONFIDENCE;

    if (isDestructiveCommand && !options.isFinal) {
        elements.voiceTranscript.textContent = `Comando posible: "${text}". Esperando confirmacion de voz.`;
        return true;
    }

    if (hasLowConfidence && !options.isFinal) {
        elements.voiceTranscript.textContent = "Ruido detectado, comando ignorado.";
        return false;
    }

    if (command === lastVoiceCommand && now - lastVoiceCommandTime < VOICE_COMMAND_COOLDOWN_MS) {
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

function normalizeText(text) {
    return text
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

async function startTraining() {
    startListening();
    const cameraStarted = await startCamera();

    if (cameraStarted) {
        startTimer();
        elements.voiceTranscript.textContent = "Entrenamiento activo. Usa voz para pausar, reiniciar o terminar.";
    }
}

function startListening() {
    if (!recognition || isListening) {
        return;
    }

    isListening = true;
    recognition.start();
    updateMicStatus(true);
    elements.voiceTranscript.textContent = "Escuchando comandos de voz.";
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
    stopTimer();
    stopCamera();
    elements.voiceTranscript.textContent = "Entrenamiento en pausa.";
    elements.poseFeedback.textContent = "Pausado. Deci empezar o toca iniciar para continuar.";
}

function resetCurrentSession() {
    state.reps = 0;
    state.aiCoach = null;
    timerSeconds = 0;
    lastVoiceCommand = "";
    resetPoseCounterState();
    stopListening(false);
    stopCamera();
    saveState();
    render();
    elements.voiceTranscript.textContent = "Sesion reiniciada.";
    elements.poseFeedback.textContent = "Contador en cero. Inicia la camara para volver a detectar.";
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
    state.aiCoach = null;
    timerSeconds = 0;
    lastVoiceCommand = "";
    resetPoseCounterState();

    stopListening(false);
    stopCamera();
    saveState();
    render();
    elements.voiceTranscript.textContent = "Sesion guardada en el historial.";
    elements.poseFeedback.textContent = "Sesion finalizada y guardada.";
}

function setReps(value) {
    state.reps = Math.max(0, Math.min(Number(value), 999));
    state.aiCoach = null;
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
    resetPoseCounterState();
    state.aiCoach = null;
    saveState();
    render();
}

function saveGeminiApiKey() {
    const apiKey = elements.geminiApiKeyInput.value.trim();

    if (!apiKey) {
        elements.aiStatus.textContent = "Pega una API key antes de guardar.";
        updateGeminiKeyMessage("Pega una API key antes de guardar.", "error");
        return;
    }

    localStorage.setItem(GEMINI_KEY_STORAGE_KEY, apiKey);
    elements.geminiApiKeyInput.value = "";
    elements.geminiApiKeyInput.placeholder = "Clave guardada en este navegador";
    elements.aiStatus.textContent = "API key guardada. Ya podes generar recomendaciones con Gemini.";
    updateGeminiKeyMessage("API key de Gemini ingresada correctamente.", "success");
}

function clearGeminiApiKey() {
    localStorage.removeItem(GEMINI_KEY_STORAGE_KEY);
    elements.geminiApiKeyInput.value = "";
    elements.geminiApiKeyInput.placeholder = "Pega tu clave solo en tu navegador";
    elements.aiStatus.textContent = "API key borrada del navegador.";
    updateGeminiKeyMessage("API key borrada del navegador.", "error");
}

function updateGeminiKeyMessage(message, type = "") {
    elements.geminiKeyMessage.textContent = message;
    elements.geminiKeyMessage.classList.toggle("success", type === "success");
    elements.geminiKeyMessage.classList.toggle("error", type === "error");
}

async function generateGeminiRecommendation() {
    const apiKey = localStorage.getItem(GEMINI_KEY_STORAGE_KEY);

    if (!apiKey) {
        elements.aiStatus.textContent = "Primero guarda tu API key de Gemini en Configuracion.";
        location.hash = "#configuracion";
        return;
    }

    elements.generateAiBtn.disabled = true;
    elements.aiStatus.textContent = "Gemini esta analizando tu entrenamiento...";

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: buildGeminiPrompt()
                            }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.75,
                    maxOutputTokens: 220,
                    responseMimeType: "application/json"
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Gemini respondio con estado ${response.status}`);
        }

        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const recommendation = parseGeminiJson(rawText);

        state.aiCoach = {
            recommendation: recommendation.recommendation || "Buen entrenamiento.",
            detail: recommendation.detail || "Segui entrenando con buena tecnica y descanso suficiente.",
            createdAt: new Date().toISOString()
        };

        saveState();
        render();
        elements.aiStatus.textContent = "Recomendacion generada con Gemini.";
    } catch (error) {
        console.error("Error con Gemini.", error);
        elements.aiStatus.textContent = "No se pudo conectar con Gemini. Revisa la clave, internet o la cuota gratis.";
    } finally {
        elements.generateAiBtn.disabled = false;
    }
}

function buildGeminiPrompt() {
    const recentHistory = state.history.slice(0, 6).map((session) => ({
        ejercicio: session.exercise,
        repeticiones: session.reps,
        duracionSegundos: session.seconds,
        fecha: session.date
    }));

    return `
Sos FitVoice AI, un entrenador personal breve, motivador y responsable.
Genera una recomendacion personalizada en espanol rioplatense para una app fitness.

Datos actuales:
- Ejercicio seleccionado: ${state.settings.routine}
- Repeticiones de la sesion actual: ${state.reps}
- Objetivo diario: ${state.settings.goal}
- Nivel configurado: ${state.settings.level}
- Record personal: ${state.record}
- Total de entrenamientos guardados: ${state.workouts}
- Total historico de repeticiones: ${state.totalReps}
- Historial reciente JSON: ${JSON.stringify(recentHistory)}

Reglas:
- No diagnostiques lesiones ni des consejos medicos.
- Si el progreso es bajo, anima sin retar.
- Si supera el objetivo o record, felicita y propone una mejora chica.
- Responde solamente JSON valido con estas claves:
{
  "recommendation": "maximo 90 caracteres",
  "detail": "una explicacion concreta de 1 o 2 frases"
}
`;
}

function parseGeminiJson(rawText) {
    const cleanText = rawText
        .replace(/^```json/i, "")
        .replace(/^```/i, "")
        .replace(/```$/i, "")
        .trim();

    return JSON.parse(cleanText);
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

async function startCamera() {
    if (isCameraActive) {
        return isCameraActive;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: "user"
            },
            audio: false
        });

        elements.poseVideo.srcObject = stream;
        await elements.poseVideo.play();
        isCameraActive = true;
        updateCameraStatus(true);
        elements.cameraOverlay.classList.add("hidden");
        elements.poseFeedback.textContent = "Camara activa. Colocate de cuerpo completo frente a la pantalla.";
        processPoseFrame();
        return true;
    } catch (error) {
        console.error("No se pudo iniciar la camara.", error);
        elements.poseFeedback.textContent = "No se pudo acceder a la camara. Revisa permisos del navegador.";
        updateCameraStatus(false);
        return false;
    }
}

async function processPoseFrame() {
    if (!isCameraActive || !pose) {
        return;
    }

    if (!isPoseProcessing && elements.poseVideo.readyState >= 2) {
        isPoseProcessing = true;

        try {
            await pose.send({ image: elements.poseVideo });
        } catch (error) {
            console.error("Error procesando pose.", error);
        } finally {
            isPoseProcessing = false;
        }
    }

    poseFrameId = requestAnimationFrame(processPoseFrame);
}

function stopCamera() {
    if (poseFrameId) {
        cancelAnimationFrame(poseFrameId);
        poseFrameId = null;
    }

    const stream = elements.poseVideo.srcObject;

    if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        elements.poseVideo.srcObject = null;
    }

    isCameraActive = false;
    isPoseProcessing = false;
    resetPoseCounterState();
    updateCameraStatus(false);
    elements.cameraOverlay.classList.remove("hidden");
}

function handlePoseResults(results) {
    const canvas = elements.poseCanvas;
    const canvasContext = canvas.getContext("2d");
    canvas.width = results.image.width;
    canvas.height = results.image.height;

    canvasContext.save();
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    canvasContext.drawImage(results.image, 0, 0, canvas.width, canvas.height);

    if (results.poseLandmarks) {
        drawConnectors(canvasContext, results.poseLandmarks, POSE_CONNECTIONS, {
            color: "rgba(53, 255, 145, 0.85)",
            lineWidth: 4
        });
        drawLandmarks(canvasContext, results.poseLandmarks, {
            color: "#21a8ff",
            lineWidth: 2,
            radius: 4
        });
        analyzeExercise(results.poseLandmarks);
    } else if (isCameraActive) {
        updatePoseQuality(0, "Cuerpo incompleto", "--");
        elements.poseFeedback.textContent = "No detecto el cuerpo completo. Alejate un poco de la camara.";
    }

    canvasContext.restore();
}

function analyzeExercise(landmarks) {
    const routine = state.settings.routine;
    const repInfo = getExerciseRepInfo(routine, landmarks);
    const frameQuality = getBodyFrameQuality(landmarks);

    if (!repInfo) {
        updatePoseQuality(0, "Cuerpo incompleto", "--");
        elements.poseFeedback.textContent = "Este ejercicio usa deteccion experimental. Proba Sentadillas, Flexiones o Estocadas.";
        return;
    }

    const finalQuality = Math.min(repInfo.quality, frameQuality.score);
    updatePoseQuality(finalQuality, getQualityLabel(finalQuality), repInfo.metricText);
    elements.poseFeedback.textContent = frameQuality.feedback || repInfo.feedback;

    if (finalQuality < 0.42) {
        stableDownFrames = 0;
        stableUpFrames = 0;
        return;
    }

    if (repInfo.isDown) {
        stableDownFrames += 1;
        stableUpFrames = 0;
    } else if (repInfo.isUp) {
        stableUpFrames += 1;
        stableDownFrames = 0;
    } else {
        stableDownFrames = 0;
        stableUpFrames = 0;
    }

    if (movementPhase === "up" && stableDownFrames >= REQUIRED_STABLE_FRAMES) {
        movementPhase = "down";
        updateMovementPhase();
        return;
    }

    if (movementPhase === "down" && stableUpFrames >= REQUIRED_STABLE_FRAMES) {
        addCameraRep();
        movementPhase = "up";
        updateMovementPhase();
    }
}

function getExerciseRepInfo(routine, landmarks) {
    if (routine === "Sentadillas" || routine === "Estocadas") {
        return getLegRepInfo(routine, landmarks);
    }

    if (routine === "Flexiones") {
        return getPushupRepInfo(landmarks);
    }

    if (routine === "Abdominales") {
        return getCoreRepInfo(landmarks);
    }

    if (routine === "Burpees") {
        return getBurpeeRepInfo(landmarks);
    }

    return null;
}

function getLegRepInfo(routine, landmarks) {
    const side = chooseVisibleTriplet(landmarks, [23, 25, 27], [24, 26, 28]);

    if (!side) {
        return null;
    }

    const kneeAngle = smoothMetric("leg", getAngle(side.first, side.middle, side.last));
    const downLimit = routine === "Estocadas" ? 115 : 120;
    const upLimit = 158;

    return {
        isDown: kneeAngle < downLimit,
        isUp: kneeAngle > upLimit,
        quality: side.quality,
        qualityLabel: getQualityLabel(side.quality),
        metricText: `Rodilla: ${Math.round(kneeAngle)} grados`,
        feedback: kneeAngle < downLimit
            ? "Bajada detectada. Ahora subi para contar la repeticion."
            : `Angulo de rodilla: ${Math.round(kneeAngle)} grados.`
    };
}

function getPushupRepInfo(landmarks) {
    const side = chooseVisibleTriplet(landmarks, [11, 13, 15], [12, 14, 16]);

    if (!side) {
        return null;
    }

    const elbowAngle = smoothMetric("pushup", getAngle(side.first, side.middle, side.last));

    return {
        isDown: elbowAngle < 95,
        isUp: elbowAngle > 155,
        quality: side.quality,
        qualityLabel: getQualityLabel(side.quality),
        metricText: `Codo: ${Math.round(elbowAngle)} grados`,
        feedback: elbowAngle < 95
            ? "Flexion abajo detectada. Extende brazos para sumar."
            : `Angulo de codo: ${Math.round(elbowAngle)} grados.`
    };
}

function getCoreRepInfo(landmarks) {
    const side = chooseVisibleTriplet(landmarks, [11, 23, 25], [12, 24, 26]);

    if (!side) {
        return null;
    }

    const torsoAngle = smoothMetric("core", getAngle(side.first, side.middle, side.last));

    return {
        isDown: torsoAngle > 138,
        isUp: torsoAngle < 105,
        quality: side.quality,
        qualityLabel: getQualityLabel(side.quality),
        metricText: `Torso: ${Math.round(torsoAngle)} grados`,
        feedback: torsoAngle < 105
            ? "Abdominal arriba detectado. Baja controlado."
            : `Angulo de torso: ${Math.round(torsoAngle)} grados.`
    };
}

function getBurpeeRepInfo(landmarks) {
    const leftWrist = landmarks[15];
    const rightWrist = landmarks[16];
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];

    const points = [leftWrist, rightWrist, leftShoulder, rightShoulder, leftHip, rightHip];

    if (!hasVisibility(points)) {
        return null;
    }

    const wristsHigh = leftWrist.y < leftShoulder.y && rightWrist.y < rightShoulder.y;
    const hipsLow = leftHip.y > leftShoulder.y + 0.22 && rightHip.y > rightShoulder.y + 0.22;
    const quality = averageVisibility(points);

    return {
        isDown: hipsLow,
        isUp: wristsHigh,
        quality,
        qualityLabel: getQualityLabel(quality),
        metricText: wristsHigh ? "Manos arriba" : "Cadera baja",
        feedback: wristsHigh ? "Salto arriba detectado." : "Burpee: baja y despues subi con manos arriba."
    };
}

function getBodyFrameQuality(landmarks) {
    const keyIndexes = [11, 12, 15, 16, 23, 24, 25, 26, 27, 28];
    const requiredIndexes = getRequiredFrameIndexes(state.settings.routine);
    const points = keyIndexes
        .map((index) => landmarks[index])
        .filter((point) => point && point.visibility > 0.45);
    const requiredPoints = requiredIndexes
        .map((index) => landmarks[index])
        .filter((point) => point && point.visibility > 0.45);

    if (requiredPoints.length < Math.ceil(requiredIndexes.length * 0.7)) {
        return {
            score: 0.35,
            feedback: "Faltan puntos clave del ejercicio. Ajusta la camara o mejora la luz."
        };
    }

    const xs = requiredPoints.map((point) => point.x);
    const ys = requiredPoints.map((point) => point.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const width = maxX - minX;
    const height = maxY - minY;
    const isLandscapeCamera = elements.poseVideo.videoWidth >= elements.poseVideo.videoHeight;

    if (width < 0.07 || height < 0.12) {
        return {
            score: 0.43,
            feedback: "Estas lejos, pero puedo intentar contar si los puntos clave se ven."
        };
    }

    const horizontalMargin = isLandscapeCamera ? 0.005 : 0.03;
    const verticalMargin = isLandscapeCamera ? 0.01 : 0.03;

    if (width > 0.995 || height > 0.998 || minX < horizontalMargin || maxX > 1 - horizontalMargin || minY < verticalMargin || maxY > 1 - verticalMargin) {
        return {
            score: 0.5,
            feedback: "Puede haber algun recorte. Si no cuenta, alejate un poco."
        };
    }

    return {
        score: 1,
        feedback: ""
    };
}

function getRequiredFrameIndexes(routine) {
    if (routine === "Sentadillas" || routine === "Estocadas") {
        return [23, 24, 25, 26, 27, 28];
    }

    if (routine === "Flexiones") {
        return [11, 12, 13, 14, 15, 16, 23, 24];
    }

    if (routine === "Abdominales") {
        return [11, 12, 23, 24, 25, 26];
    }

    return [11, 12, 15, 16, 23, 24, 25, 26];
}

function addCameraRep() {
    const now = Date.now();

    if (now - lastRepTime < REP_COOLDOWN_MS) {
        return;
    }

    lastRepTime = now;
    stableDownFrames = 0;
    stableUpFrames = 0;
    setReps(state.reps + 1);
    playRepSound();
}

function chooseVisibleTriplet(landmarks, leftIndexes, rightIndexes) {
    const leftPoints = leftIndexes.map((index) => landmarks[index]);
    const rightPoints = rightIndexes.map((index) => landmarks[index]);
    const leftVisible = averageVisibility(leftPoints);
    const rightVisible = averageVisibility(rightPoints);
    const points = leftVisible >= rightVisible ? leftPoints : rightPoints;

    if (!hasVisibility(points)) {
        return null;
    }

    return {
        first: points[0],
        middle: points[1],
        last: points[2],
        quality: averageVisibility(points)
    };
}

function smoothMetric(key, value) {
    metricHistory[key] = metricHistory[key] || [];
    metricHistory[key].push(value);
    metricHistory[key] = metricHistory[key].slice(-6);

    const total = metricHistory[key].reduce((sum, metric) => sum + metric, 0);
    return total / metricHistory[key].length;
}

function resetPoseCounterState() {
    movementPhase = "up";
    stableDownFrames = 0;
    stableUpFrames = 0;
    lastRepTime = 0;
    Object.keys(metricHistory).forEach((key) => {
        delete metricHistory[key];
    });
    updateMovementPhase();
    updatePoseQuality(0, "Esperando camara", "--");
}

function updateMovementPhase() {
    elements.movementPhaseText.textContent = movementPhase === "down"
        ? "Fase: abajo"
        : "Fase: arriba";
}

function updatePoseQuality(quality, label, metricText) {
    const percentage = Math.round(Math.max(0, Math.min(quality, 1)) * 100);
    elements.poseQualityText.textContent = label;
    elements.poseQualityBar.style.width = `${percentage}%`;
    elements.poseMetricText.textContent = metricText === "--" ? "Angulo: --" : metricText;
}

function getQualityLabel(quality) {
    if (quality >= 0.75) {
        return "Alta";
    }

    if (quality >= 0.52) {
        return "Media";
    }

    return "Baja";
}

function averageVisibility(points) {
    return points.reduce((sum, point) => sum + (point.visibility || 0), 0) / points.length;
}

function hasVisibility(points) {
    return points.every((point) => point && (point.visibility === undefined || point.visibility > 0.45));
}

function getAngle(firstPoint, middlePoint, lastPoint) {
    const radians = Math.atan2(lastPoint.y - middlePoint.y, lastPoint.x - middlePoint.x)
        - Math.atan2(firstPoint.y - middlePoint.y, firstPoint.x - middlePoint.x);
    let angle = Math.abs(radians * 180 / Math.PI);

    if (angle > 180) {
        angle = 360 - angle;
    }

    return angle;
}

function render() {
    elements.repCounter.textContent = state.reps;
    elements.goalInput.value = state.settings.goal;
    elements.levelSelect.value = state.settings.level;
    elements.routineSelect.value = state.settings.routine;
    elements.currentExercise.textContent = state.settings.routine;
    elements.heroGoal.textContent = state.settings.goal;
    elements.geminiApiKeyInput.placeholder = localStorage.getItem(GEMINI_KEY_STORAGE_KEY)
        ? "Clave guardada en este navegador"
        : "Pega tu clave solo en tu navegador";
    updateGeminiKeyMessage(
        localStorage.getItem(GEMINI_KEY_STORAGE_KEY)
            ? "API key de Gemini ingresada correctamente."
            : "Todavia no guardaste una API key.",
        localStorage.getItem(GEMINI_KEY_STORAGE_KEY) ? "success" : ""
    );

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
    if (state.aiCoach) {
        elements.aiRecommendation.textContent = state.aiCoach.recommendation;
        elements.aiDetail.textContent = state.aiCoach.detail;
        elements.motivationalPhrase.textContent = state.aiCoach.recommendation;
        elements.aiStatus.textContent = "Recomendacion generada con Gemini.";
        return;
    }

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
    elements.aiStatus.textContent = localStorage.getItem(GEMINI_KEY_STORAGE_KEY)
        ? "Podes pedir una recomendacion mejorada con Gemini."
        : "Configura tu API key de Gemini para activar recomendaciones con IA.";
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

function updateCameraStatus(active) {
    elements.cameraStatus.classList.toggle("active", active);
    elements.cameraStatus.classList.toggle("muted", !active);
    elements.cameraStatus.innerHTML = active
        ? `<i class="fa-solid fa-video"></i> Camara activa`
        : `<i class="fa-solid fa-video-slash"></i> Camara apagada`;
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
