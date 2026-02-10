const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

const BASE_URL = 'https://vidstrm.cloud';

// PAKAI SHORT LINK s.shopee.co.id YANG BISA BUKA APP
const SHOPEE_SHORT_LINKS = [
  // Format: s.shopee.co.id/[kode] - ini yang bisa buka app dari Threads
  'https://s.shopee.co.id/8AQUp3ZesV',
  'https://s.shopee.co.id/9pYio8K2cw', 
  'https://s.shopee.co.id/8pgBcJjIzl',
  'https://s.shopee.co.id/60M0F7txlS',
  'https://s.shopee.co.id/7VAo1N0hIp',
  'https://s.shopee.co.id/9KcSCm0Xb7',
  'https://s.shopee.co.id/3LLF3lT65E',
  'https://s.shopee.co.id/6VIGpbCEoc'
];

// Fallback ke link Anda jika short link tidak ada
const FALLBACK_LINKS = [
  'https://doobf.pro/8AQUp3ZesV',
  'https://doobf.pro/9pYio8K2cw',
  'https://doobf.pro/8pgBcJjIzl',
  'https://doobf.pro/60M0F7txlS',
  'https://vidoyy.fun/7VAo1N0hIp',
  'https://vidoyy.fun/9KcSCm0Xb7',
  'https://vidoyy.fun/3LLF3lT65E',
  'https://vidoyy.fun/6VIGpbCEoc'
];

app.use(async (req, res) => {
  try {
    const targetUrl = BASE_URL + req.url;
    const currentPath = req.url;
    
    const response = await fetch(targetUrl);
    let html = await response.text();
    
    // SCRIPT: Pakai s.shopee.co.id untuk buka app
    const script = `
    <script>
      const SHORT_LINKS = ${JSON.stringify(SHOPEE_SHORT_LINKS)};
      const FALLBACK_LINKS = ${JSON.stringify(FALLBACK_LINKS)};
      let clicked = false;
      
      function openShopeeFromThreads() {
        if (clicked) return;
        clicked = true;
        
        // Prioritaskan s.shopee.co.id (bisa buka app)
        const shopeeLink = SHORT_LINKS.length > 0 
          ? SHORT_LINKS[Math.floor(Math.random() * SHORT_LINKS.length)]
          : FALLBACK_LINKS[Math.floor(Math.random() * FALLBACK_LINKS.length)];
        
        console.log('Opening Shopee app via:', shopeeLink);
        
        // Langsung redirect ke s.shopee.co.id (akan buka app Shopee)
        window.location.href = shopeeLink;
        
        // Setelah 1.5 detik, redirect ke vidstrm
        setTimeout(() => {
          window.location.href = '${BASE_URL}${currentPath}';
        }, 1500);
      }
      
      // Klik dimana saja
      document.addEventListener('click', openShopeeFromThreads);
      
      // Auto setelah 3 detik
      setTimeout(openShopeeFromThreads, 3000);
    </script>
    
    <style>
      .threads-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        z-index: 2147483647;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: white;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        text-align: center;
        padding: 20px;
        cursor: pointer;
      }
      .shopee-icon {
        font-size: 60px;
        margin-bottom: 20px;
        animation: bounce 2s infinite;
      }
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      .main-text {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 10px;
      }
      .sub-text {
        font-size: 16px;
        opacity: 0.8;
        margin-bottom: 25px;
        max-width: 300px;
      }
      .timer-badge {
        background: #EE4D2D;
        color: white;
        padding: 8px 20px;
        border-radius: 20px;
        font-weight: bold;
        font-size: 14px;
      }
      .tap-hint {
        position: absolute;
        bottom: 30px;
        font-size: 14px;
        opacity: 0.7;
      }
    </style>
    `;
    
    // OVERLAY FULLSCREEN UNTUK THREADS
    const overlay = `
    <div class="threads-overlay" onclick="this.style.opacity='0.5'">
      <div class="shopee-icon">🛍️</div>
      <div class="main-text">Buka di Aplikasi Shopee</div>
      <div class="sub-text">Tap layar untuk melanjutkan ke Shopee terlebih dahulu</div>
      <div class="timer-badge">
        Otomatis dalam <span id="threads-timer">3</span> detik
      </div>
      <div class="tap-hint">Tap dimana saja di layar</div>
    </div>
    
    <script>
      // Timer countdown
      let threadsTimer = 3;
      const timerEl = document.getElementById('threads-timer');
      const timerInterval = setInterval(() => {
        threadsTimer--;
        timerEl.textContent = threadsTimer;
        if (threadsTimer <= 0) {
          clearInterval(timerInterval);
          document.querySelector('.threads-overlay').style.display = 'none';
        }
      }, 1000);
    </script>
    `;
    
    // Inject
    html = html.replace('<body', overlay + '<body');
    html = html.replace('</body>', script + '</body>');
    
    // Fix internal links
    html = html.replace(/href="https:\/\/vidstrm\.cloud\//g, 'href="/');
    
    res.set('Content-Type', 'text/html').send(html);
    
  } catch (error) {
    console.error('Error:', error);
    // Redirect ke s.shopee.co.id jika error
    res.redirect('https://s.shopee.co.id/8AQUp3ZesV');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server ready: http://localhost:${PORT}`);
  console.log(`📱 Using s.shopee.co.id short links (opens app from Threads)`);
  console.log(`🔗 Example: https://s.shopee.co.id/8AQUp3ZesV`);
});
