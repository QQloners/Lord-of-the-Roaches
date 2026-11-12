// 全局遊戲狀態：紀錄是否滿足秘密結局條件
let secretEndingCondition1 = false;

/* =================================
   1. 劇情資料庫 STORY_DATA
================================= */
const STORY_DATA = {
    // 故事開頭（第一張圖：images/1.png，預設全黑）
    start: {
        chapter: "第一章・異變",
        title: "白色軀體",
        description: "某天早晨，你從一場不安的夢中醒來...\n此時，門外傳來一道聲音：「要吃飯了...」",
        image: "images/1.png", 
        left: { label: "🚪 鎖門不出", next: "ending_1" },
        right: { label: "🚪 打開房門", next: "dining_room" }
    },

    // 結局 1
    ending_1: {
        chapter: "終章・絕望",
        title: "【結局1：封閉的房間】",
        achievement: "🏆 解鎖成就：孤獨的死因",
        description: "你選擇將自己死死關在房間裡...\n沒有勇氣踏出房門，也沒有嘗試尋找任何人。\n\n最後，你在無盡的恐懼與飢餓中，靜靜地死在了房間內...",
        image: "images/ending_1.png", 
        ending: true
    },

    // 餐桌之下（預設模糊背景）
    dining_room: {
        chapter: "第一章・餐桌之下",
        title: "同類的身影",
        description: "你鼓起勇氣打開房門，循著聲音一步步挪動軀體來到餐桌附近...\n\n透過陰影張望，你驚訝地發現餐桌底下正有三隻蟑螂聚集在一起，低聲碎碎唸著什麼...",
        image: "images/2.png", 
        left: { label: "👂 隱蔽偷聽", next: "eavesdrop" },
        right: { label: "💬 上前搭話", next: "talk_to_bugs" }
    },

    // 2. 偷聽劇情（暗中紀錄條件 1）
    eavesdrop: {
        chapter: "第一章・偷聽情報",
        title: "牆角裡的碎碎唸",
        description: "你屏住呼吸，將觸角貼近陰影深處……\n\n蟑螂A：「欸，你們有沒有發現最近這屋子的主人都不打掃了？」\n蟑螂B：「對啊！地上全是餅乾屑和油垢，簡直是天堂！」\n蟑螂C：「嘿嘿，這主人大概是放棄人生了吧？便宜我們了～」",
        image: "images/3.png",
        onEnter: () => {
            secretEndingCondition1 = true;
            console.log("秘密結局條件 1 已解鎖！");
        },
        left: { label: "👥 上前搭話", next: "talk_to_bugs" },
        right: { label: "👣 默默離開不搭話", next: "ending_2" }
    },

    // 3. 結局 2
    ending_2: {
        chapter: "終章・消滅",
        title: "【結局2：害蟲撲滅】",
        achievement: "🏆 解鎖成就：驅蟲公司的業績",
        description: "你選擇不搭話，悄悄退回陰影中。\n\n靠著骯髒屋子裡的殘渣，你苟延殘喘地活了半年。直到有一天，鄰居因為惡臭檢舉了這間房子……\n專業的驅蟲公司闖入，在濃烈的殺蟲劑煙霧中，你迎來了終局。",
        image: "images/ending_2.png",
        ending: true
    },

    // 4. 初次接觸與騎士對話（對話切換模式）
    talk_to_bugs: {
        chapter: "第一章・騎士的宿命",
        dialogueSteps: [
            {
                title: "震驚的同類",
                speaker: "蟑螂 A",
                text: "「天啊……你看這傢伙！這體型也太龐大了吧？而且全身通白，你到底是哪來的怪物？」",
                image: "images/bug_a.png"
            },
            {
                title: "騎士大會情報",
                speaker: "蟑螂 B",
                text: "「等等！這種白甲……難道你是被選中的『蟑螂代表』？每一屆『昆蟲騎士交流戰』都會挑選各族代表，但詳細的會議內容只有貴族騎士才知道。」",
                image: "images/bug_b.png"
            },
            {
                title: "奇特的獨角仙",
                speaker: "蟑螂 C",
                text: "「如果你想知道更多，可以去隔壁書房找那隻『獨角仙』。牠非常了解騎士大會，不過……牠性格像個小孩子一樣怪異，平時根本沒蟲敢找牠聊天。」",
                image: "images/beetle_info.png"
            }
        ],
        decision: {
            title: "尋找獨角仙",
            description: "聽完同類們的對話，你得知了隔壁書房住著一隻了解騎士大會的怪異獨角仙。\n\n你要前往隔壁房間尋找獨角仙嗎？",
            left: { label: "🚪 前往書房尋找", next: "find_beetle" },
            right: { label: "🔍 留在原處探索", next: "stay_here" }
        }
    },

    find_beetle: {
        chapter: "第二章・怪異的學者",
        title: "書房的陰影",
        description: "你穿過門縫進入了書房，周圍堆滿了巨大如山丘般的書籍……\n\n（獨角仙劇情待續）",
        image: "images/study_room.png",
        left: { label: "待補選項 A", next: "start" },
        right: { label: "待補選項 B", next: "start" }
    },

    stay_here: {
        chapter: "第一章・躊躇不前",
        title: "錯失良機",
        description: "你決定留在餐桌底下，失去了了解騎士大會真相的機會……\n\n（劇情待續）",
        image: "images/stay.png",
        left: { label: "待補選項 A", next: "start" },
        right: { label: "待補選項 B", next: "start" }
    }
};

/* =================================
   2. 全局狀態與控制變數
================================= */
let currentCardId = "start";
let isAnimating = false;
let isDragging = false;
let awakeStage = 0; // 0: 未醒來(全黑/模糊), 1: 圖片已清晰, 2: 字幕展開打字中/完畢(可劃動)
let startX = 0, startY = 0;
let currentX = 0, currentY = 0;
const SWIPE_THRESHOLD = 120;
let animationTimer = null;
let typingTimer = null;
let currentDialogueIndex = 0;

const viewport = document.getElementById("game-viewport");
const chapterName = document.getElementById("chapter-name");
const gameOver = document.getElementById("game-over");

/* =================================
   3. 核心卡片渲染 renderCard()
================================= */
function renderCard() {
    const data = STORY_DATA[currentCardId];
    if (!data) return;

    if (data.onEnter) data.onEnter();

    if (typingTimer) clearInterval(typingTimer);
    
    // 強行重置動畫與拖曳狀態，避免換關卡死
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

    if (data.dialogueSteps) {
        renderDialogueFlow(data);
        return;
    }

    const card = document.createElement("div");
    card.className = "story-card waiting-click";

    const visualClass = (currentCardId === "start") ? "full-screen blackout" : "full-screen blurred";

    card.innerHTML = `
        <div class="card-image ${visualClass}">
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
    const spanArea = imageArea.querySelector("span");

    if (data.image && data.image.trim() !== "") {
        imageArea.style.backgroundImage = `url("${data.image}")`;
        if (spanArea) spanArea.style.display = "none";
    } else {
        imageArea.style.backgroundImage = "none";
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

    // 兩階段點擊甦醒流程
    card.addEventListener("click", function handleCardClick() {
        if (isDragging) return;

        // 【快轉功能】打字中點擊，直接輸出完畢
        if (isAnimating && typingTimer) {
            clearInterval(typingTimer);
            typingTimer = null;
            card.querySelector("h2").textContent = data.title || "";
            card.querySelector("p").textContent = data.description || "";
            card.querySelector("h2").classList.remove("typing-cursor");
            card.querySelector("p").classList.remove("typing-cursor");
            isAnimating = false;
            awakeStage = 2;
            return;
        }

        // 階段 0 ➔ 點擊第 1 下：全黑/模糊圖片平滑顯影，(醒來) 字幕平滑淡出
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

        // 階段 1 ➔ 點擊第 2 下：字幕區升起並開始打字
        if (awakeStage === 1 && !isAnimating) {
            card.classList.remove("waiting-click");
            const wakeHint = card.querySelector(".wake-hint");
            if (wakeHint) wakeHint.style.display = "none";
            triggerAwakeAnimation(card, data);
        }
    });

    bindCardEvents(card);
}

/* =================================
   4. 字幕上升動畫與打字流程
================================= */
function triggerAwakeAnimation(card, data) {
    isAnimating = true;
    const imageArea = card.querySelector(".card-image");
    const titleEl = card.querySelector("h2");
    const descEl = card.querySelector("p");

    imageArea.classList.remove("full-screen");

    setTimeout(() => {
        typeText(titleEl, data.title || "", 50, () => {
            typeText(descEl, data.description || "", 35, () => {
                isAnimating = false;
                awakeStage = 2; // 打字完成，解鎖劃動
            });
        });
    }, 850);
}

/* 通用打字機函式 */
function typeText(element, text, speed, onComplete) {
    let index = 0;
    element.textContent = "";
    element.classList.add("typing-cursor");

    typingTimer = setInterval(() => {
        if (index < text.length) {
            element.textContent += text.charAt(index);
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
   5. 多頁對話卡片流程
================================= */
function renderDialogueFlow(data) {
    currentDialogueIndex = 0;
    isAnimating = false;

    const card = document.createElement("div");
    card.className = "story-card";

    card.innerHTML = `
        <div class="card-image">
            <span>[ 像素圖片區域 ]</span>
        </div>
        <div class="card-content">
            <h2></h2>
            <p></p>
        </div>
        <div class="swipe-hint hint-left"></div>
        <div class="swipe-hint hint-right"></div>
    `;

    viewport.appendChild(card);
    updateDialogueStep(card, data);

    card.addEventListener("click", () => {
        if (isAnimating && typingTimer) {
            clearInterval(typingTimer);
            typingTimer = null;
            const currentStep = data.dialogueSteps[currentDialogueIndex];
            card.querySelector("p").textContent = `${currentStep.speaker}：\n${currentStep.text}`;
            card.querySelector("p").classList.remove("typing-cursor");
            isAnimating = false;
            return;
        }

        currentDialogueIndex++;
        if (currentDialogueIndex < data.dialogueSteps.length) {
            updateDialogueStep(card, data);
        } else {
            setupDecisionState(card, data.decision);
        }
    });
}

function updateDialogueStep(card, data) {
    isAnimating = true;
    const step = data.dialogueSteps[currentDialogueIndex];
    const imageArea = card.querySelector(".card-image");
    const titleEl = card.querySelector("h2");
    const descEl = card.querySelector("p");

    if (step.image) {
        imageArea.style.backgroundImage = `url("${step.image}")`;
        const spanArea = imageArea.querySelector("span");
        if (spanArea) spanArea.style.display = "none";
    }

    titleEl.textContent = step.title;
    typeText(descEl, `${step.speaker}：\n${step.text}`, 20, () => {
        isAnimating = false;
    });
}

function setupDecisionState(card, decisionData) {
    awakeStage = 2;
    isAnimating = false;

    card.querySelector("h2").textContent = decisionData.title;
    card.querySelector("p").textContent = decisionData.description;

    const leftHint = card.querySelector(".hint-left");
    const rightHint = card.querySelector(".hint-right");
    leftHint.textContent = "← " + decisionData.left.label;
    rightHint.textContent = decisionData.right.label + " →";

    bindCardEvents(card);
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
    document.getElementById("over-msg").textContent = `${data.achievement}\n\n${data.description}`;
}

/* =================================
   7. 卡片拖曳與手勢處理（徹底防手機卡死版）
================================= */
function bindCardEvents(card) {
    const leftHint = card.querySelector(".hint-left");
    const rightHint = card.querySelector(".hint-right");

    card.addEventListener("pointerdown", (event) => {
        if (isAnimating || awakeStage < 2) return;
        isDragging = true;
        startX = event.clientX;
        currentX = 0;

        card.classList.add("dragging");

        // 安全鎖定指針
        try {
            card.setPointerCapture(event.pointerId);
        } catch (e) {}
    });

    card.addEventListener("pointermove", (event) => {
        if (!isDragging || isAnimating || awakeStage < 2) return;

        // 阻止手機瀏覽器原生滾動與選取
        if (event.cancelable) event.preventDefault();

        currentX = event.clientX - startX;
        const rotation = currentX * 0.075;

        card.style.transform = `translate3d(${currentX}px, 0, 0) rotate(${rotation}deg)`;

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

        // 1. 優先移除 dragging，還原 transition
        card.classList.remove("dragging");

        // 2. 安全釋放指針
        if (event && event.pointerId && card.hasPointerCapture && card.hasPointerCapture(event.pointerId)) {
            try {
                card.releasePointerCapture(event.pointerId);
            } catch (e) {}
        }

        // 3. 判斷位移量：達標切換，未達標平滑彈回
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
    card.style.transform = "translate3d(0, 0, 0) rotate(0deg)";
    card.querySelector(".hint-left").style.opacity = 0;
    card.querySelector(".hint-right").style.opacity = 0;
    currentX = 0;
}

function makeChoice(direction) {
    if (isAnimating || awakeStage < 2) return;
    const data = STORY_DATA[currentCardId];
    if (!data || data.ending) return;

    const choiceSource = data.decision || data;
    const selectedChoice = choiceSource[direction];
    if (!selectedChoice || !STORY_DATA[selectedChoice.next]) return;

    isAnimating = true;
    const card = viewport.querySelector(".story-card");
    const exitDirection = direction === "left" ? -1 : 1;
    const exitX = window.innerWidth + card.offsetWidth;

    card.style.transition = "transform 0.4s cubic-bezier(0.4, 0, 1, 1)";
    card.style.transform = `translate3d(${exitX * exitDirection}px, 0, 0) rotate(${exitDirection * 25}deg)`;

    animationTimer = setTimeout(() => {
        currentCardId = selectedChoice.next;
        renderCard();
    }, 400);
}

document.addEventListener("keydown", (event) => {
    if (isAnimating || awakeStage < 2) return;
    if (event.key === "ArrowLeft") makeChoice("left");
    if (event.key === "ArrowRight") makeChoice("right");
});

function restartGame() {
    clearTimeout(animationTimer);
    if (typingTimer) clearInterval(typingTimer);
    isAnimating = false;
    isDragging = false;
    awakeStage = 0;
    currentX = 0;
    currentY = 0;
    startX = 0;
    currentDialogueIndex = 0;
    currentCardId = "start";
    secretEndingCondition1 = false;
    renderCard();
}

renderCard();