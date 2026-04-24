document.addEventListener('DOMContentLoaded', function() {
    console.log('纸影谜途 - 剪纸解谜游戏 正在加载...');
    
    try {
        if (window.SmartAssist) {
            SmartAssist.init();
            console.log('智能辅助模块初始化完成');
        }
        
        Game.init();
        console.log('游戏初始化成功！');
        
        console.log('');
        console.log('=== 纸影谜途 - 功能概览 ===');
        console.log('1. 核心游戏：根据诗词提示裁剪剪纸图案');
        console.log('2. AI生成剪纸：输入关键词生成剪纸线稿模板');
        console.log('3. 照片转剪纸：上传照片转换为剪纸风格');
        console.log('4. AR扫描：扫描海报观看生肖故事动画');
        console.log('5. 位置任务：在特定地点完成任务收集徽章');
        console.log('6. 智能辅助：实时分析笔触，提供绘制提示');
        console.log('==============================');
    } catch (error) {
        console.error('游戏初始化失败:', error);
    }
});
