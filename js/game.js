const Game = {
    currentScreen: 'main-menu',
    currentLevel: 1,
    isPaused: false,
    atmosphere: 'festive',
    
    screens: {},
    elements: {},
    
    init: function() {
        this.cacheElements();
        this.bindEvents();
        this.initCanvas();
        this.loadProgress();
        this.showScreen('main-menu');
    },
    
    cacheElements: function() {
        this.screens = {
            mainMenu: document.getElementById('main-menu'),
            howToPlay: document.getElementById('how-to-play'),
            levelSelect: document.getElementById('level-select'),
            gameScreen: document.getElementById('game-screen'),
            resultScreen: document.getElementById('result-screen'),
            pauseMenu: document.getElementById('pause-menu'),
            hintPanel: document.getElementById('hint-panel'),
            aiGenerateScreen: document.getElementById('ai-generate-screen'),
            photoConvertScreen: document.getElementById('photo-convert-screen'),
            arScanScreen: document.getElementById('ar-scan-screen'),
            locationMissionScreen: document.getElementById('location-mission-screen')
        };
        
        this.elements = {
            startBtn: document.getElementById('start-btn'),
            howToPlayBtn: document.getElementById('how-to-play-btn'),
            backToMenuBtn: document.getElementById('back-to-menu-btn'),
            backToMenuFromLevelsBtn: document.getElementById('back-to-menu-from-levels-btn'),
            levelGrid: document.getElementById('level-grid'),
            
            currentLevel: document.getElementById('current-level'),
            levelTheme: document.getElementById('level-theme'),
            undoBtn: document.getElementById('undo-btn'),
            resetBtn: document.getElementById('reset-btn'),
            hintBtn: document.getElementById('hint-btn'),
            pauseBtn: document.getElementById('pause-btn'),
            
            clueType: document.getElementById('clue-type'),
            clueContent: document.getElementById('clue-content'),
            storyContent: document.getElementById('story-content'),
            
            symmetryToggle: document.getElementById('symmetry-toggle'),
            brushSize: document.getElementById('brush-size'),
            toolBtns: document.querySelectorAll('.tool-btn'),
            submitBtn: document.getElementById('submit-btn'),
            
            resultTitle: document.getElementById('result-title'),
            resultCanvas: document.getElementById('result-canvas'),
            similarityScore: document.getElementById('similarity-score'),
            revealedPoem: document.getElementById('revealed-poem'),
            unlockedStory: document.getElementById('unlocked-story'),
            exportBtn: document.getElementById('export-btn'),
            nextLevelBtn: document.getElementById('next-level-btn'),
            retryBtn: document.getElementById('retry-btn'),
            
            resumeBtn: document.getElementById('resume-btn'),
            quitBtn: document.getElementById('quit-btn'),
            
            hintText: document.getElementById('hint-text'),
            closeHintBtn: document.getElementById('close-hint-btn'),
            
            atmosphereToggle: document.getElementById('atmosphere-toggle'),
            
            aiGenerateBtn: document.getElementById('ai-generate-btn'),
            photoConvertBtn: document.getElementById('photo-convert-btn'),
            arScanBtn: document.getElementById('ar-scan-btn'),
            locationMissionBtn: document.getElementById('location-mission-btn'),
            
            backToMenuFromAiBtn: document.getElementById('back-to-menu-from-ai-btn'),
            backToMenuFromPhotoBtn: document.getElementById('back-to-menu-from-photo-btn'),
            backToMenuFromArBtn: document.getElementById('back-to-menu-from-ar-btn'),
            backToMenuFromLocationBtn: document.getElementById('back-to-menu-from-location-btn')
        };
    },
    
    bindEvents: function() {
        this.elements.startBtn.addEventListener('click', () => this.showScreen('level-select'));
        this.elements.howToPlayBtn.addEventListener('click', () => this.showScreen('how-to-play'));
        
        if (this.elements.aiGenerateBtn) {
            this.elements.aiGenerateBtn.addEventListener('click', () => this.showScreen('ai-generate'));
        }
        if (this.elements.photoConvertBtn) {
            this.elements.photoConvertBtn.addEventListener('click', () => this.showScreen('photo-convert'));
        }
        if (this.elements.arScanBtn) {
            this.elements.arScanBtn.addEventListener('click', () => this.showScreen('ar-scan'));
        }
        if (this.elements.locationMissionBtn) {
            this.elements.locationMissionBtn.addEventListener('click', () => this.showScreen('location-mission'));
        }
        
        if (this.elements.backToMenuFromAiBtn) {
            this.elements.backToMenuFromAiBtn.addEventListener('click', () => this.showScreen('main-menu'));
        }
        if (this.elements.backToMenuFromPhotoBtn) {
            this.elements.backToMenuFromPhotoBtn.addEventListener('click', () => this.showScreen('main-menu'));
        }
        if (this.elements.backToMenuFromArBtn) {
            this.elements.backToMenuFromArBtn.addEventListener('click', () => {
                if (window.ARScanner) {
                    ARScanner.stopCamera();
                }
                this.showScreen('main-menu');
            });
        }
        if (this.elements.backToMenuFromLocationBtn) {
            this.elements.backToMenuFromLocationBtn.addEventListener('click', () => this.showScreen('main-menu'));
        }
        
        this.elements.backToMenuBtn.addEventListener('click', () => this.showScreen('main-menu'));
        this.elements.backToMenuFromLevelsBtn.addEventListener('click', () => this.showScreen('main-menu'));
        
        this.elements.undoBtn.addEventListener('click', () => this.undo());
        this.elements.resetBtn.addEventListener('click', () => this.resetCanvas());
        this.elements.hintBtn.addEventListener('click', () => this.showHint());
        this.elements.pauseBtn.addEventListener('click', () => this.pause());
        
        this.elements.symmetryToggle.addEventListener('change', (e) => {
            PaperCanvas.toggleSymmetry(e.target.checked);
        });
        
        this.elements.brushSize.addEventListener('input', (e) => {
            PaperCanvas.setBrushSize(parseInt(e.target.value));
        });
        
        this.elements.toolBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectTool(btn.dataset.tool);
            });
        });
        
        this.elements.submitBtn.addEventListener('click', () => this.submitWork());
        
        this.elements.exportBtn.addEventListener('click', () => this.exportPoster());
        this.elements.nextLevelBtn.addEventListener('click', () => this.nextLevel());
        this.elements.retryBtn.addEventListener('click', () => this.retryLevel());
        
        this.elements.resumeBtn.addEventListener('click', () => this.resume());
        this.elements.quitBtn.addEventListener('click', () => this.quitLevel());
        
        this.elements.closeHintBtn.addEventListener('click', () => this.closeHint());
        
        this.elements.atmosphereToggle.addEventListener('click', () => this.toggleAtmosphere());
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.currentScreen === 'game-screen' && !this.isPaused) {
                    this.pause();
                } else if (this.isPaused) {
                    this.resume();
                }
            }
            if (e.ctrlKey && e.key === 'z') {
                e.preventDefault();
                if (e.shiftKey) {
                    PaperCanvas.redo();
                } else {
                    this.undo();
                }
            }
        });
    },
    
    initCanvas: function() {
        PaperCanvas.init('paper-canvas');
    },
    
    showScreen: function(screenName) {
        Object.values(this.screens).forEach(screen => {
            if (screen) {
                screen.classList.remove('active');
            }
        });
        
        this.currentScreen = screenName;
        
        let targetScreen;
        switch(screenName) {
            case 'main-menu':
                targetScreen = this.screens.mainMenu;
                break;
            case 'how-to-play':
                targetScreen = this.screens.howToPlay;
                break;
            case 'level-select':
                targetScreen = this.screens.levelSelect;
                this.populateLevelGrid();
                break;
            case 'game-screen':
                targetScreen = this.screens.gameScreen;
                if (window.SmartAssist) {
                    SmartAssist.isEnabled = true;
                }
                break;
            case 'result-screen':
                targetScreen = this.screens.resultScreen;
                break;
            case 'pause-menu':
                targetScreen = this.screens.pauseMenu;
                break;
            case 'hint-panel':
                targetScreen = this.screens.hintPanel;
                break;
            case 'ai-generate':
                targetScreen = this.screens.aiGenerateScreen;
                if (window.AIGenerator && !window.AIGenerator._initialized) {
                    AIGenerator.init();
                    window.AIGenerator._initialized = true;
                }
                break;
            case 'photo-convert':
                targetScreen = this.screens.photoConvertScreen;
                if (window.PhotoConverter && !window.PhotoConverter._initialized) {
                    PhotoConverter.init();
                    window.PhotoConverter._initialized = true;
                }
                break;
            case 'ar-scan':
                targetScreen = this.screens.arScanScreen;
                if (window.ARScanner && !window.ARScanner._initialized) {
                    ARScanner.init();
                    window.ARScanner._initialized = true;
                }
                break;
            case 'location-mission':
                targetScreen = this.screens.locationMissionScreen;
                if (window.LocationMission && !window.LocationMission._initialized) {
                    LocationMission.init();
                    window.LocationMission._initialized = true;
                }
                break;
        }
        
        if (targetScreen) {
            targetScreen.classList.add('active');
        }
    },
    
    populateLevelGrid: function() {
        const grid = this.elements.levelGrid;
        grid.innerHTML = '';
        
        const totalLevels = Levels.getTotalLevels();
        const progress = Levels.getProgress();
        
        for (let i = 1; i <= totalLevels; i++) {
            const level = Levels.getLevelById(i);
            const isUnlocked = Levels.isLevelUnlocked(i);
            const isCompleted = progress.completedLevels.includes(i);
            const bestScore = progress.bestScores[i];
            
            const card = document.createElement('div');
            card.className = 'level-card' + 
                (isUnlocked ? '' : ' locked') +
                (isCompleted ? ' completed' : '');
            
            card.innerHTML = `
                <span class="level-number">${i}</span>
                <span class="level-name">${level.name}</span>
                ${!isUnlocked ? '<span class="lock-icon">🔒</span>' : ''}
                ${bestScore ? `<span style="font-size: 0.8rem; color: #4CAF50;">最佳: ${bestScore}%</span>` : ''}
            `;
            
            if (isUnlocked) {
                card.addEventListener('click', () => this.startLevel(i));
            }
            
            grid.appendChild(card);
        }
    },
    
    startLevel: function(levelId) {
        this.currentLevel = levelId;
        const level = Levels.getLevelById(levelId);
        
        this.elements.currentLevel.textContent = levelId;
        this.elements.levelTheme.textContent = level.theme;
        
        this.elements.clueType.textContent = `${level.clue.icon} ${level.clue.type}`;
        this.elements.clueContent.innerHTML = `<p class="poem">${level.clue.content}</p>`;
        this.elements.storyContent.textContent = level.story.content;
        
        if (level.atmosphere === 'horror') {
            this.setAtmosphere('horror');
        } else {
            this.setAtmosphere('festive');
        }
        
        PaperCanvas.reset();
        this.elements.symmetryToggle.checked = true;
        PaperCanvas.toggleSymmetry(true);
        this.elements.brushSize.value = 8;
        PaperCanvas.setBrushSize(8);
        this.selectTool('scissors');
        
        this.showScreen('game-screen');
    },
    
    selectTool: function(tool) {
        this.elements.toolBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tool === tool);
        });
        PaperCanvas.setTool(tool);
    },
    
    undo: function() {
        PaperCanvas.undo();
    },
    
    resetCanvas: function() {
        if (confirm('确定要重置画布吗？所有进度将丢失。')) {
            PaperCanvas.reset();
        }
    },
    
    showHint: function() {
        const level = Levels.getLevelById(this.currentLevel);
        this.elements.hintText.textContent = level.hint;
        this.showScreen('hint-panel');
    },
    
    closeHint: function() {
        this.showScreen('game-screen');
    },
    
    pause: function() {
        this.isPaused = true;
        this.showScreen('pause-menu');
    },
    
    resume: function() {
        this.isPaused = false;
        this.showScreen('game-screen');
    },
    
    quitLevel: function() {
        this.isPaused = false;
        this.showScreen('level-select');
    },
    
    submitWork: function() {
        if (!PaperCanvas.hasAnyCutting()) {
            alert('请先剪出一些图案再提交！');
            return;
        }
        
        const level = Levels.getLevelById(this.currentLevel);
        const similarity = PaperCanvas.calculateSimilarity(level.targetPattern);
        
        this.elements.similarityScore.textContent = similarity + '%';
        this.elements.revealedPoem.innerHTML = level.revealedPoem;
        this.elements.unlockedStory.textContent = level.unlockedStory;
        
        if (similarity >= 60) {
            this.elements.resultTitle.textContent = '作品完成！';
            Levels.completeLevel(this.currentLevel, similarity);
        } else {
            this.elements.resultTitle.textContent = '还需要改进...';
        }
        
        PaperCanvas.exportToCanvas(this.elements.resultCanvas);
        
        this.showScreen('result-screen');
    },
    
    exportPoster: function() {
        const level = Levels.getLevelById(this.currentLevel);
        const poster = Utils.createPosterCanvas(
            this.elements.resultCanvas,
            level.revealedPoem,
            '纸影谜途',
            level.name + ' - ' + level.theme
        );
        
        const timestamp = new Date().getTime();
        Utils.downloadImage(poster, `纸影谜途_${level.name}_${timestamp}`);
    },
    
    nextLevel: function() {
        const nextLevelId = this.currentLevel + 1;
        if (nextLevelId <= Levels.getTotalLevels() && Levels.isLevelUnlocked(nextLevelId)) {
            this.startLevel(nextLevelId);
        } else {
            alert('恭喜你完成了所有关卡！返回关卡选择页面查看更多内容。');
            this.showScreen('level-select');
        }
    },
    
    retryLevel: function() {
        this.startLevel(this.currentLevel);
    },
    
    toggleAtmosphere: function() {
        const newAtmosphere = this.atmosphere === 'festive' ? 'horror' : 'festive';
        this.setAtmosphere(newAtmosphere);
    },
    
    setAtmosphere: function(atmosphere) {
        this.atmosphere = atmosphere;
        document.documentElement.setAttribute('data-atmosphere', atmosphere);
        
        if (atmosphere === 'horror') {
            PaperCanvas.setPaperColor('#5C0000');
        } else {
            PaperCanvas.setPaperColor('#D32F2F');
        }
    },
    
    loadProgress: function() {
        const savedAtmosphere = Utils.loadFromLocalStorage('paperlore_atmosphere');
        if (savedAtmosphere) {
            this.setAtmosphere(savedAtmosphere);
        } else {
            this.setAtmosphere('festive');
        }
    },
    
    saveProgress: function() {
        Utils.saveToLocalStorage('paperlore_atmosphere', this.atmosphere);
    }
};

window.Game = Game;
