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
                { speaker: "主角", image: "images/4.png", text: "那個……不好意思" },
                { speaker: "蟑螂 A", image: "images/6.png", text: "嗯？怎麼了？" },
                { speaker: "蟑螂 B", image: "images/5.png", text: "等一下……你是誰啊？" },
                { speaker: "蟑螂 C", image: "images/7.png", text: "好大隻……" },
                { speaker: "主角", image: "images/4.png", text: "啊……抱歉，嚇到你們了嗎？" },
                { speaker: "蟑螂 A", image: "images/6.png", text: "當然阿!很少看到這麼大的同類...\n等等...\n這算同類嗎?" },
                { speaker: "蟑螂 B", image: "images/5.png", text: "語言相通的話就是同類吧?" },
                { speaker: "主角", image: "images/4.png", text: "這個嘛……其實我也不太清楚" },
                { speaker: "蟑螂 C", image: "images/7.png", text: "拜託~每隻昆蟲說的話都馬相通...\n只是口音不太相近而已..." },
                { speaker: "主角", image: "images/4.png", text: "拜託了\n我真的需要你們的幫忙..." },
                { speaker: "蟑螂 A", image: "images/6.png", text: "好吧...我們盡量幫你\n先介紹一下\n我是他們大哥，左邊這位是老二，右邊是三弟\n但在這之前請讓我問個問題\n你為什麼這麼大隻?" }
            ],

            topics: [
                {
                    title: "關於主角的變身",
                    prompt: "你想向三隻蟑螂詢問哪件事？",
                    left: {
                        label: "說明自己是人類",
                        steps: [
                            { speaker: "主角", image: "images/4.png", text: "我身形會這麼大是因為...\n我原本是人類" },
                            { speaker: "大哥", image: "images/6.png", text: "人類?!\n真的假的？" },
                            { speaker: "老二", image: "images/5.png", text: "雖然很難以置信\n但你體型這麼大確實說得通..." },
                            { speaker: "三弟", image: "images/7.png", text: "天哪...\n你該不會就是住在這房子的那一個人吧..." },
                            { speaker: "主角", image: "images/4.png", text: "噢...\n那應該就是他了...\n但實不相瞞...\n我現在實在想不起來自己以前的樣子" },
                            { speaker: "三弟", image: "images/7.png", text: "什麼意思?" },
                            { speaker: "主角", image: "images/4.png", text: "自己說明有點奇怪\n但我似乎失去記憶了..." },
                            { speaker: "三隻蟑螂", image: "images/7.png", text: "什麼!?" }
                        ]
                    },
                    right: {
                        label: "簡單自我介紹，尋求幫助",
                        steps: [
                            { speaker: "主角", image: "images/4.png", text: "說實話\n我其實是人類，但現在變成了蟑螂" },
                            { speaker: "大哥", image: "images/6.png", text: "!" },
                            { speaker: "老二", image: "images/5.png", text: "可你現在這個樣子...\n我實在很難相信我們是同類" },
                            { speaker: "三弟", image: "images/7.png", text: "對阿...\n一般蟑螂可沒有你這麼大的身體" },
                            { speaker: "大哥", image: "images/6.png", text: "但他確實是巨大版本的蟑螂...\n姑且相信你的話...\n但你怎麼會變成這樣?" },
                            { speaker: "主角", image: "images/4.png", text: "那個...\n我也不知道...\n因為我什麼都不記得了" },
                            { speaker: "三隻蟑螂", image: "images/7.png", text: "..." }
                        ]
                    }
                },
                {
                    title: "關於變回人類",
                    prompt: "你想向三隻蟑螂詢問哪件事？",
                    left: {
                        label: "有無變回人類的方法",
                        steps: [
                            { speaker: "主角", image: "images/4.png", text: "所以我才想問\n你們知不知道變回去的方法?" },
                            { speaker: "大哥", image: "images/6.png", text: "變回人類？\n不...\n這種事我們從來沒想過" },
                            { speaker: "老二", image: "images/5.png", text: "而且即便知道了\n我想在座各位都不會想變成人類吧?" },
                            { speaker: "三隻蟑螂", image: "images/7.png", text: "確實..." },
                            { speaker: "主角", image: "images/4.png", text: "為什麼?" },
                            { speaker: "三弟", image: "images/7.png", text: "你自己說說看當人類有什麼好處?" },
                            { speaker: "主角", image: "images/4.png", text: "...\n等等...這不公平\n我什麼都想不起來阿" },
                            { speaker: "大哥", image: "images/6.png", text: "也許當人類太爛了?\n所以你自己不願想起來?" },
                            { speaker: "主角", image: "images/4.png", text: "...\n不會吧..." }
                        ]
                    },
                    right: {
                        label: "有沒有類似經歷的同類?",
                        steps: [
                            { speaker: "主角", image: "images/4.png", text: "你們沒有看過任何一樣經歷的昆蟲嗎?" },
                            { speaker: "老二", image: "images/5.png", text: "這個嘛...\n沒有親眼看過..." },
                            { speaker: "主角", image: "images/4.png", text: "什麼意思?" },
                            { speaker: "三弟", image: "images/7.png", text: "其實許多蟲類本來就有不少喜歡聲稱自己以前是人類的昆蟲..." },
                            { speaker: "大哥", image: "images/6.png", text: "我以前就會這樣...\n自己也不知道當初怎麼了\n但一段時間過後就不會再說了" },
                            { speaker: "主角", image: "images/4.png", text: "蝦?\n為什麼?" },
                            { speaker: "大哥", image: "images/6.png", text: "不知道\n也許我以前就是喜歡胡言亂語" },
                            { speaker: "老二", image: "images/5.png", text: "你以前確實會" },
                            { speaker: "三弟", image: "images/7.png", text: "但即便大哥以前說自己是人類\n但那時候的身形就跟我們一樣\n哪會像你一樣那麼大隻\n如果說這本來是人類\n倒有幾分可信度" },
                            { speaker: "老二", image: "images/5.png", text: "而且不光是大哥\n放眼望去還有很多其他種類的昆蟲\n偶爾都有一些跳出來說自己本來是人類" },
                            { speaker: "主角", image: "images/4.png", text: "天哪..." }
                        ]
                    }
                },
                {
                    title: "關於這間房子",
                    prompt: "你想向三隻蟑螂詢問哪件事？",
                    left: {
                        label: "是否有其他昆蟲能提供線索?",
                        steps: [
                            { speaker: "主角", image: "images/4.png", text: "難道就沒有其他能提供線索的昆蟲了?" },
                            { speaker: "三弟", image: "images/7.png", text: "這個嘛..." },
                            { speaker: "大哥", image: "images/6.png", text: "倒不是沒有..." },
                            { speaker: "老二", image: "images/5.png", text: "老天爺...\n你們是認真的?\n我可不會推薦那傢伙..." },
                            { speaker: "主角", image: "images/4.png", text: "哪個傢伙...?" },
                            { speaker: "三弟", image: "images/7.png", text: "話說在前頭...\n我也不太推薦他\n但根據你的描述\n他確實能給你一些資訊" },
                            { speaker: "大哥", image: "images/6.png", text: "但可能會受傷\n我們曾經跟他協商想拿食物\n他不但拒絕了，還打傷三弟" },
                            { speaker: "主角", image: "images/4.png", text: "什麼!？" },
                            { speaker: "大哥", image: "images/6.png", text: "老二想幫忙...\n結果就是我們的雙腿都被打斷了..." },
                            { speaker: "主角", image: "images/4.png", text: "這樣的人是能知道什麼資訊!?" },
                            { speaker: "三弟", image: "images/7.png", text: "冷靜點...\n我之所以會認為他能幫你\n是因為他不久前才搬來這裡住\n是一隻從外面世界住進來的昆蟲" },
                            { speaker: "主角", image: "images/4.png", text: "外面世界?" },
                            { speaker: "三弟", image: "images/7.png", text: "對阿...\n他對昆蟲世界的事情知道得比我們多\n特別是**比武大會**..." }
                        ]
                    },
                    right: {
                        label: "這間房子有其他昆蟲在嗎?",
                        steps: [
                            { speaker: "主角", image: "images/4.png", text: "你們知道這間房子還有哪些昆蟲嗎？" },
                            { speaker: "三弟", image: "images/7.png", text: "倒是有一個..." },
                            { speaker: "老二", image: "images/5.png", text: "不!\n我不准你提起那傢伙...\n他打傷你了!" },
                            { speaker: "三弟", image: "images/7.png", text: "可是牠是從外面世界住進來的!\n他肯定知道些什麼..." },
                            { speaker: "主角", image: "images/4.png", text: "打傷?\n發生什麼事了?" },
                            { speaker: "大哥", image: "images/6.png", text: "說來話長...\n但三弟說的沒錯...\n他恐怕真的知道些什麼..." },
                            { speaker: "老二", image: "images/5.png", text: "你們想再害一個同伴受害嗎?\n他就是個不愛分享食物的自私鬼" },
                            { speaker: "主角", image: "images/4.png", text: "你們去跟他搶食物?" },
                            { speaker: "大哥", image: "images/6.png", text: "不是搶\n只是單純地想要跟他要而已\n但事情出了差錯..." },
                            { speaker: "三弟", image: "images/7.png", text: "總而言之!\n他對外面世界瞭如指掌\n尤其是**比武大會**!" }
                        ]
                    }
                },
                {
                    title: "關於昆蟲騎士交流戰",
                    prompt: "你想向三隻蟑螂詢問哪件事？",
                    left: {
                        label: "比武大會?",
                        steps: [
                            { speaker: "主角", image: "images/4.png", text: "比武大會?" },
                            { speaker: "三弟", image: "images/7.png", text: "沒錯！\n那可是一場盛事!" },
                            { speaker: "大哥", image: "images/6.png", text: "其實是我們長老很愛提起的故事...\n一場昆蟲界的榮耀決鬥..." },
                            { speaker: "老二", image: "images/5.png", text: "反正我是不太信...\n就算是真的也輪不到蟑螂去\n你到不如跟我們一起走" },
                            { speaker: "三弟", image: "images/7.png", text: "但想像一下!\n如果我們王國派出的代表是他這樣大的傢伙呢!?" },
                            { speaker: "三隻蟑螂", image: "images/7.png", text: "..." },
                            { speaker: "大哥", image: "images/6.png", text: "原來如此...\n我知道你為什麼這麼興奮了...\n但他這麼大隻...是不能做我們代表的..." },
                            { speaker: "三弟", image: "images/7.png", text: "可是..." },
                            { speaker: "老二", image: "images/5.png", text: "大哥說的沒錯...\n連我們都不能定義他到底算不算同類了" },
                            { speaker: "主角", image: "images/4.png", text: "決鬥...王國...代表...\n你們到底在說什麼?\n而且這跟那隻昆蟲的資訊到底有什麼關係?" },
                            { speaker: "大哥", image: "images/6.png", text: "這件事我建議你還是去問牠比較好\n畢竟我們從未到外面過\n對於王國來說，我們只是一介平民\n野史不可盡信...\n是不是真的我也不敢保證" }
                        ]
                    },
                    right: {
                        label: "聽起來很可疑...",
                        steps: [
                            { speaker: "主角", image: "images/4.png", text: "我有點擔心..." },
                            { speaker: "大哥", image: "images/6.png", text: "三弟說得稍微有點粗暴\n準確來說\n更像是他自己一廂情願..." },
                            { speaker: "三弟", image: "images/7.png", text: "可是大哥..." },
                            { speaker: "老二", image: "images/5.png", text: "大哥只是想讓你認清現實...\n他一點也沒說錯..." },
                            { speaker: "主角", image: "images/4.png", text: "怎麼回事?" },
                            { speaker: "大哥", image: "images/6.png", text: "**比武大會**是長老代代傳下來的活動\n但更像是故事..." },
                            { speaker: "老二", image: "images/5.png", text: "我更願意相信事故事..." },
                            { speaker: "大哥", image: "images/6.png", text: "據說外面的昆蟲世界時不時會舉行彼此間的榮耀決鬥\n代表自己得種族去爭光..." },
                            { speaker: "主角", image: "images/4.png", text: "之後呢?\n發生什麼事了?\n你們輸了?" },
                            { speaker: "大哥", image: "images/6.png", text: "什麼都沒發生...\n然而問題就在這裡\n根本沒有蟑螂親眼見證過這種活動\n時間久了...\n活動變成故事\n故事變成傳說\n仔細想想蟑螂怎麼可能贏的過其他物種...?" }
                        ]
                    }
                },
                {
                    title: "尋找能夠幫助主角的人",
                    prompt: "你想向三隻蟑螂詢問哪件事？",
                    left: {
                        label: "最近又提起這個話題的原因...",
                        steps: [
                            { speaker: "主角", image: "images/4.png", text: "但你們最近又提起這個話題就是因為..." },
                            { speaker: "大哥", image: "images/6.png", text: "沒錯\n那傢伙在打我們之前自稱參加過**比武大會**\n警告我們不要碰牠的食物..." },
                            { speaker: "老二", image: "images/5.png", text: "我看牠只是仗著自己去過外面嚇唬我們罷了!" },
                            { speaker: "主角", image: "images/4.png", text: "牠到底是誰？" },
                            { speaker: "三弟", image: "images/7.png", text: "一隻獨角仙" },
                            { speaker: "主角", image: "images/4.png", text: "獨角仙?" },
                            { speaker: "三弟", image: "images/7.png", text: "嗯!\n受傷的獨角仙...\n還是很會打架..." },
                            { speaker: "大哥", image: "images/6.png", text: "或許牠能提供給你一些我們不知道的資訊..." },
                            { speaker: "主角", image: "images/4.png", text: "這個**比武大會**跟我變回人類有什麼關係?" },
                            { speaker: "老二", image: "images/5.png", text: "哈!\n你還真問到重點了!\n這也是為何我認為這是故......" },
                            { speaker: "三弟", image: "images/7.png", text: "聽說第一名成為**王**的人可以**許願**!" },
                        ]
                    },
                    right: {
                        label: "這跟幫我有什麼關係?",
                        steps: [
                            { speaker: "主角", image: "images/4.png", text: "但是這**比武大會**跟我變回人類有什麼關係?" },
                            { speaker: "大哥", image: "images/6.png", text: "這就是我跟老二懷疑的點了...\n據說..." },
                            { speaker: "三弟", image: "images/7.png", text: "據說第一名成為**王**的人可以**許願**!" },
                            { speaker: "主角", image: "images/4.png", text: "**許願**?" },
                            { speaker: "老二", image: "images/5.png", text: "是那隻獨角仙自己的片面之詞...\n自稱參加過比武\n明明一身是傷...怎麼可能去比賽" },
                            { speaker: "大哥", image: "images/6.png", text: "三弟說的那傢伙是一隻獨角仙\n就是剛剛提到打傷我們的..." },
                            { speaker: "三弟", image: "images/7.png", text: "但牠對昆蟲世界的事情知道得比我們多!\n這是真的!" },
                            { speaker: "大哥", image: "images/6.png", text: "恐怕...\n嚇唬我們的成分居多..." },
                            { speaker: "老二", image: "images/5.png", text: "真是無聊...\n如果你願意去相信那隻獨角仙的話\n那我想你確實很適合當昆蟲...\n一隻毛毛蟲!" },
                            { speaker: "主角", image: "images/4.png", text: "**許願**確實是有點誇張了...\n但..." },
                        ]
                    }
                }
            ],

            finalSteps: [
                { speaker: "大哥", image: "images/6.png", text: "你還是執意要去...\n對吧?" },
                { speaker: "主角", image: "images/4.png", text: "恩...\n總得嘗試看看...\n他在哪裡?" },
                { speaker: "三弟", image: "images/7.png", text: "他在走廊盡頭的房間..." },
                { speaker: "老二", image: "images/5.png", text: "說真的...你沒必要去找牠吧?" },
                { speaker: "主角", image: "images/4.png", text: "..." },
                { speaker: "大哥", image: "images/6.png", text: "他說的沒錯...\n好吧...或許你真的曾經是人類...\n但你卻也想不起來當人類的好...\n不是嗎?" },
                { speaker: "老二", image: "images/5.png", text: "大哥說的對...\n你跟我們一起生活不是更好嗎?" },
                { speaker: "三弟", image: "images/7.png", text: "...\n確實...\n雖然**比武大會**很酷...\n但有你在一起說不定會更有趣..." },
                { speaker: "主角", image: "images/4.png", text: "原來如此……" },
                { speaker: "大哥", image: "images/6.png", text: "我不會強迫你...\n但**許願**這麼不切實際的事情...\n恐怕會讓你失望吧..." },
                { speaker: "老二", image: "images/5.png", text: "恩恩...真的\n倒不如跟我們一起享用這個家豐富的資源\n享受生活豈不是更好" },
                { speaker: "主角", image: "images/4.png", text: "..." },
                { speaker: "大哥", image: "images/6.png", text: "看樣子...你已經做好決定了" }
            ],

            finalDecision: {
                title: "最後的決定",
                description: "眼前的三隻蟑螂似乎很歡迎主角加入牠們。另一方面，書房裡的獨角仙或許知道更多關於昆蟲騎士交流戰的情報，也可能幫助主角找到變回人類的線索。\n\n主角必須決定接下來的行動。",
                left: {
                    label: "🚪 前往書房",
                    next: "find_beetle",
                    steps: [
                        { speaker: "主角", image: "images/4.png", text: "真的謝謝你們...\n但是變成人類這麼荒謬的事情都發生了...\n**許願**這種事雖然機會十分渺茫...\n但我想試試看" },
                        { speaker: "大哥", image: "images/6.png", text: "這樣啊……那好吧!" },
                        { speaker: "老二", image: "images/5.png", text: "別忘了...\n我們會一直在這裡...有什麼問題儘管來找我們\n可以的話...順便找機會替我們海扁那隻獨角仙一頓!" },
                        { speaker: "三弟", image: "images/7.png", text: "注意安全!\n你一定可以成功的!" },
                        { speaker: "大哥", image: "images/6.png", text: "下次再一起聊天吧！\n再見..." },
                        { speaker: "旁白", text: "你向三隻蟑螂道別，朝書房的方向前進。\n後方你還能聽見三弟興奮的說著...\n(就像個**勇者**一樣!" }
                    ]
                },
                right: {
                    label: "留下來與三隻蟑螂一起玩",
                    next: "ending_3",
                    steps: [
                        { speaker: "主角", image: "images/4.png", text: "嗯……好吧，難得有人願意陪我聊天。" },
                        { speaker: "老二", image: "images/5.png", text: "太好了！你總算想通了！" },
                        { speaker: "三弟", image: "images/7.png", text: "哈哈哈！終於有新朋友了！" },
                        { speaker: "大哥", image: "images/6.png", text: "雖然你個頭大...\n但從今天起你就是四弟了!\n咱們走吧!" },
                        { speaker: "旁白", text: "主角決定留與三隻蟑螂一起度過時間。至於書房裡的獨角仙，以及騎士大會的事情，主角最終沒有再去了解..." }
                    ]
                }
            }
        }
    },

    // 第二章：初次會面・獨角大仙
    find_beetle: {
        chapter: "第二章・怪異的學者",

        dialogueFlow: {
            introHeading: "初次會面：獨角大仙",
            intro: [
                { speaker: "旁白", image: "images/8.png", text: "【畫面：書房】\n主角緩緩走進書房。" },
                { speaker: "獨角大仙", image: "images/9.png", text: "……有事？" },
                { speaker: "主角", image: "images/4.png", text: "不好意思，打擾了。請問你是獨角仙嗎？" },
                { speaker: "獨角大仙", image: "images/9.png", text: "請稱呼我獨角大仙。" },
                { speaker: "主角", image: "images/4.png", text: "啊……抱歉，獨角大仙。" },
                { speaker: "獨角大仙", image: "images/9.png", text: "你是誰？找我有什麼事？" },
                { speaker: "主角", image: "images/4.png", text: "我叫（主角名字）。我是今天早上在這間屋子裡醒來的……那隻白色蟑螂。" },
                { speaker: "獨角大仙", image: "images/9.png", text: "所以？" },
                { speaker: "主角", image: "images/4.png", text: "我有一些事情想請教你。" }
            ],

            topics: [
                // 左右選擇一：主角如何開口？
                {
                    title: "主角如何開口？",
                    prompt: "面對氣場威嚴的獨角大仙，你決定怎麼開口？",
                    left: {
                        label: "禮貌地說明",
                        steps: [
                            { speaker: "主角", image: "images/4.png", text: "我知道這件事可能很突然，但我真的有些事情想向你請教。" },
                            { speaker: "獨角大仙", image: "images/9.png", text: "既然如此，就把事情說清楚。" }
                        ]
                    },
                    right: {
                        label: "急切地尋求幫助",
                        steps: [
                            { speaker: "主角", image: "images/4.png", text: "拜託你了！我真的不知道該怎麼辦才好。" },
                            { speaker: "獨角大仙", image: "images/9.png", text: "先冷靜下來。慌張並不能解決問題。" }
                        ]
                    },
                    // 【兩條路線回歸主線】第一階段與第二階段
                    afterHeading: "變身的真相與生前性格",
                    afterSteps: [
                        { speaker: "主角", image: "images/4.png", text: "其實……我原本是人類。" },
                        { speaker: "獨角大仙", image: "images/9.png", text: "人類？" },
                        { speaker: "主角", image: "images/4.png", text: "是的。我今天早上醒來的時候，身體就變成了這副模樣。\n我完全不知道發生了什麼事。明明昨天還是正常的人類，結果一醒來，就變成了一隻巨大的蟑螂。" },
                        { speaker: "獨角大仙", image: "images/9.png", text: "……繼續說。" },
                        { speaker: "主角", image: "images/4.png", text: "我想知道，自己究竟為什麼會變成蟑螂？\n還有……有沒有辦法讓我變回人類？" },
                        { speaker: "獨角大仙", image: "images/9.png", text: "原來如此。\n不過，在回答你的問題之前，我需要先了解一件事。\n你身為人類時，是怎樣的一個人？" },
                        { speaker: "主角", image: "images/4.png", text: "我的性格？" },
                        { speaker: "獨角大仙", image: "images/9.png", text: "沒錯。平時如何與人相處？遇到事情時又會怎麼應對？\n仔細想想。不要只用好或不好來形容自己。" }
                    ]
                },

                // 左右選擇二：主角描述自己過去的性格
                {
                    title: "描述過去的性格",
                    prompt: "回想身為人類時的自己，你是怎樣的人？",
                    left: {
                        label: "不擅長與人相處",
                        steps: [
                            { speaker: "主角", image: "images/4.png", text: "我一直都不太擅長和別人相處。\n很多時候，我會下意識地避開人群，也不太會主動和別人交談。" },
                            { speaker: "獨角大仙", image: "images/9.png", text: "原來如此。你習慣與他人保持距離。" }
                        ]
                    },
                    right: {
                        label: "習慣待在自己的世界",
                        steps: [
                            { speaker: "主角", image: "images/4.png", text: "我並不是討厭別人，只是……比起和別人相處，我更習慣一個人待著。\n有時候，我會沉浸在自己的思緒裡，甚至忘記周圍發生了什麼事。" },
                            { speaker: "獨角大仙", image: "images/9.png", text: "我明白了。你更習慣將注意力留在自己的世界裡。" }
                        ]
                    },
                    // 【兩條路線回歸主線】第三階段
                    afterHeading: "昆蟲身分與許願的條件",
                    afterSteps: [
                        { speaker: "獨角大仙", image: "images/9.png", text: "不論是哪一種，你過去似乎都很少主動走進人群之中。" },
                        { speaker: "主角", image: "images/4.png", text: "這和我變成蟑螂有關係嗎？" },
                        { speaker: "獨角大仙", image: "images/9.png", text: "在這個世界，人類轉變成昆蟲並不是毫無理由的事情。\n一個人生前長久累積的性格與行為習慣，會與某種昆蟲的生存方式產生呼應。" },
                        { speaker: "主角", image: "images/4.png", text: "呼應……？" },
                        { speaker: "獨角大仙", image: "images/9.png", text: "不同的昆蟲，有著不同的生存方式。\n有些昆蟲習慣群居，有些習慣獨自行動。有些善於正面對抗，有些則擅長躲藏、適應環境。\n人類生前的性格，也可能與這些特徵產生某種聯繫。" },
                        { speaker: "主角", image: "images/4.png", text: "所以……我會變成蟑螂，是因為我以前的性格？" },
                        { speaker: "獨角大仙", image: "images/9.png", text: "這是我根據你剛才的描述所做出的判斷。\n蟑螂擅長在不受注意的地方生存，能夠適應環境，即使身處不起眼的角落，也能繼續活下去。\n你生前習慣將自己與外界隔開，這或許就是你與蟑螂產生聯繫的原因。" },
                        { speaker: "主角", image: "images/4.png", text: "……\n那麼，這代表我再也不能變回人類了嗎？" },
                        { speaker: "獨角大仙", image: "images/9.png", text: "我並沒有這麼說。\n想要變回人類，並不是完全沒有辦法。" },
                        { speaker: "主角", image: "images/4.png", text: "真的嗎？" },
                        { speaker: "獨角大仙", image: "images/9.png", text: "只要成為騎士競技的冠軍，並且登上王位，就能獲得一次許願的機會。\n屆時，你可以將自己的願望告訴國王。" },
                        { speaker: "主角", image: "images/4.png", text: "也就是說……只要我成為冠軍、成為國王，就能許願變回人類？" },
                        { speaker: "獨角大仙", image: "images/9.png", text: "正是如此。" }
                    ]
                },

                // 左右選擇三：主角對這個目標的反應
                {
                    title: "面對冠軍的條件",
                    prompt: "得知變回人類的唯一方法後，你的反應是？",
                    left: {
                        label: "決定接受挑戰",
                        steps: [
                            { speaker: "主角", image: "images/4.png", text: "既然有辦法，那我就去參加騎士競技！\n只要能夠成為冠軍，我就有機會變回人類了。" },
                            { speaker: "獨角大仙", image: "images/9.png", text: "目標很明確。\n但在那之前，你還有許多事情需要學習。" }
                        ]
                    },
                    right: {
                        label: "對這個條件感到不安",
                        steps: [
                            { speaker: "主角", image: "images/4.png", text: "可是……要成為騎士冠軍，甚至還要成為國王？\n這聽起來根本不是普通人能夠做到的事情。" },
                            { speaker: "獨角大仙", image: "images/9.png", text: "確實不容易。\n但你現在連自己的身體都無法掌握，又怎麼能判斷自己將來做不到？" }
                        ]
                    },
                    // 【兩條路線回歸主線】第四階段與第五階段
                    afterHeading: "掌握身體與冥想修行",
                    afterSteps: [
                        { speaker: "主角", image: "images/4.png", text: "說起來……還有一件事情。\n為什麼我的身體會這麼巨大？有沒有辦法讓自己縮小？" },
                        { speaker: "獨角大仙", image: "images/9.png", text: "有。" },
                        { speaker: "主角", image: "images/4.png", text: "真的有辦法？" },
                        { speaker: "獨角大仙", image: "images/9.png", text: "你現在的體型，並不是無法改變的。\n只是你還沒有學會如何控制這副身體。" },
                        { speaker: "主角", image: "images/4.png", text: "控制身體？" },
                        { speaker: "獨角大仙", image: "images/9.png", text: "你的意識還停留在過去的人類身分，卻沒有真正理解自己現在的身體。\n只要你始終排斥這副身體，就很難掌握它。" },
                        { speaker: "主角", image: "images/4.png", text: "那我究竟該怎麼做？" },
                        { speaker: "獨角大仙", image: "images/9.png", text: "首先，你必須接受一件事。\n你現在是一隻蟑螂。" },
                        { speaker: "主角", image: "images/4.png", text: "……\n可是，我根本不想當蟑螂。" },
                        { speaker: "獨角大仙", image: "images/9.png", text: "我沒有要求你放棄變回人類的願望。\n你可以繼續追求那個目標。\n但在那之前，這副身體就是你現在必須使用的身體。\n你必須先承認它的存在，理解它的構造，才能學會控制它。" },
                        { speaker: "主角", image: "images/4.png", text: "所以……只要接受自己是蟑螂，就能縮小嗎？" },
                        { speaker: "獨角大仙", image: "images/9.png", text: "光是接受還不夠。\n接下來，我要教你如何透過冥想掌握身體。\n保持身體穩定，閉上眼睛。\n感受你的六隻腳與地面接觸的觸感，留意身體的重量，以及背甲與腹部的起伏。\n不要急著改變體型，也不要刻意想像自己變回人類。\n先讓自己的意識，完整地感受到這副身體。\n接著，想像身體的輪廓逐漸收束，將自己的體型控制在你希望的大小。" },
                        { speaker: "主角", image: "images/4.png", text: "聽起來……好像不太容易。" },
                        { speaker: "獨角大仙", image: "images/9.png", text: "所以才需要練習。" }
                    ]
                },

                // 左右選擇四：主角準備開始修行
                {
                    title: "開始冥想修行",
                    prompt: "閉上眼睛前，你抱持著什麼心態開始修行？",
                    left: {
                        label: "認真修行",
                        steps: [
                            { speaker: "主角", image: "images/4.png", text: "我明白了。我會認真試試看。" },
                            { speaker: "獨角大仙", image: "images/9.png", text: "很好。保持安靜，集中精神。" },
                            { speaker: "旁白", image: "images/8.png", text: "主角緩緩閉上眼睛，開始感受身體的重量。" },
                            { speaker: "主角", image: "images/4.png", text: "……六隻腳都能感覺到地面的觸感。" },
                            { speaker: "獨角大仙", image: "images/9.png", text: "不要排斥這種感覺。繼續保持。" },
                            { speaker: "主角", image: "images/4.png", text: "我現在……確實是一隻蟑螂。\n至少在變回人類以前，我必須學會控制這副身體。" },
                            { speaker: "獨角大仙", image: "images/9.png", text: "很好。不要分心。" }
                        ]
                    },
                    right: {
                        label: "不耐煩修行",
                        onSelect: () => {
                            window.hiddenMemoryMeditation = true;
                            console.log("隱藏記憶點已解鎖：主角一邊冥想，一邊忍不住碎碎念的畫面");
                        },
                        steps: [
                            { speaker: "主角", image: "images/4.png", text: "就只是冥想而已嗎？\n要我接受自己變成蟑螂……這種事情怎麼可能說接受就接受啊。" },
                            { speaker: "獨角大仙", image: "images/9.png", text: "你有什麼意見？" },
                            { speaker: "主角", image: "images/4.png", text: "沒、沒有！我只是在集中精神！" },
                            { speaker: "旁白", image: "images/8.png", text: "主角緩緩閉上眼睛，開始冥想。" },
                            { speaker: "主角（小聲碎念）", image: "images/4.png", text: "明明以前還是人類……現在卻得注意自己的六隻腳……\n真是的……要不是為了變回去，誰想做這種事……" },
                            { speaker: "獨角大仙", image: "images/9.png", text: "……\n你的注意力似乎不太集中。" },
                            { speaker: "主角", image: "images/4.png", text: "我知道啦……我會認真一點。" },
                            { speaker: "旁白", image: "images/8.png", text: "【隱藏記憶點：主角一邊冥想，一邊忍不住碎碎念的畫面】" },
                            { speaker: "主角", image: "images/4.png", text: "……好吧。\n我不喜歡這副身體，但現在它確實是我的身體。\n至少……先學會控制它吧。" },
                            { speaker: "獨角大仙", image: "images/9.png", text: "這樣就對了。繼續。" }
                        ]
                    }
                }
            ],

            // 縮小成功：共同結尾
            finalHeading: "縮小成功",
            finalSteps: [
                { speaker: "旁白", image: "images/8.png", text: "隨著主角逐漸集中精神，原本龐大的身體開始產生變化。\n六隻腳的比例逐漸縮小，身體與背甲也慢慢收束。" },
                { speaker: "主角", image: "images/4.png", text: "咦……？" },
                { speaker: "旁白", image: "images/8.png", text: "主角低頭看著自己的身體。" },
                { speaker: "主角", image: "images/4.png", text: "我、我真的變小了！" },
                { speaker: "獨角大仙", image: "images/9.png", text: "你只是初步掌握了控制身體的方法。\n不要因為這點成果就鬆懈。接下來還有許多練習等著你。" },
                { speaker: "主角", image: "images/4.png", text: "我明白了……\n謝謝你，獨角大仙。" },
                { speaker: "獨角大仙", image: "images/9.png", text: "不用急著道謝。\n先記住今天學會的事情。你要走的路還很長。" }
            ],

            // 場景結束後跳轉至下一張卡片
            nextCard: "chapter2_end"
        }
    },

    // 第二章場景結束過渡卡片
    chapter2_end: {
        chapter: "第二章・怪異的學者",
        title: "初次的修行",
        description: "你成功學會了控制體型的方法。\n在獨角大仙的指導下，通往騎士競技的修行才正要開始……\n\n（後續劇情待續）",
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

    playDialogueSequence(flow.intro, flow.introHeading || "初次接觸", () => {
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

    const isBeetleMaster = step.speaker === "獨角大仙";
    const typingSpeed = isBeetleMaster ? 52 : 24;   // 獨角大仙語速放慢
    const blipInterval = isBeetleMaster ? 1 : 2;   // 獨角大仙逐字發聲，咬字更分明

    const currentSegment = session.segments[session.segmentIndex] || "";
    const prefix = `${step.speaker}：\n`;
    const fullMessage = `${prefix}${currentSegment}`;

    typeText(
        descEl,
        fullMessage,
        typingSpeed,
        () => {
            isAnimating = false;
            stopDialoguePortraitTalk(card);
        },
        (ch, charIdx) => {
            if (charIdx < prefix.length) return;

            const spokenIdx = charIdx - prefix.length;
            if (/[，。！？、…；：「」（）\s]/.test(ch)) {
                if (portraitEl) portraitEl.classList.remove("mouth-open");
            } else if (spokenIdx % blipInterval === 0) {
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
    renderFormattedText(descEl, `${step.speaker}：\n${currentSegment}`);
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

function finishDialogueTopicsAndGoFinal() {
    const session = currentDialogueFlow;
    if (!session) return;

    playDialogueSequence(
        session.flow.finalSteps,
        session.flow.finalHeading || "獨角仙情報",
        () => {
            if (session.flow.finalDecision) {
                setupFinalDecision();
            } else if (session.flow.nextCard) {
                currentCardId = session.flow.nextCard;
                currentDialogueFlow = null;
                renderCard();
            }
        }
    );
}

function setupTopicChoice(topicIndex) {
    const session = currentDialogueFlow;
    if (!session) return;

    const topic = session.flow.topics[topicIndex];
    if (!topic) {
        finishDialogueTopicsAndGoFinal();
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
            if (choice.onSelect) choice.onSelect();

            const proceedToNextTopic = () => {
                const nextTopicIndex = session.topicIndex + 1;
                if (nextTopicIndex < session.flow.topics.length) {
                    setupTopicChoice(nextTopicIndex);
                } else {
                    finishDialogueTopicsAndGoFinal();
                }
            };

            playDialogueSequence(choice.steps, topic.title, () => {
                if (Array.isArray(topic.afterSteps) && topic.afterSteps.length > 0) {
                    playDialogueSequence(
                        topic.afterSteps,
                        topic.afterHeading || topic.title,
                        proceedToNextTopic
                    );
                } else {
                    proceedToNextTopic();
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