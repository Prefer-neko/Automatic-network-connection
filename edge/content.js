// 当页面匹配到校园网认证域名时，此脚本自动执行
console.log("校园网自动认证插件：已注入当前页面");

// 读取存储中的账号、密码和自动登录开关
chrome.storage.local.get(['username', 'password', 'autoLogin'], function(data) {
    // 检查是否满足自动登录条件：开关打开 且 账号密码均存在
    if (data.autoLogin && data.username && data.password) {
        console.log("准备自动填写并登录...");
        
        let checkCount = 0;
        // 每隔500毫秒检查一次页面元素是否加载完成（模拟显式等待）
        let checkExist = setInterval(function() {
            checkCount++;
            
            // 查找认证页面中的用户名输入框、密码输入框和登录按钮
            // 注意：这些ID需与校园网实际页面元素ID一致
            const userField = document.getElementById("username_tip");
            const passField = document.getElementById("pwd_tip");
            const loginBtn = document.getElementById("loginLink_div");

            // 全部元素都出现时执行自动填充和点击
            if (userField && passField && loginBtn) {
                clearInterval(checkExist); // 停止继续检查
                
                // 填入账号和密码
                userField.value = data.username;
                passField.value = data.password;
                
                // 手动触发一些事件，确保前端框架能够捕捉到值的变化
                userField.dispatchEvent(new Event('input', { bubbles: true }));
                passField.dispatchEvent(new Event('input', { bubbles: true }));
                userField.dispatchEvent(new Event('change', { bubbles: true }));

                // 延迟1秒再点击登录按钮，防止服务器处理过快或页面未完全绑定事件
                console.log("等待1秒后点击登录...");
                setTimeout(function() {
                    loginBtn.click();
                    console.log("已自动点击登录按钮");
                }, 1000);
            }
            
            // 超过20次检查（共10秒）仍未找到元素，放弃本次自动登录，避免无限循环
            if (checkCount > 20) {
                clearInterval(checkExist);
                console.log("超时未找到登录输入框，放弃自动登录");
            }
        }, 500);
    }
});