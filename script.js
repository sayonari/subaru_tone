const instrument = document.getElementById('instrument');
const frequencyDisplay = document.getElementById('frequency');
const noteDisplay = document.getElementById('note');

// 音階の定義（C4を基準に2オクターブ）
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const BASE_FREQUENCY = 261.63; // C4 (ド)

let audioCtx = null;
let sourceNode = null;
let gainNode = null;
let buffer = null;
let isPlaying = false;

// セントから周波数を計算する関数
function centToFrequency(cents) {
    return BASE_FREQUENCY * Math.pow(2, cents / 1200);
}

// 周波数から音階名を取得する関数
function getNoteName(frequency) {
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

// 再生開始とピッチ変更
async function playAudio(detuneValue) {
    if (!audioCtx) await initAudio();
    
    // 前の音を停止
    if (sourceNode) {
        sourceNode.stop();
        sourceNode.disconnect();
    }
    if (gainNode) {
        gainNode.disconnect();
    }

    sourceNode = audioCtx.createBufferSource();
    gainNode = audioCtx.createGain();

    sourceNode.buffer = buffer;
    sourceNode.loop = true;
    sourceNode.detune.value = detuneValue;
    sourceNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    sourceNode.start();
    isPlaying = true;
}

function stopAudio() {
    if (!isPlaying) return;
    if (sourceNode) {
        sourceNode.stop();
        sourceNode.disconnect();
    }
    if (gainNode) {
        gainNode.disconnect();
    }
    isPlaying = false;
}

// ピッチ計算
function calculateDetune(y, height) {
    const normalizedY = 1 - Math.max(0, Math.min(1, y / height));
    const semitoneRange = 24; // 2オクターブ（上12, 下12）
    const cents = (normalizedY * semitoneRange - semitoneRange / 2) * 100;
    return cents;
}

// マウスイベント
instrument.addEventListener('mousedown', async (e) => {
    try {
        const rect = e.target.getBoundingClientRect();
        const detuneValue = calculateDetune(e.clientY - rect.top, rect.height);
        await playAudio(detuneValue);
        updateDisplay(detuneValue);
    } catch (error) {
        console.error('Error in mousedown:', error);
    }
});

instrument.addEventListener('mousemove', async (e) => {
    if (isPlaying) {
        const rect = e.target.getBoundingClientRect();
        const detuneValue = calculateDetune(e.clientY - rect.top, rect.height);
        await playAudio(detuneValue);
        updateDisplay(detuneValue);
    }
});

instrument.addEventListener('mouseup', stopAudio);

// タッチイベント
instrument.addEventListener('touchstart', async (e) => {
    try {
        const rect = e.target.getBoundingClientRect();
        const detuneValue = calculateDetune(e.touches[0].clientY - rect.top, rect.height);
        await playAudio(detuneValue);
        updateDisplay(detuneValue);
    } catch (error) {
        console.error('Error in touchstart:', error);
    }
});

instrument.addEventListener('touchmove', async (e) => {
    if (isPlaying) {
        const rect = e.target.getBoundingClientRect();
        const detuneValue = calculateDetune(e.touches[0].clientY - rect.top, rect.height);
        await playAudio(detuneValue);
        updateDisplay(detuneValue);
    }
});

instrument.addEventListener('touchend', stopAudio);

// 表示更新
function updateDisplay(detuneValue) {
    const frequency = centToFrequency(detuneValue);
    frequencyDisplay.textContent = `${Math.round(frequency)} Hz`;
    noteDisplay.textContent = getNoteName(frequency);
    
    console.log(`Cents: ${detuneValue.toFixed(1)}, Frequency: ${frequency.toFixed(1)}Hz`);
}
