const LocationMission = {
    currentPosition: null,
    watchId: null,
    nearbyMissions: [],
    collectedBadges: [],
    collectedFragments: [],
    
    locationMissions: [
        {
            id: 'forbidden_city',
            name: '故宫探秘',
            location: {
                name: '北京故宫',
                lat: 39.9163,
                lng: 116.3972,
                radius: 500
            },
            description: '在故宫附近完成"龙凤呈祥"剪纸任务',
            requiredLevel: 3,
            reward: {
                type: 'badge',
                name: '故宫徽章',
                icon: '🏯'
            },
            storyFragment: {
                id: 'fragment_1',
                title: '故宫的剪纸传说',
                content: '传说在清朝时期，故宫里有一位技艺高超的剪纸艺人，他的作品能够在月光下显现出神秘的图案...'
            }
        },
        {
            id: 'great_wall',
            name: '长城寻踪',
            location: {
                name: '北京八达岭长城',
                lat: 40.3576,
                lng: 116.0205,
                radius: 1000
            },
            description: '在长城附近完成"双龙戏珠"剪纸任务',
            requiredLevel: 6,
            reward: {
                type: 'badge',
                name: '长城徽章',
                icon: '🧱'
            },
            storyFragment: {
                id: 'fragment_2',
                title: '长城上的龙纹',
                content: '长城上的砖纹据说蕴含着古老的龙纹密码，只有真正的剪纸大师才能解读其中的奥秘...'
            }
        },
        {
            id: 'west_lake',
            name: '西湖剪影',
            location: {
                name: '杭州西湖',
                lat: 30.2500,
                lng: 120.1500,
                radius: 800
            },
            description: '在西湖附近完成"喜上眉梢"剪纸任务',
            requiredLevel: 2,
            reward: {
                type: 'badge',
                name: '西湖徽章',
                icon: '🌊'
            },
            storyFragment: {
                id: 'fragment_3',
                title: '西湖边的剪纸坊',
                content: '西湖边有一座古老的剪纸坊，据说那里的剪纸能够倒映出西湖的美景...'
            }
        },
        {
            id: 'terracotta',
            name: '秦俑之谜',
            location: {
                name: '西安兵马俑',
                lat: 34.3843,
                lng: 109.2775,
                radius: 600
            },
            description: '在兵马俑附近完成"虎头虎脑"剪纸任务',
            requiredLevel: 4,
            reward: {
                type: 'badge',
                name: '兵马俑徽章',
                icon: '🗿'
            },
            storyFragment: {
                id: 'fragment_4',
                title: '秦代的剪纸艺术',
                content: '虽然纸在汉代才被发明，但秦代的刻纹艺术已经蕴含了剪纸的精髓...'
            }
        },
        {
            id: 'local_mission',
            name: '身边的剪纸',
            location: {
                name: '您当前位置',
                lat: 0,
                lng: 0,
                radius: 100
            },
            description: '在任意位置完成任意剪纸任务',
            requiredLevel: 1,
            reward: {
                type: 'badge',
                name: '探索者徽章',
                icon: '🌟'
            },
            storyFragment: {
                id: 'fragment_0',
                title: '剪纸的起源',
                content: '剪纸艺术起源于中国，距今已有三千多年的历史。最早的剪纸是用金银箔雕刻而成的...'
            }
        }
    ],
    
    init: function() {
        this.loadProgress();
        this.bindEvents();
        console.log('位置任务模块初始化完成');
    },
    
    bindEvents: function() {
        const missionsContainer = document.querySelector('.missions');
        if (missionsContainer) {
            missionsContainer.addEventListener('click', (e) => {
                const missionCard = e.target.closest('.mission-card');
                if (missionCard && !missionCard.classList.contains('locked')) {
                    const missionId = missionCard.dataset.missionId;
                    this.startMission(missionId);
                }
            });
        }
    },
    
    loadProgress: function() {
        const saved = Utils.loadFromLocalStorage('paperlore_location_progress');
        if (saved) {
            this.collectedBadges = saved.collectedBadges || [];
            this.collectedFragments = saved.collectedFragments || [];
        }
    },
    
    saveProgress: function() {
        Utils.saveToLocalStorage('paperlore_location_progress', {
            collectedBadges: this.collectedBadges,
            collectedFragments: this.collectedFragments
        });
    },
    
    startLocationTracking: function() {
        if (!navigator.geolocation) {
            this.updateStatus('❌ 您的浏览器不支持地理位置功能');
            this.showDemoMissions();
            return;
        }
        
        this.updateStatus('📍 正在获取位置信息...');
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.currentPosition = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                this.updateStatus(`✅ 已获取位置: ${this.currentPosition.lat.toFixed(4)}, ${this.currentPosition.lng.toFixed(4)}`);
                this.findNearbyMissions();
            },
            (error) => {
                console.error('获取位置失败:', error);
                let errorMessage = '无法获取位置信息';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = '您拒绝了位置权限请求';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = '位置信息不可用';
                        break;
                    case error.TIMEOUT:
                        errorMessage = '获取位置超时';
                        break;
                }
                this.updateStatus(`❌ ${errorMessage}`);
                this.showDemoMissions();
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
        
        this.watchId = navigator.geolocation.watchPosition(
            (position) => {
                this.currentPosition = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                this.findNearbyMissions();
            },
            (error) => {
                console.error('位置更新失败:', error);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 5000
            }
        );
    },
    
    stopLocationTracking: function() {
        if (this.watchId !== null) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
    },
    
    findNearbyMissions: function() {
        if (!this.currentPosition) return;
        
        this.nearbyMissions = [];
        
        this.locationMissions.forEach(mission => {
            let distance;
            
            if (mission.id === 'local_mission') {
                this.nearbyMissions.push({
                    ...mission,
                    distance: 0,
                    isNearby: true
                });
            } else {
                distance = this.calculateDistance(
                    this.currentPosition.lat,
                    this.currentPosition.lng,
                    mission.location.lat,
                    mission.location.lng
                );
                
                const isNearby = distance <= mission.location.radius;
                
                this.nearbyMissions.push({
                    ...mission,
                    distance: Math.round(distance),
                    isNearby: isNearby
                });
            }
        });
        
        this.nearbyMissions.sort((a, b) => a.distance - b.distance);
        
        this.renderMissions();
        this.updateCollectionUI();
    },
    
    calculateDistance: function(lat1, lng1, lat2, lng2) {
        const R = 6371000;
        const dLat = this.toRad(lat2 - lat1);
        const dLng = this.toRad(lng2 - lng1);
        
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return R * c;
    },
    
    toRad: function(deg) {
        return deg * (Math.PI / 180);
    },
    
    showDemoMissions: function() {
        this.nearbyMissions = this.locationMissions.map(mission => ({
            ...mission,
            distance: Math.floor(Math.random() * 5000),
            isNearby: mission.id === 'local_mission'
        }));
        
        this.renderMissions();
        this.updateCollectionUI();
    },
    
    renderMissions: function() {
        const missionsContainer = document.querySelector('.missions');
        if (!missionsContainer) return;
        
        missionsContainer.innerHTML = '';
        
        this.nearbyMissions.forEach(mission => {
            const isCompleted = this.collectedBadges.includes(mission.reward.name);
            const card = document.createElement('div');
            card.className = `mission-card ${!mission.isNearby ? 'locked' : ''} ${isCompleted ? 'completed' : ''}`;
            card.dataset.missionId = mission.id;
            
            let distanceText = '';
            if (mission.distance > 1000) {
                distanceText = `${(mission.distance / 1000).toFixed(1)}公里`;
            } else {
                distanceText = `${mission.distance}米`;
            }
            
            card.innerHTML = `
                <div class="mission-title">${mission.reward.icon} ${mission.name}</div>
                <div class="mission-location">📍 ${mission.location.name} (${distanceText})</div>
                <p style="font-size: 0.85rem; color: var(--text-dark); margin: 0.5rem 0; opacity: 0.8;">${mission.description}</p>
                <div class="mission-reward">
                    🏆 奖励: ${mission.reward.name}
                    ${isCompleted ? ' ✅ 已完成' : ''}
                </div>
                ${!mission.isNearby ? '<div style="margin-top: 0.5rem; font-size: 0.8rem; color: #888;">🔒 需要到达指定位置</div>' : ''}
            `;
            
            missionsContainer.appendChild(card);
        });
    },
    
    updateCollectionUI: function() {
        const badges = document.querySelectorAll('.badge-item');
        badges.forEach((badge, index) => {
            const badgeName = ['故宫徽章', '长城徽章', '西湖徽章', '兵马俑徽章'][index];
            if (this.collectedBadges.includes(badgeName)) {
                badge.classList.remove('locked');
                const icon = badge.querySelector('.badge-icon');
                if (icon) {
                    const icons = ['🏯', '🧱', '🌊', '🗿'];
                    icon.textContent = icons[index];
                }
            }
        });
        
        const fragments = document.querySelectorAll('.fragment-item');
        fragments.forEach((fragment, index) => {
            const fragmentId = `fragment_${index}`;
            if (this.collectedFragments.includes(fragmentId)) {
                fragment.classList.remove('locked');
            }
        });
    },
    
    startMission: function(missionId) {
        const mission = this.nearbyMissions.find(m => m.id === missionId);
        if (!mission) return;
        
        if (!mission.isNearby) {
            alert(`需要到达 ${mission.location.name} 附近才能开始此任务！\n当前距离: ${mission.distance > 1000 ? (mission.distance / 1000).toFixed(1) + '公里' : mission.distance + '米'}`);
            return;
        }
        
        if (this.collectedBadges.includes(mission.reward.name)) {
            alert('您已完成此任务！');
            return;
        }
        
        const level = Levels.getLevelById(mission.requiredLevel);
        if (!level) {
            alert('任务数据错误！');
            return;
        }
        
        if (confirm(`开始任务: ${mission.name}\n\n位置: ${mission.location.name}\n描述: ${mission.description}\n\n是否开始?`)) {
            Game.startLevel(mission.requiredLevel);
            
            const originalSubmitWork = Game.submitWork;
            Game.submitWork = function() {
                if (!PaperCanvas.hasAnyCutting()) {
                    alert('请先剪出一些图案再提交！');
                    return;
                }
                
                const levelData = Levels.getLevelById(Game.currentLevel);
                const similarity = PaperCanvas.calculateSimilarity(levelData.targetPattern);
                
                if (similarity >= 60) {
                    LocationMission.completeMission(missionId);
                }
                
                Game.elements.similarityScore.textContent = similarity + '%';
                Game.elements.revealedPoem.innerHTML = levelData.revealedPoem;
                Game.elements.unlockedStory.textContent = levelData.unlockedStory;
                
                if (similarity >= 60) {
                    Game.elements.resultTitle.textContent = '作品完成！';
                    Levels.completeLevel(Game.currentLevel, similarity);
                } else {
                    Game.elements.resultTitle.textContent = '还需要改进...';
                }
                
                PaperCanvas.exportToCanvas(Game.elements.resultCanvas);
                
                Game.showScreen('result-screen');
                
                Game.submitWork = originalSubmitWork;
            };
        }
    },
    
    completeMission: function(missionId) {
        const mission = this.locationMissions.find(m => m.id === missionId);
        if (!mission) return;
        
        if (!this.collectedBadges.includes(mission.reward.name)) {
            this.collectedBadges.push(mission.reward.name);
        }
        
        if (!this.collectedFragments.includes(mission.storyFragment.id)) {
            this.collectedFragments.push(mission.storyFragment.id);
        }
        
        this.saveProgress();
        this.updateCollectionUI();
        
        setTimeout(() => {
            alert(`🎉 恭喜完成任务: ${mission.name}！\n\n🏆 获得徽章: ${mission.reward.name}\n📜 解锁故事碎片: ${mission.storyFragment.title}\n\n${mission.storyFragment.content}`);
        }, 500);
    },
    
    updateStatus: function(message) {
        const statusText = document.getElementById('gps-status-text');
        if (statusText) {
            statusText.textContent = message;
        }
    }
};

window.LocationMission = LocationMission;
