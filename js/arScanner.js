const ARScanner = {
    videoElement: null,
    canvasElement: null,
    canvasCtx: null,
    stream: null,
    isScanning: false,
    animationFrame: null,
    detectedLevel: null,
    
    levelMarkers: {
        'level1': {
            name: '年年有余',
            color: '#D32F2F',
            pattern: 'fish',
            story: {
                title: '年年有余 - 生肖故事',
                content: '在传统剪纸中，胖娃娃抱着红鲤鱼的图案寓意"年年有余"。"鱼"与"余"谐音，象征着生活富足、年年有剩余。这个图案常用于春节装饰，表达了人们对美好生活的向往。红鲤鱼也是吉祥的象征，在生肖故事中，鲤鱼跃龙门的典故更是家喻户晓。传说只要鲤鱼能够跳过龙门，就能化身为龙，这象征着通过努力奋斗可以改变命运。'
            }
        },
        'level2': {
            name: '喜上眉梢',
            color: '#FFD700',
            pattern: 'rat',
            story: {
                title: '喜上眉梢 - 生肖故事',
                content: '在十二生肖中，鼠排名第一。传说当年玉帝要选十二生肖，老鼠凭借聪明才智，骑在牛背上抢先到达天宫，获得了第一名。在剪纸艺术中，老鼠常与梅花一起出现，寓意"喜上眉梢"（"梅"与"眉"谐音）。老鼠虽然体型最小，却凭借智慧获得了第一。这个图案告诉我们，智慧往往比力量更加重要。'
            }
        },
        'level3': {
            name: '龙凤呈祥',
            color: '#8B0000',
            pattern: 'dragon_phoenix',
            story: {
                title: '龙凤呈祥 - 神秘传说',
                content: '传说在古老的剪纸作坊中，每一张红纸都承载着制作者的心愿。当月光洒在镂空的剪纸上，那些隐藏在图案中的秘密便会显现。龙凤呈祥本是吉祥之兆，但在某些古老的传说中，它也可能是某种封印的象征。龙和凤是中国文化中最重要的神兽，龙象征着阳刚之气，凤象征着阴柔之美，龙凤呈祥则象征着阴阳调和、吉祥如意。'
            }
        },
        'level4': {
            name: '虎头虎脑',
            color: '#D32F2F',
            pattern: 'tiger',
            story: {
                title: '虎头虎脑 - 生肖故事',
                content: '虎在十二生肖中排名第三，被誉为"百兽之王"。在中国传统文化中，老虎象征着力量、威严和勇气。虎头帽、虎头鞋是中国传统民俗中常见的物品，人们相信它们能保护孩子健康成长、驱邪避凶。老虎的"王"字额头更是权威的象征。在剪纸艺术中，老虎常常被剪成威武的形象，用于表达对力量和勇气的向往。'
            }
        },
        'level5': {
            name: '月宫玉兔',
            color: '#8B0000',
            pattern: 'rabbit',
            story: {
                title: '月宫玉兔 - 神秘传说',
                content: '传说月宫中住着嫦娥和玉兔。玉兔常年在桂树下捣药，那药据说能让人长生不老。但在某些古老的传说中，玉兔捣的并非长生药，而是某种能够解开时空封印的神秘药剂。当满月之夜，月光洒在玉兔剪纸上，据说能看到另一个世界。嫦娥奔月的故事更是家喻户晓，她因偷吃了西王母的不死药而飞升月宫，成为了月亮女神。'
            }
        },
        'level6': {
            name: '双龙戏珠',
            color: '#D32F2F',
            pattern: 'double_dragon',
            story: {
                title: '双龙戏珠 - 生肖故事',
                content: '龙是十二生肖中唯一虚构的神兽，也是中国文化中最重要的象征之一。龙象征着皇权、权威和好运。"双龙戏珠"是中国传统艺术中常见的题材，两条龙围绕着一颗宝珠嬉戏，象征着吉祥如意、权力平衡。宝珠通常代表着太阳、月亮或者珍贵的宝物。在传统剪纸中，龙的图案常常用于庆典和重要场合，表达人们对美好生活的向往。'
            }
        }
    },
    
    init: function() {
        this.bindEvents();
        console.log('AR扫描模块初始化完成');
    },
    
    bindEvents: function() {
        const startCameraBtn = document.getElementById('start-camera-btn');
        const stopCameraBtn = document.getElementById('stop-camera-btn');
        
        if (startCameraBtn) {
            startCameraBtn.addEventListener('click', () => this.startCamera());
        }
        
        if (stopCameraBtn) {
            stopCameraBtn.addEventListener('click', () => this.stopCamera());
        }
    },
    
    startCamera: async function() {
        this.videoElement = document.getElementById('ar-camera');
        this.canvasElement = document.getElementById('ar-process-canvas');
        
        if (!this.videoElement || !this.canvasElement) {
            alert('无法找到相机元素！');
            return;
        }
        
        this.canvasCtx = this.canvasElement.getContext('2d');
        
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });
            
            this.videoElement.srcObject = this.stream;
            this.isScanning = true;
            
            const startBtn = document.getElementById('start-camera-btn');
            const stopBtn = document.getElementById('stop-camera-btn');
            if (startBtn) startBtn.style.display = 'none';
            if (stopBtn) stopBtn.style.display = 'inline-block';
            
            this.updateStatus('📷 相机已启动，请将关卡海报放入扫描框内');
            
            this.startScanning();
            
        } catch (error) {
            console.error('无法访问相机:', error);
            alert('无法访问相机，请检查权限设置。\n\n错误信息: ' + error.message + '\n\n提示：您可以使用"模拟扫描"功能来体验AR效果。');
            
            this.showSimulatedScan();
        }
    },
    
    stopCamera: function() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        
        this.isScanning = false;
        this.detectedLevel = null;
        
        const startBtn = document.getElementById('start-camera-btn');
        const stopBtn = document.getElementById('stop-camera-btn');
        if (startBtn) startBtn.style.display = 'inline-block';
        if (stopBtn) stopBtn.style.display = 'none';
        
        this.updateStatus('📷 相机已停止');
        this.hideResult();
    },
    
    startScanning: function() {
        const scan = () => {
            if (!this.isScanning) return;
            
            if (this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA) {
                this.processFrame();
            }
            
            this.animationFrame = requestAnimationFrame(scan);
        };
        
        scan();
    },
    
    processFrame: function() {
        const video = this.videoElement;
        const canvas = this.canvasElement;
        const ctx = this.canvasCtx;
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const frameData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const detected = this.analyzeFrame(frameData, canvas.width, canvas.height);
        
        if (detected) {
            this.onMarkerDetected(detected);
        }
    },
    
    analyzeFrame: function(imageData, width, height) {
        const data = imageData.data;
        
        const centerX = Math.floor(width / 2);
        const centerY = Math.floor(height / 2);
        const sampleSize = Math.min(width, height) * 0.3;
        const startX = Math.floor(centerX - sampleSize / 2);
        const startY = Math.floor(centerY - sampleSize / 2);
        
        let totalRed = 0;
        let totalGold = 0;
        let pixelCount = 0;
        
        for (let y = startY; y < startY + sampleSize && y < height; y++) {
            for (let x = startX; x < startX + sampleSize && x < width; x++) {
                const idx = (y * width + x) * 4;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                
                if (this.isRedColor(r, g, b)) {
                    totalRed++;
                }
                if (this.isGoldColor(r, g, b)) {
                    totalGold++;
                }
                pixelCount++;
            }
        }
        
        const redRatio = totalRed / pixelCount;
        const goldRatio = totalGold / pixelCount;
        
        if (redRatio > 0.1 || goldRatio > 0.05) {
            const levelKeys = Object.keys(this.levelMarkers);
            const randomLevel = levelKeys[Math.floor(Math.random() * levelKeys.length)];
            return randomLevel;
        }
        
        return null;
    },
    
    isRedColor: function(r, g, b) {
        return r > 100 && g < 80 && b < 80 && r > g * 1.5 && r > b * 1.5;
    },
    
    isGoldColor: function(r, g, b) {
        return r > 150 && g > 100 && b < 80 && r > b * 1.5 && g > b * 1.2;
    },
    
    onMarkerDetected: function(levelKey) {
        if (this.detectedLevel === levelKey) return;
        
        this.detectedLevel = levelKey;
        const levelData = this.levelMarkers[levelKey];
        
        if (!levelData) return;
        
        this.updateStatus(`🎉 检测到: ${levelData.name}`);
        this.playAnimation(levelData);
    },
    
    playAnimation: function(levelData) {
        this.showResult();
        
        const storyTitle = document.getElementById('ar-story-title');
        const storyContent = document.getElementById('ar-story-content');
        
        if (storyTitle) storyTitle.textContent = levelData.story.title;
        if (storyContent) storyContent.textContent = levelData.story.content;
        
        this.playCanvasAnimation(levelData);
    },
    
    playCanvasAnimation: function(levelData) {
        const canvas = document.getElementById('animation-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        let frame = 0;
        const maxFrames = 120;
        
        const animate = () => {
            if (frame >= maxFrames) {
                this.drawFinalAnimation(ctx, width, height, levelData);
                return;
            }
            
            ctx.fillStyle = '#FFF8E7';
            ctx.fillRect(0, 0, width, height);
            
            const progress = frame / maxFrames;
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            this.drawAnimationFrame(ctx, width, height, easeProgress, levelData);
            
            frame++;
            requestAnimationFrame(animate);
        };
        
        animate();
    },
    
    drawAnimationFrame: function(ctx, width, height, progress, levelData) {
        const centerX = width / 2;
        const centerY = height / 2;
        
        ctx.save();
        ctx.globalAlpha = progress;
        
        ctx.fillStyle = levelData.color;
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 4;
        
        const size = 100 + progress * 100;
        const rotation = progress * Math.PI * 4;
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation);
        
        ctx.beginPath();
        for (let i = 0; i <= 360; i += 30) {
            const angle = (i * Math.PI) / 180;
            const r = size * (0.8 + Math.sin(angle * 6) * 0.2);
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.restore();
        
        ctx.fillStyle = levelData.color;
        ctx.font = `bold ${24 + progress * 16}px "KaiTi", "STKaiti", serif`;
        ctx.textAlign = 'center';
        ctx.globalAlpha = Math.max(0, (progress - 0.5) * 2);
        ctx.fillText(levelData.name, centerX, centerY + size + 40);
        
        ctx.restore();
        
        for (let i = 0; i < 20; i++) {
            const particleProgress = (progress + i * 0.02) % 1;
            const particleX = centerX + Math.cos(i * 0.5) * particleProgress * 300;
            const particleY = centerY + Math.sin(i * 0.5) * particleProgress * 300;
            const particleSize = 5 * (1 - particleProgress);
            
            ctx.fillStyle = `rgba(255, 215, 0, ${1 - particleProgress})`;
            ctx.beginPath();
            ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
            ctx.fill();
        }
    },
    
    drawFinalAnimation: function(ctx, width, height, levelData) {
        const centerX = width / 2;
        const centerY = height / 2;
        
        ctx.fillStyle = '#FFF8E7';
        ctx.fillRect(0, 0, width, height);
        
        ctx.fillStyle = levelData.color;
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 4;
        
        ctx.save();
        ctx.translate(centerX, centerY);
        
        ctx.beginPath();
        for (let i = 0; i <= 360; i += 30) {
            const angle = (i * Math.PI) / 180;
            const r = 150 * (0.8 + Math.sin(angle * 6) * 0.2);
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.restore();
        
        ctx.fillStyle = levelData.color;
        ctx.font = 'bold 48px "KaiTi", "STKaiti", serif';
        ctx.textAlign = 'center';
        ctx.fillText(levelData.name, centerX, centerY + 200);
        
        ctx.fillStyle = '#8B0000';
        ctx.font = '24px "KaiTi", "STKaiti", serif';
        ctx.fillText('✨ 故事已解锁 ✨', centerX, centerY + 240);
    },
    
    showSimulatedScan: function() {
        this.updateStatus('🔍 模拟扫描模式 - 随机展示关卡故事');
        
        setTimeout(() => {
            const levelKeys = Object.keys(this.levelMarkers);
            const randomLevel = levelKeys[Math.floor(Math.random() * levelKeys.length)];
            this.onMarkerDetected(randomLevel);
        }, 2000);
    },
    
    updateStatus: function(message) {
        const statusEl = document.getElementById('ar-status');
        if (statusEl) {
            statusEl.innerHTML = `<p>${message}</p>`;
        }
    },
    
    showResult: function() {
        const resultSection = document.getElementById('ar-result-section');
        if (resultSection) {
            resultSection.classList.add('active');
        }
    },
    
    hideResult: function() {
        const resultSection = document.getElementById('ar-result-section');
        if (resultSection) {
            resultSection.classList.remove('active');
        }
    }
};

window.ARScanner = ARScanner;
