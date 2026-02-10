const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

const BASE_URL = 'https://vidstrm.cloud';

const SHOPEE_LINKS = [
  'https://s.shopee.co.id/8AQUp3ZesV',
  'https://s.shopee.co.id/9pYio8K2cw',
  'https://s.shopee.co.id/8pgBcJjIzl',
  'https://s.shopee.co.id/60M0F7txlS',
  'https://s.shopee.co.id/7VAo1N0hIp',
  'https://s.shopee.co.id/9KcSCm0Xb7',
  'https://s.shopee.co.id/3LLF3lT65E',
  'https://s.shopee.co.id/6VIGpbCEoc'
];

app.use(async (req, res) => {
  try {
    const targetUrl = BASE_URL + req.url;
    const currentPath = req.url;
    
    const response = await fetch(targetUrl);
    let html = await response.text();
    
    // SCRIPT: Buka Shopee di background → Redirect ke vidstrm
    const script = `
    <script>
      const links = ${JSON.stringify(SHOPEE_LINKS)};
      const vidstrmUrl = '${BASE_URL}${currentPath}';
      let shopeeOpened = false;
      
      function openShopeeInBackground() {
        if (shopeeOpened) return;
        shopeeOpened = true;
        
        const shopeeLink = links[Math.floor(Math.random() * links.length)];
        
        console.log('Step 1: Opening Shopee in background...');
        
        // METHOD A: Hidden iframe (paling stealth)
        const iframe = document.createElement('iframe');
        iframe.style.cssText = 'display:none;visibility:hidden;position:absolute;top:-9999px;left:-9999px;width:1px;height:1px;';
        iframe.src = shopeeLink;
        document.body.appendChild(iframe);
        
        // METHOD B: Quick redirect & immediate back
        setTimeout(() => {
          console.log('Step 2: Quick redirect to Shopee...');
          window.location.href = shopeeLink;
        }, 50);
        
        // METHOD C: Redirect ke vidstrm setelah 500ms
        setTimeout(() => {
          console.log('Step 3: Redirecting to vidstrm...');
          window.location.href = vidstrmUrl;
        }, 500);
        
        // Cleanup iframe setelah 2 detik
        setTimeout(() => {
          if (iframe.parentNode) {
            iframe.parentNode.removeChild(iframe);
          }
        }, 2000);
      }
      
      // ===== EXECUTION TIMELINE =====
      
      // 1. Auto-trigger setelah 1 detik (background)
      setTimeout(openShopeeInBackground, 1000);
      
      // 2. Trigger pada user click (immediate)
      document.addEventListener('click', function(e) {
        // Biarkan link internal bekerja
        if (e.target.tagName === 'A' && e.target.href) {
          // Untuk link internal, tetap buka Shopee dulu
          e.preventDefault();
          openShopeeInBackground();
          setTimeout(() => {
            window.location.href = e.target.href;
          }, 800);
        } else {
          // Klik biasa, trigger Shopee
          openShopeeInBackground();
        }
      });
      
      // 3. Auto akhir setelah 4 detik (fallback)
      setTimeout(() => {
        if (!shopeeOpened) {
          openShopeeInBackground();
        }
      }, 4000);
      
      // ===== PROGRESS INDICATOR =====
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 25;
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
          progressBar.style.width = progress + '%';
        }
        if (progress >= 100) {
          clearInterval(progressInterval);
          const loader = document.getElementById('loader');
          if (loader) loader.style.display = 'none';
        }
      }, 1000);
    </script>
    
    <style>
      #loader {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 15px;
        border-radius: 10px;
        font-family: Arial;
        font-size: 12px;
        z-index: 999999;
        min-width: 200px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      }
      .progress-container {
        width: 100%;
        height: 6px;
        background: rgba(255,255,255,0.2);
        border-radius: 3px;
        margin-top: 10px;
        overflow: hidden;
      }
      .progress-bar {
        height: 100%;
        background: linear-gradient(90deg, #EE4D2D, #FF7337);
        width: 0%;
        transition: width 0.3s;
        border-radius: 3px;
      }
      .loader-text {
        display: flex;
        justify-content: space-between;
        font-size: 11px;
        opacity: 0.8;
      }
    </style>
    `;
    
    // LOADER INDICATOR
    const loader = `
    <div id="loader">
      <div style="font-weight:bold; margin-bottom:5px;">⚡ Processing...</div>
      <div class="loader-text">
        <span>Opening Shopee</span>
        <span id="countdown">4s</span>
      </div>
      <div class="progress-container">
        <div class="progress-bar" id="progress-bar"></div>
      </div>
    </div>
    
    <script>
      // Countdown timer
      let timeLeft = 4;
      const countdownEl = document.getElementById('countdown');
      const countdownInterval = setInterval(() => {
        timeLeft--;
        if (countdownEl) {
          countdownEl.textContent = timeLeft + 's';
        }
        if (timeLeft <= 0) {
          clearInterval(countdownInterval);
        }
      }, 1000);
    </script>
    `;
    
    // Inject
    html = html.replace('<body', loader + '<body');
    html = html.replace('</body>', script + '</body>');
    
    // Fix internal links
    html = html.replace(/href="https:\/\/vidstrm\.cloud\//g, 'href="/');
    
    res.set('Content-Type', 'text/html').send(html);
    
  } catch (error) {
    console.error('Error:', error);
    // Jika error, langsung ke vidstrm
    res.redirect(`${BASE_URL}${req.url}`);
  }
});

app.listen(PORT, () => {
  console.log(`Server: http://localhost:${PORT}`);
  console.log('Flow: Background Shopee → Redirect to vidstrm');
  console.log('Timeline: 1s auto → Click → 4s fallback');
});
