const SmartAssist = {
    isEnabled: true,
    shapeDetectionEnabled: true,
    lineHintEnabled: true,
    autoCompleteEnabled: false,
    
    currentStroke: [],
    detectedShapes: [],
    hintTimer: null,
    
    shapeTemplates: {
        circle: {
            name: '圆形',
            description: '圆润的曲线，常见于娃娃脸、太阳等图案',
            hint: '尝试保持流畅的曲线，让线条自然闭合'
        },
        arc: {
            name: '圆弧',
            description: '部分圆形，常见于云纹、水纹等装饰',
            hint: '保持一致的曲率，让弧线平滑过渡'
        },
        zigzag: {
            name: '锯齿纹',
            description: '尖锐的折线，常见于老虎纹、闪电等',
            hint: '保持角度一致，让每个锯齿大小均匀'
        },
        curve: {
            name: '曲线',
            description: '流畅的波浪线，常见于云纹、水纹',
            hint: '让线条自然流动，避免生硬的转折'
        },
        straight: {
            name: '直线',
            description: '笔直的线条，常见于建筑、几何图案',
            hint: '保持方向稳定，让线条笔直'
        },
        spiral: {
            name: '螺旋纹',
            description: '旋转的曲线，常见于祥云、漩涡',
            hint: '让旋转角度均匀，逐渐向外扩展'
        }
    },
    
    init: function() {
        this.bindEvents();
        console.log('智能辅助模块初始化完成');
    },
    
    bindEvents: function() {
        const shapeToggle = document.getElementById('shape-detection-toggle');
        const lineHintToggle = document.getElementById('line-hint-toggle');
        const autoCompleteToggle = document.getElementById('auto-complete-toggle');
        
        if (shapeToggle) {
            shapeToggle.addEventListener('change', (e) => {
                this.shapeDetectionEnabled = e.target.checked;
            });
        }
        
        if (lineHintToggle) {
            lineHintToggle.addEventListener('change', (e) => {
                this.lineHintEnabled = e.target.checked;
            });
        }
        
        if (autoCompleteToggle) {
            autoCompleteToggle.addEventListener('change', (e) => {
                this.autoCompleteEnabled = e.target.checked;
            });
        }
    },
    
    startStroke: function(x, y) {
        if (!this.isEnabled) return;
        this.currentStroke = [{ x, y, time: Date.now() }];
    },
    
    addStrokePoint: function(x, y) {
        if (!this.isEnabled || this.currentStroke.length === 0) return;
        this.currentStroke.push({ x, y, time: Date.now() });
        
        if (this.currentStroke.length % 10 === 0) {
            this.analyzeCurrentStroke();
        }
    },
    
    endStroke: function() {
        if (!this.isEnabled || this.currentStroke.length === 0) return;
        
        const shape = this.analyzeStroke(this.currentStroke);
        if (shape) {
            this.detectedShapes.push(shape);
            this.updateUI(shape);
            
            if (this.lineHintEnabled) {
                this.provideHint(shape);
            }
            
            if (this.autoCompleteEnabled) {
                this.autoComplete(shape);
            }
        }
        
        this.currentStroke = [];
    },
    
    analyzeCurrentStroke: function() {
        if (this.currentStroke.length < 5) return null;
        
        const recentPoints = this.currentStroke.slice(-20);
        const shape = this.analyzeStroke(recentPoints);
        
        if (shape && this.lineHintEnabled) {
            this.showRealTimeHint(shape);
        }
        
        return shape;
    },
    
    analyzeStroke: function(points) {
        if (points.length < 3) return null;
        
        const features = this.extractFeatures(points);
        
        if (this.isCircle(points, features)) {
            return { type: 'circle', confidence: features.circularity, points: points };
        }
        
        if (this.isZigzag(points, features)) {
            return { type: 'zigzag', confidence: features.angularity, points: points };
        }
        
        if (this.isSpiral(points, features)) {
            return { type: 'spiral', confidence: features.spirality, points: points };
        }
        
        if (this.isArc(points, features)) {
            return { type: 'arc', confidence: features.curvature, points: points };
        }
        
        if (this.isStraightLine(points, features)) {
            return { type: 'straight', confidence: features.straightness, points: points };
        }
        
        if (features.curvature > 0.5) {
            return { type: 'curve', confidence: features.curvature, points: points };
        }
        
        return null;
    },
    
    extractFeatures: function(points) {
        let totalDistance = 0;
        let totalAngleChange = 0;
        let maxCurvature = 0;
        let minCurvature = Infinity;
        
        for (let i = 1; i < points.length - 1; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const next = points[i + 1];
            
            const dist1 = Utils.distance(prev.x, prev.y, curr.x, curr.y);
            const dist2 = Utils.distance(curr.x, curr.y, next.x, next.y);
            totalDistance += dist1;
            
            const angle1 = Math.atan2(curr.y - prev.y, curr.x - prev.x);
            const angle2 = Math.atan2(next.y - curr.y, next.x - curr.x);
            let angleDiff = Math.abs(angle2 - angle1);
            if (angleDiff > Math.PI) angleDiff = 2 * Math.PI - angleDiff;
            totalAngleChange += angleDiff;
            
            const curvature = this.calculateCurvature(prev, curr, next);
            maxCurvature = Math.max(maxCurvature, curvature);
            minCurvature = Math.min(minCurvature, curvature);
        }
        
        const startPoint = points[0];
        const endPoint = points[points.length - 1];
        const directDistance = Utils.distance(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
        
        const center = this.calculateCenter(points);
        const radii = points.map(p => Utils.distance(p.x, p.y, center.x, center.y));
        const avgRadius = radii.reduce((a, b) => a + b, 0) / radii.length;
        const radiusVariance = radii.reduce((sum, r) => sum + Math.pow(r - avgRadius, 2), 0) / radii.length;
        const circularity = 1 - Math.min(1, Math.sqrt(radiusVariance) / avgRadius);
        
        const isClosed = directDistance < avgRadius * 0.3;
        
        const straightness = totalDistance > 0 ? directDistance / totalDistance : 0;
        
        const angularity = points.length > 2 ? totalAngleChange / (points.length - 2) : 0;
        
        const spirality = this.calculateSpirality(points);
        
        return {
            totalDistance,
            directDistance,
            straightness,
            circularity: isClosed ? circularity : 0,
            isClosed,
            curvature: maxCurvature,
            angularity,
            spirality,
            avgRadius,
            center
        };
    },
    
    calculateCurvature: function(p1, p2, p3) {
        const dx1 = p2.x - p1.x;
        const dy1 = p2.y - p1.y;
        const dx2 = p3.x - p2.x;
        const dy2 = p3.y - p2.y;
        
        const cross = dx1 * dy2 - dy1 * dx2;
        const dot = dx1 * dx2 + dy1 * dy2;
        
        const angle = Math.atan2(Math.abs(cross), dot);
        
        return angle;
    },
    
    calculateCenter: function(points) {
        let sumX = 0, sumY = 0;
        points.forEach(p => {
            sumX += p.x;
            sumY += p.y;
        });
        return { x: sumX / points.length, y: sumY / points.length };
    },
    
    calculateSpirality: function(points) {
        if (points.length < 10) return 0;
        
        const center = this.calculateCenter(points);
        let increasingRadius = true;
        let prevRadius = Utils.distance(points[0].x, points[0].y, center.x, center.y);
        
        for (let i = 1; i < points.length; i++) {
            const radius = Utils.distance(points[i].x, points[i].y, center.x, center.y);
            if (radius < prevRadius * 0.9) {
                increasingRadius = false;
                break;
            }
            prevRadius = radius;
        }
        
        let totalAngle = 0;
        for (let i = 1; i < points.length; i++) {
            const angle1 = Math.atan2(points[i-1].y - center.y, points[i-1].x - center.x);
            const angle2 = Math.atan2(points[i].y - center.y, points[i].x - center.x);
            let angleDiff = angle2 - angle1;
            if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
            if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
            totalAngle += Math.abs(angleDiff);
        }
        
        const rotations = totalAngle / (2 * Math.PI);
        
        if (increasingRadius && rotations > 0.5) {
            return Math.min(1, rotations / 2);
        }
        
        return 0;
    },
    
    isCircle: function(points, features) {
        return features.isClosed && 
               features.circularity > 0.7 && 
               features.straightness < 0.3;
    },
    
    isZigzag: function(points, features) {
        return features.angularity > 0.5 && 
               features.curvature < 0.3 &&
               features.straightness > 0.4;
    },
    
    isSpiral: function(points, features) {
        return features.spirality > 0.3 && features.isClosed === false;
    },
    
    isArc: function(points, features) {
        return features.curvature > 0.3 && 
               features.circularity > 0.3 && 
               features.isClosed === false;
    },
    
    isStraightLine: function(points, features) {
        return features.straightness > 0.85 && features.curvature < 0.2;
    },
    
    updateUI: function(shape) {
        const shapeText = document.getElementById('detected-shape-text');
        if (shapeText && this.shapeTemplates[shape.type]) {
            const template = this.shapeTemplates[shape.type];
            shapeText.textContent = `${template.name} (置信度: ${Math.round(shape.confidence * 100)}%)`;
        }
    },
    
    showRealTimeHint: function(shape) {
        if (!this.lineHintEnabled) return;
        
        if (this.hintTimer) {
            clearTimeout(this.hintTimer);
        }
        
        this.hintTimer = setTimeout(() => {
            if (this.shapeTemplates[shape.type]) {
                this.updateHintText(this.shapeTemplates[shape.type].hint);
            }
        }, 300);
    },
    
    provideHint: function(shape) {
        if (!this.lineHintEnabled) return;
        
        if (this.shapeTemplates[shape.type]) {
            const template = this.shapeTemplates[shape.type];
            const hint = `检测到${template.name}！${template.description}。${template.hint}`;
            this.updateHintText(hint);
        }
    },
    
    updateHintText: function(text) {
        const hintText = document.getElementById('hint-text-content');
        if (hintText) {
            hintText.textContent = text;
        }
    },
    
    autoComplete: function(shape) {
        if (!this.autoCompleteEnabled) return;
        
        if (shape.type === 'circle' && shape.confidence > 0.8) {
            this.completeCircle(shape);
        } else if (shape.type === 'arc' && shape.confidence > 0.7) {
            this.completeArc(shape);
        }
    },
    
    completeCircle: function(shape) {
        const center = this.calculateCenter(shape.points);
        const radii = shape.points.map(p => Utils.distance(p.x, p.y, center.x, center.y));
        const avgRadius = radii.reduce((a, b) => a + b, 0) / radii.length;
        
        const startAngle = Math.atan2(
            shape.points[0].y - center.y,
            shape.points[0].x - center.x
        );
        
        const endAngle = Math.atan2(
            shape.points[shape.points.length - 1].y - center.y,
            shape.points[shape.points.length - 1].x - center.x
        );
        
        if (PaperCanvas && PaperCanvas.ctx) {
            const ctx = PaperCanvas.ctx;
            ctx.save();
            ctx.globalCompositeOperation = 'destination-out';
            ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
            ctx.lineWidth = PaperCanvas.brushSize;
            ctx.beginPath();
            ctx.arc(center.x, center.y, avgRadius, endAngle, startAngle, true);
            ctx.stroke();
            ctx.restore();
            
            PaperCanvas.saveState();
        }
    },
    
    completeArc: function(shape) {
        const center = this.calculateCenter(shape.points);
        const radii = shape.points.map(p => Utils.distance(p.x, p.y, center.x, center.y));
        const avgRadius = radii.reduce((a, b) => a + b, 0) / radii.length;
        
        if (PaperCanvas && PaperCanvas.ctx) {
            const ctx = PaperCanvas.ctx;
            const lastPoint = shape.points[shape.points.length - 1];
            const angle = Math.atan2(lastPoint.y - center.y, lastPoint.x - center.x);
            
            const extendedAngle = angle + Math.PI / 4;
            const extendedX = center.x + Math.cos(extendedAngle) * avgRadius;
            const extendedY = center.y + Math.sin(extendedAngle) * avgRadius;
            
            ctx.save();
            ctx.globalCompositeOperation = 'destination-out';
            ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
            ctx.lineWidth = PaperCanvas.brushSize;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(lastPoint.x, lastPoint.y);
            ctx.arc(center.x, center.y, avgRadius, angle, extendedAngle);
            ctx.stroke();
            ctx.restore();
        }
    },
    
    getDetectedShapes: function() {
        return this.detectedShapes;
    },
    
    clearDetectedShapes: function() {
        this.detectedShapes = [];
    },
    
    toggle: function(enabled) {
        this.isEnabled = enabled;
    }
};

window.SmartAssist = SmartAssist;
