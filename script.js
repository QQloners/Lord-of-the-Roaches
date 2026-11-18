// 全局遊戲狀態：紀錄是否滿足秘密結局條件
let secretEndingCondition1 = false;
let lastMajorChapter = null;

/* =================================
   0. 背景飄浮微塵粒子初始化
================================= */
function initAmbientDust() {
    const dustLayer = document.getElementById("dust-layer");
    if (!dustLayer) return;

    dustLayer.innerHTML = "";
    const moteCount = 18;

    for (let i = 0; i < moteCount; i++) {
        const mote = document.createElement("span");
        mote.className = "dust-mote";
        mote.style.left = `${Math.random() * 100}%`;
        mote.style.top = `${25 + Math.random() * 75}%`;
        mote.style.setProperty("--drift-x", `${(Math.random() * 44 - 22).toFixed(1)}px`);
        mote.style.animationDuration = `${(9 + Math.random() * 10).toFixed(1)}s`;
        mote.style.animationDelay = `${(-Math.random() * 14).toFixed(1)}s`;
        dustLayer.appendChild(mote);
    }
}

function getActiveStory() {
    if (currentLanguage === "en" && typeof STORY_DATA_EN !== "undefined") {
        return STORY_DATA_EN;
    }
    return STORY_DATA;
}



/* =================================
   2. 全局狀態與控制變數
================================= */
let currentCardId = "start";
let isAnimating = false;
let isDragging = false;
let awakeStage = 0;
let startSequenceComplete = false;
let startX = 0, startY = 0;
let currentX = 0, currentY = 0;
const SWIPE_THRESHOLD = 120;
let animationTimer = null;
let typingTimer = null;
let currentDialogueIndex = 0;
let currentDialogueFlow = null;

// 對話角色特寫圖預設對照（中英並存）
const DIALOGUE_SPEAKER_IMAGES = {
    "你": "images/4.png",
    "蟑螂 A": "images/6.png",
    "蟑螂 B": "images/5.png",
    "蟑螂 C": "images/7.png",
    "You": "images/4.png",
    "Roach A": "images/6.png",
    "Roach B": "images/5.png",
    "Roach C": "images/7.png"
};

// 各角色說話音效基礎音高（Hz）
const SPEAKER_VOICE_PITCH = {
    "你": 135,
    "蟑螂 A": 195,
    "蟑螂 B": 165,
    "蟑螂 C": 240,
    "You": 135,
    "Roach A": 195,
    "Roach B": 165,
    "Roach C": 240
};

// 預先載入角色圖片並自動偵測是否為左右並排圖
const DIALOGUE_IMAGE_CACHE = {};
function cacheDialogueImage(imagePath) {
    if (!imagePath || DIALOGUE_IMAGE_CACHE[imagePath]) return DIALOGUE_IMAGE_CACHE[imagePath];
    const img = new Image();
    img.src = imagePath;
    DIALOGUE_IMAGE_CACHE[imagePath] = img;
    return img;
}

function preloadDialogueSpeakerImages(flow) {
    Object.values(DIALOGUE_SPEAKER_IMAGES).forEach(cacheDialogueImage);
    if (!flow) return;

    const collectSteps = (steps) => {
        if (!Array.isArray(steps)) return;
        steps.forEach((step) => {
            if (step && step.image) cacheDialogueImage(step.image);
        });
    };

    collectSteps(flow.intro);
    collectSteps(flow.finalSteps);
    if (Array.isArray(flow.topics)) {
        flow.topics.forEach((t) => {
            if (t.left) collectSteps(t.left.steps);
            if (t.right) collectSteps(t.right.steps);
        });
    }
    if (flow.finalDecision) {
        if (flow.finalDecision.left) collectSteps(flow.finalDecision.left.steps);
        if (flow.finalDecision.right) collectSteps(flow.finalDecision.right.steps);
    }
}

// 文字分段控制
let currentTextSegments = [];
let currentTextSegmentIndex = 0;

const viewport = document.getElementById("game-viewport");
const chapterName = document.getElementById("chapter-name");
const gameOver = document.getElementById("game-over");

/* =================================
   2-1. Web Audio API 復古說話音效
================================= */
let audioCtx = null;

const SPEAKER_VOICE_PROFILES = {
    // --- 中文稱謂 ---
    "你": { freq: 310, endFreq: 300, type: "triangle", duration: 0.045, gain: 0.09 },
    "你（小聲碎念）": { freq: 265, endFreq: 255, type: "triangle", duration: 0.04, gain: 0.06 },
    "蟑螂 A": { freq: 460, endFreq: 480, type: "square", duration: 0.035, gain: 0.055 },
    "蟑螂 B": { freq: 520, endFreq: 545, type: "square", duration: 0.035, gain: 0.055 },
    "蟑螂 C": { freq: 590, endFreq: 620, type: "square", duration: 0.035, gain: 0.055 },
    "大哥": { freq: 460, endFreq: 480, type: "square", duration: 0.035, gain: 0.055 },
    "老二": { freq: 520, endFreq: 545, type: "square", duration: 0.035, gain: 0.055 },
    "三弟": { freq: 590, endFreq: 620, type: "square", duration: 0.035, gain: 0.055 },
    "三隻蟑螂": {
        voices: [
            { freq: 460, endFreq: 490, type: "square", duration: 0.038, gain: 0.032, delay: 0 },
            { freq: 520, endFreq: 555, type: "square", duration: 0.038, gain: 0.032, delay: 0.006 },
            { freq: 590, endFreq: 630, type: "square", duration: 0.038, gain: 0.032, delay: 0.012 }
        ]
    },
    "獨角大仙": { freq: 145, endFreq: 134, type: "triangle", duration: 0.04, gain: 0.16 },

    // --- 英文稱謂 ---
    "You": { freq: 310, endFreq: 300, type: "triangle", duration: 0.045, gain: 0.09 },
    "You (Muttering)": { freq: 265, endFreq: 255, type: "triangle", duration: 0.04, gain: 0.06 },
    "Roach A": { freq: 460, endFreq: 480, type: "square", duration: 0.035, gain: 0.055 },
    "Roach B": { freq: 520, endFreq: 545, type: "square", duration: 0.035, gain: 0.055 },
    "Roach C": { freq: 590, endFreq: 620, type: "square", duration: 0.035, gain: 0.055 },
    "Eldest": { freq: 460, endFreq: 480, type: "square", duration: 0.035, gain: 0.055 },
    "Second Brother": { freq: 520, endFreq: 545, type: "square", duration: 0.035, gain: 0.055 },
    "Youngest": { freq: 590, endFreq: 620, type: "square", duration: 0.035, gain: 0.055 },
    "Three Roaches": {
        voices: [
            { freq: 460, endFreq: 490, type: "square", duration: 0.038, gain: 0.032, delay: 0 },
            { freq: 520, endFreq: 555, type: "square", duration: 0.038, gain: 0.032, delay: 0.006 },
            { freq: 590, endFreq: 630, type: "square", duration: 0.038, gain: 0.032, delay: 0.012 }
        ]
    },
    "Master Rhinoceros": { freq: 145, endFreq: 134, type: "triangle", duration: 0.04, gain: 0.16 }
};

function playSpeakerBlip(speaker) {
    if (!speaker || speaker === "旁白") return;

    const profile = SPEAKER_VOICE_PROFILES[speaker];
    if (!profile) return;

    try {
        if (!audioCtx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioCtx();
        }
        if (audioCtx.state === "suspended") audioCtx.resume();

        const now = audioCtx.currentTime;
        const voiceList = profile.voices || [profile];

        voiceList.forEach(v => {
            const startTime = now + (v.delay || 0);
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            osc.type = v.type;
            osc.frequency.setValueAtTime(v.freq, startTime);
            osc.frequency.exponentialRampToValueAtTime(v.endFreq, startTime + v.duration);

            gainNode.gain.setValueAtTime(0.001, startTime);
            gainNode.gain.linearRampToValueAtTime(v.gain, startTime + 0.005);
            gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + v.duration);

            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            osc.start(startTime);
            osc.stop(startTime + v.duration + 0.005);
        });
    } catch (e) {}
}
/* =================================
   2-1B. Web Audio 紙質卡片擬音（厚紙卡「刷—塔」悶實手感）
================================= */
function playCardSound(type = "pick") {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === "suspended") {
            audioCtx.resume();
        }

        const now = audioCtx.currentTime;
        const jitter = 0.93 + Math.random() * 0.14;

        const triggerPaperNoise = ({
            delay = 0,
            duration = 0.04,
            hpFreq = 300,
            lpStart = 900,
            lpEnd = 500,
            peakGain = 0.15,
            attack = 0.005,
            smoothness = 0.25
        }) => {
            const startTime = now + delay;
            const bufferSize = Math.max(1, Math.floor(audioCtx.sampleRate * duration));
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);

            let prev = 0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                prev = prev + smoothness * (white - prev);
                data[i] = prev * 1.8;
            }

            const src = audioCtx.createBufferSource();
            src.buffer = buffer;

            const hp = audioCtx.createBiquadFilter();
            hp.type = "highpass";
            hp.frequency.setValueAtTime(hpFreq * jitter, startTime);
            hp.Q.setValueAtTime(0.5, startTime);

            const lp = audioCtx.createBiquadFilter();
            lp.type = "lowpass";
            lp.Q.setValueAtTime(0.5, startTime);
            lp.frequency.setValueAtTime(lpStart * jitter, startTime);
            lp.frequency.exponentialRampToValueAtTime(Math.max(70, lpEnd * jitter), startTime + duration);

            const gain = audioCtx.createGain();
            gain.gain.setValueAtTime(0.0001, startTime);
            gain.gain.linearRampToValueAtTime(peakGain, startTime + Math.min(attack, duration * 0.45));
            gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

            src.connect(hp);
            hp.connect(lp);
            lp.connect(gain);
            gain.connect(audioCtx.destination);

            src.start(startTime);
            src.stop(startTime + duration);
        };

        if (type === "pick") {
            // 【拿起卡片】厚紙卡離桌的微悶摩擦
            triggerPaperNoise({
                delay: 0,
                duration: 0.036,
                hpFreq: 220,
                lpStart: 880,
                lpEnd: 520,
                peakGain: 0.16,
                attack: 0.005,
                smoothness: 0.26
            });
            triggerPaperNoise({
                delay: 0.008,
                duration: 0.02,
                hpFreq: 550,
                lpStart: 1350,
                lpEnd: 820,
                peakGain: 0.075,
                attack: 0.004,
                smoothness: 0.35
            });
        } else if (type === "swipe") {
            // 【滑開卡片：雙音節「刷—塔」】
            // 第一拍「刷」：霧面紙身滑過卡堆的低頻摩擦
            triggerPaperNoise({
                delay: 0,
                duration: 0.078,
                hpFreq: 380,
                lpStart: 1220,
                lpEnd: 740,
                peakGain: 0.16,
                attack: 0.014,
                smoothness: 0.34
            });

            // 第二拍「塔」前緣：削掉高頻的厚紙板碰撞頭音（260Hz~820Hz，帶有微黏的緩衝起音）
            triggerPaperNoise({
                delay: 0.072,
                duration: 0.026,
                hpFreq: 260,
                lpStart: 820,
                lpEnd: 380,
                peakGain: 0.25,
                attack: 0.004,
                smoothness: 0.24
            });

            // 第二拍「塔」尾韻：厚紙貼合時的沉悶氣墊重量感
            triggerPaperNoise({
                delay: 0.075,
                duration: 0.052,
                hpFreq: 70,
                lpStart: 300,
                lpEnd: 120,
                peakGain: 0.32,
                attack: 0.006,
                smoothness: 0.15
            });
        } else {
            // 【放回卡堆】厚紙貼回桌面的沉悶拍擊
            triggerPaperNoise({
                delay: 0,
                duration: 0.048,
                hpFreq: 70,
                lpStart: 280,
                lpEnd: 130,
                peakGain: 0.26,
                attack: 0.004,
                smoothness: 0.18
            });
            triggerPaperNoise({
                delay: 0.01,
                duration: 0.028,
                hpFreq: 420,
                lpStart: 980,
                lpEnd: 560,
                peakGain: 0.07,
                attack: 0.005,
                smoothness: 0.3
            });
        }
    } catch (e) {}
}

/* =================================
   2-2. 對話框像素按壓凹陷回饋（1-2px）
================================= */
function bindDialogPressFeedback(card) {
    const contentBox = card.querySelector(".card-content");
    if (!contentBox) return;

    const pressDown = () => {
        if (isDragging) return;
        contentBox.classList.add("is-pressed");
    };
    const releasePress = () => {
        contentBox.classList.remove("is-pressed");
    };

    card.addEventListener("pointerdown", pressDown);
    card.addEventListener("pointerup", releasePress);
    card.addEventListener("pointerleave", releasePress);
    card.addEventListener("pointercancel", releasePress);
}
/* =================================
   2-3. 自動存檔與讀檔系統（localStorage）
================================= */
const SAVE_STORAGE_KEY = "roach_save_data";

function saveGameProgress() {
    const story = getActiveStory();
    const data = story ? story[currentCardId] : null;
    if (!data || data.ending) return;

    const payload = {
        cardId: currentCardId,
        secretEndingCondition1: Boolean(secretEndingCondition1),
        chapter: data.chapter || "",
        savedAt: Date.now()
    };

    try {
        localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {}
}

function loadGameProgress() {
    try {
        const raw = localStorage.getItem(SAVE_STORAGE_KEY);
        if (!raw) return null;

        const saved = JSON.parse(raw);
        const story = getActiveStory();
        if (!saved || !saved.cardId || !story || !story[saved.cardId]) {
            return null;
        }
        // 若存檔指向結局卡則視為已通關，不提供接續
        if (story[saved.cardId].ending) {
            return null;
        }
        return saved;
    } catch (e) {
        return null;
    }
}

function clearGameProgress() {
    try {
        localStorage.removeItem(SAVE_STORAGE_KEY);
    } catch (e) {}
}

/* =================================
   3. 核心卡片渲染 renderCard()
================================= */
function getMajorChapter(chapterText) {
    const raw = String(chapterText || "").trim();
    if (!raw) return "";
    // 擷取「・」、「·」、「:」、「：」或「-」之前的大章節名稱（如「第一章」、「第二章」、「Chapter 2」）
    return raw.split(/[・·:：\-]/)[0].trim();
}

function shouldTriggerChapterShuffle(data) {
    if (!data || data.ending) return false;

    // 1. 若卡片明確標記為新章節（例如與三隻蟑螂道別後的卡片設定 newChapter: true）
    if (data.newChapter || data.shuffleOnEnter) {
        const major = getMajorChapter(data.chapter);
        if (major) lastMajorChapter = major;
        return true;
    }

    // 2. 自動比對大章節名稱是否切換（例如 null -> 第一章 -> 第二章 -> 第三章）
    const currentMajor = getMajorChapter(data.chapter);
    if (currentMajor && currentMajor !== lastMajorChapter) {
        lastMajorChapter = currentMajor;
        return true;
    }

    return false;
}

function renderChapterShuffleTransition(data) {
    gameOver.hidden = true;
    isAnimating = true;
    isDragging = false;
    awakeStage = 0;
    startSequenceComplete = false;
    currentDialogueFlow = null;

    viewport.innerHTML = "";

    const wrapper = document.createElement("div");
    wrapper.className = "title-deck-wrapper";

    const deckCard = document.createElement("div");
    deckCard.className = "story-card title-main-card";
    deckCard.innerHTML = getCardBackHTML();

    wrapper.appendChild(deckCard);
    viewport.appendChild(wrapper);

    // 執行連續三張實體刷牌動畫，結束後翻開新章節第一張卡片
    playDeckShuffleSequence(wrapper, deckCard, () => {
        if (typeof playCardSound === "function") playCardSound("return");
        deckCard.classList.add("is-flip-to-edge");

        setTimeout(() => {
            renderCard({ skipChapterShuffle: true, revealFromEdge: true });
        }, 310);
    });
}

function renderCard(options = {}) {
    const data = getActiveStory()[currentCardId];
    if (!data) return;

    if (!data.dialogueFlow) currentDialogueFlow = null;

    if (typingTimer) {
        clearInterval(typingTimer);
        typingTimer = null;
    }

    isAnimating = false;
    isDragging = false;

    viewport.innerHTML = "";
    chapterName.textContent = data.chapter || "";

    if (data.ending) {
        clearGameProgress();
        renderEndingFlow(data);
        return;
    }

    // 進入新的大章節時，先執行實體洗牌過場再翻開卡片
    if (!options.skipChapterShuffle && shouldTriggerChapterShuffle(data)) {
        renderChapterShuffleTransition(data);
        return;
    }

    if (data.onEnter) data.onEnter();
    saveGameProgress();

    gameOver.hidden = true;
    awakeStage = 0;
    startSequenceComplete = false;

    const finalizeCardReveal = () => {
        if (!options.revealFromEdge) return;
        const revealedCard = viewport.querySelector(".story-card");
        if (!revealedCard) return;

        isAnimating = true;
        revealedCard.classList.add("is-flip-from-edge");
        setTimeout(() => {
            revealedCard.classList.remove("is-flip-from-edge");
            isAnimating = false;
        }, 340);
    };

    if (currentCardId === "start") {
        renderStartCard(data);
        finalizeCardReveal();
        return;
    }

    currentTextSegments = [];
    currentTextSegmentIndex = 0;

    if (data.dialogueFlow) {
        renderDialogueFlow(data);
        finalizeCardReveal();
        return;
    }

    const card = document.createElement("div");
    card.className = "story-card waiting-click";

    card.innerHTML = `
        <div class="card-image full-screen blurred">
            <div class="dialogue-portrait"></div>
            <span>[ 像素圖片區域 ]</span>
        </div>
        <div class="wake-hint">${getText("wakeHint")}</div>
        <div class="card-content">
            <h2></h2>
            <p></p>
        </div>
        <div class="swipe-hint hint-left"></div>
        <div class="swipe-hint hint-right"></div>
    `;

    const imageArea = card.querySelector(".card-image");
    const portraitEl = imageArea.querySelector(".dialogue-portrait");
    const spanArea = imageArea.querySelector("span");

    if (data.image && data.image.trim() !== "") {
        portraitEl.style.display = "block";
        portraitEl.style.backgroundImage = `url("${data.image}")`;
        portraitEl.classList.add("is-idle");
        if (spanArea) spanArea.style.display = "none";
    } else {
        portraitEl.style.display = "none";
        portraitEl.style.backgroundImage = "none";
        if (spanArea) {
            spanArea.style.display = "block";
            spanArea.textContent = `[ 圖片預留區：${data.title} ]`;
        }
    }

    const leftHint = card.querySelector(".hint-left");
    const rightHint = card.querySelector(".hint-right");

    leftHint.textContent = data.left ? "← " + data.left.label : "";
    rightHint.textContent = data.right ? data.right.label + " →" : "";

    viewport.appendChild(card);
    bindDialogPressFeedback(card);

    card.addEventListener("click", function handleCardClick() {
        if (isDragging) return;

        if (isAnimating && typingTimer) {
            clearInterval(typingTimer);
            typingTimer = null;

            card.querySelector("h2").textContent = data.title || "";
            renderFormattedText(card.querySelector("p"), currentTextSegments[currentTextSegmentIndex] || "");

            card.querySelector("h2").classList.remove("typing-cursor");
            card.querySelector("p").classList.remove("typing-cursor");
            stopStoryPortraitTalk(card);

            isAnimating = false;
            awakeStage = 2;
            return;
        }

        if (awakeStage === 0) {
            awakeStage = 1;

            imageArea.classList.remove("blackout", "blurred");
            imageArea.classList.add("clear");

            const wakeHint = card.querySelector(".wake-hint");
            if (wakeHint) {
                wakeHint.classList.add("fade-out");
                setTimeout(() => {
                    wakeHint.style.display = "none";
                }, 800);
            }
            return;
        }

        if (awakeStage === 1 && !isAnimating) {
            card.classList.remove("waiting-click");

            const wakeHint = card.querySelector(".wake-hint");
            if (wakeHint) wakeHint.style.display = "none";

            currentTextSegments = splitTextIntoSegments(data.description || "");
            currentTextSegmentIndex = 0;

            triggerAwakeAnimation(card, data);
            return;
        }

        if (awakeStage === 2 && !isAnimating) {
            if (currentTextSegmentIndex < currentTextSegments.length - 1) {
                currentTextSegmentIndex++;
                isAnimating = true;

                const descEl = card.querySelector("p");
                playStorySegmentWithMotion(
                    card,
                    descEl,
                    currentTextSegments[currentTextSegmentIndex],
                    35,
                    () => {
                        isAnimating = false;
                    }
                );
                return;
            }
        }
    });

    bindCardEvents(card);
    finalizeCardReveal();
}

/* =================================
   3-1. 開場專屬演出（僅限 start）
================================= */
function renderStartCard(data) {
    const lines = splitTextIntoSegments(data.description || "");
    let step = 0;
    let currentLineText = "";

    const card = document.createElement("div");
    card.className = "story-card waiting-click";
    card.innerHTML = `
        <div class="card-image start-stage full-screen blackout">
            <div class="dialogue-portrait"></div>
            <span>[ 像素圖片區域 ]</span>
        </div>
        <div class="wake-hint">（醒來）</div>
        <div class="card-content">
            <h2></h2>
            <p></p>
        </div>
        <div class="swipe-hint hint-left"></div>
        <div class="swipe-hint hint-right"></div>
    `;

    const imageArea = card.querySelector(".card-image");
    const portraitEl = imageArea.querySelector(".dialogue-portrait");
    const spanArea = imageArea.querySelector("span");
    const titleEl = card.querySelector("h2");
    const descEl = card.querySelector("p");

    if (data.image && data.image.trim() !== "") {
        portraitEl.style.backgroundImage = `url("${data.image}")`;
        if (spanArea) spanArea.style.display = "none";
    }

    card.querySelector(".hint-left").textContent = data.left ? "← " + data.left.label : "";
    card.querySelector(".hint-right").textContent = data.right ? data.right.label + " →" : "";

    viewport.appendChild(card);
    bindDialogPressFeedback(card);

    function triggerViolentShake() {
        card.classList.remove("start-violent-shake");
        void card.offsetWidth;
        card.classList.add("start-violent-shake");
        setTimeout(() => {
            card.classList.remove("start-violent-shake");
        }, 420);
    }

    function playStartLine(lineIndex, talkVoice = null, isFinalLine = false) {
        isAnimating = true;
        currentLineText = lines[lineIndex] || "";

        if (talkVoice) {
            portraitEl.classList.add("is-talking");
        }

        typeText(
            descEl,
            currentLineText,
            38,
            () => {
                portraitEl.classList.remove("is-talking");
                isAnimating = false;
                if (isFinalLine) {
                    startSequenceComplete = true;
                    awakeStage = 2;
                }
            },
            (ch, idx) => {
                if (!talkVoice) return;
                if (!/[，。！？、…；：「」~\s]/.test(ch) && idx % 2 === 0) {
                    playSpeakerBlip(talkVoice);
                }
            }
        );
    }

    card.addEventListener("click", () => {
        if (isDragging) return;

        // 打字中點擊 -> 快轉顯示整句並切回待機晃動
        if (isAnimating && typingTimer) {
            clearInterval(typingTimer);
            typingTimer = null;
            titleEl.textContent = data.title || "";
            renderFormattedText(descEl, currentLineText);

            titleEl.classList.remove("typing-cursor");
            descEl.classList.remove("typing-cursor");
            titleEl.classList.remove("typing-cursor");
            descEl.classList.remove("typing-cursor");
            portraitEl.classList.remove("is-talking");
            isAnimating = false;

            if (step >= 3 + (lines.length - 1)) {
                startSequenceComplete = true;
                awakeStage = 2;
            }
            return;
        }

        if (isAnimating) return;

        // 【點擊 1】醒來：中心微露圖片、四周依然黑暗的朦朧狀態
        if (step === 0) {
            step = 1;
            imageArea.classList.remove("blackout");
            imageArea.classList.add("start-hazy");

            const wakeHint = card.querySelector(".wake-hint");
            if (wakeHint) {
                wakeHint.classList.add("fade-out");
                setTimeout(() => { wakeHint.style.display = "none"; }, 800);
            }
            return;
        }

        // 【點擊 2】字幕上升，顯示「某天早晨，你從一場不安的夢中醒來...」
        if (step === 1) {
            step = 2;
            isAnimating = true;
            card.classList.remove("waiting-click");
            imageArea.classList.remove("full-screen");

            setTimeout(() => {
                typeText(titleEl, data.title || "", 50, () => {
                    playStartLine(0, null, false);
                });
            }, 850);
            return;
        }

        // 【點擊 3】卡片劇烈抖動一瞬間 + 字幕收下去 + 黑色遮蔽全部消失
        if (step === 2) {
            step = 3;
            isAnimating = true;
            triggerViolentShake();

            titleEl.textContent = "";
            descEl.textContent = "";
            imageArea.classList.add("full-screen");
            imageArea.classList.remove("start-hazy");
            imageArea.classList.add("clear");

            setTimeout(() => {
                isAnimating = false;
            }, 900);
            return;
        }

        // 【點擊 4】字幕上升 + 開啟與對話完全相同的 is-idle 晃動 + 「這是怎麼回事!?我怎麼會變這樣!?」說話晃動
        if (step === 3) {
            step = 4;
            isAnimating = true;
            imageArea.classList.remove("full-screen");
            portraitEl.classList.add("is-idle");

            setTimeout(() => {
                typeText(titleEl, data.title || "", 45, () => {
                    playStartLine(1, "你", false);
                });
            }, 850);
            return;
        }

        // 【點擊 5 之後】依序播放剩餘台詞
        const nextLineIdx = step - 2;
        if (nextLineIdx < lines.length) {
            step++;
            const isLast = (nextLineIdx === lines.length - 1);

            // 「此時，門外傳來一道聲音...」-> 劇烈抖動一瞬間
            if (nextLineIdx === lines.length - 2) {
                triggerViolentShake();
                playStartLine(nextLineIdx, null, false);
                return;
            }

            // 「「喔依~大家快來吃東西!」」-> 配合字幕出現說話晃動
            if (isLast) {
                playStartLine(nextLineIdx, "蟑螂 A", true);
                return;
            }

            // 中間獨白：維持 is-idle 輕微晃動，不觸發說話晃動
            playStartLine(nextLineIdx, null, false);
        }
    });

    bindCardEvents(card);
}

/* =================================
   4. 字幕上升動畫與打字流程
================================= */
function splitTextIntoSegments(text, maxLength = null) {
    const limit = maxLength || (currentLanguage === "en" ? 160 : 80);
    const paragraphs = String(text)
        .split(/\n+/)
        .map(p => p.trim())
        .filter(p => p.length > 0);

    const segments = [];

    paragraphs.forEach(paragraph => {
        while (paragraph.length > limit) {
            let cutIndex = limit;
            for (let i = limit; i >= Math.floor(limit * 0.6); i--) {
                if ("，。！？；、,.!?;".includes(paragraph[i - 1])) {
                    cutIndex = i;
                    break;
                }
            }
            // 英文若找不到標點，退而求其次找空格斷詞，避免把單字從中間切半
            if (cutIndex === limit && currentLanguage === "en") {
                const lastSpace = paragraph.lastIndexOf(" ", limit);
                if (lastSpace > Math.floor(limit * 0.5)) {
                    cutIndex = lastSpace;
                }
            }
            segments.push(paragraph.slice(0, cutIndex).trim());
            paragraph = paragraph.slice(cutIndex).trim();
        }
        if (paragraph.length > 0) {
            segments.push(paragraph);
        }
    });

    return segments.length > 0 ? segments : [""];
}

function stopStoryPortraitTalk(card) {
    if (!card) return;
    const portraitEl = card.querySelector(".dialogue-portrait");
    if (!portraitEl) return;
    portraitEl.classList.remove("is-talking", "mouth-open");
}

function playStorySegmentWithMotion(card, descEl, segmentText, speed, onComplete) {
    const portraitEl = card ? card.querySelector(".dialogue-portrait") : null;
    const speakerMatch = String(segmentText).match(/^([^：\n]{1,10})：/);
    const rawSpeaker = speakerMatch ? speakerMatch[1].trim() : "";
    const normalizedSpeaker = rawSpeaker.replace(/^蟑螂\s*([A-Z])$/, "蟑螂 $1");
    const prefixLength = speakerMatch ? speakerMatch[0].length : 0;

    if (rawSpeaker && portraitEl) {
        portraitEl.classList.add("is-talking");
    }

    typeText(
        descEl,
        segmentText,
        speed,
        () => {
            stopStoryPortraitTalk(card);
            if (onComplete) onComplete();
        },
        (ch, idx) => {
            if (!rawSpeaker || idx < prefixLength) return;

            const spokenIdx = idx - prefixLength;
            if (/[，。！？、…；：「」~\s]/.test(ch)) {
                if (portraitEl) portraitEl.classList.remove("mouth-open");
            } else if (spokenIdx % 2 === 0) {
                if (portraitEl) portraitEl.classList.toggle("mouth-open");
                if (typeof playSpeakerBlip === "function") {
                    playSpeakerBlip(normalizedSpeaker);
                }
            }
        }
    );
}

function triggerAwakeAnimation(card, data) {
    isAnimating = true;

    const imageArea = card.querySelector(".card-image");
    const titleEl = card.querySelector("h2");
    const descEl = card.querySelector("p");

    imageArea.classList.remove("full-screen");

    setTimeout(() => {
        typeText(titleEl, data.title || "", 50, () => {
            playStorySegmentWithMotion(
                card,
                descEl,
                currentTextSegments[currentTextSegmentIndex] || "",
                35,
                () => {
                    isAnimating = false;
                    awakeStage = 2;
                }
            );
        });
    }, 850);
}

/* 粗體標記（**文字**）解析與渲染工具 */
function parseFormattedTokens(text) {
    const str = String(text || "");
    const tokens = [];
    let isBold = false;
    let i = 0;

    while (i < str.length) {
        if (str[i] === "*" && str[i + 1] === "*") {
            isBold = !isBold;
            i += 2;
            continue;
        }
        tokens.push({ char: str[i], bold: isBold });
        i++;
    }
    return tokens;
}

function escapeHtmlChar(ch) {
    if (ch === "&") return "&amp;";
    if (ch === "<") return "&lt;";
    if (ch === ">") return "&gt;";
    return ch;
}

function tokensToHtml(tokens) {
    let html = "";
    let inBoldTag = false;

    for (let i = 0; i < tokens.length; i++) {
        const { char, bold } = tokens[i];
        if (bold && !inBoldTag) {
            html += '<strong class="dialogue-bold">';
            inBoldTag = true;
        } else if (!bold && inBoldTag) {
            html += "</strong>";
            inBoldTag = false;
        }
        html += escapeHtmlChar(char);
    }

    if (inBoldTag) {
        html += "</strong>";
    }
    return html;
}

function renderFormattedText(element, text) {
    if (!element) return;
    const tokens = parseFormattedTokens(text);
    element.innerHTML = tokensToHtml(tokens);
}

/* 通用打字機函式 */
function typeText(element, text, speed, onComplete, onChar) {
    const tokens = parseFormattedTokens(text);
    let index = 0;
    element.innerHTML = "";
    element.classList.add("typing-cursor");

    typingTimer = setInterval(() => {
        if (index < tokens.length) {
            const currentToken = tokens[index];
            element.innerHTML = tokensToHtml(tokens.slice(0, index + 1));
            if (onChar) onChar(currentToken.char, index);
            index++;
        } else {
            clearInterval(typingTimer);
            typingTimer = null;
            element.classList.remove("typing-cursor");
            if (onComplete) onComplete();
        }
    }, speed);
}


/* =================================
   6. 結局卡片與撕卡流程
================================= */
function renderEndingFlow(data) {
    gameOver.hidden = true;
    isAnimating = true;

    const card = document.createElement("div");
    card.className = "story-card ending-card";

    card.innerHTML = `
        <div class="card-image full-screen">
            <span>[ 結局圖片預留區 ]</span>
        </div>
        <div class="card-content">
            <h2></h2>
            <p></p>
        </div>
        <div class="tear-hint" style="display:none;">${getText("tearHint")}</div>
    `;

    viewport.appendChild(card);

    const imageArea = card.querySelector(".card-image");
    const titleEl = card.querySelector("h2");
    const descEl = card.querySelector("p");
    const tearHint = card.querySelector(".tear-hint");

    if (data.image) {
        imageArea.style.backgroundImage = `url("${data.image}")`;
        const spanArea = imageArea.querySelector("span");
        if (spanArea) spanArea.style.display = "none";
    }

    setTimeout(() => {
        imageArea.classList.remove("full-screen");
        setTimeout(() => {
            typeText(titleEl, data.title || "", 50, () => {
                typeText(descEl, data.description || "", 35, () => {
                    isAnimating = false;
                    tearHint.style.display = "block";
                    bindTearOffEvent(card, data);
                });
            });
        }, 850);
    }, 300);
}

function bindTearOffEvent(card, data) {
    let isTearing = false;

    card.addEventListener("pointerdown", (e) => {
        isTearing = true;
        startY = e.clientY;
        card.setPointerCapture(e.pointerId);
    });

    card.addEventListener("pointermove", (e) => {
        if (!isTearing) return;
        currentY = e.clientY - startY;
        if (currentY > 0) {
            card.style.transform = `translate3d(0, ${currentY * 0.4}px, 0) rotate(${currentY * 0.05}deg)`;
        }
    });

    card.addEventListener("pointerup", () => {
        if (!isTearing) return;
        isTearing = false;

        if (currentY > 80) {
            card.classList.add("tearing");
            setTimeout(() => {
                card.remove();
                showAchievement(data);
            }, 550);
        } else {
            card.style.transform = "none";
        }
    });
}

function showAchievement(data) {
    gameOver.hidden = false;
    document.getElementById("over-title").textContent = data.title;
    const achievementText = data.achievement ? `${data.achievement}\n\n` : "";
    document.getElementById("over-msg").textContent = `${achievementText}${data.description || ""}`;
}

/* =================================
   7. 卡片拖曳與手勢處理
================================= */
function canUseSwipe() {
    if (currentCardId === "start") {
        return !isAnimating && startSequenceComplete;
    }

    if (isAnimating || awakeStage < 2) return false;

    if (currentDialogueFlow) {
        return currentDialogueFlow.mode === "topic-choice" ||
               currentDialogueFlow.mode === "final-choice";
    }

    const data = getActiveStory()[currentCardId];
    if (!data || data.ending) return false;

    if (currentTextSegments.length > 0 &&
        currentTextSegmentIndex < currentTextSegments.length - 1) {
        return false;
    }

    return true;
}

function bindCardEvents(card) {
    const leftHint = card.querySelector(".hint-left");
    const rightHint = card.querySelector(".hint-right");

    card.addEventListener("pointerdown", (event) => {
        if (!canUseSwipe()) return;
        isDragging = true;
        startX = event.clientX;
        currentX = 0;

        card.classList.add("dragging");
        card.style.transform = "translate3d(0, -4px, 0) rotate(0deg) scale(1.03)";
        if (typeof playCardSound === "function") playCardSound("pick");

        try {
            card.setPointerCapture(event.pointerId);
        } catch (e) {}
    });

    card.addEventListener("pointermove", (event) => {
        if (!isDragging) return;
        if (!canUseSwipe()) {
            isDragging = false;
            card.classList.remove("dragging");
            returnCard(card);
            return;
        }

        if (event.cancelable) event.preventDefault();

        currentX = event.clientX - startX;
        const rotation = currentX * 0.065;

        card.style.transform = `translate3d(${currentX}px, -4px, 0) rotate(${rotation}deg) scale(1.03)`;

        const progress = Math.min(Math.abs(currentX) / SWIPE_THRESHOLD, 1);
        if (currentX < 0) {
            leftHint.style.opacity = progress;
            rightHint.style.opacity = 0;
        } else if (currentX > 0) {
            rightHint.style.opacity = progress;
            leftHint.style.opacity = 0;
        }
    });

    card.addEventListener("pointerup", handlePointerEnd);
    card.addEventListener("pointercancel", handlePointerEnd);

    function handlePointerEnd(event) {
        if (!isDragging) return;
        isDragging = false;

        if (!canUseSwipe()) {
            card.classList.remove("dragging");
            returnCard(card);
            return;
        }

        card.classList.remove("dragging");

        if (event && event.pointerId && card.hasPointerCapture && card.hasPointerCapture(event.pointerId)) {
            try {
                card.releasePointerCapture(event.pointerId);
            } catch (e) {}
        }

        const threshold = Math.max(SWIPE_THRESHOLD, card.offsetWidth * 0.25);
        if (currentX <= -threshold) {
            makeChoice("left");
        } else if (currentX >= threshold) {
            makeChoice("right");
        } else {
            returnCard(card);
        }
    }
}

function returnCard(card) {
    card.style.transition = "transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)";
    card.style.transform = "translate3d(0, 0, 0) rotate(0deg) scale(1)";
    card.querySelector(".hint-left").style.opacity = 0;
    card.querySelector(".hint-right").style.opacity = 0;
    if (Math.abs(currentX) > 12 && typeof playCardSound === "function") {
        playCardSound("return");
    }
    currentX = 0;
}

function makeChoice(direction) {
    if (!canUseSwipe()) return;

    if (currentDialogueFlow &&
        (currentDialogueFlow.mode === "topic-choice" || currentDialogueFlow.mode === "final-choice")) {
        if (typeof playCardSound === "function") playCardSound("swipe");
        handleDialogueFlowChoice(direction);
        return;
    }

    const story = getActiveStory();
    const data = story[currentCardId];
    if (!data || data.ending) return;

    const choiceSource = data.decision || data;
    const selectedChoice = choiceSource[direction];
    if (!selectedChoice || !story[selectedChoice.next]) return;

    isAnimating = true;
    if (typeof playCardSound === "function") playCardSound("swipe");

    const card = viewport.querySelector(".story-card");
    if (!card) return;

    const exitDirection = direction === "left" ? -1 : 1;
    const exitX = window.innerWidth + card.offsetWidth;

    card.style.transition = "transform 0.4s cubic-bezier(0.4, 0, 1, 1)";
    card.style.transform = `translate3d(${exitX * exitDirection}px, 0, 0) rotate(${exitDirection * 25}deg)`;

    animationTimer = setTimeout(() => {
        currentCardId = selectedChoice.next;
        currentDialogueFlow = null;
        renderCard();
    }, 400);
}

document.addEventListener("keydown", (event) => {
    if (!canUseSwipe()) return;
    if (event.key === "ArrowLeft") makeChoice("left");
    if (event.key === "ArrowRight") makeChoice("right");
});

function restartGame() {
    clearTimeout(animationTimer);
    if (typingTimer) clearInterval(typingTimer);
    isAnimating = false;
    isDragging = false;
    awakeStage = 0;
    startSequenceComplete = false;
    currentX = 0;
    currentY = 0;
    startX = 0;
    currentDialogueIndex = 0;
    currentDialogueFlow = null;
    currentCardId = "start";
    secretEndingCondition1 = false;
    lastMajorChapter = null;
    clearGameProgress();
    renderCard();
}

/* =================================
   8. 首頁選單（洗牌 -> 翻牌 -> 選單 -> 多語系切換）
================================= */
let currentLanguage = localStorage.getItem("roach_lang") || "zh";

const UI_TEXT = {
    zh: {
        gameTitle: "蟑螂王",
        chapterMenu: "— 主選單 —",
        startGame: "開始遊戲",
        continueGame: "繼續遊戲",
        settings: "設定",
        noSaveTip: "尚無存檔紀錄",
        settingsHeader: "— 遊戲設定 —",
        textSound: "🔊 字幕聲音",
        textSoundStatus: "",
        bgm: "🎵 背景音樂",
        bgmStatus: "",
        languageLabel: "🌐 語言",
        backToMenu: "返回選單",
        wakeHint: "（醒來）",
        resumeTip: "接續進度：",
        tearHint: "✂️ 向下滑動撕下卡片"
    },
    en: {
        gameTitle: "King of Cockroach",
        chapterMenu: "— MAIN MENU —",
        startGame: "Start Game",
        continueGame: "Continue",
        settings: "Settings",
        noSaveTip: "No save data found",
        settingsHeader: "— SETTINGS —",
        textSound: "🔊 Text Sound",
        textSoundStatus: "",
        bgm: "🎵 Music",
        bgmStatus: "",
        languageLabel: "🌐 LAN",
        backToMenu: "Back to Menu",
        wakeHint: "(Wake up)",
        resumeTip: "Resume: ",
        tearHint: "✂️ Swipe down to tear card"
    }
};

function getText(key) {
    const dict = UI_TEXT[currentLanguage] || UI_TEXT.zh;
    return dict[key] || UI_TEXT.zh[key] || "";
}

function applyLanguageUI() {
    // 1. 更新網頁頂部 <h1> 主標題
    const headerTitle = document.querySelector(".game-header h1");
    if (headerTitle) {
        headerTitle.textContent = getText("gameTitle");
    }

    // 2. 若目前停留在主選單／設定畫面，同步更新頂部章節副標題與卡片背景圖
    if (viewport.querySelector(".title-deck-wrapper")) {
        if (chapterName) {
            chapterName.textContent = getText("chapterMenu");
        }
        const menuFace = document.querySelector(".title-menu-face");
        if (menuFace) {
            menuFace.classList.toggle("lang-en", currentLanguage === "en");
        }
    }
}

function getCardBackHTML() {
    return `<div class="title-card-back"></div>`;
}

/* 共用實體刷牌動畫引擎（主選單進場與大章節切換共用） */
function playDeckShuffleSequence(wrapper, referenceCard, onComplete) {
    const shuffleDirections = ["shuffle-left", "shuffle-right", "shuffle-left"];
    const staggerMs = 210;
    const cardDurationMs = 520;

    shuffleDirections.forEach((dirClass, idx) => {
        setTimeout(() => {
            if (!wrapper.isConnected) return;

            // 音效與卡牌實際開始被抽出完全同步
            if (typeof playCardSound === "function") playCardSound("pick");

            const dummy = document.createElement("div");
            dummy.className = `story-card shuffle-dummy-card ${dirClass}`;
            dummy.style.width = `${referenceCard.offsetWidth}px`;
            dummy.style.height = `${referenceCard.offsetHeight}px`;
            wrapper.appendChild(dummy);

            // 動畫結束後確保移除虛擬卡牌 DOM，不殘留節點
            const cleanup = () => {
                if (dummy.parentNode) dummy.remove();
            };
            dummy.addEventListener("animationend", cleanup, { once: true });
            setTimeout(cleanup, cardDurationMs + 60);
        }, idx * staggerMs);
    });

    const totalShuffleTime = (shuffleDirections.length - 1) * staggerMs + cardDurationMs + 20;
    setTimeout(() => {
        if (!wrapper.isConnected) return;
        if (typeof onComplete === "function") onComplete();
    }, totalShuffleTime);
}

function renderTitleMenu() {
    gameOver.hidden = true;
    isAnimating = true;
    isDragging = false;
    awakeStage = 0;
    startSequenceComplete = false;
    currentDialogueFlow = null;
    lastMajorChapter = null;

    applyLanguageUI();
    if (chapterName) {
        chapterName.textContent = getText("chapterMenu");
    }

    viewport.innerHTML = "";

    const wrapper = document.createElement("div");
    wrapper.className = "title-deck-wrapper";

    // 主卡片（初始為卡背狀態，置中於牌堆）
    const mainCard = document.createElement("div");
    mainCard.className = "story-card title-main-card";
    mainCard.innerHTML = getCardBackHTML();

    wrapper.appendChild(mainCard);
    viewport.appendChild(wrapper);

    // 執行連續三張實體刷牌動畫，結束後翻開主選單
    playDeckShuffleSequence(wrapper, mainCard, () => {
        if (typeof playCardSound === "function") playCardSound("return");
        mainCard.classList.add("is-flipping");

        setTimeout(() => {
            showMainMenuFace(mainCard);
        }, 310);

        setTimeout(() => {
            mainCard.classList.remove("is-flipping");
            isAnimating = false;
        }, 660);
    });
}

function showMainMenuFace(card) {
    const langClass = currentLanguage === "en" ? "lang-en" : "";
    const savedData = loadGameProgress();
    const hasSave = Boolean(savedData);

    const getSavedChapterText = (saveObj) => {
        if (!saveObj) return "";
        const savedCard = getActiveStory()[saveObj.cardId];
        const chapterLabel = (savedCard && savedCard.chapter) || saveObj.chapter || "";
        return chapterLabel ? `${getText("resumeTip")}${chapterLabel}` : "";
    };

    card.innerHTML = `
        <div class="title-menu-face ${langClass}">
            <div class="title-menu-list">
                <button type="button" class="menu-btn ${hasSave ? "" : "is-active"}" id="btn-menu-start">
                    <span class="btn-crown">♛</span>
                    <span class="btn-icon">▶</span>
                    <span>${getText("startGame")}</span>
                </button>

                <button type="button" class="menu-btn ${hasSave ? "is-active" : "is-locked"}" id="btn-menu-continue">
                    <span class="btn-crown">♛</span>
                    <span class="btn-icon">🕒</span>
                    <span>${getText("continueGame")}</span>
                </button>

                <button type="button" class="menu-btn" id="btn-menu-settings">
                    <span class="btn-crown">♛</span>
                    <span class="btn-icon">⚙</span>
                    <span>${getText("settings")}</span>
                </button>
            </div>
            <div class="title-menu-footer" id="title-menu-tip">${hasSave ? getSavedChapterText(savedData) : ""}</div>
        </div>
    `;

    const startBtn = card.querySelector("#btn-menu-start");
    const continueBtn = card.querySelector("#btn-menu-continue");
    const settingsBtn = card.querySelector("#btn-menu-settings");
    const tipEl = card.querySelector("#title-menu-tip");

    const interactiveBtns = hasSave
        ? [startBtn, continueBtn, settingsBtn]
        : [startBtn, settingsBtn];

    interactiveBtns.forEach(btn => {
        btn.addEventListener("mouseenter", () => {
            interactiveBtns.forEach(b => b.classList.remove("is-active"));
            btn.classList.add("is-active");

            if (btn === continueBtn && savedData) {
                tipEl.textContent = getSavedChapterText(savedData);
            } else {
                tipEl.textContent = "";
            }
        });
    });

    // 1. 開始遊戲 -> 開啟新局（清除舊存檔）並進入第一章開頭洗牌與翻牌
    startBtn.addEventListener("click", () => {
        if (isAnimating) return;
        isAnimating = true;
        if (typeof playCardSound === "function") playCardSound("swipe");

        card.classList.add("is-spin-out");

        setTimeout(() => {
            card.innerHTML = getCardBackHTML();
        }, 160);

        setTimeout(() => {
            currentCardId = "start";
            secretEndingCondition1 = false;
            lastMajorChapter = null;
            clearGameProgress();
            renderCard();
        }, 320);
    });

    // 2. 繼續遊戲 -> 讀取存檔並以洗牌過場接續該卡片
    continueBtn.addEventListener("click", () => {
        const latestSave = loadGameProgress();
        if (!latestSave) {
            continueBtn.classList.remove("shake-deny");
            void continueBtn.offsetWidth;
            continueBtn.classList.add("shake-deny");
            tipEl.textContent = getText("noSaveTip");
            return;
        }

        if (isAnimating) return;
        isAnimating = true;
        if (typeof playCardSound === "function") playCardSound("swipe");

        card.classList.add("is-spin-out");

        setTimeout(() => {
            card.innerHTML = getCardBackHTML();
        }, 160);

        setTimeout(() => {
            currentCardId = latestSave.cardId;
            secretEndingCondition1 = Boolean(latestSave.secretEndingCondition1);
            lastMajorChapter = null;
            renderCard();
        }, 320);
    });

    // 3. 設定 -> 切換至設定面板
    settingsBtn.addEventListener("click", () => {
        if (typeof playCardSound === "function") playCardSound("pick");
        showSettingsPlaceholderFace(card);
    });
}

function showSettingsPlaceholderFace(card) {
    const langClass = currentLanguage === "en" ? "lang-en" : "";

    card.innerHTML = `
        <div class="title-menu-face ${langClass}">
            <div class="settings-section-label">${getText("settingsHeader")}</div>

            <div class="settings-slot-list">
                <div class="settings-slot-item">
                    <span>${getText("textSound")}</span>
                    <span class="slot-status">${getText("textSoundStatus")}</span>
                </div>
                <div class="settings-slot-item">
                    <span>${getText("bgm")}</span>
                    <span class="slot-status">${getText("bgmStatus")}</span>
                </div>
                <div class="settings-slot-item">
                    <span>${getText("languageLabel")}</span>
                    <div class="lang-toggle-group" role="group" aria-label="Language">
                        <button type="button" class="lang-option-btn ${currentLanguage === "zh" ? "is-selected" : ""}" data-lang="zh">中文</button>
                        <button type="button" class="lang-option-btn ${currentLanguage === "en" ? "is-selected" : ""}" data-lang="en">EN</button>
                    </div>
                </div>
            </div>

            <button type="button" class="menu-btn is-active" id="btn-settings-back">
                <span class="btn-icon">←</span>
                <span>${getText("backToMenu")}</span>
                <span></span>
            </button>

            <div class="title-menu-footer"></div>
        </div>
    `;

    // 語言切換按鈕互動：即時更新標題、背景圖並重繪設定面板文字
    const langButtons = card.querySelectorAll(".lang-option-btn");
    langButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const selectedLang = btn.dataset.lang;
            if (selectedLang === currentLanguage) return;

            currentLanguage = selectedLang;
            localStorage.setItem("roach_lang", currentLanguage);

            if (typeof playCardSound === "function") playCardSound("pick");

            applyLanguageUI();
            showSettingsPlaceholderFace(card);
        });
    });

    card.querySelector("#btn-settings-back").addEventListener("click", () => {
        if (typeof playCardSound === "function") playCardSound("pick");
        showMainMenuFace(card);
    });
}

applyLanguageUI();
initAmbientDust();
renderTitleMenu();