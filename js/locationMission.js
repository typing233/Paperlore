const LocationMission = {
    currentPosition: null,
    watchId: null,
    nearbyMissions: [],
    collectedBadges: [],
    collectedFragments: [],
    
    mapCanvas: null,
    mapCtx: null,
    mapWidth: 0,
    mapHeight: 0,
    mapZoom: 1,
    mapOffsetX: 0,
    mapOffsetY: 0,
    isDraggingMap: false,
    dragStartX: 0,
    dragStartY: 0,
    hoveredMission: null,
    animationFrameId: null,
    isMapActive: false,
    
    chinaBounds: {
        minLat: 18,
        maxLat: 54,
        minLng: 73,
        maxLng: 135
    },
    
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
        this.initMap();
        this.startLocationTracking();
        console.log('位置任务模块初始化完成');
    },
    
    initMap: function() {
        this.mapCanvas = document.getElementById('map-canvas');
        if (!this.mapCanvas) return;
        
        this.mapCtx = this.mapCanvas.getContext('2d');
        this.resizeMap();
        
        window.addEventListener('resize', () => this.resizeMap());
        
        this.mapCanvas.addEventListener('mousedown', (e) => this.onMapMouseDown(e));
        this.mapCanvas.addEventListener('mousemove', (e) => this.onMapMouseMove(e));
        this.mapCanvas.addEventListener('mouseup', () => this.onMapMouseUp());
        this.mapCanvas.addEventListener('mouseleave', () => this.onMapMouseUp());
        
        this.mapCanvas.addEventListener('touchstart', (e) => this.onMapTouchStart(e), { passive: false });
        this.mapCanvas.addEventListener('touchmove', (e) => this.onMapTouchMove(e), { passive: false });
        this.mapCanvas.addEventListener('touchend', () => this.onMapMouseUp());
        
        const zoomInBtn = document.getElementById('map-zoom-in');
        const zoomOutBtn = document.getElementById('map-zoom-out');
        
        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', () => this.zoomMap(1.2));
        }
        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', () => this.zoomMap(0.8));
        }
        
        this.isMapActive = true;
        this.startMapAnimation();
    },
    
    startMapAnimation: function() {
        if (!this.isMapActive) return;
        
        this.renderMap();
        this.animationFrameId = requestAnimationFrame(() => this.startMapAnimation());
    },
    
    stopMapAnimation: function() {
        this.isMapActive = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    },
    
    resizeMap: function() {
        if (!this.mapCanvas) return;
        
        const container = this.mapCanvas.parentElement;
        const rect = container.getBoundingClientRect();
        
        this.mapCanvas.width = rect.width || 600;
        this.mapCanvas.height = rect.height || 300;
        
        this.mapWidth = this.mapCanvas.width;
        this.mapHeight = this.mapCanvas.height;
        
        this.mapZoom = 1;
        this.mapOffsetX = 0;
        this.mapOffsetY = 0;
        
        this.renderMap();
    },
    
    latLngToPixel: function(lat, lng) {
        const latRange = this.chinaBounds.maxLat - this.chinaBounds.minLat;
        const lngRange = this.chinaBounds.maxLng - this.chinaBounds.minLng;
        
        const x = ((lng - this.chinaBounds.minLng) / lngRange) * this.mapWidth;
        const y = ((this.chinaBounds.maxLat - lat) / latRange) * this.mapHeight;
        
        const centerX = this.mapWidth / 2;
        const centerY = this.mapHeight / 2;
        
        return {
            x: centerX + (x - centerX) * this.mapZoom + this.mapOffsetX,
            y: centerY + (y - centerY) * this.mapZoom + this.mapOffsetY
        };
    },
    
    pixelToLatLng: function(x, y) {
        const centerX = this.mapWidth / 2;
        const centerY = this.mapHeight / 2;
        
        const mapX = (x - centerX - this.mapOffsetX) / this.mapZoom + centerX;
        const mapY = (y - centerY - this.mapOffsetY) / this.mapZoom + centerY;
        
        const latRange = this.chinaBounds.maxLat - this.chinaBounds.minLat;
        const lngRange = this.chinaBounds.maxLng - this.chinaBounds.minLng;
        
        return {
            lat: this.chinaBounds.maxLat - (mapY / this.mapHeight) * latRange,
            lng: this.chinaBounds.minLng + (mapX / this.mapWidth) * lngRange
        };
    },
    
    zoomMap: function(factor) {
        const newZoom = this.mapZoom * factor;
        if (newZoom >= 0.5 && newZoom <= 5) {
            this.mapZoom = newZoom;
            this.renderMap();
        }
    },
    
    onMapMouseDown: function(e) {
        this.isDraggingMap = true;
        this.dragStartX = e.clientX - this.mapOffsetX;
        this.dragStartY = e.clientY - this.mapOffsetY;
        this.mapCanvas.style.cursor = 'grabbing';
    },
    
    onMapMouseMove: function(e) {
        const rect = this.mapCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (this.isDraggingMap) {
            this.mapOffsetX = e.clientX - this.dragStartX;
            this.mapOffsetY = e.clientY - this.dragStartY;
            this.renderMap();
        } else {
            this.checkMapHover(x, y);
        }
    },
    
    onMapMouseUp: function() {
        this.isDraggingMap = false;
        this.mapCanvas.style.cursor = 'grab';
    },
    
    onMapTouchStart: function(e) {
        e.preventDefault();
        const touch = e.touches[0];
        this.isDraggingMap = true;
        this.dragStartX = touch.clientX - this.mapOffsetX;
        this.dragStartY = touch.clientY - this.mapOffsetY;
    },
    
    onMapTouchMove: function(e) {
        e.preventDefault();
        if (this.isDraggingMap && e.touches.length > 0) {
            const touch = e.touches[0];
            this.mapOffsetX = touch.clientX - this.dragStartX;
            this.mapOffsetY = touch.clientY - this.dragStartY;
            this.renderMap();
        }
    },
    
    checkMapHover: function(x, y) {
        let foundMission = null;
        
        this.locationMissions.forEach(mission => {
            if (mission.id === 'local_mission' && !this.currentPosition) return;
            
            const lat = mission.id === 'local_mission' ? this.currentPosition.lat : mission.location.lat;
            const lng = mission.id === 'local_mission' ? this.currentPosition.lng : mission.location.lng;
            const pos = this.latLngToPixel(lat, lng);
            
            const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
            if (distance < 20) {
                foundMission = mission;
            }
        });
        
        if (foundMission !== this.hoveredMission) {
            this.hoveredMission = foundMission;
            this.renderMap();
        }
    },
    
    renderMap: function() {
        if (!this.mapCtx) return;
        
        const ctx = this.mapCtx;
        ctx.clearRect(0, 0, this.mapWidth, this.mapHeight);
        
        this.drawMapBackground();
        this.drawChinaOutline();
        this.drawProvinceBoundaries();
        this.drawCities();
        this.drawMissionMarkers();
        this.drawCurrentPosition();
        this.drawHoverPopup();
    },
    
    drawMapBackground: function() {
        const ctx = this.mapCtx;
        const gradient = ctx.createLinearGradient(0, 0, 0, this.mapHeight);
        gradient.addColorStop(0, '#e8f4f8');
        gradient.addColorStop(0.5, '#d4e8ed');
        gradient.addColorStop(1, '#c8dce0');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.mapWidth, this.mapHeight);
    },
    
    drawChinaOutline: function() {
        const ctx = this.mapCtx;
        
        const outlinePoints = [
            { lat: 53.56, lng: 123.4 },
            { lat: 52.5, lng: 120.5 },
            { lat: 50.2, lng: 119.5 },
            { lat: 49.2, lng: 121.5 },
            { lat: 47.8, lng: 123.5 },
            { lat: 46.8, lng: 125.5 },
            { lat: 45.8, lng: 126.5 },
            { lat: 44.8, lng: 127.5 },
            { lat: 43.8, lng: 129.5 },
            { lat: 42.8, lng: 130.8 },
            { lat: 41.8, lng: 131.8 },
            { lat: 40.8, lng: 131.5 },
            { lat: 39.8, lng: 130.5 },
            { lat: 38.8, lng: 129.5 },
            { lat: 37.8, lng: 128.5 },
            { lat: 36.8, lng: 127.5 },
            { lat: 35.8, lng: 126.5 },
            { lat: 34.8, lng: 125.5 },
            { lat: 33.8, lng: 124.5 },
            { lat: 32.8, lng: 123.5 },
            { lat: 31.8, lng: 122.5 },
            { lat: 30.8, lng: 121.8 },
            { lat: 29.8, lng: 121.5 },
            { lat: 28.8, lng: 121.2 },
            { lat: 27.8, lng: 120.8 },
            { lat: 26.8, lng: 120.2 },
            { lat: 25.8, lng: 119.5 },
            { lat: 24.8, lng: 118.8 },
            { lat: 23.8, lng: 117.8 },
            { lat: 22.8, lng: 116.8 },
            { lat: 21.8, lng: 115.8 },
            { lat: 20.8, lng: 114.8 },
            { lat: 19.8, lng: 113.8 },
            { lat: 18.8, lng: 112.8 },
            { lat: 18.2, lng: 111.8 },
            { lat: 18.5, lng: 110.8 },
            { lat: 19.5, lng: 109.8 },
            { lat: 20.5, lng: 108.8 },
            { lat: 21.5, lng: 107.8 },
            { lat: 22.5, lng: 106.8 },
            { lat: 23.5, lng: 105.8 },
            { lat: 24.5, lng: 104.8 },
            { lat: 25.5, lng: 103.8 },
            { lat: 26.5, lng: 102.8 },
            { lat: 27.5, lng: 101.8 },
            { lat: 28.5, lng: 100.8 },
            { lat: 29.5, lng: 99.8 },
            { lat: 30.5, lng: 98.8 },
            { lat: 31.5, lng: 97.8 },
            { lat: 32.5, lng: 96.8 },
            { lat: 33.5, lng: 95.8 },
            { lat: 34.5, lng: 94.8 },
            { lat: 35.5, lng: 93.8 },
            { lat: 36.5, lng: 92.8 },
            { lat: 37.5, lng: 91.8 },
            { lat: 38.5, lng: 90.8 },
            { lat: 39.5, lng: 89.8 },
            { lat: 40.5, lng: 88.8 },
            { lat: 41.5, lng: 87.8 },
            { lat: 42.5, lng: 86.8 },
            { lat: 43.5, lng: 85.8 },
            { lat: 44.5, lng: 84.8 },
            { lat: 45.5, lng: 83.8 },
            { lat: 46.5, lng: 82.8 },
            { lat: 47.5, lng: 81.8 },
            { lat: 48.5, lng: 80.8 },
            { lat: 49.5, lng: 79.8 },
            { lat: 50.5, lng: 78.8 },
            { lat: 51.5, lng: 77.8 },
            { lat: 52.5, lng: 76.8 },
            { lat: 53.5, lng: 75.8 },
            { lat: 52.5, lng: 74.8 },
            { lat: 51.5, lng: 73.8 },
            { lat: 50.5, lng: 73.5 },
            { lat: 49.5, lng: 74.5 },
            { lat: 48.5, lng: 75.5 },
            { lat: 47.5, lng: 76.5 },
            { lat: 46.5, lng: 77.5 },
            { lat: 45.5, lng: 78.5 },
            { lat: 44.5, lng: 79.5 },
            { lat: 43.5, lng: 80.5 },
            { lat: 42.5, lng: 81.5 },
            { lat: 41.5, lng: 82.5 },
            { lat: 40.5, lng: 83.5 },
            { lat: 39.5, lng: 84.5 },
            { lat: 38.5, lng: 85.5 },
            { lat: 37.5, lng: 86.5 },
            { lat: 36.5, lng: 87.5 },
            { lat: 35.5, lng: 88.5 },
            { lat: 34.5, lng: 89.5 },
            { lat: 33.5, lng: 90.5 },
            { lat: 32.5, lng: 91.5 },
            { lat: 31.5, lng: 92.5 },
            { lat: 30.5, lng: 93.5 },
            { lat: 29.5, lng: 94.5 },
            { lat: 28.5, lng: 95.5 },
            { lat: 27.5, lng: 96.5 },
            { lat: 26.5, lng: 97.5 },
            { lat: 25.5, lng: 98.5 },
            { lat: 24.5, lng: 99.5 },
            { lat: 23.5, lng: 100.5 },
            { lat: 22.5, lng: 101.5 },
            { lat: 21.5, lng: 102.5 },
            { lat: 20.5, lng: 103.5 },
            { lat: 19.5, lng: 104.5 },
            { lat: 18.5, lng: 105.5 },
            { lat: 18.2, lng: 106.5 },
            { lat: 19.2, lng: 107.5 },
            { lat: 20.2, lng: 108.5 },
            { lat: 21.2, lng: 109.5 },
            { lat: 22.2, lng: 110.5 },
            { lat: 23.2, lng: 111.5 },
            { lat: 24.2, lng: 112.5 },
            { lat: 25.2, lng: 113.5 },
            { lat: 26.2, lng: 114.5 },
            { lat: 27.2, lng: 115.5 },
            { lat: 28.2, lng: 116.5 },
            { lat: 29.2, lng: 117.5 },
            { lat: 30.2, lng: 118.5 },
            { lat: 31.2, lng: 119.5 },
            { lat: 32.2, lng: 120.5 },
            { lat: 33.2, lng: 121.5 },
            { lat: 34.2, lng: 122.5 },
            { lat: 35.2, lng: 123.5 },
            { lat: 36.2, lng: 124.5 },
            { lat: 37.2, lng: 125.5 },
            { lat: 38.2, lng: 126.5 },
            { lat: 39.2, lng: 127.5 },
            { lat: 40.2, lng: 128.5 },
            { lat: 41.2, lng: 129.5 },
            { lat: 42.2, lng: 130.5 },
            { lat: 43.2, lng: 131.5 },
            { lat: 44.2, lng: 132.5 },
            { lat: 45.2, lng: 133.5 },
            { lat: 46.2, lng: 134.5 },
            { lat: 47.2, lng: 135.5 },
            { lat: 48.2, lng: 134.5 },
            { lat: 49.2, lng: 133.5 },
            { lat: 50.2, lng: 132.5 },
            { lat: 51.2, lng: 131.5 },
            { lat: 52.2, lng: 130.5 },
            { lat: 53.2, lng: 129.5 },
            { lat: 53.56, lng: 128.4 },
            { lat: 53.56, lng: 126.4 },
            { lat: 53.56, lng: 124.4 },
            { lat: 53.56, lng: 123.4 }
        ];
        
        ctx.beginPath();
        
        const firstPoint = this.latLngToPixel(outlinePoints[0].lat, outlinePoints[0].lng);
        ctx.moveTo(firstPoint.x, firstPoint.y);
        
        for (let i = 1; i < outlinePoints.length; i++) {
            const point = this.latLngToPixel(outlinePoints[i].lat, outlinePoints[i].lng);
            ctx.lineTo(point.x, point.y);
        }
        
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 248, 231, 0.9)';
        ctx.fill();
        ctx.strokeStyle = '#D32F2F';
        ctx.lineWidth = 2;
        ctx.stroke();
    },
    
    drawProvinceBoundaries: function() {
        const ctx = this.mapCtx;
        
        ctx.strokeStyle = 'rgba(211, 47, 47, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        
        const provinceLines = [
            { lat: 42, lng: 115, toLat: 42, toLng: 125 },
            { lat: 40, lng: 114, toLat: 40, toLng: 120 },
            { lat: 36, lng: 113, toLat: 36, toLng: 122 },
            { lat: 32, lng: 110, toLat: 32, toLng: 120 },
            { lat: 30, lng: 108, toLat: 30, toLng: 122 },
            { lat: 28, lng: 106, toLat: 28, toLng: 116 },
            { lat: 48, lng: 115, toLat: 42, toLng: 115 },
            { lat: 42, lng: 112, toLat: 34, toLng: 112 },
            { lat: 34, lng: 108, toLat: 22, toLng: 108 },
            { lat: 45, lng: 105, toLat: 30, toLng: 105 },
            { lat: 40, lng: 100, toLat: 25, toLng: 100 },
            { lat: 48, lng: 95, toLat: 35, toLng: 95 },
        ];
        
        provinceLines.forEach(line => {
            const start = this.latLngToPixel(line.lat, line.lng);
            const end = this.latLngToPixel(line.toLat, line.toLng);
            
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
        });
        
        ctx.setLineDash([]);
    },
    
    drawCities: function() {
        const ctx = this.mapCtx;
        
        const cities = [
            { name: '北京', lat: 39.9, lng: 116.4, size: 4 },
            { name: '上海', lat: 31.2, lng: 121.5, size: 4 },
            { name: '广州', lat: 23.1, lng: 113.3, size: 3 },
            { name: '深圳', lat: 22.5, lng: 114.1, size: 3 },
            { name: '成都', lat: 30.7, lng: 104.1, size: 3 },
            { name: '重庆', lat: 29.6, lng: 106.6, size: 3 },
            { name: '武汉', lat: 30.6, lng: 114.3, size: 3 },
            { name: '西安', lat: 34.3, lng: 108.9, size: 3 },
            { name: '杭州', lat: 30.3, lng: 120.2, size: 3 },
            { name: '南京', lat: 32.1, lng: 118.8, size: 3 },
        ];
        
        cities.forEach(city => {
            const pos = this.latLngToPixel(city.lat, city.lng);
            
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, city.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(139, 0, 0, 0.5)';
            ctx.fill();
            ctx.strokeStyle = '#8B0000';
            ctx.lineWidth = 1;
            ctx.stroke();
        });
    },
    
    drawMissionMarkers: function() {
        const ctx = this.mapCtx;
        
        this.locationMissions.forEach(mission => {
            if (mission.id === 'local_mission') return;
            
            const pos = this.latLngToPixel(mission.location.lat, mission.location.lng);
            const isCompleted = this.collectedBadges.includes(mission.reward.name);
            const isHovered = this.hoveredMission && this.hoveredMission.id === mission.id;
            
            const radius = isHovered ? 14 : 12;
            
            if (mission.location.radius > 0) {
                const radiusPixels = (mission.location.radius / 100000) * this.mapZoom;
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, Math.max(radiusPixels, 30), 0, Math.PI * 2);
                ctx.fillStyle = isCompleted ? 'rgba(76, 175, 80, 0.15)' : 'rgba(255, 152, 0, 0.15)';
                ctx.fill();
                ctx.strokeStyle = isCompleted ? 'rgba(76, 175, 80, 0.5)' : 'rgba(255, 152, 0, 0.5)';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
            
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = isCompleted ? '#4CAF50' : '#D32F2F';
            ctx.fill();
            ctx.strokeStyle = isCompleted ? '#2E7D32' : '#B71C1C';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            if (isHovered) {
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, radius + 5, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)';
                ctx.lineWidth = 3;
                ctx.stroke();
            }
            
            ctx.fillStyle = '#FFF8E7';
            ctx.font = 'bold 11px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(mission.reward.icon, pos.x, pos.y);
            
            ctx.fillStyle = 'var(--text-dark, #2C1810)';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(mission.location.name, pos.x, pos.y + radius + 15);
        });
    },
    
    drawCurrentPosition: function() {
        if (!this.currentPosition) return;
        
        const ctx = this.mapCtx;
        const pos = this.latLngToPixel(this.currentPosition.lat, this.currentPosition.lng);
        const time = Date.now() / 1000;
        
        const pulseRadius = 15 + Math.sin(time * 3) * 3;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, pulseRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(76, 175, 80, 0.2)';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(76, 175, 80, 0.3)';
        ctx.fill();
        ctx.strokeStyle = '#4CAF50';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#4CAF50';
        ctx.fill();
        
        ctx.fillStyle = '#2E7D32';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('📍 当前位置', pos.x, pos.y - 18);
    },
    
    drawHoverPopup: function() {
        if (!this.hoveredMission) return;
        
        const ctx = this.mapCtx;
        const pos = this.latLngToPixel(this.hoveredMission.location.lat, this.hoveredMission.location.lng);
        
        const isCompleted = this.collectedBadges.includes(this.hoveredMission.reward.name);
        
        const popupX = pos.x + 20;
        const popupY = pos.y - 60;
        const popupWidth = 160;
        const popupHeight = 70;
        
        ctx.fillStyle = 'rgba(255, 248, 231, 0.98)';
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        
        this.roundRect(ctx, popupX, popupY, popupWidth, popupHeight, 8);
        ctx.fill();
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(pos.x + 18, pos.y - 5);
        ctx.lineTo(popupX, pos.y + 5);
        ctx.lineTo(popupX, pos.y - 15);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 248, 231, 0.98)';
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = isCompleted ? '#4CAF50' : '#D32F2F';
        ctx.font = 'bold 13px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`${this.hoveredMission.reward.icon} ${this.hoveredMission.name}`, popupX + 10, popupY + 20);
        
        ctx.fillStyle = '#666';
        ctx.font = '11px Arial';
        ctx.fillText(`📍 ${this.hoveredMission.location.name}`, popupX + 10, popupY + 38);
        
        ctx.fillStyle = isCompleted ? '#4CAF50' : '#888';
        ctx.font = '11px Arial';
        ctx.fillText(isCompleted ? '✅ 已完成' : '🔒 待解锁', popupX + 10, popupY + 56);
    },
    
    roundRect: function(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
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
                this.renderMap();
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
                this.renderMap();
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
            Math.sin(dLat / 2) * Math.sin(dLat / 2);
        
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
        this.renderMap();
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
        this.renderMap();
        
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
