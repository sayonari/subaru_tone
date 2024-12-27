const instrument = document.getElementById('instrument');
const frequencyDisplay = document.getElementById('frequency');
const noteDisplay = document.getElementById('note');

// 音階の定義（C4を基準に2オクターブ）
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const BASE_FREQUENCY = 261.63; // C4 (ド)

let audioCtx = null;
let sourceNode = null;
let gainNode = null;
let detuneParam = null;
let buffer = null;
let isPlaying = false;

// セントから周波数を計算する関数
function centToFrequency(cents) {
    return BASE_FREQUENCY * Math.pow(2, cents / 1200);
}

// 周波数から音階名を取得する関数
function getNoteName(frequency) {
    if (frequency >= 509) {
        const noteNumber = Math.round(12 * Math.log2(frequency / BASE_FREQUENCY));
        const noteName = NOTE_NAMES[(noteNumber % 12 + 12) % 12];
        return `${noteName}5`;
    } else if (frequency >= 254.7 && frequency < BASE_FREQUENCY) {
        return 'C4';
    }

    const noteNumber = Math.round(12 * Math.log2(frequency / BASE_FREQUENCY));
    const octave = Math.floor(Math.log2(frequency / BASE_FREQUENCY)) + 4;
    const noteName = NOTE_NAMES[(noteNumber % 12 + 12) % 12];
    return `${noteName}${octave}`;
}

// Audio初期化
async function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const response = await fetch('sound/subaru_tone.wav');
        const arrayBuffer = await response.arrayBuffer();
        buffer = await audioCtx.decodeAudioData(arrayBuffer);
    }
}

// 再生開始
async function startAudio() {
    if (!audioCtx) await initAudio();
    if (isPlaying) return;

    sourceNode = audioCtx.createBufferSource();
    gainNode = audioCtx.createGain();
    sourceNode.buffer = buffer;
    sourceNode.loop = true;

    // Detuneの調整パラメータ取得
    detuneParam = sourceNode.detune;
    sourceNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    sourceNode.start();
    isPlaying = true;
}

// 音停止
function stopAudio() {
    if (isPlaying) {
        sourceNode.stop();
        sourceNode.disconnect();
        gainNode.disconnect();
        isPlaying = false;
    }
}

// デチューン計算
function calculateDetune(y, height) {
    const normalizedY = 1 - Math.max(0, Math.min(1, y / height));
    const semitoneRange = 24; // 2オクターブ（上12, 下12）
    const cents = (normalizedY * semitoneRange - semitoneRange / 2) * 100;
    return cents;
}

// 表示更新
function updateDisplay(detuneValue) {
    const frequency = centToFrequency(detuneValue);
    frequencyDisplay.textContent = `${Math.round(frequency)} Hz`;
    noteDisplay.textContent = getNoteName(frequency);
}

// ピッチ補間更新
function updatePitchSmooth(detuneValue) {
    detuneParam.cancelScheduledValues(audioCtx.currentTime);
    detuneParam.linearRampToValueAtTime(detuneValue, audioCtx.currentTime + 0.05); // 補間0.05秒
}

// ピッチ即時更新
function setPitchImmediately(detuneValue) {
    detuneParam.setValueAtTime(detuneValue, audioCtx.currentTime); // 即時更新
}

// マウスイベント
instrument.addEventListener('mousedown', async (e) => {
    await startAudio();
    const rect = e.target.getBoundingClientRect();
    const detuneValue = calculateDetune(e.clientY - rect.top, rect.height);
    setPitchImmediately(detuneValue); // クリック時は即時設定
    updateDisplay(detuneValue);
});

instrument.addEventListener('mousemove', (e) => {
    if (isPlaying) {
        const rect = e.target.getBoundingClientRect();
        const detuneValue = calculateDetune(e.clientY - rect.top, rect.height);
        updatePitchSmooth(detuneValue); // ドラッグ時は補間処理
        updateDisplay(detuneValue);
    }
});

instrument.addEventListener('mouseup', stopAudio);

// タッチイベント
instrument.addEventListener('touchstart', async (e) => {
    await startAudio();
    const rect = e.target.getBoundingClientRect();
    const detuneValue = calculateDetune(e.touches[0].clientY - rect.top, rect.height);
    setPitchImmediately(detuneValue); // タッチ時は即時設定
    updateDisplay(detuneValue);
});

instrument.addEventListener('touchmove', (e) => {
    if (isPlaying) {
        const rect = e.target.getBoundingClientRect();
        const detuneValue = calculateDetune(e.touches[0].clientY - rect.top, rect.height);
        updatePitchSmooth(detuneValue); // 移動時は補間処理
        updateDisplay(detuneValue);
    }
});

instrument.addEventListener('touchend', stopAudio);
