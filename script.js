// 全局遊戲狀態：紀錄是否滿足秘密結局條件
let secretEndingCondition1 = false;

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

// 對話角色特寫圖預設對照
const DIALOGUE_SPEAKER_IMAGES = {
    "主角": "images/4.png",
    "蟑螂 A": "images/6.png",
    "蟑螂 B": "images/5.png",
    "蟑螂 C": "images/7.png"
};

// 各角色說話音效基礎音高（Hz）
const SPEAKER_VOICE_PITCH = {
    "主角": 135,
    "蟑螂 A": 195,
    "蟑螂 B": 165,
    "蟑螂 C": 240
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

function playSpeakerBlip(speaker) {
    const baseFreq = SPEAKER_VOICE_PITCH[speaker];
    if (!baseFreq) return;

    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === "suspended") {
            audioCtx.resume();
        }

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();

        osc.type = "triangle";
        const pitch = baseFreq + (Math.random() * 28 - 14);
        osc.frequency.setValueAtTime(pitch, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(pitch * 0.78, audioCtx.currentTime + 0.04);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(680, audioCtx.currentTime);

        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.045);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.045);
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
   3. 核心卡片渲染 renderCard()
================================= */
function renderCard() {
    const data = STORY_DATA[currentCardId];
    if (!data) return;

    if (!data.dialogueFlow) currentDialogueFlow = null;
    if (data.onEnter) data.onEnter();

    if (typingTimer) {
        clearInterval(typingTimer);
        typingTimer = null;
    }

    isAnimating = false;
    isDragging = false;

    viewport.innerHTML = "";
    chapterName.textContent = data.chapter || "";

    if (data.ending) {
        renderEndingFlow(data);
        return;
    }

    gameOver.hidden = true;
    awakeStage = 0;
    startSequenceComplete = false;

    if (currentCardId === "start") {
        renderStartCard(data);
        return;
    }

    currentTextSegments = [];
    currentTextSegmentIndex = 0;

    if (data.dialogueFlow) {
        renderDialogueFlow(data);
        return;
    }

    const card = document.createElement("div");
    card.className = "story-card waiting-click";

    card.innerHTML = `
        <div class="card-image full-screen blurred">
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
            card.querySelector("p").textContent =
                currentTextSegments[currentTextSegmentIndex] || "";

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
            descEl.textContent = currentLineText;
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
                    playStartLine(1, "主角", false);
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
function splitTextIntoSegments(text, maxLength = 80) {
    const paragraphs = String(text)
        .split(/\n+/)
        .map(p => p.trim())
        .filter(p => p.length > 0);

    const segments = [];

    paragraphs.forEach(paragraph => {
        while (paragraph.length > maxLength) {
            let cutIndex = maxLength;
            for (let i = maxLength; i >= Math.floor(maxLength * 0.65); i--) {
                if ("，。！？；、".includes(paragraph[i - 1])) {
                    cutIndex = i;
                    break;
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

/* 通用打字機函式 */
function typeText(element, text, speed, onComplete, onChar) {
    let index = 0;
    element.textContent = "";
    element.classList.add("typing-cursor");

    typingTimer = setInterval(() => {
        if (index < text.length) {
            const ch = text.charAt(index);
            element.textContent += ch;
            if (onChar) onChar(ch, index);
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
        <div class="tear-hint" style="display:none;">✂️ 向下滑動撕下卡片</div>
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

    const data = STORY_DATA[currentCardId];
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

    const data = STORY_DATA[currentCardId];
    if (!data || data.ending) return;

    const choiceSource = data.decision || data;
    const selectedChoice = choiceSource[direction];
    if (!selectedChoice || !STORY_DATA[selectedChoice.next]) return;

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
    renderCard();
}

initAmbientDust();
renderCard();