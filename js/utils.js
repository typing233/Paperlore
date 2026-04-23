const Utils = {
    clamp: function(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    lerp: function(start, end, t) {
        return start + (end - start) * t;
    },

    distance: function(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    },

    mirrorX: function(x, centerX) {
        return 2 * centerX - x;
    },

    deepClone: function(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    randomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    saveToLocalStorage: function(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('保存到localStorage失败:', e);
            return false;
        }
    },

    loadFromLocalStorage: function(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('从localStorage读取失败:', e);
            return null;
        }
    },

    downloadImage: function(canvas, filename) {
        const link = document.createElement('a');
        link.download = filename + '.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    },

    createPosterCanvas: function(artworkCanvas, poem, title, theme) {
        const poster = document.createElement('canvas');
        const ctx = poster.getContext('2d');
        
        poster.width = 800;
        poster.height = 1000;
        
        const gradient = ctx.createLinearGradient(0, 0, 0, poster.height);
        gradient.addColorStop(0, '#8B0000');
        gradient.addColorStop(0.5, '#D32F2F');
        gradient.addColorStop(1, '#8B0000');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, poster.width, poster.height);
        
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 8;
        ctx.strokeRect(20, 20, poster.width - 40, poster.height - 40);
        
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 5]);
        ctx.strokeRect(35, 35, poster.width - 70, poster.height - 70);
        ctx.setLineDash([]);
        
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 48px "KaiTi", "STKaiti", serif';
        ctx.textAlign = 'center';
        ctx.fillText(title || '纸影谜途', poster.width / 2, 100);
        
        if (theme) {
            ctx.font = '24px "KaiTi", "STKaiti", serif';
            ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
            ctx.fillText(theme, poster.width / 2, 140);
        }
        
        const artworkSize = 400;
        const artworkX = (poster.width - artworkSize) / 2;
        const artworkY = 170;
        
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 10;
        ctx.shadowOffsetY = 10;
        ctx.drawImage(artworkCanvas, artworkX, artworkY, artworkSize, artworkSize);
        ctx.restore();
        
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 4;
        ctx.strokeRect(artworkX - 10, artworkY - 10, artworkSize + 20, artworkSize + 20);
        
        if (poem) {
            ctx.fillStyle = '#FFF8E7';
            ctx.font = '28px "KaiTi", "STKaiti", serif';
            ctx.textAlign = 'center';
            
            const poemLines = poem.split('<br>');
            const poemStartY = artworkY + artworkSize + 50;
            
            poemLines.forEach((line, index) => {
                ctx.fillText(line.trim(), poster.width / 2, poemStartY + index * 40);
            });
        }
        
        ctx.fillStyle = 'rgba(255, 215, 0, 0.6)';
        ctx.font = '18px "KaiTi", "STKaiti", serif';
        ctx.fillText('—— 剪出真相，传承千年 ——', poster.width / 2, poster.height - 50);
        
        return poster;
    },

    isMobile: function() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
};

window.Utils = Utils;
