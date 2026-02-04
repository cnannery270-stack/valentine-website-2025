// Initialize configuration
const config = window.VALENTINE_CONFIG;

// Validate configuration
function validateConfig() {
    const warnings = [];

    if (!config.valentineName) {
        warnings.push("Valentine's name is not set! Using default.");
        config.valentineName = "My Love";
    }

    // Validate colors (if present)
    const isValidHex = (hex) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    if (config.colors) {
        Object.entries(config.colors).forEach(([key, value]) => {
            if (!isValidHex(value)) {
                warnings.push(`Invalid color for ${key}! Using default.`);
                config.colors[key] = getDefaultColor(key);
            }
        });
    }

    // Validate animation values (if present)
    if (config.animations?.floatDuration && parseFloat(config.animations.floatDuration) < 5) {
        warnings.push("Float duration too short! Setting to 5s minimum.");
        config.animations.floatDuration = "5s";
    }

    if (config.animations?.heartExplosionSize && (config.animations.heartExplosionSize < 1 || config.animations.heartExplosionSize > 3)) {
        warnings.push("Heart explosion size should be between 1 and 3! Using default.");
        config.animations.heartExplosionSize = 1.5;
    }

    if (warnings.length > 0) {
        console.warn("⚠️ Configuration Warnings:");
        warnings.forEach(warning => console.warn("- " + warning));
    }
}

// Default color values
function getDefaultColor(key) {
    const defaults = {
        backgroundStart: "#ffafbd",
        backgroundEnd: "#ffc3a0",
        buttonBackground: "#ff6b6b",
        buttonHover: "#ff8787",
        textColor: "#ff4757"
    };
    return defaults[key];
}

// Set page title
document.title = config.pageTitle || "Valentine 💝";

// Helper: safe get element
function $(id) {
    return document.getElementById(id);
}

// Initialize the page content when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    validateConfig();

    // Title
    const titleEl = $('valentineTitle');
    if (titleEl) titleEl.textContent = `${config.valentineName}, my love...`;

    // Question 1 texts
    $('question1Text').textContent = config.questions.first.text;
    $('yesBtn1').textContent = config.questions.first.yesBtn;
    $('noBtn1').textContent = config.questions.first.noBtn;
    $('secretAnswerBtn').textContent = config.questions.first.secretAnswer;

    // Question 2 (final) texts
    // IMPORTANT: your HTML must have yesBtn2/noBtn2 for this
    $('question2Text').textContent = config.questions.second.text;
    $('yesBtn2').textContent = config.questions.second.yesBtn;
    $('noBtn2').textContent = config.questions.second.noBtn;

    // Floating emojis
    createFloatingElements();

    // Music
    setupMusicPlayer();

    // Start on question 1
    showNextQuestion(1);
});

// Create floating hearts and bears
function createFloatingElements() {
    const container = document.querySelector('.floating-elements');
    if (!container) return;

    // Clear existing
    container.innerHTML = "";

    // Hearts
    (config.floatingEmojis?.hearts || ['💖']).forEach(heart => {
        const div = document.createElement('div');
        div.className = 'heart';
        div.innerHTML = heart;
        setRandomPosition(div);
        container.appendChild(div);
    });

    // Bears
    (config.floatingEmojis?.bears || ['🧸']).forEach(bear => {
        const div = document.createElement('div');
        div.className = 'bear';
        div.innerHTML = bear;
        setRandomPosition(div);
        container.appendChild(div);
    });
}

// Set random position for floating elements
function setRandomPosition(element) {
    element.style.left = Math.random() * 100 + 'vw';
    element.style.animationDelay = Math.random() * 5 + 's';
    element.style.animationDuration = 10 + Math.random() * 20 + 's';
}

// Show question 1 or 2
function showNextQuestion(questionNumber) {
    document.querySelectorAll('.question-section').forEach(q => q.classList.add('hidden'));
    const next = document.getElementById(`question${questionNumber}`);
    if (next) next.classList.remove('hidden');
}

// Move the "No" button
function moveButton(button) {
    const x = Math.random() * (window.innerWidth - button.offsetWidth);
    const y = Math.random() * (window.innerHeight - button.offsetHeight);
    button.style.position = 'fixed';
    button.style.left = x + 'px';
    button.style.top = y + 'px';
}

// Celebration
function celebrate() {
    document.querySelectorAll('.question-section').forEach(q => q.classList.add('hidden'));
    const celebration = document.getElementById('celebration');
    celebration.classList.remove('hidden');

    document.getElementById('celebrationTitle').textContent = config.celebration.title;
    document.getElementById('celebrationMessage').textContent = config.celebration.message;
    document.getElementById('celebrationEmojis').textContent = config.celebration.emojis;

    createHeartExplosion();
}

function createHeartExplosion() {
    const container = document.querySelector('.floating-elements');
    if (!container) return;

    for (let i = 0; i < 40; i++) {
        const heart = document.createElement('div');
        const hearts = config.floatingEmojis?.hearts || ['💖'];
        heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
        heart.className = 'heart';
        container.appendChild(heart);
        setRandomPosition(heart);
    }
}

// Music Player Setup
function setupMusicPlayer() {
    const musicControls = document.getElementById('musicControls');
    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    const musicSource = document.getElementById('musicSource');

    if (!musicControls || !musicToggle || !bgMusic || !musicSource) return;

    if (!config.music?.enabled) {
        musicControls.style.display = 'none';
        return;
    }

    musicSource.src = config.music.musicUrl;
    bgMusic.volume = typeof config.music.volume === "number" ? config.music.volume : 0.5;
    bgMusic.load();

    // Button text default
    musicToggle.textContent = config.music.startText || "🎵 Play Music";

    if (config.music.autoplay) {
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                musicToggle.textContent = config.music.stopText || "🔇 Pause Music";
            }).catch(() => {
                console.log("Autoplay prevented by browser");
                musicToggle.textContent = config.music.startText || "🎵 Play Music";
            });
        }
    }

    musicToggle.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            musicToggle.textContent = config.music.stopText || "🔇 Pause Music";
        } else {
            bgMusic.pause();
            musicToggle.textContent = config.music.startText || "🎵 Play Music";
        }
    });
}
