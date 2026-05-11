// 校园网认证页面的固定URL（包含必要的查询参数，用于触发重定向）
const LOGIN_URL = "http://10.2.10.19/eportal/index.jsp?wlanuserip=7c4d682e6ad2cc9bd629a7e6d9579cbf&wlanacname=aa2ea954bf76a149bfe442c733cdc893&ssid=5df98c42e01473b2bc145da24fd71665&nasip=24a62773d2c7adb91d18fe236c6c0224&snmpagentip=&mac=75b27d9ababc5b323ef06148d890cf83&t=wireless-v2&url=3c79db086e0a5be39866f35568a25ac9fe36ca4836013a3b1bec7afa3c62de26e777f2c4a70291d8&apmac=&nasid=aa2ea954bf76a149bfe442c733cdc893&vid=30c19e16d38a6022&port=0636026dd50a0cb6&nasportid=d03d2ccddcd08f6715ebbe91c524cf8f33e6be039c2d28c6498433a1ad48005d";

// 插件安装或启动时，创建一个定时器，每分钟检查一次网络状态
chrome.runtime.onInstalled.addListener(() => {
    // 创建周期性闹钟，最小间隔1分钟（Edge/Chrome扩展限制）
    chrome.alarms.create('checkNetwork', { periodInMinutes: 1 });
});

// 监听闹钟触发事件
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'checkNetwork') {
        checkConnectionAndLogin(); // 执行连通性检测和自动登录逻辑
    }
});

/**
 * 检测网络连通性，若无法访问外网（被劫持）则打开认证页面
 */
async function checkConnectionAndLogin() {
    // 从存储中读取用户是否启用了自动登录
    chrome.storage.local.get(['autoLogin'], async function(data) {
        if (!data.autoLogin) return; // 未开启自动登录，直接返回

        try {
            // 尝试请求百度首页，判断网络是否通畅
            // mode: 'no-cors' 可以绕过CORS限制，但无法获取响应内容，仅用于触发错误
            await fetch("https://www.baidu.com", { mode: 'no-cors', cache: 'no-store' });
        } catch (error) {
            // 请求失败 → 网络不通或需要认证 → 打开认证页面
            chrome.tabs.query({}, function(tabs) {
                // 检查是否已有认证页面处于打开状态，避免重复创建标签页
                const isOpened = tabs.some(tab => 
                    tab.url && (tab.url.includes("10.2.10.19") || tab.url.includes("my.njpji.cn"))
                );
                if (!isOpened) {
                    // 后台静默创建认证页面（active: false 不会抢夺当前焦点）
                    chrome.tabs.create({ url: LOGIN_URL, active: false });
                }
            });
        }
    });
}