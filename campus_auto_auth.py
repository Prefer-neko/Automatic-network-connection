import time
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.edge.options import Options

# ========== 配置区域 ==========
USERNAME = "-"  # 你的学号/账号
PASSWORD = "-"  # 你的密码
LOGIN_URL = "http://10.2.10.19/eportal/index.jsp?wlanuserip=7c4d682e6ad2cc9bd629a7e6d9579cbf&wlanacname=aa2ea954bf76a149bfe442c733cdc893&ssid=5df98c42e01473b2bc145da24fd71665&nasip=24a62773d2c7adb91d18fe236c6c0224&snmpagentip=&mac=75b27d9ababc5b323ef06148d890cf83&t=wireless-v2&url=3c79db086e0a5be39866f35568a25ac9fe36ca4836013a3b1bec7afa3c62de26e777f2c4a70291d8&apmac=&nasid=aa2ea954bf76a149bfe442c733cdc893&vid=30c19e16d38a6022&port=0636026dd50a0cb6&nasportid=d03d2ccddcd08f6715ebbe91c524cf8f33e6be039c2d28c6498433a1ad48005d"
EDGE_DRIVER_PATH = r"D:\work\自动联网\msedgedriver.exe"  # 替换为你的驱动路径
CHECK_INTERVAL = 30  # 检测间隔（秒），建议30秒


# ===========================

def is_connected():
    """检测网络是否连通"""
    try:
        # 尝试访问百度，超时5秒
        requests.get("http://www.baidu.com", timeout=5)
        return True
    except requests.RequestException:
        return False


def auto_login():
    """自动打开浏览器并登录"""
    print(f"[{time.strftime('%H:%M:%S')}] 网络已断开，正在尝试自动登录...")

    # 设置无头模式（静默运行，不显示浏览器窗口）
    edge_options = Options()
    edge_options.add_argument("--headless")  # 无头模式
    edge_options.add_argument("--disable-gpu")
    edge_options.add_argument("--log-level=3")  # 只显示致命错误

    driver = None
    try:
        driver = webdriver.Edge(executable_path=EDGE_DRIVER_PATH, options=edge_options)
        driver.get(LOGIN_URL)
        time.sleep(2)  # 等待页面加载

        # 尝试查找用户名和密码输入框（根据实际页面修改选择器）
        # 常见的选择器方式：id、name、class等，可能需要根据实际页面调整
        username_input = driver.find_element(By.ID, "username")  # 如果页面的id是"username"
        password_input = driver.find_element(By.ID, "password")  # 如果页面的id是"password"

        username_input.send_keys(USERNAME)
        password_input.send_keys(PASSWORD)

        # 查找并点击登录按钮
        login_button = driver.find_element(By.ID, "login")  # 如果按钮id是"login"
        login_button.click()

        time.sleep(3)
        print(f"[{time.strftime('%H:%M:%S')}] 登录请求已发送")

    except Exception as e:
        print(f"[{time.strftime('%H:%M:%S')}] 登录失败: {e}")
        print("提示：可能需要根据校园网登录页面的实际元素id修改代码中的选择器")
    finally:
        if driver:
            driver.quit()


if __name__ == "__main__":
    print("=" * 40)
    print("校园网自动认证脚本已启动")
    print(f"检测间隔: {CHECK_INTERVAL} 秒")
    print("按 Ctrl+C 可停止程序")
    print("=" * 40)

    while True:
        if not is_connected():
            auto_login()
        else:
            # 可选：取消注释下面这行可以看到实时状态
            # print(f"[{time.strftime('%H:%M:%S')}] 网络正常")
            pass

        time.sleep(CHECK_INTERVAL)