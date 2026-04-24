const AIGenerator = {
    canvas: null,
    ctx: null,
    currentKeyword: '',
    generatedTemplate: null,
    
    keywordPatterns: {
        '月宫玉兔': {
            name: '月宫玉兔',
            description: '月亮中的玉兔，寓意吉祥如意',
            generate: function(ctx, width, height) {
                AIGenerator.drawRabbitMoonPattern(ctx, width, height);
            }
        },
        '龙凤呈祥': {
            name: '龙凤呈祥',
            description: '龙和凤的吉祥图案',
            generate: function(ctx, width, height) {
                AIGenerator.drawDragonPhoenixPattern(ctx, width, height);
            }
        },
        '喜上眉梢': {
            name: '喜上眉梢',
            description: '喜鹊站在梅花枝上',
            generate: function(ctx, width, height) {
                AIGenerator.drawMagpiePlumPattern(ctx, width, height);
            }
        },
        '年年有余': {
            name: '年年有余',
            description: '胖娃娃抱鲤鱼',
            generate: function(ctx, width, height) {
                AIGenerator.drawFishChildPattern(ctx, width, height);
            }
        },
        '虎头虎脑': {
            name: '虎头虎脑',
            description: '威武的老虎形象',
            generate: function(ctx, width, height) {
                AIGenerator.drawTigerPattern(ctx, width, height);
            }
        },
        '双龙戏珠': {
            name: '双龙戏珠',
            description: '两条龙围绕宝珠',
            generate: function(ctx, width, height) {
                AIGenerator.drawDoubleDragonPattern(ctx, width, height);
            }
        },
        '福': {
            name: '福字',
            description: '传统福字剪纸',
            generate: function(ctx, width, height) {
                AIGenerator.drawFuCharacter(ctx, width, height);
            }
        },
        '春': {
            name: '春字',
            description: '春节主题春字',
            generate: function(ctx, width, height) {
                AIGenerator.drawSpringCharacter(ctx, width, height);
            }
        },
        '蝴蝶': {
            name: '蝴蝶',
            description: '美丽的蝴蝶图案',
            generate: function(ctx, width, height) {
                AIGenerator.drawButterflyPattern(ctx, width, height);
            }
        },
        '蝙蝠': {
            name: '蝙蝠',
            description: '寓意福气的蝙蝠',
            generate: function(ctx, width, height) {
                AIGenerator.drawBatPattern(ctx, width, height);
            }
        }
    },
    
    init: function() {
        this.bindEvents();
        console.log('AI生成模块初始化完成');
    },
    
    bindEvents: function() {
        const generateBtn = document.getElementById('generate-btn');
        const keywordInput = document.getElementById('keyword-input');
        const useTemplateBtn = document.getElementById('use-template-btn');
        const regenerateBtn = document.getElementById('regenerate-btn');
        
        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.generateFromKeyword());
        }
        
        if (keywordInput) {
            keywordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.generateFromKeyword();
                }
            });
        }
        
        if (useTemplateBtn) {
            useTemplateBtn.addEventListener('click', () => this.useAsTemplate());
        }
        
        if (regenerateBtn) {
            regenerateBtn.addEventListener('click', () => this.regenerate());
        }
    },
    
    generateFromKeyword: function() {
        const keywordInput = document.getElementById('keyword-input');
        const keyword = keywordInput.value.trim();
        
        if (!keyword) {
            alert('请输入关键词！');
            return;
        }
        
        this.currentKeyword = keyword;
        this.showLoading(true);
        this.hideResult();
        
        setTimeout(() => {
            this.generatePattern(keyword);
            this.showLoading(false);
            this.showResult();
        }, 1500);
    },
    
    generatePattern: function(keyword) {
        const canvas = document.getElementById('ai-preview-canvas');
        if (!canvas) return;
        
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        const width = canvas.width;
        const height = canvas.height;
        
        this.ctx.fillStyle = '#FFF8E7';
        this.ctx.fillRect(0, 0, width, height);
        
        this.ctx.fillStyle = '#D32F2F';
        this.ctx.fillRect(20, 20, width - 40, height - 40);
        
        let matched = false;
        for (const [key, pattern] of Object.entries(this.keywordPatterns)) {
            if (keyword.includes(key) || key.includes(keyword)) {
                pattern.generate(this.ctx, width, height);
                matched = true;
                break;
            }
        }
        
        if (!matched) {
            this.generateGenericPattern(keyword);
        }
        
        this.generatedTemplate = this.ctx.getImageData(0, 0, width, height);
    },
    
    generateGenericPattern: function(keyword) {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        
        ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        this.drawDecorativeBorder(ctx, width, height);
        this.drawCentralPattern(ctx, centerX, centerY, 80);
        this.drawCornerPatterns(ctx, width, height);
        
        ctx.fillStyle = '#D32F2F';
        ctx.globalCompositeOperation = 'source-over';
        ctx.font = 'bold 24px "KaiTi", "STKaiti", serif';
        ctx.textAlign = 'center';
        ctx.fillText(keyword, centerX, height - 60);
        
        ctx.restore();
    },
    
    drawDecorativeBorder: function(ctx, width, height) {
        const margin = 40;
        
        for (let i = 0; i < 20; i++) {
            const t = i / 20;
            const x = margin + t * (width - 2 * margin);
            const y = margin;
            this.drawSmallCircle(ctx, x, y, 4);
            this.drawSmallCircle(ctx, x, height - margin, 4);
        }
        
        for (let i = 0; i < 20; i++) {
            const t = i / 20;
            const x = margin;
            const y = margin + t * (height - 2 * margin);
            this.drawSmallCircle(ctx, x, y, 4);
            this.drawSmallCircle(ctx, width - margin, y, 4);
        }
    },
    
    drawCentralPattern: function(ctx, centerX, centerY, radius) {
        ctx.beginPath();
        for (let i = 0; i <= 360; i += 10) {
            const angle = (i * Math.PI) / 180;
            const r = radius + Math.sin(angle * 6) * 10;
            const x = centerX + Math.cos(angle) * r;
            const y = centerY + Math.sin(angle) * r;
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.5, 0, Math.PI * 2);
        ctx.stroke();
        
        for (let i = 0; i < 8; i++) {
            const angle = (i * 45 * Math.PI) / 180;
            const x1 = centerX + Math.cos(angle) * radius * 0.6;
            const y1 = centerY + Math.sin(angle) * radius * 0.6;
            const x2 = centerX + Math.cos(angle) * radius * 0.9;
            const y2 = centerY + Math.sin(angle) * radius * 0.9;
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
    },
    
    drawCornerPatterns: function(ctx, width, height) {
        const corners = [
            { x: 60, y: 60 },
            { x: width - 60, y: 60 },
            { x: 60, y: height - 60 },
            { x: width - 60, y: height - 60 }
        ];
        
        corners.forEach(corner => {
            this.drawCloudPattern(ctx, corner.x, corner.y, 25);
        });
    },
    
    drawCloudPattern: function(ctx, x, y, size) {
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.arc(x + size * 0.8, y - size * 0.3, size * 0.7, 0, Math.PI * 2);
        ctx.arc(x - size * 0.6, y + size * 0.2, size * 0.6, 0, Math.PI * 2);
        ctx.fill();
    },
    
    drawSmallCircle: function(ctx, x, y, radius) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    },
    
    drawRabbitMoonPattern: function(ctx, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.arc(centerX, centerY - 20, 120, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = '#D32F2F';
        ctx.beginPath();
        ctx.arc(centerX + 30, centerY - 40, 90, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.globalCompositeOperation = 'destination-out';
        
        const rabbitCenterX = centerX - 20;
        const rabbitCenterY = centerY + 20;
        
        ctx.beginPath();
        ctx.ellipse(rabbitCenterX, rabbitCenterY + 30, 35, 45, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(rabbitCenterX, rabbitCenterY - 25, 28, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.ellipse(rabbitCenterX - 15, rabbitCenterY - 70, 10, 30, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(rabbitCenterX + 15, rabbitCenterY - 70, 10, 30, 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = '#D32F2F';
        ctx.beginPath();
        ctx.ellipse(rabbitCenterX - 15, rabbitCenterY - 70, 5, 20, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(rabbitCenterX + 15, rabbitCenterY - 70, 5, 20, 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.globalCompositeOperation = 'destination-out';
        
        ctx.beginPath();
        ctx.arc(rabbitCenterX - 10, rabbitCenterY - 30, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(rabbitCenterX + 10, rabbitCenterY - 30, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(rabbitCenterX, rabbitCenterY - 12, 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(rabbitCenterX, rabbitCenterY - 8);
        ctx.quadraticCurveTo(rabbitCenterX - 8, rabbitCenterY, rabbitCenterX, rabbitCenterY + 8);
        ctx.quadraticCurveTo(rabbitCenterX + 8, rabbitCenterY, rabbitCenterX, rabbitCenterY - 8);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(rabbitCenterX - 30, rabbitCenterY - 15);
        ctx.lineTo(rabbitCenterX - 5, rabbitCenterY - 10);
        ctx.moveTo(rabbitCenterX - 30, rabbitCenterY - 5);
        ctx.lineTo(rabbitCenterX - 5, rabbitCenterY - 5);
        ctx.moveTo(rabbitCenterX + 5, rabbitCenterY - 10);
        ctx.lineTo(rabbitCenterX + 30, rabbitCenterY - 15);
        ctx.moveTo(rabbitCenterX + 5, rabbitCenterY - 5);
        ctx.lineTo(rabbitCenterX + 30, rabbitCenterY - 5);
        ctx.lineWidth = 2;
        ctx.stroke();
        
        this.drawDecorativeBorder(ctx, width, height);
        
        ctx.restore();
    },
    
    drawDragonPhoenixPattern: function(ctx, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, 40, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, 25, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
        ctx.lineWidth = 8;
        
        ctx.beginPath();
        ctx.moveTo(centerX - 60, centerY);
        for (let i = 0; i < 5; i++) {
            const waveX = centerX - 60 - i * 30;
            const waveY = centerY + Math.sin(i) * 30;
            ctx.quadraticCurveTo(waveX + 15, waveY - 20, waveX + 30, waveY);
        }
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(centerX - 200, centerY, 35, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(centerX - 230, centerY - 25);
        ctx.lineTo(centerX - 250, centerY - 50);
        ctx.lineTo(centerX - 220, centerY - 30);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(centerX + 60, centerY);
        for (let i = 0; i < 5; i++) {
            const waveX = centerX + 60 + i * 30;
            const waveY = centerY + Math.sin(i + Math.PI) * 30;
            ctx.quadraticCurveTo(waveX - 15, waveY - 20, waveX - 30, waveY);
        }
        ctx.stroke();
        
        ctx.beginPath();
        ctx.ellipse(centerX + 200, centerY, 40, 30, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(centerX + 230, centerY - 30);
        ctx.quadraticCurveTo(centerX + 260, centerY - 60, centerX + 240, centerY - 80);
        ctx.quadraticCurveTo(centerX + 250, centerY - 60, centerX + 235, centerY - 40);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(centerX + 230, centerY + 30);
        ctx.quadraticCurveTo(centerX + 260, centerY + 60, centerX + 240, centerY + 80);
        ctx.quadraticCurveTo(centerX + 250, centerY + 60, centerX + 235, centerY + 40);
        ctx.fill();
        
        this.drawDecorativeBorder(ctx, width, height);
        
        ctx.restore();
    },
    
    drawMagpiePlumPattern: function(ctx, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(centerX - 150, centerY + 100);
        ctx.quadraticCurveTo(centerX - 100, centerY + 50, centerX - 50, centerY + 30);
        ctx.quadraticCurveTo(centerX, centerY, centerX + 50, centerY - 20);
        ctx.quadraticCurveTo(centerX + 100, centerY - 50, centerX + 150, centerY - 80);
        ctx.stroke();
        
        ctx.lineWidth = 4;
        const branchPoints = [
            { x: centerX - 80, y: centerY + 50, angle: -0.5 },
            { x: centerX + 20, y: centerY + 10, angle: 0.3 },
            { x: centerX + 100, y: centerY - 50, angle: -0.8 }
        ];
        
        branchPoints.forEach(point => {
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(
                point.x + Math.cos(point.angle) * 60,
                point.y + Math.sin(point.angle) * 60
            );
            ctx.stroke();
        });
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0)';
        const plumPositions = [
            { x: centerX - 120, y: centerY + 70 },
            { x: centerX - 40, y: centerY + 40 },
            { x: centerX + 60, y: centerY },
            { x: centerX + 120, y: centerY - 60 },
            { x: centerX - 60, y: centerY + 80 }
        ];
        
        plumPositions.forEach(pos => {
            this.drawPlumFlower(ctx, pos.x, pos.y, 12);
        });
        
        const magpieX = centerX + 80;
        const magpieY = centerY - 30;
        
        ctx.beginPath();
        ctx.ellipse(magpieX, magpieY, 25, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(magpieX + 20, magpieY - 15, 15, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(magpieX + 35, magpieY - 15);
        ctx.lineTo(magpieX + 55, magpieY - 12);
        ctx.lineTo(magpieX + 35, magpieY - 8);
        ctx.fill();
        
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(magpieX - 25, magpieY);
        ctx.lineTo(magpieX - 60, magpieY + 10);
        ctx.lineTo(magpieX - 55, magpieY - 5);
        ctx.lineTo(magpieX - 25, magpieY - 5);
        ctx.fill();
        
        this.drawDecorativeBorder(ctx, width, height);
        
        ctx.restore();
    },
    
    drawPlumFlower: function(ctx, x, y, size) {
        const petalCount = 5;
        for (let i = 0; i < petalCount; i++) {
            const angle = (i * 2 * Math.PI) / petalCount - Math.PI / 2;
            const petalX = x + Math.cos(angle) * size;
            const petalY = y + Math.sin(angle) * size;
            
            ctx.beginPath();
            ctx.ellipse(petalX, petalY, size * 0.6, size * 0.4, angle, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.beginPath();
        ctx.arc(x, y, size * 0.3, 0, Math.PI * 2);
        ctx.fill();
    },
    
    drawFishChildPattern: function(ctx, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.arc(centerX, centerY - 60, 60, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + 30, 70, 80, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(centerX - 20, centerY - 70, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 20, centerY - 70, 8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(centerX, centerY - 40, 15, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.ellipse(centerX - 70, centerY - 20, 20, 15, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(centerX + 70, centerY - 20, 20, 15, 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.ellipse(centerX + 100, centerY + 60, 50, 30, 0.2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.ellipse(centerX + 50, centerY + 60, 30, 25, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(centerX + 150, centerY + 60);
        ctx.lineTo(centerX + 180, centerY + 40);
        ctx.lineTo(centerX + 180, centerY + 80);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(centerX + 70, centerY + 55, 5, 0, Math.PI * 2);
        ctx.fill();
        
        this.drawDecorativeBorder(ctx, width, height);
        
        ctx.restore();
    },
    
    drawTigerPattern: function(ctx, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, 100, 90, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(centerX - 70, centerY - 80);
        ctx.lineTo(centerX - 90, centerY - 130);
        ctx.lineTo(centerX - 50, centerY - 90);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(centerX + 70, centerY - 80);
        ctx.lineTo(centerX + 90, centerY - 130);
        ctx.lineTo(centerX + 50, centerY - 90);
        ctx.fill();
        
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = '#D32F2F';
        ctx.beginPath();
        ctx.moveTo(centerX - 65, centerY - 85);
        ctx.lineTo(centerX - 80, centerY - 120);
        ctx.lineTo(centerX - 55, centerY - 90);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(centerX + 65, centerY - 85);
        ctx.lineTo(centerX + 80, centerY - 120);
        ctx.lineTo(centerX + 55, centerY - 90);
        ctx.fill();
        
        ctx.globalCompositeOperation = 'destination-out';
        
        ctx.beginPath();
        ctx.ellipse(centerX - 40, centerY - 30, 20, 25, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(centerX + 40, centerY - 30, 20, 25, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = '#D32F2F';
        ctx.beginPath();
        ctx.arc(centerX - 40, centerY - 30, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 40, centerY - 30, 10, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.globalCompositeOperation = 'destination-out';
        
        ctx.beginPath();
        ctx.arc(centerX - 42, centerY - 32, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 38, centerY - 32, 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(centerX - 30, centerY - 60);
        ctx.lineTo(centerX - 20, centerY - 45);
        ctx.lineTo(centerX - 10, centerY - 60);
        ctx.lineTo(centerX, centerY - 45);
        ctx.lineTo(centerX + 10, centerY - 60);
        ctx.lineTo(centerX + 20, centerY - 45);
        ctx.lineTo(centerX + 30, centerY - 60);
        ctx.lineTo(centerX + 30, centerY - 40);
        ctx.lineTo(centerX - 30, centerY - 40);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + 10, 15, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY + 20);
        ctx.lineTo(centerX - 5, centerY + 35);
        ctx.moveTo(centerX, centerY + 20);
        ctx.lineTo(centerX, centerY + 35);
        ctx.moveTo(centerX, centerY + 20);
        ctx.lineTo(centerX + 5, centerY + 35);
        ctx.stroke();
        
        const stripePositions = [
            { x: centerX - 60, y: centerY + 20, w: 25, h: 15 },
            { x: centerX + 35, y: centerY + 20, w: 25, h: 15 },
            { x: centerX - 70, y: centerY + 50, w: 20, h: 12 },
            { x: centerX + 50, y: centerY + 50, w: 20, h: 12 }
        ];
        
        stripePositions.forEach(stripe => {
            ctx.beginPath();
            ctx.rect(stripe.x, stripe.y, stripe.w, stripe.h);
            ctx.fill();
        });
        
        ctx.font = 'bold 40px "KaiTi", "STKaiti", serif';
        ctx.textAlign = 'center';
        ctx.fillText('王', centerX, centerY - 90);
        
        this.drawDecorativeBorder(ctx, width, height);
        
        ctx.restore();
    },
    
    drawDoubleDragonPattern: function(ctx, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, 50, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, 35, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.lineWidth = 10;
        
        for (let side = -1; side <= 1; side += 2) {
            const startX = centerX + side * 60;
            
            ctx.beginPath();
            ctx.moveTo(startX, centerY);
            
            for (let i = 0; i < 8; i++) {
                const t = i / 8;
                const waveX = startX + side * t * 120;
                const waveY = centerY + Math.sin(t * Math.PI * 2 + (side === -1 ? 0 : Math.PI)) * 40;
                ctx.quadraticCurveTo(waveX - side * 10, waveY - 10, waveX, waveY);
            }
            ctx.stroke();
            
            const headX = centerX + side * 180;
            const headY = centerY;
            
            ctx.beginPath();
            ctx.ellipse(headX, headY, 35, 28, 0, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(headX + side * 20, headY - 25);
            ctx.lineTo(headX + side * 15, headY - 50);
            ctx.lineTo(headX + side * 25, headY - 30);
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(headX + side * 25, headY + 10);
            ctx.lineTo(headX + side * 55, headY + 15);
            ctx.lineTo(headX + side * 50, headY);
            ctx.lineTo(headX + side * 55, headY - 15);
            ctx.lineTo(headX + side * 25, headY - 10);
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(headX + side * 10, headY - 5, 6, 0, Math.PI * 2);
            ctx.fill();
        }
        
        this.drawDecorativeBorder(ctx, width, height);
        
        ctx.restore();
    },
    
    drawFuCharacter: function(ctx, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0, 0, 0, 0)';
        ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.font = 'bold 180px "KaiTi", "STKaiti", serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('福', centerX, centerY);
        
        ctx.lineWidth = 4;
        ctx.strokeRect(centerX - 120, centerY - 120, 240, 240);
        
        const cornerSize = 30;
        const corners = [
            { x: centerX - 120, y: centerY - 120 },
            { x: centerX + 120 - cornerSize, y: centerY - 120 },
            { x: centerX - 120, y: centerY + 120 - cornerSize },
            { x: centerX + 120 - cornerSize, y: centerY + 120 - cornerSize }
        ];
        
        corners.forEach(corner => {
            ctx.beginPath();
            ctx.moveTo(corner.x, corner.y + cornerSize);
            ctx.lineTo(corner.x, corner.y);
            ctx.lineTo(corner.x + cornerSize, corner.y);
            ctx.stroke();
        });
        
        this.drawDecorativeBorder(ctx, width, height);
        
        ctx.restore();
    },
    
    drawSpringCharacter: function(ctx, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0, 0, 0, 0)';
        ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.font = 'bold 180px "KaiTi", "STKaiti", serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('春', centerX, centerY);
        
        const flowerPositions = [
            { x: centerX - 150, y: centerY - 100 },
            { x: centerX + 150, y: centerY - 100 },
            { x: centerX - 150, y: centerY + 100 },
            { x: centerX + 150, y: centerY + 100 }
        ];
        
        flowerPositions.forEach(pos => {
            this.drawPlumFlower(ctx, pos.x, pos.y, 15);
        });
        
        this.drawDecorativeBorder(ctx, width, height);
        
        ctx.restore();
    },
    
    drawButterflyPattern: function(ctx, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, 8, 60, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.ellipse(centerX - 50, centerY - 30, 60, 45, -0.3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.ellipse(centerX - 60, centerY + 40, 45, 35, 0.2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.ellipse(centerX + 50, centerY - 30, 60, 45, 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.ellipse(centerX + 60, centerY + 40, 45, 35, -0.2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = '#D32F2F';
        
        const patternPositions = [
            { x: centerX - 50, y: centerY - 30 },
            { x: centerX + 50, y: centerY - 30 },
            { x: centerX - 60, y: centerY + 40 },
            { x: centerX + 60, y: centerY + 40 }
        ];
        
        ctx.globalCompositeOperation = 'destination-out';
        patternPositions.forEach((pos, index) => {
            for (let i = 1; i <= 3; i++) {
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, 10 * i, 0, Math.PI * 2);
                ctx.stroke();
            }
        });
        
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX - 5, centerY - 55);
        ctx.quadraticCurveTo(centerX - 20, centerY - 90, centerX - 15, centerY - 100);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(centerX + 5, centerY - 55);
        ctx.quadraticCurveTo(centerX + 20, centerY - 90, centerX + 15, centerY - 100);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(centerX - 15, centerY - 100, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 15, centerY - 100, 4, 0, Math.PI * 2);
        ctx.fill();
        
        this.drawDecorativeBorder(ctx, width, height);
        
        ctx.restore();
    },
    
    drawBatPattern: function(ctx, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, 30, 40, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(centerX - 30, centerY - 10);
        ctx.quadraticCurveTo(centerX - 80, centerY - 30, centerX - 120, centerY - 20);
        ctx.quadraticCurveTo(centerX - 100, centerY, centerX - 80, centerY + 10);
        ctx.quadraticCurveTo(centerX - 60, centerY + 20, centerX - 30, centerY + 10);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(centerX + 30, centerY - 10);
        ctx.quadraticCurveTo(centerX + 80, centerY - 30, centerX + 120, centerY - 20);
        ctx.quadraticCurveTo(centerX + 100, centerY, centerX + 80, centerY + 10);
        ctx.quadraticCurveTo(centerX + 60, centerY + 20, centerX + 30, centerY + 10);
        ctx.fill();
        
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX - 50, centerY);
        ctx.quadraticCurveTo(centerX - 70, centerY - 15, centerX - 90, centerY - 10);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(centerX - 60, centerY + 5);
        ctx.quadraticCurveTo(centerX - 75, centerY + 15, centerX - 85, centerY + 12);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(centerX + 50, centerY);
        ctx.quadraticCurveTo(centerX + 70, centerY - 15, centerX + 90, centerY - 10);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(centerX + 60, centerY + 5);
        ctx.quadraticCurveTo(centerX + 75, centerY + 15, centerX + 85, centerY + 12);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.ellipse(centerX, centerY - 35, 25, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(centerX - 15, centerY - 50);
        ctx.lineTo(centerX - 25, centerY - 80);
        ctx.lineTo(centerX - 10, centerY - 55);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(centerX + 15, centerY - 50);
        ctx.lineTo(centerX + 25, centerY - 80);
        ctx.lineTo(centerX + 10, centerY - 55);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(centerX - 8, centerY - 35, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 8, centerY - 35, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.font = 'bold 36px "KaiTi", "STKaiti", serif';
        ctx.textAlign = 'center';
        ctx.fillText('福', centerX, centerY + 100);
        
        this.drawDecorativeBorder(ctx, width, height);
        
        ctx.restore();
    },
    
    showLoading: function(show) {
        const loading = document.getElementById('loading-indicator');
        if (loading) {
            loading.classList.toggle('active', show);
        }
    },
    
    showResult: function() {
        const result = document.getElementById('ai-result-section');
        if (result) {
            result.classList.add('active');
        }
    },
    
    hideResult: function() {
        const result = document.getElementById('ai-result-section');
        if (result) {
            result.classList.remove('active');
        }
    },
    
    regenerate: function() {
        if (this.currentKeyword) {
            this.generateFromKeyword();
        }
    },
    
    useAsTemplate: function() {
        if (!this.generatedTemplate) {
            alert('请先生成一个图案！');
            return;
        }
        
        if (Game && PaperCanvas) {
            Game.currentLevel = 0;
            Game.showScreen('game-screen');
            
            setTimeout(() => {
                const ctx = PaperCanvas.ctx;
                ctx.clearRect(0, 0, PaperCanvas.width, PaperCanvas.height);
                
                const scale = PaperCanvas.width / this.canvas.width;
                ctx.save();
                ctx.scale(scale, scale);
                ctx.putImageData(this.generatedTemplate, 0, 0);
                ctx.restore();
                
                PaperCanvas.history = [];
                PaperCanvas.historyIndex = -1;
                PaperCanvas.saveState();
                
                alert('模板已加载到画布！您可以在此基础上进行裁剪创作。');
            }, 100);
        }
    }
};

window.AIGenerator = AIGenerator;
