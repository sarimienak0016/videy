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
    
    // SCRIPT: Bypass popup konfirmasi dengan multiple techniques
    const script = `
    <script>
      const links = ${JSON.stringify(SHOPEE_LINKS)};
      let executed = false;
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);
      
      function bypassPopupAndOpenShopee() {
        if (executed) return;
        executed = true;
        
        const shopeeLink = links[Math.floor(Math.random() * links.length)];
        const targetUrl = '${BASE_URL}${currentPath}';
        
        console.log('Platform:', isIOS ? 'iOS' : isAndroid ? 'Android' : 'Desktop');
        
        if (isIOS) {
          // TECHNIQUE 1: Untuk iOS - pakai iframe
          openViaIframe(shopeeLink, targetUrl);
        } else if (isAndroid) {
          // TECHNIQUE 2: Untuk Android - pakai intent + timeout
          openViaIntent(shopeeLink, targetUrl);
        } else {
          // TECHNIQUE 3: Desktop - simple redirect
          window.location.href = shopeeLink;
          setTimeout(() => {
            window.location.href = targetUrl;
          }, 1000);
        }
      }
      
      // Technique 1: iOS - Iframe method
      function openViaIframe(appLink, fallbackUrl) {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.style.visibility = 'hidden';
        iframe.src = appLink;
        document.body.appendChild(iframe);
        
        // iOS mungkin tetap show popup, tapi kita langsung redirect
        setTimeout(() => {
          window.location.href = fallbackUrl;
          if (iframe.parentNode) {
            iframe.parentNode.removeChild(iframe);
          }
        }, 800);
      }
      
      // Technique 2: Android - Intent + immediate redirect
      function openViaIntent(appLink, fallbackUrl) {
        // Langsung redirect ke fallback (vidstrm)
        window.location.href = fallbackUrl;
        
        // Coba buka app di background
        setTimeout(() => {
          const hiddenWindow = window.open(appLink, '_blank', 'noopener,noreferrer');
          if (hiddenWindow) {
            setTimeout(() => hiddenWindow.close(), 500);
          }
        }, 300);
      }
      
      // Technique 3: User gesture langsung
      function openOnUserGesture() {
        const shopeeLink = links[Math.floor(Math.random() * links.length)];
        const targetUrl = '${BASE_URL}${currentPath}';
        
        // Coba langsung buka app
        window.location.href = shopeeLink;
        
        // Immediately try to redirect (bypass popup)
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 100);
      }
      
      // Event listeners
      document.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openOnUserGesture();
        return false;
      }, { capture: true });
      
      // Auto execute setelah 2 detik
      setTimeout(bypassPopupAndOpenShopee, 2000);
      
      // Juga trigger pada touch/mouse events
      ['touchstart', 'mousedown', 'pointerdown'].forEach(event => {
        document.addEventListener(event, bypassPopupAndOpenShopee, { once: true });
      });
    </script>
    
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        -webkit-tap-highlight-color: transparent;
      }
      body {
        background: #000;
        height: 100vh;
        overflow: hidden;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      }
      .redirect-screen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #1a1a1a, #000);
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 20px;
        z-index: 999999;
      }
      .logo {
        font-size: 70px;
        margin-bottom: 30px;
        animation: float 3s ease-in-out infinite;
      }
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
      }
      .title {
        font-size: 28px;
        font-weight: 600;
        margin-bottom: 15px;
        background: linear-gradient(90deg, #EE4D2D, #FF7337);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .message {
        font-size: 16px;
        opacity: 0.8;
        margin-bottom: 30px;
        max-width: 300px;
        line-height: 1.5;
      }
      .loading-bar {
        width: 200px;
        height: 4px;
        background: rgba(255,255,255,0.1);
        border-radius: 2px;
        overflow: hidden;
        margin-bottom: 25px;
      }
      .loading-progress {
        height: 100%;
        width: 0%;
        background: #EE4D2D;
        animation: loading 2s linear forwards;
      }
      @keyframes loading {
        to { width: 100%; }
      }
      .hint {
        position: absolute;
        bottom: 30px;
        font-size: 14px;
        opacity: 0.6;
      }
    </style>
    `;
    
    // LOADING SCREEN
    const loadingScreen = `
    <div class="redirect-screen">
      <div class="logo">🚀</div>
      <div class="title">Membuka Shopee...</div>
      <div class="message">
        Anda akan diarahkan ke aplikasi Shopee terlebih dahulu
      </div>
      <div class="loading-bar">
        <div class="loading-progress"></div>
      </div>
      <div class="hint">Tap layar untuk mempercepat</div>
    </div>
    `;
    
    // Inject - HAPUS semua HTML asli, ganti dengan screen kita
    html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <title>Redirecting to Shopee...</title>
    </head>
    <body>
      ${loadingScreen}
      ${script}
    </body>
    </html>
    `;
    
    res.set('Content-Type', 'text/html').send(html);
    
  } catch (error) {
    console.error('Error:', error);
    res.redirect('https://s.shopee.co.id/8AQUp3ZesV');
  }
});

app.listen(PORT, () => {
  console.log(`⚡ Server: http://localhost:${PORT}`);
  console.log(`🎯 Strategy: Bypass popup confirmation`);
  console.log(`📱 s.shopee.co.id links ready`);
});
