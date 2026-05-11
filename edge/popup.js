// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取页面中的各个元素
    const userEl = document.getElementById('username');
    const passEl = document.getElementById('password');
    const autoEl = document.getElementById('autoLogin');
    const saveBtn = document.getElementById('saveBtn');
    const statusEl = document.getElementById('status');

    // 打开弹窗时，从浏览器存储中读取已保存的账号、密码和开关状态并显示
    chrome.storage.local.get(['username', 'password', 'autoLogin'], function(data) {
        if (data.username) userEl.value = data.username;
        if (data.password) passEl.value = data.password;
        if (data.autoLogin !== undefined) autoEl.checked = data.autoLogin;
    });

    // 保存按钮点击事件
    saveBtn.addEventListener('click', function() {
        const username = userEl.value.trim();
        const password = passEl.value;      // 密码无需trim（可能包含空格）
        const autoLogin = autoEl.checked;

        // 将数据存入 chrome.storage.local，供 background.js 和 content.js 使用
        chrome.storage.local.set({
            'username': username,
            'password': password,
            'autoLogin': autoLogin
        }, function() {
            // 显示短暂的成功提示
            statusEl.textContent = '设置已保存！';
            setTimeout(() => { statusEl.textContent = ''; }, 2000);
        });
    });
});