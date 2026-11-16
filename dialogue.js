/* =================================
   1. 劇情資料庫 STORY_DATA
================================= */
const STORY_DATA = {
    // 故事開頭（第一張圖：images/1.png，預設全黑）
    start: {
        chapter: "第一章・卵鞘",
        title: "純白的惡夢",
        description: "某天早晨，你從一場不安的夢中醒來...\n這是怎麼回事!?我怎麼會變這樣!?\n你驚恐的吶喊...\n然而...\n此時的你...\n什麼都想不起來...\n也不知道...\n只確定自己曾經人類...\n此時，門外傳來一道聲音...\n「喔依~大家快來吃東西!」",
        image: "images/1.png",
        left: { label: "🚪 永遠不出門，絕對不想被人看見自己現在的樣子", next: "ending_1" },
        right: { label: "🚪 鼓起勇氣打開房門，想辦法尋求協助", next: "dining_room" }
    },

    // 結局 1
    ending_1: {
        chapter: "終章・孤獨",
        title: "【結局1：封閉的房間】",
        achievement: "🏆 解鎖成就：不見天日",
        description: "你選擇將自己死死關在房間裡...\n沒有勇氣踏出房門，也沒有嘗試尋找任何人。\n\n最後，你在無盡的恐懼與飢餓中，靜靜地死在了房間內...",
        image: "images/ending_1.png",
        ending: true
    },

    // 餐桌之下（預設模糊背景）
    dining_room: {
        chapter: "第一章・卵鞘",
        title: "無人接聽",
        description: "你鼓起勇氣打開房門\n然而映入眼簾的是空無一人的走廊\n但你仍然聽見窸窣的聲音從客廳傳來...\n你循著聲音一步步挪動軀體來到餐桌附近...\n\n透過陰影張望，並發現餐桌底下正有三隻蟑螂聚集在一起，低聲碎唸著什麼...",
        image: "images/2.png",
        left: { label: "👂 隱蔽偷聽", next: "eavesdrop" },
        right: { label: "💬 上前搭話", next: "talk_to_bugs" }
    },

    // 2. 偷聽劇情（暗中紀錄條件 1）
    eavesdrop: {
        chapter: "第一章・卵鞘",
        title: "無主之地?",
        description: "你屏住呼吸，將觸角貼近陰影深處……\n\n蟑螂A：「太好了!自從上一次這家的屋主離開後就不再打掃了!」\n蟑螂B：「可是...這間房子不是還有一個人嗎？」\n蟑螂C：「有人才有食物哪!看開點...重點是他不愛打掃!」",
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

    // 結局 3：選擇留下來與三隻蟑螂相處
    ending_3: {
        chapter: "終章・新的朋友",
        title: "【結局3：新的朋友】",
        description: "",
        ending: true
    },

    // 4. 初次接觸、五個話題、獨角仙情報與最後決策
    talk_to_bugs: {
        chapter: "第一章・卵鞘",

        dialogueFlow: {
            intro: [
                { speaker: "主角", image: "images/4.png", text: "那個……不好意思。" },
                { speaker: "蟑螂 A", image: "images/6.png", text: "嗯？怎麼了？" },
                { speaker: "蟑螂 B", image: "images/5.png", text: "等一下……你是誰啊？" },
                { speaker: "蟑螂 C", image: "images/7.png", text: "好大隻……" },
                { speaker: "主角", image: "images/4.png", text: "啊……抱歉，嚇到你們了嗎？" },
                { speaker: "蟑螂 A", image: "images/6.png", text: "當然阿!很少看到這麼大的同類...\n等等...\n這算同類嗎?" },
                { speaker: "蟑螂 B", image: "images/5.png", text: "語言相通的話就是同類吧?" },
                { speaker: "主角", image: "images/4.png", text: "這個嘛……其實我也不太清楚。" },
                { speaker: "蟑螂 C", image: "images/7.png", text: "拜託~每隻昆蟲說的話都馬相通...\n只是口音不太相近而已..." },
                { speaker: "主角", image: "images/4.png", text: "拜託了\n我真的需要你們的幫忙..." },
                { speaker: "蟑螂 A", image: "images/6.png", text: "好吧...你想知道什麼？" }
            ],

            topics: [
                {
                    title: "關於主角的變身",
                    prompt: "你想向三隻蟑螂詢問哪件事？",
                    left: {
                        label: "詢問變身原因",
                        steps: [
                            { speaker: "主角", image: "images/4.png", text: "你們知道我為什麼會變成這樣嗎？" },
                            { speaker: "蟑螂 A", image: "images/6.png", text: "這個嘛……我們也不清楚，從來沒遇過這種事。" },
                            { speaker: "蟑螂 B", image: "images/5.png", text: "突然變成蟑螂，還變得這麼大，確實很奇怪。" },
                            { speaker: "蟑螂 C", image: "images/7.png", text: "你還記得自己是什麼時候變成這樣的嗎？" },
                            { speaker: "主角", image: "images/4.png", text: "我只記得早上醒來的時候，就已經變成這個樣子了。" },
                            { speaker: "蟑螂 A", image: "images/6.png", text: "這樣啊……那我們也幫不上什麼忙。" }
                        ]
                    },
                    right: {
                        label: "詢問巨大蟑螂",
                        steps: [
                            { speaker: "主角", image: "images/4.png", text: "你們有看過跟我一樣巨大的蟑螂嗎？" },
                            { speaker: "蟑螂 B", image: "images/5.png", text: "沒有喔！至少我從來沒看過。" },
                            { speaker: "蟑螂 C", image: "images/7.png", text: "一般蟑螂可沒有你這麼大的身體。" },
                            { speaker: "蟑螂 A", image: "images/6.png", text: "而且你的身體還是白色的，看起來也很不一樣。" },
                            { speaker: "主角", image: "images/4.png", text: "看來我跟一般蟑螂真的不太一樣……" },
                            { speaker: "蟑螂 B", image: "images/5.png", text: "是啊！所以我們才會對你這麼好奇嘛！" }
                        ]
                    }
                },
                {
                    title: "關於變回人類",
                    prompt: "你想向三隻蟑螂詢問哪件事？",
                    left: {
                        label: "詢問變回人類",
                        steps: [
                            { speaker: "主角", image: "images/4.png", text: "有沒有什麼辦法能讓我變回人類？" },
                            { speaker: "蟑螂 A", image: "images/6.png", text: "變回人類？原來你原本是人類啊。" },
                            { speaker: "蟑螂 B", image: "images/5.png", text: "抱歉，我們從來沒遇過這種事情，也不知道該怎麼做。" },
                            { speaker: "蟑螂 C", image: "images/7.png", text: "如果想找出答案，可能得問問比我們更了解昆蟲世界的傢伙。" },
                            { speaker: "主角", image: "images/4.png", text: "看來只能再想辦法找線索了……" },
                            { speaker: "蟑螂 A", image: "images/6.png", text: "別太著急，也許真的有人知道答案呢。" }
                        ]
                    },
                    right: {
                        label: "詢問如何生活",
                        steps: [
                            { speaker: "主角", image: "images/4.png", text: "如果一直維持這個樣子，我該怎麼辦？" },
                            { speaker: "蟑螂 B", image: "images/5.png", text: "這個嘛……首先，你得慢慢習慣現在的身體吧？" },
                            { speaker: "蟑螂 C", image: "images/7.png", text: "而且你現在的體型，跟一般蟑螂差太多了。" },
                            { speaker: "蟑螂 A", image: "images/6.png", text: "如果想在昆蟲世界生活，可能還有很多事情需要學習。" },
                            { speaker: "主角", image: "images/4.png", text: "……聽起來好麻煩，我還是希望能變回人類。" },
                            { speaker: "蟑螂 B", image: "images/5.png", text: "哈哈，慢慢來嘛！不用一下子就適應。" }
                        ]
                    }
                },
                {
                    title: "關於這間房子",
                    prompt: "你想向三隻蟑螂詢問哪件事？",
                    left: {
                        label: "詢問房屋近況",
                        steps: [
                            { speaker: "主角", image: "images/4.png", text: "你們最近常在這間房子活動嗎？" },
                            { speaker: "蟑螂 A", image: "images/6.png", text: "是啊！最近這裡真的很適合生活。" },
                            { speaker: "蟑螂 B", image: "images/5.png", text: "以前可沒這麼容易找到食物呢！" },
                            { speaker: "蟑螂 C", image: "images/7.png", text: "最近連一些角落都能找到不少東西。" },
                            { speaker: "主角", image: "images/4.png", text: "所以這裡最近都沒有什麼人在打掃嗎？" },
                            { speaker: "蟑螂 A", image: "images/6.png", text: "至少最近很少看到有人整理環境。" },
                            { speaker: "主角", image: "images/4.png", text: "……這樣啊，難怪我覺得這裡有點熟悉。" }
                        ]
                    },
                    right: {
                        label: "詢問原本住戶",
                        steps: [
                            { speaker: "主角", image: "images/4.png", text: "你們知道這間房子原本住著哪些人嗎？" },
                            { speaker: "蟑螂 B", image: "images/5.png", text: "這個嘛，我們平常只在這裡活動。" },
                            { speaker: "蟑螂 C", image: "images/7.png", text: "不太清楚房子裡原本住著哪些人。" },
                            { speaker: "蟑螂 A", image: "images/6.png", text: "我們平常比較在意哪裡有食物，倒是沒特別注意房子的主人。" },
                            { speaker: "主角", image: "images/4.png", text: "……原來如此。我對這裡有種熟悉感，卻想不起來自己為什麼會有這種感覺。" }
                        ]
                    }
                },
                {
                    title: "關於昆蟲騎士交流戰",
                    prompt: "你想向三隻蟑螂詢問哪件事？",
                    left: {
                        label: "詢問昆蟲世界的活動",
                        steps: [
                            { speaker: "主角", image: "images/4.png", text: "昆蟲世界裡，有什麼比較重要的活動嗎？" },
                            { speaker: "蟑螂 A", image: "images/6.png", text: "有啊！最重要的活動之一就是昆蟲騎士交流戰。" },
                            { speaker: "蟑螂 B", image: "images/5.png", text: "每一屆都會有不同種類的昆蟲派出代表參加。" },
                            { speaker: "蟑螂 C", image: "images/7.png", text: "像我們蟑螂，也會有自己的代表呢！" },
                            { speaker: "主角", image: "images/4.png", text: "原來如此……那是什麼樣的活動？" },
                            { speaker: "蟑螂 A", image: "images/6.png", text: "詳細情況我們也不太清楚，畢竟騎士會議的內容不是一般平民能知道的。" }
                        ]
                    },
                    right: {
                        label: "詢問自己的特殊身分",
                        steps: [
                            { speaker: "主角", image: "images/4.png", text: "像我這樣突然變得這麼巨大的蟑螂，會不會有什麼特殊身分？" },
                            { speaker: "蟑螂 A", image: "images/6.png", text: "說到特殊身分……每一屆昆蟲騎士交流戰，都會由不同種類的昆蟲派出代表。" },
                            { speaker: "蟑螂 B", image: "images/5.png", text: "我們蟑螂當然也有自己的代表。" },
                            { speaker: "蟑螂 C", image: "images/7.png", text: "你的體型和外觀都很特殊，說不定跟這件事有關。" },
                            { speaker: "主角", image: "images/4.png", text: "所以……你們覺得我可能是蟑螂的代表？" },
                            { speaker: "蟑螂 A", image: "images/6.png", text: "只是猜測而已，真正的事情還是得找了解騎士大會的人問問看。" }
                        ]
                    }
                },
                {
                    title: "尋找能夠幫助主角的人",
                    prompt: "你想向三隻蟑螂詢問哪件事？",
                    left: {
                        label: "詢問誰能幫助自己",
                        steps: [
                            { speaker: "主角", image: "images/4.png", text: "如果我想找人了解自己的情況，該找誰？" },
                            { speaker: "蟑螂 B", image: "images/5.png", text: "這個嘛……另一間房間裡倒是有個傢伙。" },
                            { speaker: "主角", image: "images/4.png", text: "那是誰？" },
                            { speaker: "蟑螂 C", image: "images/7.png", text: "牠知道不少昆蟲世界的事情。" },
                            { speaker: "蟑螂 A", image: "images/6.png", text: "或許牠能提供一些我們不知道的資訊。" }
                        ]
                    },
                    right: {
                        label: "詢問尋找線索的方法",
                        steps: [
                            { speaker: "主角", image: "images/4.png", text: "如果我想弄清楚自己為什麼變成這樣，應該從哪裡找線索？" },
                            { speaker: "蟑螂 A", image: "images/6.png", text: "我們也不知道你的身上究竟發生了什麼事。" },
                            { speaker: "蟑螂 B", image: "images/5.png", text: "不過，另一間房間裡有個傢伙，或許能幫上忙。" },
                            { speaker: "蟑螂 C", image: "images/7.png", text: "牠對昆蟲世界的事情知道得比我們多。" },
                            { speaker: "主角", image: "images/4.png", text: "另一間房間嗎……" }
                        ]
                    }
                }
            ],

            finalSteps: [
                { speaker: "蟑螂 A", image: "images/6.png", text: "對了，我們想到一個可能知道答案的傢伙。" },
                { speaker: "主角", image: "images/4.png", text: "誰？" },
                { speaker: "蟑螂 C", image: "images/7.png", text: "住在書房裡的一隻獨角仙。" },
                { speaker: "主角", image: "images/4.png", text: "獨角仙？" },
                { speaker: "蟑螂 C", image: "images/7.png", text: "沒錯！牠對昆蟲騎士交流戰的事情非常了解，應該能回答你不少問題。" },
                { speaker: "蟑螂 A", image: "images/6.png", text: "不過……牠的個性有點奇怪。" },
                { speaker: "蟑螂 B", image: "images/5.png", text: "有時候就像個小孩子一樣，精力旺盛，對什麼事情都很有興趣。" },
                { speaker: "蟑螂 C", image: "images/7.png", text: "所以平常很少有昆蟲會主動找牠聊天。" },
                { speaker: "主角", image: "images/4.png", text: "原來如此……" },
                { speaker: "蟑螂 A", image: "images/6.png", text: "如果你想弄清楚自己的狀況，或許可以去書房找牠問問。" },
                { speaker: "蟑螂 B", image: "images/5.png", text: "等一下，我倒是覺得沒必要特地去找牠吧？" },
                { speaker: "主角", image: "images/4.png", text: "為什麼？" },
                { speaker: "蟑螂 B", image: "images/5.png", text: "難得遇到新朋友，不如留下來跟我們三個一起玩啊！" },
                { speaker: "蟑螂 C", image: "images/7.png", text: "對啊！我們可以陪你聊天，也可以一起找食物。這間房子裡的食物夠我們吃上一陣子了。" },
                { speaker: "蟑螂 A", image: "images/6.png", text: "而且那隻獨角仙整天都在講騎士大會，搞不好會很無聊呢。" },
                { speaker: "蟑螂 B", image: "images/5.png", text: "怎麼樣？要不要留下來？" }
            ],

            finalDecision: {
                title: "最後的決定",
                description: "眼前的三隻蟑螂似乎很歡迎主角加入牠們。另一方面，書房裡的獨角仙或許知道更多關於昆蟲騎士交流戰的情報，也可能幫助主角找到變回人類的線索。\n\n主角必須決定接下來的行動。",
                left: {
                    label: "🚪 前往書房",
                    next: "find_beetle",
                    steps: [
                        { speaker: "主角", image: "images/4.png", text: "謝謝你們，不過我還是想去問問那隻獨角仙。" },
                        { speaker: "蟑螂 B", image: "images/5.png", text: "這樣啊……那好吧！" },
                        { speaker: "蟑螂 C", image: "images/7.png", text: "祝你順利喔！" },
                        { speaker: "蟑螂 A", image: "images/6.png", text: "如果有機會，下次再一起聊天吧！" },
                        { speaker: "旁白", text: "主角向三隻蟑螂道別，朝書房的方向前進。" }
                    ]
                },
                right: {
                    label: "留下來與三隻蟑螂一起玩",
                    next: "ending_3",
                    steps: [
                        { speaker: "主角", image: "images/4.png", text: "嗯……好吧，難得有人願意陪我聊天。" },
                        { speaker: "蟑螂 B", image: "images/5.png", text: "太好了！那就一起玩吧！" },
                        { speaker: "蟑螂 C", image: "images/7.png", text: "哈哈哈！今天又有新朋友了！" },
                        { speaker: "旁白", text: "主角決定留在餐桌底下，與三隻蟑螂一起度過時間。至於書房裡的獨角仙，以及騎士大會的事情，主角最終沒有再去了解。" }
                    ]
                }
            }
        }
    },

    find_beetle: {
        chapter: "第二章・怪異的學者",
        title: "書房的陰影",
        description: "你穿過門縫進入了書房，周圍堆滿了巨大如山丘般的書籍……\n\n（獨角仙劇情待續）",
        image: "images/8.png",
        left: { label: "↻ 返回開頭測試", next: "start" },
        right: { label: "↻ 返回開頭測試", next: "start" }
    }
};

    /* =================================
   5. 多階段對話流程
================================= */
function renderDialogueFlow(data) {
    const flow = data.dialogueFlow;
    if (!flow) return;

    preloadDialogueSpeakerImages(flow);

    currentDialogueIndex = 0;
    currentDialogueFlow = {
        data,
        flow,
        card: null,
        mode: "reading",
        steps: [],
        stepIndex: 0,
        segments: [],
        segmentIndex: 0,
        heading: "",
        onComplete: null,
        topicIndex: 0,
        choices: null
    };

    isAnimating = false;
    awakeStage = 0;

    const card = document.createElement("div");
    card.className = "story-card";
    card.innerHTML = `
        <div class="card-image dialogue-image">
            <div class="dialogue-portrait"></div>
            <span>[ 對話角色圖像預留區 ]</span>
        </div>
        <div class="card-content">
            <h2></h2>
            <p></p>
        </div>
        <div class="swipe-hint hint-left"></div>
        <div class="swipe-hint hint-right"></div>
    `;

    currentDialogueFlow.card = card;
    viewport.appendChild(card);
    bindDialogPressFeedback(card);

    card.addEventListener("click", () => {
        const session = currentDialogueFlow;
        if (!session || session.card !== card || isDragging) return;
        if (session.mode !== "reading") return;

        if (isAnimating && typingTimer) {
            finishCurrentDialogueTyping();
            return;
        }

        if (isAnimating) return;
        advanceDialogueSequence();
    });

    bindCardEvents(card);

    playDialogueSequence(flow.intro, "初次接觸", () => {
        setupTopicChoice(0);
    });
}

function playDialogueSequence(steps, heading, onComplete) {
    const session = currentDialogueFlow;
    if (!session) return;

    session.mode = "reading";
    session.steps = Array.isArray(steps) ? steps : [];
    session.stepIndex = 0;
    session.segments = [];
    session.segmentIndex = 0;
    session.heading = heading || "對話";
    session.onComplete = onComplete || null;
    session.choices = null;

    currentDialogueIndex = 0;
    awakeStage = 0;
    isAnimating = false;

    const leftHint = session.card.querySelector(".hint-left");
    const rightHint = session.card.querySelector(".hint-right");
    leftHint.textContent = "";
    rightHint.textContent = "";
    leftHint.style.opacity = 0;
    rightHint.style.opacity = 0;

    if (session.steps.length === 0) {
        finishDialogueSequence();
        return;
    }

    renderCurrentDialogueStep();
}

function stopDialoguePortraitTalk(card) {
    if (!card) return;
    const portraitEl = card.querySelector(".dialogue-portrait");
    if (!portraitEl) return;
    portraitEl.classList.remove("is-talking", "mouth-open");
}

function renderCurrentDialogueStep() {
    const session = currentDialogueFlow;
    if (!session || !session.card) return;

    const step = session.steps[session.stepIndex];
    if (!step) return;

    const card = session.card;
    const imageArea = card.querySelector(".card-image");
    const portraitEl = imageArea.querySelector(".dialogue-portrait");
    const spanArea = imageArea.querySelector("span");
    const titleEl = card.querySelector("h2");

    const imagePath = step.image || DIALOGUE_SPEAKER_IMAGES[step.speaker] || "";

    imageArea.style.transition = "none";
    imageArea.style.animation = "none";
    imageArea.classList.remove("full-screen", "blackout", "blurred", "clear");
    imageArea.dataset.speaker = step.speaker || "";

    portraitEl.classList.remove("is-spritesheet", "is-talking", "mouth-open", "is-idle");

    if (imagePath) {
        portraitEl.style.display = "block";
        portraitEl.style.backgroundImage = `url("${imagePath}")`;
        if (spanArea) spanArea.style.display = "none";

        const cachedImg = cacheDialogueImage(imagePath);
        const applySpriteFlag = () => {
            if (cachedImg.naturalWidth > cachedImg.naturalHeight) {
                portraitEl.classList.add("is-spritesheet");
            }
        };
        if (cachedImg.complete && cachedImg.naturalWidth > 0) {
            applySpriteFlag();
        } else {
            cachedImg.addEventListener("load", applySpriteFlag, { once: true });
        }

        portraitEl.classList.add("is-idle");
    } else {
        portraitEl.style.display = "none";
        portraitEl.style.backgroundImage = "none";
        if (spanArea) {
            spanArea.style.display = "block";
            spanArea.textContent = step.speaker === "旁白"
                ? "[ 旁白畫面預留區 ]"
                : `[ ${step.speaker || "角色"} 特寫圖片預留區 ]`;
        }
    }

    titleEl.textContent = session.heading;

    // 將對話內容依 \n 拆成多段字幕，讓玩家點擊卡片逐句切換
    const rawText = step.text || "";
    const parsedSegments = rawText
        .split("\n")
        .map(seg => seg.trim())
        .filter(seg => seg.length > 0);

    session.segments = parsedSegments.length > 0 ? parsedSegments : [""];
    session.segmentIndex = 0;

    typeCurrentDialogueSegment();
}

function typeCurrentDialogueSegment() {
    const session = currentDialogueFlow;
    if (!session || !session.card) return;

    const step = session.steps[session.stepIndex];
    if (!step) return;

    const card = session.card;
    const portraitEl = card.querySelector(".dialogue-portrait");
    const descEl = card.querySelector("p");
    const imagePath = step.image || DIALOGUE_SPEAKER_IMAGES[step.speaker] || "";

    if (imagePath && portraitEl) {
        portraitEl.classList.add("is-talking");
    }

    isAnimating = true;

    const currentSegment = session.segments[session.segmentIndex] || "";
    const prefix = `${step.speaker}：\n`;
    const fullMessage = `${prefix}${currentSegment}`;

    typeText(
        descEl,
        fullMessage,
        24,
        () => {
            isAnimating = false;
            stopDialoguePortraitTalk(card);
        },
        (ch, charIdx) => {
            if (charIdx < prefix.length) return;

            const spokenIdx = charIdx - prefix.length;
            if (/[，。！？、…；：「」\s]/.test(ch)) {
                if (portraitEl) portraitEl.classList.remove("mouth-open");
            } else if (spokenIdx % 2 === 0) {
                if (portraitEl) portraitEl.classList.toggle("mouth-open");
                playSpeakerBlip(step.speaker);
            }
        }
    );
}

function finishCurrentDialogueTyping() {
    const session = currentDialogueFlow;
    if (!session || session.mode !== "reading" || !typingTimer) return;

    clearInterval(typingTimer);
    typingTimer = null;

    const step = session.steps[session.stepIndex];
    const currentSegment = session.segments[session.segmentIndex] || "";
    session.card.querySelector("h2").textContent = session.heading;
    const descEl = session.card.querySelector("p");
    descEl.textContent = `${step.speaker}：\n${currentSegment}`;
    descEl.classList.remove("typing-cursor");

    stopDialoguePortraitTalk(session.card);
    isAnimating = false;
}

function advanceDialogueSequence() {
    const session = currentDialogueFlow;
    if (!session || session.mode !== "reading" || isAnimating) return;

    // 同一句對話裡還有 \n 分隔的下一段時，先切換字幕、保留同一張立繪
    if (session.segmentIndex < session.segments.length - 1) {
        session.segmentIndex++;
        typeCurrentDialogueSegment();
        return;
    }

    if (session.stepIndex < session.steps.length - 1) {
        session.stepIndex++;
        currentDialogueIndex = session.stepIndex;
        renderCurrentDialogueStep();
    } else {
        finishDialogueSequence();
    }
}

function finishDialogueSequence() {
    const session = currentDialogueFlow;
    if (!session) return;

    const callback = session.onComplete;
    session.onComplete = null;
    isAnimating = false;
    awakeStage = 0;

    if (callback) callback();
}

function setupTopicChoice(topicIndex) {
    const session = currentDialogueFlow;
    if (!session) return;

    const topic = session.flow.topics[topicIndex];
    if (!topic) {
        playDialogueSequence(session.flow.finalSteps, "獨角仙情報", setupFinalDecision);
        return;
    }

    session.topicIndex = topicIndex;
    setupDialogueChoice(
        "topic-choice",
        topic.title,
        topic.prompt || "你想向三隻蟑螂詢問哪件事？",
        topic.left,
        topic.right
    );
}

function setupFinalDecision() {
    const session = currentDialogueFlow;
    if (!session) return;

    const decision = session.flow.finalDecision;
    setupDialogueChoice(
        "final-choice",
        decision.title,
        decision.description,
        decision.left,
        decision.right
    );
}

function setupDialogueChoice(mode, title, description, leftChoice, rightChoice) {
    const session = currentDialogueFlow;
    if (!session) return;

    session.mode = mode;
    session.choices = {
        left: leftChoice,
        right: rightChoice
    };

    isAnimating = false;
    awakeStage = 2;

    const card = session.card;
    card.querySelector("h2").textContent = title || "做出選擇";
    card.querySelector("p").textContent = description || "請選擇接下來的行動。";

    const imageArea = card.querySelector(".card-image");
    const portraitEl = imageArea.querySelector(".dialogue-portrait");
    if (portraitEl) {
        portraitEl.style.display = "none";
        portraitEl.style.backgroundImage = "none";
        portraitEl.classList.remove("is-talking", "is-idle", "mouth-open", "is-spritesheet");
    }

    const spanArea = imageArea.querySelector("span");
    if (spanArea) {
        spanArea.style.display = "block";
        spanArea.textContent = "[ 左右滑動做出選擇 ]";
    }

    const leftHint = card.querySelector(".hint-left");
    const rightHint = card.querySelector(".hint-right");
    leftHint.textContent = leftChoice ? `← ${leftChoice.label}` : "";
    rightHint.textContent = rightChoice ? `${rightChoice.label} →` : "";
    leftHint.style.opacity = 0;
    rightHint.style.opacity = 0;
}

function animateDialogueCard(direction, onComplete) {
    const session = currentDialogueFlow;
    if (!session || !session.card) return;

    isAnimating = true;
    awakeStage = 0;

    const card = session.card;
    const exitDirection = direction === "left" ? -1 : 1;
    const exitX = window.innerWidth + card.offsetWidth;

    card.style.transition = "transform 0.4s cubic-bezier(0.4, 0, 1, 1)";
    card.style.transform = `translate3d(${exitX * exitDirection}px, 0, 0) rotate(${exitDirection * 25}deg)`;
    
    animationTimer = setTimeout(() => {
        card.style.transition = "none";
        card.style.transform = "translate3d(0, 0, 0) rotate(0deg)";
        card.querySelector(".hint-left").style.opacity = 0;
        card.querySelector(".hint-right").style.opacity = 0;
        currentX = 0;
        card.offsetHeight;
        card.style.transition = "";

        if (onComplete) onComplete();
    }, 400);
}

function handleDialogueFlowChoice(direction) {
    const session = currentDialogueFlow;
    if (!session || (session.mode !== "topic-choice" && session.mode !== "final-choice")) return;

    const choice = session.choices && session.choices[direction];
    if (!choice) return;

    const selectedMode = session.mode;
    animateDialogueCard(direction, () => {
        if (selectedMode === "topic-choice") {
            const topic = session.flow.topics[session.topicIndex];
            playDialogueSequence(choice.steps, topic.title, () => {
                const nextTopicIndex = session.topicIndex + 1;
                if (nextTopicIndex < session.flow.topics.length) {
                    setupTopicChoice(nextTopicIndex);
                } else {
                    playDialogueSequence(session.flow.finalSteps, "獨角仙情報", setupFinalDecision);
                }
            });
            return;
        }

        playDialogueSequence(
            choice.steps,
            direction === "left" ? "前往書房" : "留下來與三隻蟑螂一起玩",
            () => {
                currentCardId = choice.next;
                currentDialogueFlow = null;
                renderCard();
            }
        );
    });
}