// Mobile Audio Unlock System
let audioUnlocked = false;

function unlockAudio() {
    if (audioUnlocked) return;
    
    // Create temporary audio context
    const sounds = [
        document.getElementById('flap-sound'),
        document.getElementById('score-sound'),
        document.getElementById('hit-sound'),
        document.getElementById('bg-music')
    ];
    
    // Play/pause all sounds to unlock them
    sounds.forEach(sound => {
        sound.volume = 0.3;
        sound.play().then(() => {
            sound.pause();
            sound.currentTime = 0;
        }).catch(e => console.log("Audio init:", e));
    });
    
    audioUnlocked = true;
    console.log("Audio unlocked!");
}

document.addEventListener('DOMContentLoaded', () => {
    // Unlock audio on any touch/click
    document.addEventListener('click', unlockAudio, { once: true });
    document.addEventListener('touchstart', unlockAudio, { once: true });

    // Game variables
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 600;
    
    // [Keep ALL your original game code below this line]
    // Only replace the audio-related functions:
    
    function playSound(id) {
        if (!audioUnlocked) return;
        const sound = document.getElementById(id);
        sound.currentTime = 0;
        sound.play().catch(e => console.log(id, "error:", e));
    }

    function jump() {
        if (!isGameRunning) return;
        bat.velocity = JUMP_FORCE;
        playSound('flap-sound');
    }

    function startGame() {
        if (audioUnlocked) {
            document.getElementById('bg-music').play()
                .catch(e => console.log("Music error:", e));
        }
        // ... rest of your original startGame() code
    }

    // [Keep all other original game functions]
});
