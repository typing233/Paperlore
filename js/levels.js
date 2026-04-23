const Levels = {
    _storageKey: 'paperlore_progress',
    
    _defaultProgress: {
        currentLevel: 1,
        completedLevels: [],
        bestScores: {}
    },
    
    getProgress: function() {
        const saved = Utils.loadFromLocalStorage(this._storageKey);
        return saved ? saved : Utils.deepClone(this._defaultProgress);
    },
    
    saveProgress: function(progress) {
        return Utils.saveToLocalStorage(this._storageKey, progress);
    },
    
    completeLevel: function(levelId, score) {
        const progress = this.getProgress();
        if (!progress.completedLevels.includes(levelId)) {
            progress.completedLevels.push(levelId);
        }
        if (!progress.bestScores[levelId] || score > progress.bestScores[levelId]) {
            progress.bestScores[levelId] = score;
        }
        if (levelId >= progress.currentLevel) {
            progress.currentLevel = levelId + 1;
        }
        this.saveProgress(progress);
    },
    
    isLevelUnlocked: function(levelId) {
        const progress = this.getProgress();
        return levelId <= progress.currentLevel;
    },
    
    getLevelData: function(levelId) {
        return this.levels[levelId - 1] || null;
    },
    
    levels: [
        {
            id: 1,
            name: '年年有余',
            theme: '新春系列',
            difficulty: 1,
            atmosphere: 'festive',
            
            clue: {
                type: '诗词线索',
                icon: '📜',
                content: '喜气洋洋抱红鲤，<br>年年有余福满堂。<br>圆圆脸蛋笑开颜，<br>吉祥如意庆新春。'
            },
            
            story: {
                title: '生肖故事',
                content: '在传统剪纸中，胖娃娃抱红鲤鱼的图案寓意"年年有余"。"鱼"与"余"谐音，象征着生活富足、年年有剩余。这个图案常用于春节装饰，表达了人们对美好生活的向往。红鲤鱼也是吉祥的象征，在生肖故事中，鲤鱼跃龙门的典故更是家喻户晓。'
            },
            
            hint: '提示：尝试从中心开始，剪出圆润的娃娃头部轮廓，然后在一侧剪出鱼的形状。注意运用对称原理！',
            
            revealedPoem: '喜气洋洋抱红鲤，<br>年年有余福满堂。<br>圆圆脸蛋笑开颜，<br>吉祥如意庆新春。',
            
            unlockedStory: '恭喜你完成了"年年有余"的剪纸！这个图案是中国剪纸艺术中最经典的题材之一。胖娃娃圆润的脸庞代表着圆满和幸福，红鲤鱼则象征着富裕和好运。在中国传统文化中，"余"不仅指财富，更指精神上的富足和传承。',
            
            targetPattern: 'fish',
            
            requiredShape: {
                type: 'symmetric',
                elements: [
                    { name: 'head', description: '圆形的娃娃头部' },
                    { name: 'body', description: '圆润的身体轮廓' },
                    { name: 'fish', description: '鲤鱼的身体和尾巴' }
                ]
            }
        },
        
        {
            id: 2,
            name: '喜上眉梢',
            theme: '生肖系列 · 鼠',
            difficulty: 2,
            atmosphere: 'festive',
            
            clue: {
                type: '生肖线索',
                icon: '🐭',
                content: '十二生肖鼠为首，<br>机灵聪慧第一筹。<br>喜上眉梢传佳音，<br>岁岁平安福运久。'
            },
            
            story: {
                title: '生肖故事',
                content: '在十二生肖中，鼠排名第一。传说当年玉帝要选十二生肖，老鼠凭借聪明才智，骑在牛背上抢先到达天宫，获得了第一名。在剪纸艺术中，老鼠常与梅花一起出现，寓意"喜上眉梢"（"梅"与"眉"谐音）。'
            },
            
            hint: '提示：剪出机灵的小老鼠形象，注意耳朵要大而圆，尾巴细长。可以在旁边加上梅花图案，象征喜上眉梢！',
            
            revealedPoem: '十二生肖鼠为首，<br>机灵聪慧第一筹。<br>喜上眉梢传佳音，<br>岁岁平安福运久。',
            
            unlockedStory: '你成功剪出了"喜上眉梢"的剪纸！老鼠在生肖中虽然体型最小，却凭借智慧获得了第一。这个图案中，老鼠站在梅花枝上，"梅"与"眉"谐音，寓意喜事降临、好运连连。在中国传统文化中，老鼠还象征着智慧和机敏。',
            
            targetPattern: 'rat',
            
            requiredShape: {
                type: 'symmetric',
                elements: [
                    { name: 'body', description: '老鼠的身体轮廓' },
                    { name: 'ears', description: '大而圆的耳朵' },
                    { name: 'tail', description: '细长的尾巴' }
                ]
            }
        },
        
        {
            id: 3,
            name: '龙凤呈祥',
            theme: '中式悬疑',
            difficulty: 3,
            atmosphere: 'horror',
            
            clue: {
                type: '神秘线索',
                icon: '🌙',
                content: '月黑风高夜深沉，<br>龙凤呈祥藏迷津。<br>红纸剪成心中事，<br>镂空之处见真心。'
            },
            
            story: {
                title: '神秘传说',
                content: '传说在古老的剪纸作坊中，每一张红纸都承载着制作者的心愿。当月光洒在镂空的剪纸上，那些隐藏在图案中的秘密便会显现。龙凤呈祥本是吉祥之兆，但在某些古老的传说中，它也可能是某种封印的象征...'
            },
            
            hint: '提示：这是一个悬疑关卡。剪出龙和凤的轮廓，但要注意——镂空的部分才是真正的秘密所在。尝试对称裁剪，让左右两边形成神秘的图案。',
            
            revealedPoem: '月黑风高夜深沉，<br>龙凤呈祥藏迷津。<br>红纸剪成心中事，<br>镂空之处见真心。',
            
            unlockedStory: '你揭开了"龙凤呈祥"的秘密！在中式悬疑题材中，剪纸的镂空效果常常被用来营造神秘感。当灯光从背后照来时，镂空的部分会形成独特的光影图案。龙凤呈祥虽然通常象征吉祥，但在这个悬疑版本中，它暗示着某种古老的封印即将被解开...',
            
            targetPattern: 'dragon_phoenix',
            
            requiredShape: {
                type: 'symmetric',
                elements: [
                    { name: 'dragon', description: '龙的轮廓（左侧）' },
                    { name: 'phoenix', description: '凤的轮廓（右侧）' },
                    { name: 'pattern', description: '中心的神秘图案' }
                ]
            }
        },
        
        {
            id: 4,
            name: '虎头虎脑',
            theme: '生肖系列 · 虎',
            difficulty: 2,
            atmosphere: 'festive',
            
            clue: {
                type: '生肖线索',
                icon: '🐯',
                content: '虎年虎威震山林，<br>虎头虎脑显精神。<br>剪纸剪出英雄气，<br>驱邪避凶保平安。'
            },
            
            story: {
                title: '生肖故事',
                content: '虎在十二生肖中排名第三，被誉为"百兽之王"。在中国传统文化中，老虎象征着力量、威严和勇气。虎头帽、虎头鞋是中国传统民俗中常见的物品，人们相信它们能保护孩子健康成长、驱邪避凶。'
            },
            
            hint: '提示：剪出威风凛凛的老虎头部。注意老虎的特征：圆眼睛、王字额头、锯齿状的嘴巴。运用对称原理，剪出对称的虎脸！',
            
            revealedPoem: '虎年虎威震山林，<br>虎头虎脑显精神。<br>剪纸剪出英雄气，<br>驱邪避凶保平安。',
            
            unlockedStory: '你剪出了威武的老虎剪纸！虎是生肖中最具威严的动物之一。在中国传统剪纸中，老虎常常被剪成"虎头"的形象，用于制作虎头帽、虎头枕等物品。这些物品不仅可爱，更寄托了父母对孩子的美好祝愿——希望孩子能够像老虎一样勇敢、健康、充满活力。',
            
            targetPattern: 'tiger',
            
            requiredShape: {
                type: 'symmetric',
                elements: [
                    { name: 'head', description: '老虎的头部轮廓' },
                    { name: 'eyes', description: '圆圆的眼睛' },
                    { name: 'pattern', description: '身上的条纹' }
                ]
            }
        },
        
        {
            id: 5,
            name: '月宫玉兔',
            theme: '中式悬疑',
            difficulty: 3,
            atmosphere: 'horror',
            
            clue: {
                type: '神秘线索',
                icon: '🐰',
                content: '嫦娥应悔偷灵药，<br>碧海青天夜夜心。<br>玉兔捣药千年久，<br>剪纸之中藏玄机。'
            },
            
            story: {
                title: '神秘传说',
                content: '传说月宫中住着嫦娥和玉兔。玉兔常年在桂树下捣药，那药据说能让人长生不老。但在某些古老的传说中，玉兔捣的并非长生药，而是某种能够解开时空封印的神秘药剂。当满月之夜，月光洒在玉兔剪纸上，据说能看到另一个世界...'
            },
            
            hint: '提示：剪出月宫玉兔的形象。兔子的特征是长耳朵、三瓣嘴、圆身体。在悬疑氛围中，尝试剪出一些神秘的符号——也许是月亮，也许是某种古老的图案...',
            
            revealedPoem: '嫦娥应悔偷灵药，<br>碧海青天夜夜心。<br>玉兔捣药千年久，<br>剪纸之中藏玄机。',
            
            unlockedStory: '你解开了"月宫玉兔"的秘密！在中式悬疑题材中，月宫玉兔的故事充满了神秘感。嫦娥奔月、玉兔捣药，这些古老的传说在剪纸艺术中被赋予了新的意义。镂空的兔子剪影，在月光下会呈现出怎样的光影？也许，那正是通往另一个世界的入口...',
            
            targetPattern: 'rabbit',
            
            requiredShape: {
                type: 'symmetric',
                elements: [
                    { name: 'body', description: '兔子的身体轮廓' },
                    { name: 'ears', description: '长长的耳朵' },
                    { name: 'moon', description: '周围的月亮图案' }
                ]
            }
        },
        
        {
            id: 6,
            name: '双龙戏珠',
            theme: '新春系列',
            difficulty: 4,
            atmosphere: 'festive',
            
            clue: {
                type: '诗词线索',
                icon: '🐉',
                content: '双龙戏珠云间舞，<br>金鳞闪耀映日光。<br>剪纸传承千年艺，<br>龙腾虎跃庆吉祥。'
            },
            
            story: {
                title: '生肖故事',
                content: '龙是十二生肖中唯一虚构的神兽，也是中国文化中最重要的象征之一。龙象征着皇权、权威和好运。"双龙戏珠"是中国传统艺术中常见的题材，两条龙围绕着一颗宝珠嬉戏，象征着吉祥如意、权力平衡。'
            },
            
            hint: '提示：这是一个高级关卡。剪出双龙戏珠的图案。龙的特征是：蛇身、鹿角、鹰爪、鱼鳞。由于是对称裁剪，你只需要剪出一条龙，另一条龙会镜像呈现。宝珠放在中心位置！',
            
            revealedPoem: '双龙戏珠云间舞，<br>金鳞闪耀映日光。<br>剪纸传承千年艺，<br>龙腾虎跃庆吉祥。',
            
            unlockedStory: '你完成了壮观的"双龙戏珠"剪纸！龙在中国文化中具有极其重要的地位。作为十二生肖中唯一的神兽，龙代表着力量、智慧和好运。双龙戏珠的图案象征着阴阳调和、吉祥如意。在传统剪纸中，龙的图案常常用于庆典和重要场合，表达人们对美好生活的向往。',
            
            targetPattern: 'double_dragon',
            
            requiredShape: {
                type: 'symmetric',
                elements: [
                    { name: 'dragon', description: '龙的身体轮廓' },
                    { name: 'head', description: '龙的头部（鹿角、长须）' },
                    { name: 'pearl', description: '中心的宝珠' },
                    { name: 'clouds', description: '周围的云纹' }
                ]
            }
        }
    ],
    
    getTotalLevels: function() {
        return this.levels.length;
    },
    
    getLevelById: function(id) {
        return this.levels.find(level => level.id === id) || null;
    },
    
    getLevelsByTheme: function(theme) {
        return this.levels.filter(level => level.theme.includes(theme));
    }
};

window.Levels = Levels;
