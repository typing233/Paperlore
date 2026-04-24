const PaperCanvas = {
    canvas: null,
    ctx: null,
    width: 500,
    height: 500,
    
    isDrawing: false,
    lastX: 0,
    lastY: 0,
    
    currentTool: 'scissors',
    brushSize: 8,
    symmetryEnabled: true,
    
    history: [],
    historyIndex: -1,
    maxHistory: 30,
    
    paperColor: '#D32F2F',
    cutColor: 'rgba(0, 0, 0, 0)',
    paperTexture: null,
    
    init: function(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Canvas not found:', canvasId);
            return false;
        }
        
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        this.setupEventListeners();
        this.reset();
        
        return true;
    },
    
    setupEventListeners: function() {
        const canvas = this.canvas;
        
        canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        canvas.addEventListener('mouseleave', this.handleMouseUp.bind(this));
        
        canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        canvas.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
        
        canvas.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });
    },
    
    getMousePos: function(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.width / rect.width;
        const scaleY = this.height / rect.height;
        
        let clientX, clientY;
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    },
    
    handleMouseDown: function(e) {
        if (e.button !== 0) return;
        
        const pos = this.getMousePos(e);
        this.isDrawing = true;
        this.lastX = pos.x;
        this.lastY = pos.y;
        
        if (window.SmartAssist && SmartAssist.isEnabled) {
            SmartAssist.startStroke(pos.x, pos.y);
        }
        
        this.cutAt(pos.x, pos.y);
    },
    
    handleMouseMove: function(e) {
        if (!this.isDrawing) return;
        
        const pos = this.getMousePos(e);
        
        if (window.SmartAssist && SmartAssist.isEnabled) {
            SmartAssist.addStrokePoint(pos.x, pos.y);
        }
        
        this.cutLine(this.lastX, this.lastY, pos.x, pos.y);
        
        this.lastX = pos.x;
        this.lastY = pos.y;
    },
    
    handleMouseUp: function() {
        if (this.isDrawing) {
            this.isDrawing = false;
            
            if (window.SmartAssist && SmartAssist.isEnabled) {
                SmartAssist.endStroke();
            }
            
            this.saveState();
        }
    },
    
    handleTouchStart: function(e) {
        e.preventDefault();
        const touch = e.touches[0];
        this.handleMouseDown({ clientX: touch.clientX, clientY: touch.clientY });
    },
    
    handleTouchMove: function(e) {
        e.preventDefault();
        if (!this.isDrawing) return;
        
        const touch = e.touches[0];
        this.handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
    },
    
    handleTouchEnd: function(e) {
        this.handleMouseUp();
    },
    
    cutAt: function(x, y) {
        this.drawCircle(x, y);
        
        if (this.symmetryEnabled) {
            const mirroredX = Utils.mirrorX(x, this.width / 2);
            this.drawCircle(mirroredX, y);
        }
    },
    
    cutLine: function(x1, y1, x2, y2) {
        const dist = Utils.distance(x1, y1, x2, y2);
        const steps = Math.max(1, Math.floor(dist / (this.brushSize / 3)));
        
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const x = Utils.lerp(x1, x2, t);
            const y = Utils.lerp(y1, y2, t);
            this.cutAt(x, y);
        }
    },
    
    drawCircle: function(x, y) {
        const ctx = this.ctx;
        
        ctx.save();
        
        if (this.currentTool === 'scissors') {
            ctx.globalCompositeOperation = 'destination-out';
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = this.paperColor;
        }
        
        ctx.beginPath();
        ctx.arc(x, y, this.brushSize / 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    },
    
    reset: function() {
        const ctx = this.ctx;
        
        ctx.clearRect(0, 0, this.width, this.height);
        
        ctx.fillStyle = this.paperColor;
        ctx.fillRect(0, 0, this.width, this.height);
        
        this.addPaperTexture();
        
        this.history = [];
        this.historyIndex = -1;
        this.saveState();
    },
    
    addPaperTexture: function() {
        const ctx = this.ctx;
        ctx.save();
        
        ctx.globalAlpha = 0.15;
        
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * this.width;
            const y = Math.random() * this.height;
            const size = Math.random() * 3 + 1;
            
            ctx.fillStyle = 'rgba(139, 0, 0, 0.1)';
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    },
    
    saveState: function() {
        if (this.historyIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyIndex + 1);
        }
        
        const imageData = this.ctx.getImageData(0, 0, this.width, this.height);
        this.history.push(imageData);
        
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        } else {
            this.historyIndex++;
        }
    },
    
    undo: function() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.restoreState();
            return true;
        }
        return false;
    },
    
    redo: function() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.restoreState();
            return true;
        }
        return false;
    },
    
    restoreState: function() {
        const imageData = this.history[this.historyIndex];
        if (imageData) {
            this.ctx.putImageData(imageData, 0, 0);
        }
    },
    
    setTool: function(tool) {
        this.currentTool = tool;
    },
    
    setBrushSize: function(size) {
        this.brushSize = Utils.clamp(size, 2, 30);
    },
    
    toggleSymmetry: function(enabled) {
        this.symmetryEnabled = enabled;
    },
    
    setPaperColor: function(color) {
        this.paperColor = color;
    },
    
    getImageData: function() {
        return this.ctx.getImageData(0, 0, this.width, this.height);
    },
    
    calculateSimilarity: function(targetPattern) {
        const imageData = this.getImageData();
        const data = imageData.data;
        
        let totalPixels = 0;
        let cutPixels = 0;
        
        for (let i = 0; i < data.length; i += 4) {
            const alpha = data[i + 3];
            if (alpha > 0) {
                totalPixels++;
                if (alpha < 255) {
                    cutPixels++;
                }
            }
        }
        
        if (totalPixels === 0) return 0;
        
        const cutRatio = cutPixels / totalPixels;
        
        let score;
        if (cutRatio < 0.05) {
            score = 30 + cutRatio * 400;
        } else if (cutRatio < 0.15) {
            score = 50 + (cutRatio - 0.05) * 500;
        } else if (cutRatio < 0.25) {
            score = 85 + (cutRatio - 0.15) * 150;
        } else if (cutRatio < 0.4) {
            score = 70 - (cutRatio - 0.25) * 200;
        } else {
            score = 40 - (cutRatio - 0.4) * 100;
        }
        
        return Math.round(Utils.clamp(score, 10, 100));
    },
    
    exportToCanvas: function(targetCanvas) {
        const targetCtx = targetCanvas.getContext('2d');
        targetCtx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
        
        targetCtx.fillStyle = '#FFF8E7';
        targetCtx.fillRect(0, 0, targetCanvas.width, targetCanvas.height);
        
        targetCtx.drawImage(
            this.canvas,
            0, 0, this.width, this.height,
            0, 0, targetCanvas.width, targetCanvas.height
        );
    },
    
    clear: function() {
        this.reset();
    },
    
    hasAnyCutting: function() {
        const imageData = this.getImageData();
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const alpha = data[i + 3];
            if (alpha < 255 && alpha > 0) {
                return true;
            }
        }
        return false;
    }
};

window.PaperCanvas = PaperCanvas;
