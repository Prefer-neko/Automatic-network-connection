// 该脚本会在你打开 10.2.10.19 校园网页面时自动运行
console.log("校园网自动认证插件：已注入当前页面");

chrome.storage.local.get(['username', 'password', 'autoLogin'], function(data) {
    // 如果用户在面板开启了自动登录，并且填写了账号密码
    if (data.autoLogin && data.username && data.password) {
        console.log("准备自动填写并登录...");
        
        // 使用定时器循环查找元素（完美替代 Selenium 的显式等待）
        let checkCount = 0;
        let checkExist = setInterval(function() {
            checkCount++;
            
            // 【注意】如果你网页的实际 ID 不是下面这些，请修改括号内的字符串！
            const userField = document.getElementById("username");
            const passField = document.getElementById("password");
            const loginBtn = document.getElementById("login");

            if (userField && passField && loginBtn) {
                clearInterval(checkExist); // 找到元素，停止循环检查
                
                // 填入账号密码
                userField.value = data.username;
                passField.value = data.password;
                
                // 触发网页事件 (防止一些前端框架检测不到输入)
                userField.dispatchEvent(new Event('input', { bubbles: true }));
                passField.dispatchEvent(new Event('input', { bubbles: true }));
                userField.dispatchEvent(new Event('change', { bubbles: true }));

                // 点击登录
                loginBtn.click();
                console.log("已自动点击登录按钮");
            }
            
            // 最多检查 20 次（即 10 秒），超时后放弃，防止无限卡死
            if (checkCount > 20) {
                clearInterval(checkExist);
                console.log("超时未找到登录输入框，放弃自动登录");
            }
        }, 500); // 每 500 毫秒扫描一次页面
    }
});