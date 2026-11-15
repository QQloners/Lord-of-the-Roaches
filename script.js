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
                { speaker: "蟑螂 A", image: "images/6.png", text: "倒也不是，只是很少看到這麼大的蟑螂。" },
                { speaker: "蟑螂 B", image: "images/5.png", text: "而且你的顏色也不太一樣，怎麼會是白色的？" },
                { speaker: "主角", image: "images/4.png", text: "這個嘛……其實我也不太清楚。" },
                { speaker: "蟑螂 A", image: "images/6.png", text: "你也不知道？" },
                { speaker: "主角", image: "images/4.png", text: "嗯……所以我才想問問你們，有沒有看過跟我一樣的情況。" },
                { speaker: "蟑螂 A", image: "images/6.png", text: "這樣啊。那你想知道什麼？" }
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
        image: "images/study_room.png",
        left: { label: "↻ 返回開頭測試", next: "start" },
        right: { label: "↻ 返回開頭測試", next: "start" }
    }
};

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
   2-1B. Web Audio 紙質卡片擬音（Inscryption 風格乾燥厚紙卡手感）
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
        // 每次操作加入 ±8% 自然隨機變化，避免聽起來像重複的電子音效
        const jitter = 0.92 + Math.random() * 0.16;

        // 輔助函式：產生無共振峰的乾燥紙張噪音層
        const triggerPaperNoise = ({
            delay = 0,
            duration = 0.04,
            hpFreq = 400,
            lpStart = 1600,
            lpEnd = 1000,
            peakGain = 0.12,
            attack = 0.005,
            smoothness = 0.45
        }) => {
            const startTime = now + delay;
            const bufferSize = Math.max(1, Math.floor(audioCtx.sampleRate * duration));
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);

            // 一階低通平滑雜訊，模擬紙張纖維表面而非刺耳電流聲
            let prev = 0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                prev = prev + smoothness * (white - prev);
                data[i] = prev * 1.6;
            }

            const src = audioCtx.createBufferSource();
            src.buffer = buffer;

            const hp = audioCtx.createBiquadFilter();
            hp.type = "highpass";
            hp.frequency.setValueAtTime(hpFreq * jitter, startTime);
            hp.Q.setValueAtTime(0.5, startTime);

            const lp = audioCtx.createBiquadFilter();
            lp.type = "lowpass";
            lp.Q.setValueAtTime(0.55, startTime);
            lp.frequency.setValueAtTime(lpStart * jitter, startTime);
            lp.frequency.exponentialRampToValueAtTime(Math.max(80, lpEnd * jitter), startTime + duration);

            const gain = audioCtx.createGain();
            gain.gain.setValueAtTime(0.0001, startTime);
            gain.gain.linearRampToValueAtTime(peakGain, startTime + Math.min(attack, duration * 0.4));
            gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

            src.connect(hp);
            hp.connect(lp);
            lp.connect(gain);
            gain.connect(audioCtx.destination);

            src.start(startTime);
            src.stop(startTime + duration);
        };

        if (type === "pick") {
            // 【拿起卡片】1. 厚紙板輕微彎曲的乾燥摩擦 + 2. 牌緣脫離卡堆的極短輕響
            triggerPaperNoise({
                delay: 0,
                duration: 0.032,
                hpFreq: 280,
                lpStart: 1150,
                lpEnd: 780,
                peakGain: 0.14,
                attack: 0.004,
                smoothness: 0.35
            });
            triggerPaperNoise({
                delay: 0.007,
                duration: 0.016,
                hpFreq: 1350,
                lpStart: 3100,
                lpEnd: 2200,
                peakGain: 0.085,
                attack: 0.002,
                smoothness: 0.65
            });
        } else if (type === "swipe") {
            // 【滑開卡片】1. 牌面擦過卡堆的乾燥摩擦聲 + 2. 卡片切開空氣甩出的低頻重量感
            triggerPaperNoise({
                delay: 0,
                duration: 0.115,
                hpFreq: 480,
                lpStart: 1550,
                lpEnd: 920,
                peakGain: 0.16,
                attack: 0.014,
                smoothness: 0.5
            });
            triggerPaperNoise({
                delay: 0.012,
                duration: 0.145,
                hpFreq: 150,
                lpStart: 620,
                lpEnd: 340,
                peakGain: 0.15,
                attack: 0.025,
                smoothness: 0.25
            });
        } else {
            // 【放回卡堆】1. 平拍回桌面的低頻氣墊悶響 + 2. 紙邊貼齊的微弱沙沙聲
            triggerPaperNoise({
                delay: 0,
                duration: 0.044,
                hpFreq: 75,
                lpStart: 310,
                lpEnd: 150,
                peakGain: 0.24,
                attack: 0.003,
                smoothness: 0.2
            });
            triggerPaperNoise({
                delay: 0.009,
                duration: 0.026,
                hpFreq: 750,
                lpStart: 1850,
                lpEnd: 1100,
                peakGain: 0.065,
                attack: 0.004,
                smoothness: 0.5
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
                typeText(
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

function triggerAwakeAnimation(card, data) {
    isAnimating = true;

    const imageArea = card.querySelector(".card-image");
    const titleEl = card.querySelector("h2");
    const descEl = card.querySelector("p");

    imageArea.classList.remove("full-screen");

    setTimeout(() => {
        typeText(titleEl, data.title || "", 50, () => {
            typeText(
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
    const descEl = card.querySelector("p");

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

        portraitEl.classList.add("is-idle", "is-talking");
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
    isAnimating = true;

    const prefix = `${step.speaker}：\n`;
    const fullMessage = `${prefix}${step.text}`;

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
                portraitEl.classList.remove("mouth-open");
            } else if (spokenIdx % 2 === 0) {
                portraitEl.classList.toggle("mouth-open");
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
    session.card.querySelector("h2").textContent = session.heading;
    const descEl = session.card.querySelector("p");
    descEl.textContent = `${step.speaker}：\n${step.text}`;
    descEl.classList.remove("typing-cursor");

    stopDialoguePortraitTalk(session.card);
    isAnimating = false;
}

function advanceDialogueSequence() {
    const session = currentDialogueFlow;
    if (!session || session.mode !== "reading" || isAnimating) return;

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
        const sheenOffset = (currentX / Math.max(card.offsetWidth, 1)) * 150;
        card.style.setProperty("--sheen-x", `${sheenOffset}%`);

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
    card.style.setProperty("--sheen-x", "-120%");
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