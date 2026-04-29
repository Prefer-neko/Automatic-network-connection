// 这个超长链接是你原脚本里的链接，可按需修改
const LOGIN_URL = "http://10.2.10.19/eportal/index.jsp?wlanuserip=7c4d682e6ad2cc9bd629a7e6d9579cbf&wlanacname=aa2ea954bf76a149bfe442c733cdc893&ssid=5df98c42e01473b2bc145da24fd71665&nasip=24a62773d2c7adb91d18fe236c6c0224&snmpagentip=&mac=75b27d9ababc5b323ef06148d890cf83&t=wireless-v2&url=3c79db086e0a5be39866f35568a25ac9fe36ca4836013a3b1bec7afa3c62de26e777f2c4a70291d8&apmac=&nasid=aa2ea954bf76a149bfe442c733cdc893&vid=30c19e16d38a6022&port=0636026dd50a0cb6&nasportid=d03d2ccddcd08f6715ebbe91c524cf8f33e6be039c2d28c6498433a1ad48005d";

// 插件安装或启动时，创建一个定时器
// 注意：Edge 扩展的 API 限制后台定时器最小间隔为 1 分钟，这比你原 Python 的 30 秒稍长一点
chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.create('checkNetwork', { periodInMinutes: 1 });
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'checkNetwork') {
        checkConnectionAndLogin();
    }
});

async function checkConnectionAndLogin() {
    chrome.storage.local.get(['autoLogin'], async function(data) {
        // 如果用户没有在控制面板开启自动登录，则什么都不做
        if (!data.autoLogin) return;

        try {
            // 尝试请求百度检测连通性。如果没网或被校园网劫持，这步会抛出错误
            await fetch("https://www.baidu.com", { mode: 'no-cors', cache: 'no-store' });
        } catch (error) {
            // 如果捕捉到错误，说明网络断了/需要认证
            // 先检查是否已经打开了校园网认证页面，避免无限创建新标签页弹窗轰炸
            chrome.tabs.query({url: "*://10.2.10.19/*"}, function(tabs) {
                if (tabs.length === 0) {
                    // 后台静默打开一个新的标签页访问校园网
                    // 页面一打开，刚才写的 content.js 就会光速执行填密码并点击
                    chrome.tabs.create({ url: LOGIN_URL, active: false });
                }
            });
        }
    });
}