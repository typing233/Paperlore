# 纸影谜途 - 剪纸解谜游戏

一款将传统剪纸工艺与古诗词、生肖故事及中式悬疑元素相融合的互动解谜游戏。玩家需要通过理解文化线索，运用对称原理来剪出真相。

## 游戏特色

### 🎨 交互式绘图画布
- **动态对称裁剪**: 只需裁剪一半，系统会自动生成对称的另一半
- **实时镂空效果**: 使用 `destination-out` 合成模式实现逼真的剪纸镂空效果
- **可调节剪刀大小**: 支持精细裁剪和大面积裁剪
- **撤销/重做功能**: 最多支持30步操作历史

### 📜 关卡与解谜系统
- **古诗词线索**: 每个关卡都配有原创诗句作为解谜提示
- **生肖故事**: 深入了解十二生肖的传统文化背景
- **关卡递进**: 6个精心设计的关卡，难度逐渐提升
- **进度保存**: 本地存储玩家进度和最佳成绩

### ✂️ 剪刀交互工具
- **精美剪刀图标**: SVG矢量图标，支持两种视觉风格
- **橡皮擦工具**: 可以修复裁剪错误
- **对称模式切换**: 自由选择是否启用对称裁剪

### 🌙 多重视觉渲染引擎
- **喜庆红色调**: 传统节日的温暖氛围，金色边框装饰
- **中式悬疑氛围**: 深色调配合动态光影效果，营造神秘氛围
- **一键切换**: 右下角的太阳/月亮按钮随时切换氛围

### 🖼️ 作品结算与分享
- **相似度评分**: 智能评估玩家作品与目标的匹配度
- **诗句解密**: 通关后揭示完整诗句
- **生肖故事解锁**: 深入了解背后的文化故事
- **海报导出**: 将作品导出为精美的图文海报，包含诗词和主题信息

## 游戏玩法

1. **开始游戏**: 从主菜单进入关卡选择页面
2. **选择关卡**: 选择已解锁的关卡开始挑战
3. **理解线索**: 阅读诗词线索和生肖故事，理解目标图案
4. **开始裁剪**: 在红色画布上使用鼠标进行裁剪
   - 对称模式下，裁剪左侧会自动在右侧生成对称图案
   - 可以调整剪刀大小以适应不同区域
5. **提交作品**: 完成后点击"提交作品"进行评分
6. **分享成果**: 导出海报分享你的剪纸作品

## 关卡介绍

| 关卡 | 名称 | 主题 | 氛围 | 难度 |
|------|------|------|------|------|
| 1 | 年年有余 | 新春系列 | 喜庆 | ⭐ |
| 2 | 喜上眉梢 | 生肖系列 · 鼠 | 喜庆 | ⭐⭐ |
| 3 | 龙凤呈祥 | 中式悬疑 | 悬疑 | ⭐⭐⭐ |
| 4 | 虎头虎脑 | 生肖系列 · 虎 | 喜庆 | ⭐⭐ |
| 5 | 月宫玉兔 | 中式悬疑 | 悬疑 | ⭐⭐⭐ |
| 6 | 双龙戏珠 | 新春系列 | 喜庆 | ⭐⭐⭐⭐ |

## 技术实现

### 前端技术栈
- **HTML5**: 页面结构
- **CSS3**: 样式与动画，使用CSS变量实现双主题切换
- **JavaScript ES6**: 核心游戏逻辑
- **Canvas API**: 绘图画布和图像处理

### 核心模块

#### 1. Canvas 模块 (`js/canvas.js`)
负责所有画布相关操作：
- `PaperCanvas.init()` - 初始化画布
- `PaperCanvas.cutAt()` - 单点裁剪
- `PaperCanvas.cutLine()` - 连续裁剪
- `PaperCanvas.saveState()` - 保存历史状态
- `PaperCanvas.undo()` / `PaperCanvas.redo()` - 撤销重做
- `PaperCanvas.calculateSimilarity()` - 计算相似度评分

#### 2. 游戏模块 (`js/game.js`)
负责游戏状态管理：
- `Game.init()` - 游戏初始化
- `Game.showScreen()` - 页面切换
- `Game.startLevel()` - 开始关卡
- `Game.submitWork()` - 提交作品
- `Game.toggleAtmosphere()` - 切换氛围

#### 3. 关卡模块 (`js/levels.js`)
存储和管理关卡数据：
- `Levels.getLevelById()` - 获取关卡数据
- `Levels.getProgress()` - 获取玩家进度
- `Levels.completeLevel()` - 完成关卡

#### 4. 工具模块 (`js/utils.js`)
通用工具函数：
- `Utils.createPosterCanvas()` - 创建导出海报
- `Utils.downloadImage()` - 下载图片
- `Utils.saveToLocalStorage()` - 本地存储

### 视觉特效实现

#### 对称裁剪
```javascript
cutAt: function(x, y) {
    this.drawCircle(x, y);
    
    if (this.symmetryEnabled) {
        const mirroredX = Utils.mirrorX(x, this.width / 2);
        this.drawCircle(mirroredX, y);
    }
}
```

#### 镂空效果
使用 Canvas 的 `globalCompositeOperation` 属性：
```javascript
if (this.currentTool === 'scissors') {
    ctx.globalCompositeOperation = 'destination-out';
} else {
    ctx.globalCompositeOperation = 'source-over';
}
```

#### 双主题切换
使用 CSS 变量和 `data-atmosphere` 属性：
```css
:root {
    --primary-red: #D32F2F;
    /* ... 其他喜庆变量 */
}

[data-atmosphere="horror"] {
    --primary-red: #8B0000;
    /* ... 其他悬疑变量 */
}
```

## 项目结构

```
Paperlore/
├── index.html          # 主页面
├── README.md          # 项目文档
├── css/
│   └── style.css      # 样式文件（双主题）
└── js/
    ├── main.js        # 入口文件
    ├── game.js        # 游戏核心逻辑
    ├── canvas.js      # Canvas 绘图模块
    ├── levels.js      # 关卡数据
    └── utils.js       # 工具函数
```

## 运行方式

### 方式一：直接打开
使用浏览器直接打开 `index.html` 文件即可游玩。

### 方式二：本地服务器
使用 Python 启动简单服务器：

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

然后在浏览器访问 `http://localhost:8000`

### 方式三：使用其他服务器
```bash
# 使用 Node.js 的 http-server
npx http-server -p 8000

# 使用 PHP
php -S localhost:8000
```

## 快捷键

| 按键 | 功能 |
|------|------|
| `Ctrl + Z` | 撤销 |
| `Ctrl + Shift + Z` | 重做 |
| `ESC` | 暂停/继续 |

## 浏览器兼容性

- Chrome 60+ ✅
- Firefox 55+ ✅
- Safari 11+ ✅
- Edge 79+ ✅

## 后续扩展计划

- [ ] 添加更多关卡（十二生肖全系列）
- [ ] 实现关卡编辑器
- [ ] 添加音效和背景音乐
- [ ] 实现在线排行榜
- [ ] 添加多人对战模式
- [ ] 支持自定义背景和纸张颜色
- [ ] 添加更多剪纸图案模板

## 开发说明

### 如何添加新关卡
在 `js/levels.js` 的 `levels` 数组中添加新的关卡对象：

```javascript
{
    id: 7,
    name: '新关卡名称',
    theme: '主题系列',
    difficulty: 3,
    atmosphere: 'festive', // 或 'horror'
    
    clue: {
        type: '线索类型',
        icon: '🎨',
        content: '诗句内容<br>第二行诗句'
    },
    
    story: {
        title: '故事标题',
        content: '故事内容...'
    },
    
    hint: '提示信息...',
    revealedPoem: '通关后显示的完整诗句',
    unlockedStory: '解锁的故事内容',
    targetPattern: 'pattern_name'
}
```

## 文化背景

剪纸艺术是中国最古老的民间艺术之一，距今已有三千多年的历史。传统剪纸常用于节日装饰、宗教仪式和民俗活动，通过镂空的艺术效果展现丰富的图案和寓意。

本游戏将传统剪纸工艺与现代游戏机制相结合，希望能够让更多人了解和喜爱这一珍贵的非物质文化遗产。

## 许可证

MIT License

---

**剪出真相，传承千年**

纸影谜途团队
