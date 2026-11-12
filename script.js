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

    // 結局 3：選擇留下來與三隻蟑螂相處
    ending_3: {
        chapter: "終章・新的朋友",
        title: "【結局3：新的朋友】",
        description: "",
        ending: true
    },

    // 4. 初次接觸、五個話題、獨角仙情報與最後決策
    talk_to_bugs: {
        chapter: "第一章・騎士的宿命",
        dialogueFlow: {
            // 第一階段：主角主動上前搭話
            intro: [
                { speaker: "主角", image: "images/4.png", text: "那個……不好意思。" },
                { speaker: "蟑螂 A", image: "images/bug_a.png", text: "嗯？怎麼了？" },
                { speaker: "蟑螂 B", image: "images/bug_b.png", text: "等一下……你是誰啊？" },
                { speaker: "蟑螂 C", image: "images/bug_c.png", text: "好大隻……" },
                { speaker: "主角", image: "images/4.png", text: "啊……抱歉，嚇到你們了嗎？" },
                { speaker: "蟑螂 A", image: "images/bug_a.png", text: "倒也不是，只是很少看到這麼大的蟑螂。" },
                { speaker: "蟑螂 B", image: "images/bug_b.png", text: "而且你的顏色也不太一樣，怎麼會是白色的？" },
                { speaker: "主角", image: "images/4.png", text: "這個嘛……其實我也不太清楚。" },
                { speaker: "蟑螂 A", image: "images/bug_a.png", text: "你也不知道？" },
                { speaker: "主角", image: "images/4.png", text: "嗯……所以我才想問問你們，有沒有看過跟我一樣的情況。" },
                { speaker: "蟑螂 A", image: "images/bug_a.png", text: "這樣啊。那你想知道什麼？" }
            ],

            // 第二階段：五個話題。每個話題選一側，完成後必定進入下一個話題。
            // 不顯示話題進度，也不會因選擇左右而跳過其他話題。
            topics: [
                {
                    title: "關於主角的變身",
                    prompt: "你想向三隻蟑螂詢問哪件事？",
                    left: {
                        label: "詢問變身原因",
                        steps: [
                            { speaker: "主角", image: "images/protagonist.png", text: "你們知道我為什麼會變成這樣嗎？" },
                            { speaker: "蟑螂 A", image: "images/bug_a.png", text: "這個嘛……我們也不清楚。" },
                            { speaker: "蟑螂 B", image: "images/bug_b.png", text: "突然變成蟑螂，還變得這麼大，確實很奇怪。" },
                            { speaker: "蟑螂 C", image: "images/bug_c.png", text: "說不定你是遇到什麼特別的事情了？" },
                            { speaker: "主角", image: "images/protagonist.png", text: "我也不知道……早上醒來的時候，就已經變成這個樣子了。" },
                            { speaker: "蟑螂 A", image: "images/bug_a.png", text: "那你真的什麼都不記得了？" },
                            { speaker: "主角", image: "images/protagonist.png", text: "嗯，完全沒有頭緒。" }
                        ]
                    },
                    right: {
                        label: "詢問巨大蟑螂",
                        steps: [
                            { speaker: "主角", image: "images/protagonist.png", text: "你們有看過跟我一樣巨大的蟑螂嗎？" },
                            { speaker: "蟑螂 B", image: "images/bug_b.png", text: "沒有喔！至少我從來沒看過。" },
                            { speaker: "蟑螂 C", image: "images/bug_c.png", text: "一般蟑螂可沒有你這麼大的身體。" },
                            { speaker: "蟑螂 A", image: "images/bug_a.png", text: "而且你的身體還是白色的，看起來也很不一樣。" },
                            { speaker: "主角", image: "images/protagonist.png", text: "這樣啊……" },
                            { speaker: "蟑螂 B", image: "images/bug_b.png", text: "所以我們才會對你這麼好奇嘛！" }
                        ]
                    }
                },
                {
                    title: "關於變回人類",
                    prompt: "你想向三隻蟑螂詢問哪件事？",
                    left: {
                        label: "詢問變回人類",
                        steps: [
                            { speaker: "主角", image: "images/protagonist.png", text: "有沒有什麼辦法能讓我變回人類？" },
                            { speaker: "蟑螂 A", image: "images/bug_a.png", text: "變回人類？原來你想要變回原本的樣子啊。" },
                            { speaker: "蟑螂 B", image: "images/bug_b.png", text: "這個我們真的不知道……畢竟沒遇過這種事情。" },
                            { speaker: "蟑螂 C", image: "images/bug_c.png", text: "不過，如果你想找出解決方法，或許可以去參加昆蟲騎士交流戰。" },
                            { speaker: "主角", image: "images/protagonist.png", text: "昆蟲騎士交流戰？" },
                            { speaker: "蟑螂 A", image: "images/bug_a.png", text: "嗯，這是昆蟲世界裡很重要的活動。" }
                        ]
                    },
                    right: {
                        label: "詢問如何生活",
                        steps: [
                            { speaker: "主角", image: "images/protagonist.png", text: "如果一直維持這個樣子，我該怎麼辦？" },
                            { speaker: "蟑螂 B", image: "images/bug_b.png", text: "這個嘛……首先，你得先習慣現在的身體吧？" },
                            { speaker: "蟑螂 C", image: "images/bug_c.png", text: "而且你現在的體型，跟一般蟑螂差太多了。" },
                            { speaker: "蟑螂 A", image: "images/bug_a.png", text: "如果想在昆蟲世界生活，可能還有很多事情需要學習。" },
                            { speaker: "主角", image: "images/protagonist.png", text: "……聽起來好麻煩。" },
                            { speaker: "蟑螂 B", image: "images/bug_b.png", text: "哈哈，慢慢來嘛！" }
                        ]
                    }
                },
                {
                    title: "關於這間房子",
                    prompt: "你想向三隻蟑螂詢問哪件事？",
                    left: {
                        label: "詢問打掃情況",
                        steps: [
                            { speaker: "主角", image: "images/protagonist.png", text: "你們剛剛說，這裡的主人最近都不打掃？" },
                            { speaker: "蟑螂 A", image: "images/bug_a.png", text: "對啊！最近這裡真的很適合生活。" },
                            { speaker: "蟑螂 B", image: "images/bug_b.png", text: "以前可沒這麼容易找到食物呢！" },
                            { speaker: "蟑螂 C", image: "images/bug_c.png", text: "最近連一些角落都能找到不少東西。" },
                            { speaker: "主角", image: "images/protagonist.png", text: "……這樣啊。" },
                            { speaker: "蟑螂 A", image: "images/bug_a.png", text: "怎麼了？你看起來好像知道些什麼？" },
                            { speaker: "主角", image: "images/protagonist.png", text: "沒有，只是覺得這裡有點熟悉。" }
                        ]
                    },
                    right: {
                        label: "詢問原本住戶",
                        steps: [
                            { speaker: "主角", image: "images/protagonist.png", text: "你們知道這間房子原本住著哪些人嗎？" },
                            { speaker: "蟑螂 B", image: "images/bug_b.png", text: "這個嘛，我們平常只在這裡活動。" },
                            { speaker: "蟑螂 C", image: "images/bug_c.png", text: "不太清楚房子裡原本住著哪些人。" },
                            { speaker: "蟑螂 A", image: "images/bug_a.png", text: "不過，最近好像很少看到有人活動的樣子。" },
                            { speaker: "主角", image: "images/protagonist.png", text: "……原來如此。" }
                        ]
                    }
                },
                {
                    title: "關於昆蟲騎士交流戰",
                    prompt: "你想向三隻蟑螂詢問哪件事？",
                    left: {
                        label: "詢問交流戰內容",
                        steps: [
                            { speaker: "主角", image: "images/protagonist.png", text: "你們剛剛說的騎士交流戰是什麼？" },
                            { speaker: "蟑螂 A", image: "images/bug_a.png", text: "昆蟲騎士交流戰啊！每一屆都會有不同種類的昆蟲派出代表參加。" },
                            { speaker: "蟑螂 B", image: "images/bug_b.png", text: "像我們蟑螂，也會有自己的代表。" },
                            { speaker: "蟑螂 C", image: "images/bug_c.png", text: "那可是很重要的活動呢！" },
                            { speaker: "主角", image: "images/protagonist.png", text: "所以你們也會參加嗎？" },
                            { speaker: "蟑螂 A", image: "images/bug_a.png", text: "我們只是一般平民，沒辦法知道騎士會議的詳細內容。" }
                        ]
                    },
                    right: {
                        label: "詢問代表身分",
                        steps: [
                            { speaker: "主角", image: "images/protagonist.png", text: "你們為什麼覺得我是蟑螂代表？" },
                            { speaker: "蟑螂 A", image: "images/bug_a.png", text: "主要是因為你的體型實在太特殊了。" },
                            { speaker: "蟑螂 B", image: "images/bug_b.png", text: "再加上你突然出現在這裡，確實讓人很難不往那方面想。" },
                            { speaker: "蟑螂 C", image: "images/bug_c.png", text: "不過這也只是我們的猜測啦！" },
                            { speaker: "主角", image: "images/protagonist.png", text: "所以你們也不能確定？" },
                            { speaker: "蟑螂 A", image: "images/bug_a.png", text: "沒錯，真正的事情還是得找了解騎士大會的人問問看。" }
                        ]
                    }
                },
                {
                    title: "尋找能夠幫助主角的人",
                    prompt: "你想向三隻蟑螂詢問哪件事？",
                    left: {
                        label: "詢問誰了解騎士大會",
                        steps: [
                            { speaker: "主角", image: "images/protagonist.png", text: "你們知道誰比較了解騎士大會嗎？" },
                            { speaker: "蟑螂 B", image: "images/bug_b.png", text: "有啊！另一間房間裡就有一個傢伙。" },
                            { speaker: "主角", image: "images/protagonist.png", text: "誰？" },
                            { speaker: "蟑螂 C", image: "images/bug_c.png", text: "一隻獨角仙。" },
                            { speaker: "蟑螂 A", image: "images/bug_a.png", text: "牠對騎士大會非常了解，應該能回答你不少問題。" }
                        ]
                    },
                    right: {
                        label: "詢問去哪裡找線索",
                        steps: [
                            { speaker: "主角", image: "images/protagonist.png", text: "我應該去哪裡找線索？" },
                            { speaker: "蟑螂 A", image: "images/bug_a.png", text: "如果是騎士大會的事情，最好還是找了解內情的人。" },
                            { speaker: "蟑螂 B", image: "images/bug_b.png", text: "我們知道另一間房間裡有一隻獨角仙。" },
                            { speaker: "蟑螂 C", image: "images/bug_c.png", text: "牠在那邊待了一段時間，對騎士大會的事情知道得很多。" }
                        ]
                    }
                }
            ],

            // 第三階段：五個話題全部完成後，播放獨角仙情報與挽留對話
            finalSteps: [
                { speaker: "蟑螂 B", image: "images/bug_b.png", text: "如果你想知道騎士大會的事情，可以去書房找一隻獨角仙。" },
                { speaker: "主角", image: "images/protagonist.png", text: "獨角仙？" },
                { speaker: "蟑螂 C", image: "images/bug_c.png", text: "沒錯！牠對騎士大會非常了解，應該能回答你不少問題。" },
                { speaker: "蟑螂 A", image: "images/bug_a.png", text: "不過……牠的個性有點奇怪。" },
                { speaker: "蟑螂 B", image: "images/bug_b.png", text: "有時候就像個小孩子一樣，精力旺盛，對什麼事情都很有興趣。" },
                { speaker: "蟑螂 C", image: "images/bug_c.png", text: "所以平常很少有昆蟲會主動找牠聊天。" },
                { speaker: "主角", image: "images/protagonist.png", text: "原來如此……" },
                { speaker: "蟑螂 A", image: "images/bug_a.png", text: "如果你想知道更多，可以去書房找牠看看。" },
                { speaker: "蟑螂 B", image: "images/bug_b.png", text: "等一下，我倒是覺得沒必要特地去找牠吧？" },
                { speaker: "主角", image: "images/protagonist.png", text: "為什麼？" },
                { speaker: "蟑螂 B", image: "images/bug_b.png", text: "難得遇到新朋友，還不如留下來跟我們一起啊！" },
                { speaker: "蟑螂 C", image: "images/bug_c.png", text: "對啊！我們三個也可以陪你一起找食物，這間房子的庫子夠我們吃一輩子。" },
                { speaker: "蟑螂 A", image: "images/bug_a.png", text: "而且那隻獨角仙整天都在講騎士大會，搞不好會很無聊呢。" },
                { speaker: "蟑螂 B", image: "images/bug_b.png", text: "怎麼樣？要不要留下來？" }
            ],

            // 第四階段：最後決策與各自的告別對話
            finalDecision: {
                title: "最後的決定",
                description: "眼前的三隻蟑螂似乎很歡迎主角加入牠們。另一方面，書房裡的獨角仙或許知道更多關於騎士大會的情報。\n\n主角必須決定接下來的行動。",
                left: {
                    label: "🚪 前往書房",
                    next: "find_beetle",
                    steps: [
                        { speaker: "主角", image: "images/protagonist.png", text: "謝謝你們，不過我還是想去問問那隻獨角仙。" },
                        { speaker: "蟑螂 B", image: "images/bug_b.png", text: "這樣啊……那好吧！" },
                        { speaker: "蟑螂 C", image: "images/bug_c.png", text: "祝你順利喔！" },
                        { speaker: "蟑螂 A", image: "images/bug_a.png", text: "如果有機會，下次再一起聊天吧！" },
                        { speaker: "旁白", text: "主角向三隻蟑螂道別，朝書房的方向前進。" }
                    ]
                },
                right: {
                    label: "留下來與三隻蟑螂一起玩",
                    next: "ending_3",
                    steps: [
                        { speaker: "主角", image: "images/protagonist.png", text: "嗯……好吧，難得有人願意陪我聊天。" },
                        { speaker: "蟑螂 B", image: "images/bug_b.png", text: "太好了！那就一起玩吧！" },
                        { speaker: "蟑螂 C", image: "images/bug_c.png", text: "哈哈哈！今天又有新朋友了！" },
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
let awakeStage = 0; // 0: 尚未開始字幕, 1: 圖片已清晰, 2: 字幕閱讀流程已開始（是否可滑卡另由 canUseSwipe() 判斷）
let startX = 0, startY = 0;
let currentX = 0, currentY = 0;
const SWIPE_THRESHOLD = 120;
let animationTimer = null;
let typingTimer = null;
let currentDialogueIndex = 0;
let currentDialogueFlow = null; // 目前進行中的多階段對話狀態

// 對話角色特寫圖：每句台詞會依 speaker 自動切換到對應角色圖片。
// 若某一句需要使用不同表情或角度，可在該句資料中加入 image: "images/xxx.png" 覆蓋預設圖片。
const DIALOGUE_SPEAKER_IMAGES = {
    "主角": "images/protagonist.png",
    "蟑螂 A": "images/bug_a.png",
    "蟑螂 B": "images/bug_b.png",
    "蟑螂 C": "images/bug_c.png"
};

// 預先載入並保留角色圖片物件，降低對話逐句切換時等待圖片載入的時間。
const DIALOGUE_IMAGE_CACHE = {};
function preloadDialogueSpeakerImages() {
    Object.values(DIALOGUE_SPEAKER_IMAGES).forEach((imagePath) => {
        if (DIALOGUE_IMAGE_CACHE[imagePath]) return;
        const preloadImage = new Image();
        preloadImage.src = imagePath;
        DIALOGUE_IMAGE_CACHE[imagePath] = preloadImage;
    });
}

// 文字分段控制
let currentTextSegments = [];  // 儲存目前劇情切割後的文字段落
let currentTextSegmentIndex = 0; // 紀錄目前顯示到第幾段

const viewport = document.getElementById("game-viewport");
const chapterName = document.getElementById("chapter-name");
const gameOver = document.getElementById("game-over");


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

    // 強行重置動畫與拖曳狀態，避免換關卡死
    isAnimating = false;
    isDragging = false;

    viewport.innerHTML = "";
    chapterName.textContent = data.chapter || "";

    // 結局卡片交由獨立函式處理
    if (data.ending) {
        renderEndingFlow(data);
        return;
    }

    gameOver.hidden = true;
    awakeStage = 0;

    // 重置文字分段進度
    currentTextSegments = [];
    currentTextSegmentIndex = 0;

    // 對話卡片交由獨立函式處理
    if (data.dialogueFlow) {
        renderDialogueFlow(data);
        return;
    }

    const card = document.createElement("div");
    card.className = "story-card waiting-click";

    const visualClass = (currentCardId === "start")
        ? "full-screen blackout"
        : "full-screen blurred";

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

    // 設定劇情圖片
    if (data.image && data.image.trim() !== "") {
        imageArea.style.backgroundImage = `url("${data.image}")`;

        if (spanArea) {
            spanArea.style.display = "none";
        }
    } else {
        imageArea.style.backgroundImage = "none";

        if (spanArea) {
            spanArea.style.display = "block";
            spanArea.textContent = `[ 圖片預留區：${data.title} ]`;
        }
    }

    // 設定左右選項提示
    const leftHint = card.querySelector(".hint-left");
    const rightHint = card.querySelector(".hint-right");

    leftHint.textContent = data.left
        ? "← " + data.left.label
        : "";

    rightHint.textContent = data.right
        ? data.right.label + " →"
        : "";

    viewport.appendChild(card);

    // =================================
    // 卡片點擊控制
    // =================================
    card.addEventListener("click", function handleCardClick() {

        if (isDragging) return;

        // 【快轉功能】
        // 打字中點擊，直接顯示目前段落的完整文字
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

        // =================================
        // 階段 0 ➔ 第一次點擊：圖片顯影
        // =================================
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

        // =================================
        // 階段 1 ➔ 第二次點擊：開始字幕動畫
        // =================================
        if (awakeStage === 1 && !isAnimating) {
            card.classList.remove("waiting-click");

            const wakeHint = card.querySelector(".wake-hint");

            if (wakeHint) {
                wakeHint.style.display = "none";
            }

            // 將劇情拆分成多個閱讀段落
            currentTextSegments = splitTextIntoSegments(
                data.description || ""
            );

            currentTextSegmentIndex = 0;

            triggerAwakeAnimation(card, data);

            return;
        }

        // =================================
        // 階段 2 ➔ 點擊卡片：閱讀下一段
        // =================================
        if (awakeStage === 2 && !isAnimating) {

            // 確認是否還有下一段
            if (currentTextSegmentIndex < currentTextSegments.length - 1) {

                currentTextSegmentIndex++;
                isAnimating = true;

                const descEl = card.querySelector("p");

                // 輸出下一段文字
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

    // =================================
    // 綁定原本的卡片拖曳與左右滑動功能
    // =================================
    bindCardEvents(card);

}


/* =================================
   4. 字幕上升動畫與打字流程
================================= */

/* =================================
   劇情文字自動分段工具
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

            // 優先尋找標點符號，避免切斷語意
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

            // 只輸出目前的第一段文字
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
   5. 多階段對話流程
================================= */

// 建立對話卡，並從「主角主動搭話」開始播放。
function renderDialogueFlow(data) {
    const flow = data.dialogueFlow;
    if (!flow) return;

    // 對話開始前先載入四位角色的特寫圖，讓後續切換更即時。
    preloadDialogueSpeakerImages();

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

    // 對話期間點擊只負責快轉或閱讀下一句；選擇階段則由左右滑動／方向鍵決定。
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

    // 一開始先綁定一次。閱讀階段 awakeStage = 0，不會誤觸左右滑動；
    // 進入選擇階段後 awakeStage = 2，原本的滑卡功能便會啟用。
    bindCardEvents(card);

    playDialogueSequence(flow.intro, "初次接觸", () => {
        setupTopicChoice(0);
    });
}

// 播放指定的一組對話句子。
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

// 顯示目前句子：每切換一句，就立即切換到正在說話角色的特寫圖。
// 對話圖片不使用一般劇情卡的慢速顯影／開場動畫；圖片直接切換，字幕仍維持打字效果。
function renderCurrentDialogueStep() {
    const session = currentDialogueFlow;
    if (!session || !session.card) return;

    const step = session.steps[session.stepIndex];
    if (!step) return;

    const card = session.card;
    const imageArea = card.querySelector(".card-image");
    const spanArea = imageArea.querySelector("span");
    const titleEl = card.querySelector("h2");
    const descEl = card.querySelector("p");

    // 單句 step.image 可指定特殊表情／角度；未指定時依角色名稱套用預設特寫圖。
    const imagePath = step.image || DIALOGUE_SPEAKER_IMAGES[step.speaker] || "";

    // 強制取消圖片區可能繼承到的慢速過場，讓每句台詞切換時立即換圖。
    imageArea.style.transition = "none";
    imageArea.style.animation = "none";
    imageArea.classList.remove("full-screen", "blackout", "blurred", "clear");
    imageArea.dataset.speaker = step.speaker || "";

    if (imagePath) {
        imageArea.style.backgroundImage = `url("${imagePath}")`;
        if (spanArea) spanArea.style.display = "none";
    } else {
        imageArea.style.backgroundImage = "none";
        if (spanArea) {
            spanArea.style.display = "block";
            spanArea.textContent = step.speaker === "旁白"
                ? "[ 旁白畫面預留區 ]"
                : `[ ${step.speaker || "角色"} 特寫圖片預留區 ]`;
        }
    }

    titleEl.textContent = session.heading;
    isAnimating = true;
    typeText(descEl, `${step.speaker}：\n${step.text}`, 20, () => {
        isAnimating = false;
    });
}

// 打字尚未結束時，點擊卡片會直接顯示目前整句，不會跳到下一句。
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

    isAnimating = false;
}

// 一句播放完畢後，點擊即可閱讀下一句；整組完成才執行階段切換。
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

// 顯示話題選擇。五個話題各自只選一條對話，但選完一定會進入下一個話題。
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

// 顯示最後決策。
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

// 共用左右選擇畫面。
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

    // 選擇畫面不沿用上一位角色的肖像，避免圖片與目前內容錯配。
    const imageArea = card.querySelector(".card-image");
    imageArea.style.backgroundImage = "none";
    const spanArea = imageArea.querySelector("span");
    if (spanArea) {
        spanArea.style.display = "block";
        spanArea.textContent = "[ 請選擇對話方向 ]";
    }

    const leftHint = card.querySelector(".hint-left");
    const rightHint = card.querySelector(".hint-right");
    leftHint.textContent = leftChoice ? `← ${leftChoice.label}` : "";
    rightHint.textContent = rightChoice ? `${rightChoice.label} →` : "";
    leftHint.style.opacity = 0;
    rightHint.style.opacity = 0;
}

// 對話選項的卡片滑出動畫。動畫結束後在同一張卡片載入下一組台詞。
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
        card.offsetHeight; // 強制套用歸位狀態，再恢復原本的 CSS transition。
        card.style.transition = "";

        if (onComplete) onComplete();
    }, 400);
}

// 處理五個話題與最後決策的左右選擇。
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
                    // 五個話題全部完成後，才會進入獨角仙情報與挽留階段。
                    playDialogueSequence(session.flow.finalSteps, "獨角仙情報", setupFinalDecision);
                }
            });
            return;
        }

        // 最後決策的對話完整播放後，才進入書房或結局 3。
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
   7. 卡片拖曳與手勢處理（徹底防手機卡死版）
================================= */
// 統一判斷目前是否真的可以使用左右滑卡。
// 一般劇情卡：必須讀完所有字幕段落，而且目前沒有打字動畫。
// 多階段對話卡：只有進入話題選擇或最後決策畫面時才能滑動。
function canUseSwipe() {
    if (isAnimating || awakeStage < 2) return false;

    if (currentDialogueFlow) {
        return currentDialogueFlow.mode === "topic-choice" ||
               currentDialogueFlow.mode === "final-choice";
    }

    const data = STORY_DATA[currentCardId];
    if (!data || data.ending) return false;

    // 只要還有任何未顯示的字幕段落，就禁止滑卡跳過劇情。
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

        // 安全鎖定指針
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

        // 若拖曳期間閱讀狀態已改變，取消本次滑動，不執行選擇。
        if (!canUseSwipe()) {
            card.classList.remove("dragging");
            returnCard(card);
            return;
        }

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
    if (!canUseSwipe()) return;

    // 對話流程中的話題選擇／最後決策，交由專用流程處理。
    if (currentDialogueFlow &&
        (currentDialogueFlow.mode === "topic-choice" || currentDialogueFlow.mode === "final-choice")) {
        handleDialogueFlowChoice(direction);
        return;
    }

    const data = STORY_DATA[currentCardId];
    if (!data || data.ending) return;

    const choiceSource = data.decision || data;
    const selectedChoice = choiceSource[direction];
    if (!selectedChoice || !STORY_DATA[selectedChoice.next]) return;

    isAnimating = true;
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
    currentX = 0;
    currentY = 0;
    startX = 0;
    currentDialogueIndex = 0;
    currentDialogueFlow = null;
    currentCardId = "start";
    secretEndingCondition1 = false;
    renderCard();
}

renderCard();