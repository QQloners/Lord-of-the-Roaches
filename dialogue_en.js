/* =================================
   1. English Story Database STORY_DATA_EN
================================= */
const STORY_DATA_EN = {
    // Story opening (first image: images/1.png, black by default)
    start: {
        chapter: "Chapter 1: The Ootheca",
        title: "A Pure White Nightmare",
        description: "One morning, you wake from an unsettling dream...\nWhat’s going on?! Why do I look like this?!\nYou cry out in terror...\nBut...\nRight now...\nyou can’t remember anything...\nYou don’t even know...\nAll you’re sure of is that you used to be human...\nThen, a voice calls from outside your door...\n“Oi~ Everyone, come and get it!”",
        image: "images/1.png",
        left: { label: "🚪 Never leave the room — no one can ever see what you’ve become", next: "ending_1" },
        right: { label: "🚪 Summon your courage, open the door, and try to find help", next: "dining_room" }
    },

    // Ending 1
    ending_1: {
        chapter: "Final Chapter: Solitude",
        title: "[Ending 1: The Sealed Room]",
        achievement: "🏆 Achievement Unlocked: Never Seen the Light of Day",
        description: "You chose to lock yourself away in your room...\nYou didn’t have the courage to step outside, nor did you try to find anyone.\n\nIn the end, consumed by endless fear and hunger, you quietly died inside the room...",
        image: "images/ending_1.png",
        ending: true
    },

    // Under the dining table (blurred background by default)
    dining_room: {
        chapter: "Chapter 1: The Ootheca",
        title: "Nobody Home",
        description: "You muster your courage and open the door.\nBut all that greets you is an empty hallway.\nStill, you can hear a rustling sound coming from the living room...\nFollowing the noise, you drag your body step by step toward the dining table...\n\nPeering through the shadows, you spot three cockroaches huddled together beneath the table, muttering softly about something.",
        image: "images/2.png",
        left: { label: "👂 Hide and eavesdrop", next: "eavesdrop" },
        right: { label: "💬 Step forward and talk to them", next: "talk_to_bugs" }
    },

    // 2. Eavesdropping scene (secretly records Condition 1)
    eavesdrop: {
        chapter: "Chapter 1: The Ootheca",
        title: "No Man’s Land?",
        description: "You hold your breath and press your antennae deeper into the shadows……\n\nRoach A: “Great! Nobody’s cleaned this place since the owner left!”\nRoach B: “But... isn’t there still someone living in this house?”\nRoach C: “Where there’s a person, there’s food! Look on the bright side... the point is, he hates cleaning!”",
        image: "images/3.png",
        onEnter: () => {
            secretEndingCondition1 = true;
            console.log("Secret ending condition 1 unlocked!");
        },
        left: { label: "👥 Step forward and talk to them", next: "talk_to_bugs" },
        right: { label: "👣 Quietly leave without speaking", next: "ending_2" }
    },

    // 3. Ending 2
    ending_2: {
        chapter: "Final Chapter: Extermination",
        title: "[Ending 2: Pest Eradication]",
        achievement: "🏆 Achievement Unlocked: Another Win for Pest Control",
        description: "You chose not to speak up and quietly slipped back into the shadows.\n\nLiving off the scraps in the filthy house, you scraped by for half a year. Then one day, a neighbor reported the house over the stench……\nProfessional exterminators stormed in, and amid thick clouds of insecticide, you met your end.",
        image: "images/ending_2.png",
        ending: true
    },

    // Ending 3: Choosing to stay and live with the three roaches
    ending_3: {
        chapter: "Final Chapter: New Friends",
        title: "[Ending 3: New Friends]",
        description: "",
        ending: true
    },

    // 4. First contact, five topics, the rhinoceros beetle intel, and the final decision
    talk_to_bugs: {
        chapter: "Chapter 1: The Ootheca",

        dialogueFlow: {
            intro: [
                { speaker: "You", image: "images/4.png", text: "Um... excuse me" },
                { speaker: "Roach A", image: "images/6.png", text: "Hm? What is it?" },
                { speaker: "Roach B", image: "images/5.png", text: "Hold on... who are you?" },
                { speaker: "Roach C", image: "images/7.png", text: "So big..." },
                { speaker: "You", image: "images/4.png", text: "Ah... sorry, did I scare you?" },
                { speaker: "Roach A", image: "images/6.png", text: "Of course you did!\nIt’s rare to see one of our own this big...\nWait...\nDoes that even count as one of our own?" },
                { speaker: "Roach B", image: "images/5.png", text: "If we can understand each other, doesn’t that make us the same kind?" },
                { speaker: "You", image: "images/4.png", text: "Well... honestly, I’m not really sure myself" },
                { speaker: "Roach C", image: "images/7.png", text: "...\nActually, all insects speak the same language...\nThey just have different accents..." },
                { speaker: "You", image: "images/4.png", text: "Please\nI really need your help..." },
                { speaker: "Roach A", image: "images/6.png", text: "All right... we’ll do what we can to help\nLet me introduce us first\nI’m the eldest of the three. \nThis is our second brother on the left\nand our youngest on the right\nAnd who are you?\nWhy are you so huge?" }
            ],

            topics: [
                {
                    title: "About the Transformation",
                    prompt: "What would you like to ask the three roaches?",
                    left: {
                        label: "Explain that you’re human",
                        steps: [
                            { speaker: "You", image: "images/4.png", text: "The reason I’m this big is...\nI used to be human" },
                            { speaker: "Eldest", image: "images/6.png", text: "Human?!\nReally?" },
                            { speaker: "Second Brother", image: "images/5.png", text: "It’s hard to believe\nbut it would explain why you’re so big..." },
                            { speaker: "Youngest", image: "images/7.png", text: "Oh my gosh...\nYou’re not the person who lives in this house, are you...?" },
                            { speaker: "You", image: "images/4.png", text: "Oh...\nThen that must be him...\nBut to be honest...\nI can’t remember what I used to be like" },
                            { speaker: "Youngest", image: "images/7.png", text: "What do you mean?" },
                            { speaker: "You", image: "images/4.png", text: "It feels weird saying it myself\nbut I think I’ve lost my memory..." },
                            { speaker: "Three Roaches", image: "images/7.png", text: "What?!" }
                        ]
                    },
                    right: {
                        label: "Briefly introduce yourself and ask for help",
                        steps: [
                            { speaker: "You", image: "images/4.png", text: "To be honest\nI’m actually human, but now I’ve turned into a cockroach" },
                            { speaker: "Eldest", image: "images/6.png", text: "!" },
                            { speaker: "Second Brother", image: "images/5.png", text: "But looking at you like this...\nI really can’t believe we’re the same kind" },
                            { speaker: "Youngest", image: "images/7.png", text: "Yeah...\nRegular roaches don’t have bodies as big as yours" },
                            { speaker: "Eldest", image: "images/6.png", text: "But he really is a giant version of a roach...\nI’ll take your word for it, for now...\nBut how did you end up like this?" },
                            { speaker: "You", image: "images/4.png", text: "Well...\nI don’t know either...\nBecause I can’t remember anything" },
                            { speaker: "Three Roaches", image: "images/7.png", text: "..." }
                        ]
                    }
                },
                {
                    title: "Back into a Human?",
                    prompt: "What would you like to ask the three roaches?",
                    left: {
                        label: "Is there a way to turn back into a human?",
                        steps: [
                            { speaker: "You", image: "images/4.png", text: "That’s exactly why I wanted to ask\nDo you know any way to change back?" },
                            { speaker: "Eldest", image: "images/6.png", text: "Turn back into a human?\nNo...\nWe’ve never even thought about something like that" },
                            { speaker: "Second Brother", image: "images/5.png", text: "And even if we knew\nI doubt any of us would want to be human, right?" },
                            { speaker: "Three Roaches", image: "images/7.png", text: "True..." },
                            { speaker: "You", image: "images/4.png", text: "Why not?" },
                            { speaker: "Youngest", image: "images/7.png", text: "You tell us, what’s so great about being human?" },
                            { speaker: "You", image: "images/4.png", text: "...\nHey, wait... that’s not fair\nI can’t remember anything!" },
                            { speaker: "Eldest", image: "images/6.png", text: "Maybe being human was just terrible?\nAnd that’s why you don’t want to remember?" },
                            { speaker: "You", image: "images/4.png", text: "...\nNo way..." }
                        ]
                    },
                    right: {
                        label: "Are there others who’ve gone through the same thing?",
                        steps: [
                            { speaker: "You", image: "images/4.png", text: "Haven’t you ever come across an insect with the same experience?" },
                            { speaker: "Second Brother", image: "images/5.png", text: "Well...\nNot with our own eyes..." },
                            { speaker: "You", image: "images/4.png", text: "What do you mean?" },
                            { speaker: "Youngest", image: "images/7.png", text: "Actually, plenty of bugs like to claim they used to be human..." },
                            { speaker: "Eldest", image: "images/6.png", text: "I used to do that too...\nI don’t even know what got into me back then\nBut after a while, I stopped saying it" },
                            { speaker: "You", image: "images/4.png", text: "Huh?\nWhy?" },
                            { speaker: "Eldest", image: "images/6.png", text: "No idea\nMaybe I just liked talking nonsense back then" },
                            { speaker: "Second Brother", image: "images/5.png", text: "You really did" },
                            { speaker: "Youngest", image: "images/7.png", text: "But even when big bro claimed to be human\nhe was the same size as the rest of us back then\nNothing like you, so huge\nIf anyone was really human once\nyou’d be a lot more believable" },
                            { speaker: "Second Brother", image: "images/5.png", text: "And it’s not just big bro\nLook around, and there are plenty of other kinds of insects\nwho pop up now and then saying they used to be human" },
                            { speaker: "You", image: "images/4.png", text: "Oh my gosh..." }
                        ]
                    }
                },
                {
                    title: "About This House",
                    prompt: "What would you like to ask the three roaches?",
                    left: {
                        label: "Is there another insect who could give me a lead?",
                        steps: [
                            { speaker: "You", image: "images/4.png", text: "Isn’t there any other insect who could give me a lead?" },
                            { speaker: "Youngest", image: "images/7.png", text: "Well..." },
                            { speaker: "Eldest", image: "images/6.png", text: "It’s not that there isn’t..." },
                            { speaker: "Second Brother", image: "images/5.png", text: "For heaven’s sake...\nAre you serious?\nI’m not recommending that guy..." },
                            { speaker: "You", image: "images/4.png", text: "Which guy...?" },
                            { speaker: "Youngest", image: "images/7.png", text: "I’ll say this up front...\nI don’t really recommend him either\nBut from what you’ve told us\nhe really could give you some information" },
                            { speaker: "Eldest", image: "images/6.png", text: "But you might get hurt\nWe once tried to negotiate with him for some food\nNot only did he refuse, he beat up our youngest" },
                            { speaker: "You", image: "images/4.png", text: "What?!" },
                            { speaker: "Eldest", image: "images/6.png", text: "Second tried to help...\nAnd the result was that our legs got broken..." },
                            { speaker: "You", image: "images/4.png", text: "What could a guy like that possibly know?!" },
                            { speaker: "Youngest", image: "images/7.png", text: "Calm down...\nThe reason I think he can help you\nis that he only moved in here recently\nHe’s an insect who came from the outside world" },
                            { speaker: "You", image: "images/4.png", text: "The outside world?" },
                            { speaker: "Youngest", image: "images/7.png", text: "Yeah...\nHe knows a lot more about the insect world than we do\nEspecially the **Grand Tournament**..." }
                        ]
                    },
                    right: {
                        label: "Are there any other insects in this house?",
                        steps: [
                            { speaker: "You", image: "images/4.png", text: "Do you know if there are any other insects in this house?" },
                            { speaker: "Youngest", image: "images/7.png", text: "Well, there’s one..." },
                            { speaker: "Second Brother", image: "images/5.png", text: "No!\nI won’t let you bring up that guy...\nHe hurt you!" },
                            { speaker: "Youngest", image: "images/7.png", text: "But he came from the outside world!\nHe must know something..." },
                            { speaker: "You", image: "images/4.png", text: "Hurt?\nWhat happened?" },
                            { speaker: "Eldest", image: "images/6.png", text: "It’s a long story...\nBut Youngest is right...\nHe probably does know something..." },
                            { speaker: "Second Brother", image: "images/5.png", text: "Do you want another one of us to get hurt?\nHe’s just a selfish jerk who won’t share his food" },
                            { speaker: "You", image: "images/4.png", text: "You tried to steal food from him?" },
                            { speaker: "Eldest", image: "images/6.png", text: "It wasn’t stealing\nWe just wanted to ask him for some\nBut things went wrong..." },
                            { speaker: "Youngest", image: "images/7.png", text: "Anyway!\nHe knows the outside world like the back of his hand\nEspecially the **Grand Tournament**!" }
                        ]
                    }
                },
                {
                    title: "The Insect Knight",
                    prompt: "What would you like to ask the three roaches?",
                    left: {
                        label: "The Grand Tournament?",
                        steps: [
                            { speaker: "You", image: "images/4.png", text: "The Grand Tournament?" },
                            { speaker: "Youngest", image: "images/7.png", text: "That’s right!\nIt’s a huge event!" },
                            { speaker: "Eldest", image: "images/6.png", text: "It’s really a story our elders love to tell...\nA glorious duel in the insect world..." },
                            { speaker: "Second Brother", image: "images/5.png", text: "I don’t really buy it, personally...\nEven if it’s real, they’d never send a roach\nYou’d be better off just coming with us" },
                            { speaker: "Youngest", image: "images/7.png", text: "But imagine!\nWhat if our kingdom’s representative were someone as big as him?!" },
                            { speaker: "Three Roaches", image: "images/7.png", text: "..." },
                            { speaker: "Eldest", image: "images/6.png", text: "I see...\nNow I get why you’re so excited...\nBut someone this big... can’t be our representative..." },
                            { speaker: "Youngest", image: "images/7.png", text: "But..." },
                            { speaker: "Second Brother", image: "images/5.png", text: "Big bro’s right...\nWe can’t even say for sure whether he counts as one of us" },
                            { speaker: "You", image: "images/4.png", text: "Duel... kingdom... representative...\nWhat are you even talking about?\nAnd what does any of this have to do with that insect’s information?" },
                            { speaker: "Eldest", image: "images/6.png", text: "I’d suggest asking him about that yourself\nAfter all, we’ve never been outside\nTo the kingdom, we’re nothing but commoners\nLegends can’t be fully trusted...\nI can’t promise it’s true" }
                        ]
                    },
                    right: {
                        label: "That sounds suspicious...",
                        steps: [
                            { speaker: "You", image: "images/4.png", text: "I’m a little worried..." },
                            { speaker: "Eldest", image: "images/6.png", text: "Youngest put it a bit harshly\nTo be precise\nit’s more like wishful thinking on his part..." },
                            { speaker: "Youngest", image: "images/7.png", text: "But big bro..." },
                            { speaker: "Second Brother", image: "images/5.png", text: "Big bro just wants you to face reality...\nHe’s not wrong at all..." },
                            { speaker: "You", image: "images/4.png", text: "What’s going on?" },
                            { speaker: "Eldest", image: "images/6.png", text: "The **Grand Tournament** is an event the elders have passed down through the generations\nBut it’s more like a story..." },
                            { speaker: "Second Brother", image: "images/5.png", text: "I’d rather believe it’s only a story..." },
                            { speaker: "Eldest", image: "images/6.png", text: "They say that out in the insect world, glorious duels are held between the species every now and then\nwhere each one sends a representative to win honor for its own kind..." },
                            { speaker: "You", image: "images/4.png", text: "And then?\nWhat happened?\nDid you lose?" },
                            { speaker: "Eldest", image: "images/6.png", text: "Nothing happened...\nAnd that’s exactly the problem\nNo roach has ever witnessed such an event with their own eyes\nOver time...\nthe event became a story\nand the story became a legend\nWhen you think about it, how could a roach ever beat the other species...?" }
                        ]
                    }
                },
                {
                    title: "Who Can Help me?",
                    prompt: "What would you like to ask the three roaches?",
                    left: {
                        label: "Why bring this up again lately...?",
                        steps: [
                            { speaker: "You", image: "images/4.png", text: "But the reason you’ve been talking about this again lately is..." },
                            { speaker: "Eldest", image: "images/6.png", text: "That’s right\nBefore he beat us up, that guy claimed he’d taken part in the **Grand Tournament**\nand warned us not to touch his food..." },
                            { speaker: "Second Brother", image: "images/5.png", text: "I bet he was just using the fact that he’s been outside to scare us!" },
                            { speaker: "You", image: "images/4.png", text: "Who is he, exactly?" },
                            { speaker: "Youngest", image: "images/7.png", text: "A rhinoceros beetle" },
                            { speaker: "You", image: "images/4.png", text: "A rhinoceros beetle?" },
                            { speaker: "Youngest", image: "images/7.png", text: "Yeah!\nAn injured rhinoceros beetle...\nwho’s still really good at fighting..." },
                            { speaker: "Eldest", image: "images/6.png", text: "Maybe he can give you some information we don’t have..." },
                            { speaker: "You", image: "images/4.png", text: "What does this **Grand Tournament** have to do with me turning back into a human?" },
                            { speaker: "Second Brother", image: "images/5.png", text: "Ha!\nYou really hit the nail on the head!\nThat’s exactly why I think it’s just a sto..." },
                            { speaker: "Youngest", image: "images/7.png", text: "They say whoever takes first place and becomes **King** gets to **make a wish**!" },
                            { speaker: "You", image: "images/4.png", text: "I can see why you two don’t believe it...\nBut..." }
                        ]
                    },
                    right: {
                        label: "What does this have to do with helping me?",
                        steps: [
                            { speaker: "You", image: "images/4.png", text: "But what does this **Grand Tournament** have to do with me turning back into a human?" },
                            { speaker: "Eldest", image: "images/6.png", text: "That’s exactly what Second and I are doubtful about...\nThey say..." },
                            { speaker: "Youngest", image: "images/7.png", text: "They say whoever takes first place and becomes **King** gets to **make a wish**!" },
                            { speaker: "You", image: "images/4.png", text: "**Make a wish**?" },
                            { speaker: "Second Brother", image: "images/5.png", text: "That’s just that rhinoceros beetle’s own one-sided story...\nHe says he’s competed in the tournament\nBut he’s covered in injuries... how could he have competed?" },
                            { speaker: "Eldest", image: "images/6.png", text: "The guy Youngest is talking about is a rhinoceros beetle\nThe one we just mentioned, who beat us up..." },
                            { speaker: "Youngest", image: "images/7.png", text: "But he knows a lot more about the insect world than we do!\nThat part is true!" },
                            { speaker: "Eldest", image: "images/6.png", text: "I’m afraid...\nhe was mostly just trying to scare us..." },
                            { speaker: "Second Brother", image: "images/5.png", text: "How boring...\nIf you’re willing to believe that rhinoceros beetle\nthen I’d say you’re perfectly suited to be an insect...\na caterpillar!" },
                            { speaker: "You", image: "images/4.png", text: "**Make a wish** does sound a bit over the top...\nBut..." }
                        ]
                    }
                }
            ],

            finalSteps: [
                { speaker: "Eldest", image: "images/6.png", text: "You’re still determined to go...\naren’t you?" },
                { speaker: "You", image: "images/4.png", text: "Yeah...\nI have to at least try...\nWhere is he?" },
                { speaker: "Youngest", image: "images/7.png", text: "He’s in the room at the end of the hallway..." },
                { speaker: "Second Brother", image: "images/5.png", text: "Seriously... do you really have to go find him?" },
                { speaker: "You", image: "images/4.png", text: "..." },
                { speaker: "Eldest", image: "images/6.png", text: "He’s right...\nAll right... maybe you really were human once...\nBut you can’t even remember what was good about being human...\nCan you?" },
                { speaker: "Second Brother", image: "images/5.png", text: "Big bro’s right...\nWouldn’t it be better to live with us?" },
                { speaker: "Youngest", image: "images/7.png", text: "...\nTrue...\nThe **Grand Tournament** sounds cool...\nbut having you around might be even more fun..." },
                { speaker: "You", image: "images/4.png", text: "I see……" },
                { speaker: "Eldest", image: "images/6.png", text: "I won’t force you...\nBut something as unrealistic as **making a wish**...\nwill probably just let you down..." },
                { speaker: "Second Brother", image: "images/5.png", text: "Yeah, really\nYou’d be better off enjoying this house’s plentiful resources with us\nWouldn’t enjoying life be better?" },
                { speaker: "You", image: "images/4.png", text: "..." },
                { speaker: "Eldest", image: "images/6.png", text: "Looks like...you’ve already made up your mind" }
            ],

            finalDecision: {
                title: "The Final Decision",
                description: "The three roaches in front of you seem to welcome the protagonist to join them. On the other hand, the rhinoceros beetle in the study may know more about the Insect Knights’ Exchange Tournament, and might even help the protagonist find a clue to becoming human again.\n\nThe protagonist must decide what to do next.",
                left: {
                    label: "🚪 Head to the study",
                    next: "find_beetle",
                    steps: [
                        { speaker: "You", image: "images/4.png", text: "Thank you so much, really...\nBut something as absurd as turning into a roach has already happened...\nThe chance of **making a wish** is slim...\nbut I want to give it a try" },
                        { speaker: "Eldest", image: "images/6.png", text: "I see... Well then, all right!" },
                        { speaker: "Second Brother", image: "images/5.png", text: "Don’t forget...\nWe’ll always be here... come find us if you have any problems\nAnd if you can... find a chance to give that rhinoceros beetle a good beating for us!" },
                        { speaker: "Youngest", image: "images/7.png", text: "Stay safe!\nI know you can do it!" },
                        { speaker: "Eldest", image: "images/6.png", text: "Let’s chat again next time!\nSee you..." },
                        { speaker: "Narrator", text: "You say goodbye to the three roaches and head toward the study.\nBehind you, you can still hear Youngest saying excitedly...\n“Just like a **hero**!”" }
                    ]
                },
                right: {
                    label: "Stay and hang out with the three roaches",
                    next: "ending_3",
                    steps: [
                        { speaker: "You", image: "images/4.png", text: "Hmm... all right, it’s not every day someone’s willing to keep me company." },
                        { speaker: "Second Brother", image: "images/5.png", text: "Great! You finally came around!" },
                        { speaker: "Youngest", image: "images/7.png", text: "Hahaha! We finally have a new friend!" },
                        { speaker: "Eldest", image: "images/6.png", text: "Even though you’re huge...\nfrom today on, you’re our fourth brother!\nCome on, let’s go!" },
                        { speaker: "Narrator", text: "The protagonist decides to stay and spend time with the three roaches. As for the rhinoceros beetle in the study and the matter of the Knights’ Tournament, the protagonist never looked into it any further..." }
                    ]
                }
            }
        }
    },

    // Chapter 2: First Meeting – Master Rhinoceros
    find_beetle: {
        chapter: "Chapter 2: The Eccentric Scholar",

        dialogueFlow: {
            introHeading: "First Meeting: Master Rhinoceros",
            intro: [
                { speaker: "Narrator", image: "images/8.png", text: "[Scene: The Study]\nThe protagonist slowly walks into the study." },
                { speaker: "Master Rhinoceros", image: "images/9.png", text: "......Yes? What is it?" },
                { speaker: "You", image: "images/4.png", text: "Sorry to bother you. Are you a rhinoceros beetle?" },
                { speaker: "Master Rhinoceros", image: "images/9.png", text: "Please address me as Master Rhinoceros." },
                { speaker: "You", image: "images/4.png", text: "Ah... sorry, Master Rhinoceros." },
                { speaker: "Master Rhinoceros", image: "images/9.png", text: "Who are you? What do you want from me?" },
                { speaker: "You", image: "images/4.png", text: "My name is (protagonist’s name). I’m the... white cockroach who woke up in this house this morning." },
                { speaker: "Master Rhinoceros", image: "images/9.png", text: "And?" },
                { speaker: "You", image: "images/4.png", text: "There are some things I’d like to ask you." }
            ],

            topics: [
                // Choice 1 (left/right): How does the protagonist begin?
                {
                    title: "How Does the Protagonist Begin?",
                    prompt: "Facing the imposing Master Rhinoceros, how do you decide to begin?",
                    left: {
                        label: "Explain politely",
                        steps: [
                            { speaker: "You", image: "images/4.png", text: "I know this might be sudden, but I really do have some things I’d like to ask you." },
                            { speaker: "Master Rhinoceros", image: "images/9.png", text: "In that case, explain the situation clearly." }
                        ]
                    },
                    right: {
                        label: "Plead for help urgently",
                        steps: [
                            { speaker: "You", image: "images/4.png", text: "Please! I really don’t know what to do!" },
                            { speaker: "Master Rhinoceros", image: "images/9.png", text: "Calm down first. Panicking won’t solve anything." }
                        ]
                    },
                    // [Both routes rejoin the main storyline] Phase 1 and Phase 2
                    afterHeading: "The Truth Behind the Transformation and Your Past Personality",
                    afterSteps: [
                        { speaker: "You", image: "images/4.png", text: "Actually... I used to be human." },
                        { speaker: "Master Rhinoceros", image: "images/9.png", text: "Human?" },
                        { speaker: "You", image: "images/4.png", text: "Yes. When I woke up this morning, my body had turned into this.\nI have no idea what happened. I was a perfectly normal human just yesterday, and then I woke up as a giant cockroach." },
                        { speaker: "Master Rhinoceros", image: "images/9.png", text: "......Go on." },
                        { speaker: "You", image: "images/4.png", text: "I want to know why I turned into a cockroach in the first place.\nAnd... is there any way for me to turn back into a human?" },
                        { speaker: "Master Rhinoceros", image: "images/9.png", text: "I see.\nHowever, before I answer your questions, there’s something I need to understand first.\nWhat kind of person were you when you were human?" },
                        { speaker: "You", image: "images/4.png", text: "My personality?" },
                        { speaker: "Master Rhinoceros", image: "images/9.png", text: "Yes. How did you get along with others? How did you handle things when trouble came up?\nThink carefully. Don’t just describe yourself as “good” or “bad.”" }
                    ]
                },

                // Choice 2 (left/right): The protagonist describes their past personality
                {
                    title: "Describing Your Past Personality",
                    prompt: "Thinking back to who you were as a human, what kind of person were you?",
                    left: {
                        label: "Not good with people",
                        steps: [
                            { speaker: "You", image: "images/4.png", text: "I was never really good at getting along with others.\nOften I’d instinctively avoid crowds, and I rarely started conversations myself." },
                            { speaker: "Master Rhinoceros", image: "images/9.png", text: "I see. You were used to keeping your distance from others." }
                        ]
                    },
                    right: {
                        label: "Used to staying in my own world",
                        steps: [
                            { speaker: "You", image: "images/4.png", text: "It’s not that I disliked other people, it’s just... I was more comfortable being alone than being around others.\nSometimes I’d get lost in my own thoughts and forget what was going on around me." },
                            { speaker: "Master Rhinoceros", image: "images/9.png", text: "I understand. You preferred to keep your attention inside your own world." }
                        ]
                    },
                    // [Both routes rejoin the main storyline] Phase 3
                    afterHeading: "Insect Identity and the Conditions for Making a Wish",
                    afterSteps: [
                        { speaker: "Master Rhinoceros", image: "images/9.png", text: "Either way, you seem to have rarely walked into a crowd of your own accord." },
                        { speaker: "You", image: "images/4.png", text: "Does that have something to do with me turning into a cockroach?" },
                        { speaker: "Master Rhinoceros", image: "images/9.png", text: "In this world, a human turning into an insect is not without reason.\nThe personality and habits a person builds up over a lifetime come to resonate with the way of life of a certain kind of insect." },
                        { speaker: "You", image: "images/4.png", text: "Resonate...?" },
                        { speaker: "Master Rhinoceros", image: "images/9.png", text: "Different insects have different ways of surviving.\nSome live in groups, others act alone. Some excel at confronting enemies head-on, while others are skilled at hiding and adapting to their surroundings.\nA human’s personality in life may form some kind of connection with these traits." },
                        { speaker: "You", image: "images/4.png", text: "So... I turned into a cockroach because of the kind of person I used to be?" },
                        { speaker: "Master Rhinoceros", image: "images/9.png", text: "That is my judgment based on what you just described.\nCockroaches excel at surviving in places no one notices. They adapt to their environment and keep living even in the most inconspicuous corners.\nIn life, you were accustomed to separating yourself from the outside world. That may be what connects you to the cockroach." },
                        { speaker: "You", image: "images/4.png", text: "......\nThen does that mean I can never turn back into a human?" },
                        { speaker: "Master Rhinoceros", image: "images/9.png", text: "I never said that.\nThere is a way to turn back into a human. It isn’t entirely impossible." },
                        { speaker: "You", image: "images/4.png", text: "Really?" },
                        { speaker: "Master Rhinoceros", image: "images/9.png", text: "If you become the champion of the Knights’ Tournament and ascend the throne, you will be granted a chance to make a wish.\nAt that time, you may tell the King your wish." },
                        { speaker: "You", image: "images/4.png", text: "So... if I become champion and become king, I can wish to turn back into a human?" },
                        { speaker: "Master Rhinoceros", image: "images/9.png", text: "Exactly." }
                    ]
                },

                // Choice 3 (left/right): The protagonist's reaction to this goal
                {
                    title: "Facing the Requirements for Champion",
                    prompt: "Having learned the only way to turn back into a human, how do you react?",
                    left: {
                        label: "Decide to accept the challenge",
                        steps: [
                            { speaker: "You", image: "images/4.png", text: "If there’s a way, then I’ll enter the Knights’ Tournament!\nIf I can become the champion, I’ll have a chance to turn back into a human." },
                            { speaker: "Master Rhinoceros", image: "images/9.png", text: "A clear goal.\nBut before that, there is still much you need to learn." }
                        ]
                    },
                    right: {
                        label: "Feel uneasy about the requirements",
                        steps: [
                            { speaker: "You", image: "images/4.png", text: "But... become the Knights’ champion, and even become king?\nThat sounds like something an ordinary person could never do." },
                            { speaker: "Master Rhinoceros", image: "images/9.png", text: "It is certainly not easy.\nBut you can’t even control your own body right now, so how can you judge that you won’t be able to do it in the future?" }
                        ]
                    },
                    // [Both routes rejoin the main storyline] Phase 4 and Phase 5
                    afterHeading: "Mastering the Body and Meditation Training",
                    afterSteps: [
                        { speaker: "You", image: "images/4.png", text: "Come to think of it... there’s one more thing.\nWhy is my body so huge? Is there any way to make myself smaller?" },
                        { speaker: "Master Rhinoceros", image: "images/9.png", text: "There is." },
                        { speaker: "You", image: "images/4.png", text: "There really is a way?" },
                        { speaker: "Master Rhinoceros", image: "images/9.png", text: "Your current size is not something that cannot be changed.\nYou simply haven’t learned how to control this body yet." },
                        { speaker: "You", image: "images/4.png", text: "Control my body?" },
                        { speaker: "Master Rhinoceros", image: "images/9.png", text: "Your mind is still stuck in your past human identity, and you haven’t truly come to understand the body you have now.\nAs long as you keep rejecting this body, it will be hard to master it." },
                        { speaker: "You", image: "images/4.png", text: "Then what exactly should I do?" },
                        { speaker: "Master Rhinoceros", image: "images/9.png", text: "First, you must accept one thing.\nYou are a cockroach now." },
                        { speaker: "You", image: "images/4.png", text: "......\nBut I don’t want to be a cockroach at all." },
                        { speaker: "Master Rhinoceros", image: "images/9.png", text: "I am not asking you to give up your wish to turn back into a human.\nYou may keep pursuing that goal.\nBut until then, this body is the one you have to use.\nYou must first acknowledge that it exists and understand how it is built before you can learn to control it." },
                        { speaker: "You", image: "images/4.png", text: "So... if I just accept that I’m a cockroach, I can shrink?" },
                        { speaker: "Master Rhinoceros", image: "images/9.png", text: "Acceptance alone is not enough.\nNext, I will teach you how to master your body through meditation.\nKeep your body steady and close your eyes.\nFeel your six legs touching the ground, and notice the weight of your body and the rise and fall of your back shell and abdomen.\nDon’t rush to change your size, and don’t deliberately imagine yourself turning back into a human.\nFirst, let your mind fully feel this body.\nThen, imagine the outline of your body gradually drawing inward, and bring your size down to whatever you wish it to be." },
                        { speaker: "You", image: "images/4.png", text: "That sounds... not very easy." },
                        { speaker: "Master Rhinoceros", image: "images/9.png", text: "That is why you need practice." }
                    ]
                },

                // Choice 4 (left/right): The protagonist prepares to begin training
                {
                    title: "Beginning Meditation Training",
                    prompt: "Before you close your eyes, what mindset do you bring to your training?",
                    left: {
                        label: "Train earnestly",
                        steps: [
                            { speaker: "You", image: "images/4.png", text: "I understand. I’ll give it an honest try." },
                            { speaker: "Master Rhinoceros", image: "images/9.png", text: "Good. Stay quiet and focus." },
                            { speaker: "Narrator", image: "images/8.png", text: "The protagonist slowly closes their eyes and begins to feel the weight of their body." },
                            { speaker: "You", image: "images/4.png", text: "......I can feel the ground under all six legs." },
                            { speaker: "Master Rhinoceros", image: "images/9.png", text: "Don’t resist the sensation. Keep going." },
                            { speaker: "You", image: "images/4.png", text: "I really am a cockroach right now...\nAt least until I turn back into a human, I have to learn to control this body." },
                            { speaker: "Master Rhinoceros", image: "images/9.png", text: "Good. Don’t get distracted." }
                        ]
                    },
                    right: {
                        label: "Train impatiently",
                        onSelect: () => {
                            window.hiddenMemoryMeditation = true;
                            console.log("Hidden memory unlocked: the protagonist can’t help muttering while meditating");
                        },
                        steps: [
                            { speaker: "You", image: "images/4.png", text: "So it’s just meditation?\nYou want me to accept being a cockroach... how could I just accept something like that on command?" },
                            { speaker: "Master Rhinoceros", image: "images/9.png", text: "Do you have a problem with that?" },
                            { speaker: "You", image: "images/4.png", text: "N-no! I’m just concentrating!" },
                            { speaker: "Narrator", image: "images/8.png", text: "The protagonist slowly closes their eyes and begins to meditate." },
                            { speaker: "You (Muttering)", image: "images/4.png", text: "I was human until yesterday... and now I have to pay attention to my six legs...\nHonestly... if it weren’t for turning back, who’d want to do this..." },
                            { speaker: "Master Rhinoceros", image: "images/9.png", text: "......\nYour concentration seems lacking." },
                            { speaker: "You", image: "images/4.png", text: "I know, I know... I’ll take it more seriously." },
                            { speaker: "Narrator", image: "images/8.png", text: "[Hidden Memory: The protagonist can’t help muttering while meditating]" },
                            { speaker: "You", image: "images/4.png", text: "......Fine.\nI don’t like this body, but right now it really is mine.\nAt least... let me learn to control it first." },
                            { speaker: "Master Rhinoceros", image: "images/9.png", text: "That’s the way. Continue." }
                        ]
                    }
                }
            ],

            // Shrinking succeeds: shared ending
            finalHeading: "Shrinking Success",
            finalSteps: [
                { speaker: "Narrator", image: "images/8.png", text: "As the protagonist gradually focuses, their enormous body begins to change.\nThe proportions of the six legs slowly shrink, and the body and back shell gradually draw inward." },
                { speaker: "You", image: "images/4.png", text: "Huh...?" },
                { speaker: "Narrator", image: "images/8.png", text: "The protagonist looks down at their own body." },
                { speaker: "You", image: "images/4.png", text: "I-I really did get smaller!" },
                { speaker: "Master Rhinoceros", image: "images/9.png", text: "You have merely grasped the basics of controlling your body.\nDon’t slack off over this small result. There is still a great deal of practice ahead of you." },
                { speaker: "You", image: "images/4.png", text: "I understand...\nThank you, Master Rhinoceros." },
                { speaker: "Master Rhinoceros", image: "images/9.png", text: "There’s no need to rush to thank me.\nRemember what you learned today. The road you have to walk is still long." }
            ],

            // After the scene ends, jump to the next card
            nextCard: "chapter2_end"
        }
    },

    // Chapter 2 end-of-scene transition card
    chapter2_end: {
        chapter: "Chapter 2: The Eccentric Scholar",
        title: "The First Training",
        description: "You successfully learned how to control your size.\nUnder Master Rhinoceros’s guidance, the training that leads to the Knights’ Tournament is only just beginning……\n\n(To be continued)",
        image: "images/8.png",
        left: { label: "↻ Return to the start (test)", next: "start" },
        right: { label: "↻ Return to the start (test)", next: "start" }
    }
};