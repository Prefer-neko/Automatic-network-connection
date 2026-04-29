document.addEventListener('DOMContentLoaded', function() {
    const userEl = document.getElementById('username');
    const passEl = document.getElementById('password');
    const autoEl = document.getElementById('autoLogin');
    const saveBtn = document.getElementById('saveBtn');
    const statusEl = document.getElementById('status');

    // 打开面板时，加载已保存的数据
    chrome.storage.local.get(['username', 'password', 'autoLogin'], function(data) {
        if (data.username) userEl.value = data.username;
        if (data.password) passEl.value = data.password;
        if (data.autoLogin !== undefined) autoEl.checked = data.autoLogin;
    });

    // 点击保存按钮
    saveBtn.addEventListener('click', function() {
        const username = userEl.value.trim();
        const password = passEl.value;
        const autoLogin = autoEl.checked;

        // 保存数据到浏览器的本地存储
        chrome.storage.local.set({
            'username': username,
            'password': password,
            'autoLogin': autoLogin
        }, function() {
            statusEl.textContent = '设置已保存！';
            setTimeout(() => { statusEl.textContent = ''; }, 2000);
        });
    });
});