// Initialize configuration
const config = window.VALENTINE_CONFIG;

// ============================
// Validate configuration
// ============================
function validateConfig() {
    const warnings = [];

    if (!config.valentineName) {
        warnings.push("Valentine's name not set. Using default.");
        config.valentineName = "My Love";
    }

    const isValidHex = (hex) =>
        /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);

    if (config.colors) {
        Object.entries(config.colors).forEach(([key, value]) => {
            if (!isValidHex(value)) {
                warnings.push(`Invalid color for ${key}`);
            }
        });
    }

    if (warnings.length > 0) {
        console.warn("⚠️ Config warnings:");
        warnings.forEach(w => console.warn(w));
    }
}

// ============================
// Helpers
// ============================
function $(id) {
    return document.getElementById(id);
}

// ============================
// Page setup
// ============================
document.title = config.pageTitle || "Valentine 💝";

window.addEventListener("DOMContentLoaded", () => {
    validateConfig();

    // 💜 OPTION B — Title only name + heart
    const titleEl = $("valentineTitle");
    if (titleEl) titleEl.textContent = `${config.valentineName} 💜`;

    // Question 1
    $("question1Text").textContent = config.questions.first.text;
    $("yesBtn1").textContent = config.questions.first.yesBtn;
    $("noBtn1").textContent = config.questions.first.noBtn;
    $("secretAnswerBtn").textContent = config.questions.first.secretAnswer;

    // Question 2 (final)
    $("question2Text").textContent = config.questions.second.text;
    $("yesBtn2").textContent = config.questions.second.yesBtn;
    $("noBtn2").textContent = config.questions.second.noBtn;

    createFloatingElements();
    setupMusicPlayer();

    showNextQuestion(1);
});

// ============================
// Floating emojis
// ============================
function createFloatingElements() {
    const container = document.querySelector(".floating-elements");
    if (!container) return;

    container.innerHTML = "";

    const hearts = config.floatingEmojis?.hearts || ["💜"];
    const bears = config.floatingEmojis?.bears || [];

    [...hearts, ...bears].forEach((emoji) => {
        const div = document.createElement("div");
        div.className = "heart";
        div.innerHTML = emoji;
        setRandomPosition(div);
        container.appendChild(div);
    });
}

function setRandomPosition(el) {
    el.style.left = Math.random() * 100 + "vw";
    el.style.animationDelay = Math.random() * 5 + "s";
    el.style.animationDuration = 10 + Math.random() * 20 + "s";
}

// ============================
// Question flow
// ============================
function showNextQuestion(num) {
    document
        .querySelectorAll(".question-section")
        .forEach((q) => q.classList.add("hidden"));

    const next = document.getElementById(`question${num}`);
    if (next) next.classList.remove("hidden");
}

function moveButton(btn) {
    const x = Math.random() * (window.innerWidth - btn.offsetWidth);
    const y = Math.random() * (window.innerHeight - btn.offsetHeight);

    btn.style.position = "fixed";
    btn.style.left = x + "px";
    btn.style.top = y + "px";
}

// ============================
// Celebration
// ============================
function celebrate() {
    document
        .querySelectorAll(".question-section")
        .forEach((q) => q.classList.add("hidden"));

    const celebration = $("celebration");
    celebration.classList.remove("hidden");

    $("celebrationTitle").textContent = config.celebration.title;
    $("celebrationMessage").textContent = config.celebration.message;
    $("celebrationEmojis").textContent = config.celebration.emojis;

    createHeartExplosion();
}

function createHeartExplosion() {
    const container = document.querySelector(".floating-elements");
    if (!container) return;

    const hearts = config.floatingEmojis?.hearts || ["💜"];

    for (let i = 0; i < 40; i++) {
        const heart = document.createElement("div");
        heart.className = "heart";
        heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
        setRandomPosition(heart);
        container.appendChild(heart);
    }
}

// ============================
// Music player
// ============================
function setupMusicPlayer() {
    const controls = $("musicControls");
    const toggle = $("musicToggle");
    const music = $("bgMusic");
    const source = $("musicSource");

    if (!controls || !toggle || !music || !source) return;

    if (!config.music?.enabled) {
        controls.style.display = "none";
        return;
    }

    source.src = config.music.musicUrl;
    music.volume = config.music.volume ?? 0.25;
    music.load();

    toggle.textContent = config.music.startText || "🎵 Play Music";

    toggle.addEventListener("click", () => {
        if (music.paused) {
            music.play();
            toggle.textContent = config.music.stopText || "🔇 Pause Music";
        } else {
            music.pause();
            toggle.textContent = config.music.startText || "🎵 Play Music";
        }
    });
}
