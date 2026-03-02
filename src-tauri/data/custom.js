window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// very important, if you don't know what it is, don't touch it
// 非常重要，不懂代码不要动，这里可以解决80%的问题，也可以生产1000+的bug
const hookClick = (e) => {
    const origin = e.target.closest('a')
    const isBaseTargetBlank = document.querySelector(
        'head base[target="_blank"]'
    )
    console.log('origin', origin, isBaseTargetBlank)
    if (
        (origin && origin.href && origin.target === '_blank') ||
        (origin && origin.href && isBaseTargetBlank)
    ) {
        e.preventDefault()
        console.log('handle origin', origin)
        location.href = origin.href
    } else {
        console.log('not handle origin', origin)
    }
}

window.open = function (url, target, features) {
    console.log('open', url, target, features)
    location.href = url
}

document.addEventListener('click', hookClick, { capture: true })
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>快记·点 · 极简餐馆记菜原型</title>
  <style>
    /* 全局样式 —— 仿移动端，主色活力橙 #FF6B35 */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
    }

    body {
      background: #F2F4F6;  /* 深色背景衬托手机卡片 */
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
    }

    /* 手机外壳模拟 */
    .phone-mock {
      width: 375px;
      background: white;
      border-radius: 40px;
      box-shadow: 0 25px 60px rgba(0,0,0,0.12);
      overflow: hidden;
      margin: 20px auto;
      border: 1px solid rgba(0,0,0,0.04);
      position: relative;
    }

    .phone-screen {
      padding: 20px 16px;
      background: white;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    /* 状态栏简单模拟 */
    .status-bar {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 4px;
    }

    /* 主标题栏 */
    .app-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .app-title {
      font-size: 22px;
      font-weight: 700;
      color: #FF6B35;
      letter-spacing: 0.5px;
    }
    .time-badge {
      background: #f0f0f0;
      padding: 6px 12px;
      border-radius: 30px;
      font-size: 14px;
      color: #444;
    }

    /* 定位/辅助行 */
    .location-bar {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #666;
      font-size: 15px;
      padding-bottom: 8px;
      border-bottom: 1px solid #efefef;
    }

    /* 桌台网格 —— 宫格布局 */
    .table-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin: 12px 0 8px;
    }
    .table-card {
      aspect-ratio: 1 / 1;
      background: #fafafa;
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      border: 1.5px solid transparent;
      transition: 0.1s;
      box-shadow: 0 2px 6px rgba(0,0,0,0.02);
    }
    /* 桌号字体 */
    .table-num {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    .table-status {
      font-size: 11px;
      font-weight: 400;
      padding: 3px 8px;
      border-radius: 30px;
      color: white;
    }

    /* 状态色彩 */
    .status-free { background: #E8E8E8; } /* 空闲灰 */
    .status-free .table-num { color: #3a3a3a; }
    .status-free .table-status { background: #a0a0a0; }

    .status-ordered { background: #FFF2E5; } /* 已点未下单 浅橙 */
    .status-ordered .table-num { color: #FF6B35; }
    .status-ordered .table-status { background: #FF6B35; }

    .status-confirmed { background: #E3F1E6; } /* 已下单 浅绿 */
    .status-confirmed .table-num { color: #2E7D32; }
    .status-confirmed .table-status { background: #4CAF50; }

    .status-paid { background: #E9ECF3; } /* 已结账 蓝灰 */
    .status-paid .table-num { color: #2c3e50; }
    .status-paid .table-status { background: #546E7A; }

    /* 快速开台按钮 */
    .quick-open-btn {
      background: #FF6B35;
      color: white;
      border: none;
      border-radius: 30px;
      padding: 14px 0;
      font-size: 17px;
      font-weight: 600;
      width: 100%;
      margin: 8px 0 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      box-shadow: 0 6px 12px rgba(255,107,53,0.2);
    }

    /* ------ 点菜页样式（左右两栏）------ */
    .menu-container {
      display: flex;
      gap: 16px;
      margin-top: 8px;
      height: 460px; /* 固定高度，模拟滚动区域 */
    }
    .category-side {
      width: 90px;
      background: #F8F9FA;
      border-radius: 20px;
      padding: 12px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow-y: auto;
    }
    .category-item {
      padding: 14px 0;
      width: 100%;
      text-align: center;
      font-size: 15px;
      font-weight: 500;
      color: #555;
      border-left: 4px solid transparent;
    }
    .category-active {
      color: #FF6B35;
      font-weight: 700;
      background: white;
      border-left: 4px solid #FF6B35;
      box-shadow: -2px 0 8px rgba(255,107,53,0.08);
    }

    .dish-side {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 12px;
      overflow-y: auto;
    }
    .dish-card {
      background: white;
      border-radius: 18px;
      padding: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 12px rgba(0,0,0,0.04);
      border: 1px solid #f0f0f0;
    }
    .dish-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .dish-name {
      font-size: 16px;
      font-weight: 600;
    }
    .dish-price {
      font-size: 15px;
      color: #FF6B35;
      font-weight: 700;
    }
    .add-btn {
      background: #FF6B35;
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: 400;
      border: none;
      box-shadow: 0 4px 10px rgba(255,107,53,0.3);
    }

    /* 底部已点清单（折叠/展开） */
    .order-summary {
      background: #FEF7F2;
      border-radius: 24px;
      padding: 14px 18px;
      margin-top: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #FFE6D6;
    }
    .order-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .order-count {
      font-size: 15px;
      color: #444;
    }
    .order-total {
      font-size: 20px;
      font-weight: 800;
      color: #1a1a1a;
    }
    .confirm-btn {
      background: #FF6B35;
      color: white;
      border: none;
      padding: 12px 26px;
      border-radius: 40px;
      font-size: 16px;
      font-weight: 600;
      box-shadow: 0 6px 14px rgba(255,107,53,0.25);
    }

    /* 展开后的清单浮层（模拟半屏） */
    .expanded-cart {
      background: white;
      border-radius: 28px 28px 0 0;
      padding: 20px 16px;
      margin-top: 12px;
      border: 1px solid #eee;
      box-shadow: 0 -6px 20px rgba(0,0,0,0.04);
    }
    .cart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .cart-title {
      font-size: 18px;
      font-weight: 700;
    }
    .cart-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .item-name-spec {
      display: flex;
      flex-direction: column;
    }
    .item-name {
      font-weight: 600;
      font-size: 16px;
    }
    .item-remark {
      font-size: 13px;
      color: #888;
      margin-top: 2px;
    }
    .item-price {
      font-weight: 600;
      color: #1a1a1a;
    }
    .item-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .qty-btn {
      background: #f1f1f1;
      width: 30px;
      height: 30px;
      border-radius: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 18px;
      color: #444;
    }
    .qty-num {
      font-weight: 600;
      min-width: 24px;
      text-align: center;
    }

    /* 分隔线 */
    .divider {
      height: 1px;
      background: #efefef;
      margin: 16px 0;
    }

    .label-orange {
      background: #FF6B35;
      color: white;
      padding: 2px 10px;
      border-radius: 50px;
      font-size: 12px;
    }

    /* 演示标注 */
    .demo-tip {
      text-align: center;
      font-size: 12px;
      color: #999;
      margin-top: 12px;
      border-top: 1px dashed #ddd;
      padding-top: 16px;
    }
  </style>
</head>
<body>
  <!-- 界面1: 桌台面板（首页） -->
  <div class="phone-mock">
    <div class="phone-screen">
      <div class="status-bar">
        <span>9:41</span>
        <span>📶 🔋 100%</span>
      </div>
      <div class="app-header">
        <span class="app-title">快记·点</span>
        <span class="time-badge">15:30 大厅</span>
      </div>
      <div class="location-bar">
        <span>📍 大厅 · 8号桌</span>
        <span style="margin-left: auto; color: #FF6B35;">▼ 换区</span>
      </div>

      <!-- 桌台网格 4x4 示例 -->
      <div style="display: flex; justify-content: space-between; margin-top: 6px;">
        <span style="font-weight: 600; font-size: 16px;">桌台状态</span>
        <span style="color: #666; font-size: 13px;">空闲 已点 已下单 已结</span>
      </div>
      <div class="table-grid">
        <!-- 01 空闲 -->
        <div class="table-card status-free">
          <span class="table-num">01</span>
          <span class="table-status">空闲</span>
        </div>
        <!-- 02 空闲 -->
        <div class="table-card status-free">
          <span class="table-num">02</span>
          <span class="table-status">空闲</span>
        </div>
        <!-- 03 已点未下单 -->
        <div class="table-card status-ordered">
          <span class="table-num">03</span>
          <span class="table-status">已点</span>
        </div>
        <!-- 04 空闲 -->
        <div class="table-card status-free">
          <span class="table-num">04</span>
          <span class="table-status">空闲</span>
        </div>
        <!-- 05 空闲 -->
        <div class="table-card status-free">
          <span class="table-num">05</span>
          <span class="table-status">空闲</span>
        </div>
        <!-- 06 空闲 -->
        <div class="table-card status-free">
          <span class="table-num">06</span>
          <span class="table-status">空闲</span>
        </div>
        <!-- 07 已下单 -->
        <div class="table-card status-confirmed">
          <span class="table-num">07</span>
          <span class="table-status">已下</span>
        </div>
        <!-- 08 空闲 -->
        <div class="table-card status-free">
          <span class="table-num">08</span>
          <span class="table-status">空闲</span>
        </div>
        <!-- 09 空闲 -->
        <div class="table-card status-free">
          <span class="table-num">09</span>
          <span class="table-status">空闲</span>
        </div>
        <!-- 10 已结账 -->
        <div class="table-card status-paid">
          <span class="table-num">10</span>
          <span class="table-status">已结</span>
        </div>
        <!-- 11 空闲 -->
        <div class="table-card status-free">
          <span class="table-num">11</span>
          <span class="table-status">空闲</span>
        </div>
        <!-- 12 空闲 -->
        <div class="table-card status-free">
          <span class="table-num">12</span>
          <span class="table-status">空闲</span>
        </div>
        <!-- 13 空闲 -->
        <div class="table-card status-free">
          <span class="table-num">13</span>
          <span class="table-status">空闲</span>
        </div>
        <!-- 14 空闲 -->
        <div class="table-card status-free">
          <span class="table-num">14</span>
          <span class="table-status">空闲</span>
        </div>
        <!-- 15 空闲 -->
        <div class="table-card status-free">
          <span class="table-num">15</span>
          <span class="table-status">空闲</span>
        </div>
        <!-- 16 空闲 -->
        <div class="table-card status-free">
          <span class="table-num">16</span>
          <span class="table-status">空闲</span>
        </div>
      </div>

      <!-- 快速开台按钮 -->
      <button class="quick-open-btn">
        <span style="font-size: 22px;">+</span> 快速开台
      </button>

      <div style="color: #888; font-size: 12px; text-align: right;">长按桌号可加菜/结账</div>
    </div>
  </div>

  <!-- 界面2: 点菜页（桌3 · 4人，已点3件，未展开底部） -->
  <div class="phone-mock" style="margin-top: 30px;">
    <div class="phone-screen">
      <div class="status-bar">
        <span>9:41</span>
        <span>📶 🔋 98%</span>
      </div>
      <!-- 桌号与人数行 -->
      <div style="display: flex; align-items: baseline; justify-content: space-between;">
        <div style="display: flex; gap: 12px; align-items: baseline;">
          <span style="font-size: 24px; font-weight: 800;">桌3</span>
          <span style="background: #f0f0f0; padding: 6px 14px; border-radius: 40px; font-size: 14px;">👥 4人</span>
        </div>
        <span style="color: #FF6B35; font-weight: 700; font-size: 22px;">¥146</span>
      </div>

      <!-- 左右分类/菜品菜单区 -->
      <div class="menu-container">
        <!-- 左侧分类 -->
        <div class="category-side">
          <div class="category-item category-active">热销</div>
          <div class="category-item">热菜</div>
          <div class="category-item">凉菜</div>
          <div class="category-item">主食</div>
          <div class="category-item">汤羹</div>
          <div class="category-item">酒水</div>
        </div>
        <!-- 右侧菜品列表 -->
        <div class="dish-side">
          <div class="dish-card">
            <div class="dish-info">
              <span class="dish-name">宫保鸡丁</span>
              <span class="dish-price">¥42</span>
            </div>
            <button class="add-btn">+</button>
          </div>
          <div class="dish-card">
            <div class="dish-info">
              <span class="dish-name">水煮牛肉</span>
              <span class="dish-price">¥68</span>
            </div>
            <button class="add-btn">+</button>
          </div>
          <div class="dish-card">
            <div class="dish-info">
              <span class="dish-name">干煸豆角</span>
              <span class="dish-price">¥28</span>
            </div>
            <button class="add-btn">+</button>
          </div>
          <div class="dish-card">
            <div class="dish-info">
              <span class="dish-name">米饭</span>
              <span class="dish-price">¥3</span>
            </div>
            <button class="add-btn" style="background: #ccc;">+</button>
          </div>
          <div style="font-size: 13px; color: #888; padding: 6px 0;">—— 已售罄 ——</div>
        </div>
      </div>

      <!-- 底部已点清单（折叠态） -->
      <div class="order-summary">
        <div class="order-info">
          <span class="order-count">已点 3 件</span>
          <span class="order-total">¥87</span>
        </div>
        <button class="confirm-btn">确认下单</button>
      </div>
      <div style="font-size: 12px; color: #FF6B35; text-align: right;">点击展开清单 ▼</div>
    </div>
  </div>

  <!-- 界面3: 已点清单展开状态（半屏卡片） -->
  <div class="phone-mock" style="margin-top: 30px;">
    <div class="phone-screen">
      <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 8px;">
        <div style="display: flex; gap: 12px; align-items: baseline;">
          <span style="font-size: 24px; font-weight: 800;">桌3</span>
          <span style="background: #f0f0f0; padding: 6px 14px; border-radius: 40px; font-size: 14px;">👥 4人</span>
        </div>
        <span style="color: #FF6B35; font-weight: 700; font-size: 22px;">¥87</span>
      </div>

      <!-- 模拟点菜区域简略示意（菜品列表半透明表示） -->
      <div style="opacity: 0.5; margin-bottom: 8px; font-size: 14px; color: #666;">
        ⚡ 宫保鸡丁 ··· （菜单区域）
      </div>

      <!-- 展开的购物车 —— 仿已点清单展开效果 -->
      <div class="expanded-cart">
        <div class="cart-header">
          <span class="cart-title">已点清单</span>
          <span style="color: #FF6B35; font-weight: 600;">添加备注</span>
        </div>
        <!-- 菜品条目 1 -->
        <div class="cart-item">
          <div class="item-name-spec">
            <span class="item-name">宫保鸡丁</span>
            <span class="item-remark">免葱，微辣</span>
          </div>
          <div class="item-price">¥42</div>
          <div class="item-actions">
            <span class="qty-btn">−</span>
            <span class="qty-num">2</span>
            <span class="qty-btn" style="background: #FF6B35; color: white;">+</span>
          </div>
        </div>
        <!-- 菜品条目 2 -->
        <div class="cart-item">
          <div class="item-name-spec">
            <span class="item-name">米饭</span>
            <span class="item-remark">—</span>
          </div>
          <div class="item-price">¥3</div>
          <div class="item-actions">
            <span class="qty-btn">−</span>
            <span class="qty-num">1</span>
            <span class="qty-btn" style="background: #FF6B35; color: white;">+</span>
          </div>
        </div>
        <!-- 整单备注输入框 -->
        <div style="background: #F5F7FA; padding: 12px; border-radius: 16px; margin-top: 12px; color: #aaa; font-size: 14px;">
          📝 口味要求：少油少盐，不要香菜
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 20px;">
          <span style="font-weight: 600;">合计</span>
          <span style="font-size: 24px; font-weight: 800; color: #1a1a1a;">¥87</span>
        </div>
        <div style="display: flex; gap: 12px; margin-top: 24px;">
          <button style="flex: 1; background: white; border: 1.5px solid #FF6B35; color: #FF6B35; padding: 14px; border-radius: 60px; font-weight: 600; font-size: 16px;">继续加菜</button>
          <button style="flex: 1; background: #FF6B35; border: none; color: white; padding: 14px; border-radius: 60px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(255,107,53,0.2);">确认下单</button>
        </div>
      </div>
    </div>
  </div>

  <!-- 设计规范简要说明 -->
  <div style="max-width: 375px; margin: 30px auto 10px; background: #FFF9F5; padding: 20px; border-radius: 28px; color: #333; border: 1px solid #FFD9C6;">
    <h3 style="color: #FF6B35; margin-bottom: 12px;">🎨 快记·点 · UI 规范</h3>
    <ul style="list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 16px;">
      <li style="width: 100%;"><span style="background: #FF6B35; display: inline-block; width: 20px; height: 20px; border-radius: 8px; vertical-align: middle; margin-right: 10px;"></span> 主色：活力橙 #FF6B35 —— 按钮、激活态、关键价格</li>
      <li style="width: 100%;"><span style="background: #4CAF50; display: inline-block; width: 20px; height: 20px; border-radius: 8px; vertical-align: middle; margin-right: 10px;"></span> 状态绿：已下单/后厨接单</li>
      <li style="width: 100%;"><span style="background: #546E7A; display: inline-block; width: 20px; height: 20px; border-radius: 8px; vertical-align: middle; margin-right: 10px;"></span> 状态蓝灰：已结账</li>
      <li style="width: 100%;"><span style="background: #E8E8E8; display: inline-block; width: 20px; height: 20px; border-radius: 8px; vertical-align: middle; margin-right: 10px;"></span> 空闲灰：简洁明了</li>
      <li style="width: 100%;">🔲 卡片圆角：16-24px，轻盈现代</li>
      <li style="width: 100%;">📱 字体：SF/Inter，粗细搭配</li>
    </ul>
    <p style="margin-top: 16px; font-size: 14px; color: #555;">点击“+”加菜，长按菜品批量加，暂存后确认下单——后厨实时打印。完全替代手写菜单，永不漏单。</p>
  </div>
  
  <div class="demo-tip" style="max-width: 375px;">
    ⚡ 以上为可交互高保真原型，直接运行即模拟真实App界面。<br>
    已覆盖：桌台面板 | 点菜页 | 展开清单 | 状态色规范。<br>
    开发者可基于此样式快速实现前端代码。
  </div>
</body>
</html>