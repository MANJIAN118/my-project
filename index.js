(function() {
  // 防止重复加载
  if (document.getElementById('wv-phone-container')) return;

  // ===== 0. 【关键修正】加载外部 CSS 文件 =====
  // 注意：这里的路径和仓库名保持一致
  const cssLink = document.createElement('link');
cssLink.rel = 'stylesheet';
// 原来的错误路径：
// cssLink.href = 'https://cdn.jsdelivr.net/gh/MANJIAN118/my-project/weverse-app/weverse-app.css';
// 改成正确的根目录路径：
cssLink.href = 'https://cdn.jsdelivr.net/gh/MANJIAN118/my-project/weverse-app.css';
document.head.appendChild(cssLink);

  // ===== 1. 创建手机外壳容器 =====
  const phoneContainer = document.createElement('div');
  phoneContainer.id = 'wv-phone-container';
  phoneContainer.innerHTML = `
    <div id="wv-phone-frame">
      <div class="wv-phone-notch"></div>
      <div class="wv-phone-status-bar">
        <span class="wv-status-time">18:00</span>
        <span>●●●● WiFi 🔋78%</span>
      </div>
      <div id="wv-phone-body">
        <!-- 这里的内容会被 weverse-app.css 控制样式 -->
        <div class="wv-app">
          <div class="wv-header">
            <div class="wv-header-title">Weverse</div>
            <div class="wv-header-avatar"></div>
          </div>
          <div class="wv-feed">
            <div class="wv-post">
              <div class="wv-post-header">
                <div class="wv-post-avatar"></div>
                <div class="wv-post-info">
                  <div class="wv-post-author">Artist Name</div>
                  <div class="wv-post-time">2 hours ago</div>
                </div>
              </div>
              <div class="wv-post-content">这是一条测试帖子内容~</div>
              <div class="wv-post-actions">
                <div>💬 123</div>
                <div>❤️ 4567</div>
              </div>
            </div>
          </div>
          <div class="wv-bottom-nav">
            <div class="wv-tab active" data-page="home">
              <div class="wv-tab-icon">🏠</div>
              <div>Home</div>
            </div>
            <div class="wv-tab" data-page="dm">
              <div class="wv-tab-icon">✉️</div>
              <div>DM</div>
            </div>
            <div class="wv-tab" data-page="more">
              <div class="wv-tab-icon">☰</div>
              <div>More</div>
            </div>
          </div>
          <div class="wv-fab">+</div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(phoneContainer);

  // ===== 2. 注入手机壳基础样式 =====
  const baseStyle = document.createElement('style');
  baseStyle.textContent = `
    #wv-phone-container {
      position: fixed;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
      z-index: 99999;
    }
    #wv-phone-frame {
      width: 375px;
      height: 720px;
      background: #fff;
      border-radius: 40px;
      border: 8px solid #1a1a1a;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      display: flex;
      flex-direction: column;
      position: relative;
    }
    .wv-phone-notch {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 150px;
      height: 28px;
      background: #1a1a1a;
      border-radius: 0 0 18px 18px;
      z-index: 10;
    }
    .wv-phone-status-bar {
      height: 44px;
      background: #fff;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      padding: 0 20px 4px;
      font-size: 12px;
      color: #333;
      flex-shrink: 0;
    }
    #wv-phone-body {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      background: #F5F5F5;
    }
    #wv-phone-body::-webkit-scrollbar {
      width: 0;
    }
  `;
  document.head.appendChild(baseStyle);

  // ===== 3. 更新状态栏时间 =====
  function updateTime() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const timeEl = phoneContainer.querySelector('.wv-status-time');
    if (timeEl) timeEl.textContent = `${h}:${m}`;
  }
  updateTime();
  setInterval(updateTime, 30000);

  // ===== 4. 【关键修正】绑定显隐切换按钮 =====
  // 注意：这里的事件名 'Weverse' 必须和你酒馆助手里的按钮名完全一样！
  if (typeof getButtonEvent === 'function') {
    const btnEvent = getButtonEvent();
    if (btnEvent) {
      btnEvent.on('Weverse', () => {
        const el = document.getElementById('wv-phone-container');
        if (el) {
          el.style.display = el.style.display === 'none' ? 'block' : 'none';
        }
      });
    }
  }

  // ===== 5. 可拖拽功能 =====
  let isDragging = false;
  let dragOffsetX, dragOffsetY;
  const statusBar = phoneContainer.querySelector('.wv-phone-status-bar');
  
  if (statusBar) {
    statusBar.style.cursor = 'grab';
    statusBar.addEventListener('mousedown', (e) => {
      isDragging = true;
      const rect = phoneContainer.getBoundingClientRect();
      dragOffsetX = e.clientX - rect.left;
      dragOffsetY = e.clientY - rect.top;
      phoneContainer.style.transform = 'none';
      statusBar.style.cursor = 'grabbing';
    });
  }

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    phoneContainer.style.left = (e.clientX - dragOffsetX) + 'px';
    phoneContainer.style.top = (e.clientY - dragOffsetY) + 'px';
    phoneContainer.style.right = 'auto';
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    if (statusBar) statusBar.style.cursor = 'grab';
  });

  console.log('✅ Weverse 小手机加载完成！');
})();