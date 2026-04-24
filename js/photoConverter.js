const PhotoConverter = {
    originalImage: null,
    convertedImage: null,
    currentStyle: 'traditional',
    detailLevel: 3,
    
    styles: {
        traditional: {
            name: '传统剪纸',
            edgeThreshold: 50,
            blurRadius: 2,
            invertColors: true,
            simplifyLevel: 0.5
        },
        modern: {
            name: '现代简约',
            edgeThreshold: 80,
            blurRadius: 1,
            invertColors: true,
            simplifyLevel: 0.3
        },
        detailed: {
            name: '精细复杂',
            edgeThreshold: 30,
            blurRadius: 1,
            invertColors: true,
            simplifyLevel: 0.8
        },
        minimal: {
            name: '极简风格',
            edgeThreshold: 100,
            blurRadius: 3,
            invertColors: false,
            simplifyLevel: 0.2
        }
    },
    
    init: function() {
        this.bindEvents();
        console.log('照片转换模块初始化完成');
    },
    
    bindEvents: function() {
        const photoInput = document.getElementById('photo-input');
        const styleSelect = document.getElementById('style-select');
        const detailLevel = document.getElementById('detail-level');
        const convertBtn = document.getElementById('convert-btn');
        const editConvertedBtn = document.getElementById('edit-converted-btn');
        const downloadConvertedBtn = document.getElementById('download-converted-btn');
        const uploadNewBtn = document.getElementById('upload-new-btn');
        
        if (photoInput) {
            photoInput.addEventListener('change', (e) => this.handlePhotoUpload(e));
        }
        
        if (styleSelect) {
            styleSelect.addEventListener('change', (e) => {
                this.currentStyle = e.target.value;
                if (this.originalImage) {
                    this.convertPhoto();
                }
            });
        }
        
        if (detailLevel) {
            detailLevel.addEventListener('input', (e) => {
                this.detailLevel = parseInt(e.target.value);
                const detailValue = document.getElementById('detail-value');
                if (detailValue) {
                    const levels = ['极低', '低', '中', '高', '极高'];
                    detailValue.textContent = levels[this.detailLevel - 1];
                }
            });
        }
        
        if (convertBtn) {
            convertBtn.addEventListener('click', () => this.convertPhoto());
        }
        
        if (editConvertedBtn) {
            editConvertedBtn.addEventListener('click', () => this.editInCanvas());
        }
        
        if (downloadConvertedBtn) {
            downloadConvertedBtn.addEventListener('click', () => this.downloadConverted());
        }
        
        if (uploadNewBtn) {
            uploadNewBtn.addEventListener('click', () => this.resetUpload());
        }
    },
    
    handlePhotoUpload: function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            alert('请上传图片文件！');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                this.originalImage = img;
                this.displayOriginalImage(img);
                this.hideResult();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    },
    
    displayOriginalImage: function(img) {
        const canvas = document.getElementById('original-photo-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const maxWidth = canvas.width;
        const maxHeight = canvas.height;
        
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
        }
        
        const x = (maxWidth - width) / 2;
        const y = (maxHeight - height) / 2;
        
        ctx.fillStyle = '#FFF8E7';
        ctx.fillRect(0, 0, maxWidth, maxHeight);
        
        ctx.drawImage(img, x, y, width, height);
    },
    
    convertPhoto: function() {
        if (!this.originalImage) {
            alert('请先上传一张照片！');
            return;
        }
        
        this.showLoading(true);
        
        setTimeout(() => {
            this.performConversion();
            this.showLoading(false);
            this.showResult();
        }, 1000);
    },
    
    performConversion: function() {
        const style = this.styles[this.currentStyle];
        const sourceCanvas = document.getElementById('original-photo-canvas');
        const targetCanvas = document.getElementById('converted-canvas');
        
        if (!sourceCanvas || !targetCanvas) return;
        
        const sourceCtx = sourceCanvas.getContext('2d');
        const targetCtx = targetCanvas.getContext('2d');
        
        const width = targetCanvas.width;
        const height = targetCanvas.height;
        
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempCtx = tempCanvas.getContext('2d');
        
        tempCtx.fillStyle = '#FFF8E7';
        tempCtx.fillRect(0, 0, width, height);
        
        const img = this.originalImage;
        let imgWidth = img.width;
        let imgHeight = img.height;
        
        const ratio = Math.min(width / imgWidth, height / imgHeight);
        imgWidth *= ratio;
        imgHeight *= ratio;
        
        const x = (width - imgWidth) / 2;
        const y = (height - imgHeight) / 2;
        
        tempCtx.drawImage(img, x, y, imgWidth, imgHeight);
        
        const imageData = tempCtx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        this.applyEdgeDetection(data, width, height, style);
        this.applySimplification(data, width, height, this.detailLevel);
        
        if (style.invertColors) {
            this.invertColors(data);
        }
        
        targetCtx.putImageData(imageData, 0, 0);
        
        this.convertedImage = targetCanvas;
    },
    
    applyEdgeDetection: function(data, width, height, style) {
        const threshold = style.edgeThreshold;
        const blurRadius = style.blurRadius;
        
        const grayData = new Uint8Array(width * height);
        for (let i = 0; i < data.length; i += 4) {
            const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            grayData[i / 4] = gray;
        }
        
        const edges = new Uint8Array(width * height);
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const idx = y * width + x;
                
                const gx = 
                    -1 * grayData[idx - width - 1] +
                     0 * grayData[idx - width] +
                     1 * grayData[idx - width + 1] +
                    -2 * grayData[idx - 1] +
                     0 * grayData[idx] +
                     2 * grayData[idx + 1] +
                    -1 * grayData[idx + width - 1] +
                     0 * grayData[idx + width] +
                     1 * grayData[idx + width + 1];
                
                const gy = 
                    -1 * grayData[idx - width - 1] +
                    -2 * grayData[idx - width] +
                    -1 * grayData[idx - width + 1] +
                     0 * grayData[idx - 1] +
                     0 * grayData[idx] +
                     0 * grayData[idx + 1] +
                     1 * grayData[idx + width - 1] +
                     2 * grayData[idx + width] +
                     1 * grayData[idx + width + 1];
                
                const magnitude = Math.sqrt(gx * gx + gy * gy);
                edges[idx] = magnitude > threshold ? 0 : 255;
            }
        }
        
        for (let i = 0; i < data.length; i += 4) {
            const idx = i / 4;
            const edgeValue = edges[idx];
            
            if (edgeValue === 0) {
                data[i] = 0;
                data[i + 1] = 0;
                data[i + 2] = 0;
                data[i + 3] = 255;
            } else {
                const gray = grayData[idx];
                const paperValue = gray > 128 ? 255 : 211;
                data[i] = paperValue;
                data[i + 1] = paperValue > 200 ? 248 : 47;
                data[i + 2] = paperValue > 200 ? 231 : 47;
                data[i + 3] = 255;
            }
        }
    },
    
    applySimplification: function(data, width, height, detailLevel) {
        const levels = [0.3, 0.5, 0.7, 0.85, 0.95];
        const simplifyFactor = levels[detailLevel - 1];
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;
                
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                
                const brightness = (r + g + b) / 3;
                
                if (brightness > 128 * simplifyFactor) {
                    data[idx] = 255;
                    data[idx + 1] = 248;
                    data[idx + 2] = 231;
                } else {
                    data[idx] = 211;
                    data[idx + 1] = 47;
                    data[idx + 2] = 47;
                }
            }
        }
    },
    
    invertColors: function(data) {
        for (let i = 0; i < data.length; i += 4) {
            const isRed = data[i] === 211 && data[i + 1] === 47 && data[i + 2] === 47;
            const isPaper = data[i] === 255 && data[i + 1] === 248 && data[i + 2] === 231;
            
            if (isRed) {
                data[i] = 255;
                data[i + 1] = 248;
                data[i + 2] = 231;
            } else if (isPaper) {
                data[i] = 211;
                data[i + 1] = 47;
                data[i + 2] = 47;
            }
        }
    },
    
    showLoading: function(show) {
        const loading = document.getElementById('converting-indicator');
        if (loading) {
            loading.classList.toggle('active', show);
        }
    },
    
    showResult: function() {
        const result = document.getElementById('photo-result-section');
        if (result) {
            result.classList.add('active');
        }
    },
    
    hideResult: function() {
        const result = document.getElementById('photo-result-section');
        if (result) {
            result.classList.remove('active');
        }
    },
    
    resetUpload: function() {
        this.originalImage = null;
        this.convertedImage = null;
        this.hideResult();
        
        const photoInput = document.getElementById('photo-input');
        if (photoInput) {
            photoInput.value = '';
        }
        
        const originalCanvas = document.getElementById('original-photo-canvas');
        if (originalCanvas) {
            const ctx = originalCanvas.getContext('2d');
            ctx.fillStyle = '#FFF8E7';
            ctx.fillRect(0, 0, originalCanvas.width, originalCanvas.height);
        }
    },
    
    editInCanvas: function() {
        if (!this.convertedImage) {
            alert('请先转换照片！');
            return;
        }
        
        if (Game && PaperCanvas) {
            Game.currentLevel = 0;
            Game.showScreen('game-screen');
            
            setTimeout(() => {
                const ctx = PaperCanvas.ctx;
                const targetCanvas = this.convertedImage;
                const targetCtx = targetCanvas.getContext('2d');
                
                const targetImageData = targetCtx.getImageData(0, 0, targetCanvas.width, targetCanvas.height);
                
                ctx.clearRect(0, 0, PaperCanvas.width, PaperCanvas.height);
                ctx.fillStyle = '#D32F2F';
                ctx.fillRect(0, 0, PaperCanvas.width, PaperCanvas.height);
                
                const scaleX = PaperCanvas.width / targetCanvas.width;
                const scaleY = PaperCanvas.height / targetCanvas.height;
                
                ctx.save();
                ctx.scale(scaleX, scaleY);
                
                for (let y = 0; y < targetCanvas.height; y++) {
                    for (let x = 0; x < targetCanvas.width; x++) {
                        const idx = (y * targetCanvas.width + x) * 4;
                        const r = targetImageData.data[idx];
                        const g = targetImageData.data[idx + 1];
                        const b = targetImageData.data[idx + 2];
                        
                        const isRed = r === 211 && g === 47 && b === 47;
                        
                        if (!isRed) {
                            ctx.globalCompositeOperation = 'destination-out';
                            ctx.fillStyle = 'rgba(0, 0, 0, 0)';
                            ctx.fillRect(x, y, 1, 1);
                        }
                    }
                }
                
                ctx.restore();
                
                PaperCanvas.history = [];
                PaperCanvas.historyIndex = -1;
                PaperCanvas.saveState();
                
                alert('剪纸作品已加载到画布！您可以在此基础上继续裁剪创作。');
            }, 100);
        }
    },
    
    downloadConverted: function() {
        if (!this.convertedImage) {
            alert('请先转换照片！');
            return;
        }
        
        const posterCanvas = Utils.createPosterCanvas(
            this.convertedImage,
            '照片转剪纸风格作品',
            '纸影谜途',
            'AI剪纸艺术转换'
        );
        
        const timestamp = new Date().getTime();
        Utils.downloadImage(posterCanvas, `剪纸作品_${timestamp}`);
    }
};

window.PhotoConverter = PhotoConverter;
