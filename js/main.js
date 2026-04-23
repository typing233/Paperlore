document.addEventListener('DOMContentLoaded', function() {
    console.log('纸影谜途 - 剪纸解谜游戏 正在加载...');
    
    try {
        Game.init();
        console.log('游戏初始化成功！');
    } catch (error) {
        console.error('游戏初始化失败:', error);
    }
});
