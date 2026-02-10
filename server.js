const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

const BASE_URL = 'https://vidstrm.cloud';

// COBA SEMUA FORMAT DEEP LINK YANG MUNGKIN
const SHOPEE_DEEP_LINKS = [
  // Format 1: shope.ee (sering work buka app)
  'https://shope.ee/8AQUp3ZesV',
  'https://shope.ee/9pYio8K2cw',
  'https://shope.ee/8pgBcJjIzl',
  
  // Format 2: shopee.co.id dengan parameter affiliate
  'https://shopee.co.id/share/8AQUp3ZesV',
  'https://shopee.co.id/affiliate/8AQUp3ZesV',
  
  // Format 3: Deep link langsung (jika tahu itemid)
  'shopee://com.shopee.id/product?itemid=1234567890',
  'intent://shopee.co.id/product?itemid=1234567890#Intent;scheme=https;package=com.shopee.id;end',
  
  // Format 4: Link affiliate Anda (fallback)
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
    
    // SCRIPT: Coba semua format deep link
    const script = `
    <script>
      const DEEP_LINKS = ${JSON.stringify(SHOPEE_DEEP_LINKS)};
      let clicked = false;
      
      function triggerShopeeApp() {
        if (clicked) return;
        clicked = true;
        
        // Pilih link (prioritaskan shope.ee dulu)
        const shopeLinks = DEEP_LINKS.filter(l => l.includes('shope.ee'));
        const shopeeLinks = DEEP_LINKS.filter(l => l.includes('shopee.co.id'));
        const otherLinks = DEEP_LINKS.filter(l => !l.includes('shope.ee') && !l.includes('shopee.co.id'));
        
        const selectedLink = 
          (shopeLinks.length > 0 ? shopeLinks[0] : null) ||
          (shopeeLinks.length > 0 ? shopeeLinks[0] : null) ||
          otherLinks[0];
        
        console.log('Opening:', selectedLink);
        
        // Coba buka app dengan deep link
        window.location.href = selectedLink;
        
        // Fallback ke web setelah 2 detik
        setTimeout(() => {
          window.location.href = '${BASE_URL}${currentPath}';
        }, 2000);
      }
      
      // Klik dimana saja
      document.addEventListener('click', triggerShopeeApp);
      
      // Auto setelah 3 detik
      setTimeout(triggerShopeeApp, 3000);
    </script>
    
    <style>
      .tap-hint {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(238, 77, 45, 0.95);
        color: white;
        padding: 25px 35px;
        border-radius: 20px;
        font-family: Arial, sans-serif;
        text-align: center;
        z-index: 999999;
        box-shadow: 0 10px 30px rgba(0,0,0,0.4);
        animation: pulse 1.5s infinite;
        cursor: pointer;
        max-width: 300px;
      }
      @keyframes pulse {
        0% { transform: translate(-50%, -50%) scale(1); }
        50% { transform: translate(-50%, -50%) scale(1.05); }
        100% { transform: translate(-50%, -50%) scale(1); }
      }
      .tap-text {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      .tap-sub {
        font-size: 14px;
        opacity: 0.9;
      }
    </style>
    `;
    
    // TAP OVERLAY BESAR
    const overlay = `
    <div class="tap-hint" onclick="this.style.display='none'">
      <div class="tap-text">👇 TAP DISINI 👇</div>
      <div class="tap-sub">Buka aplikasi Shopee</div>
      <div style="margin-top: 15px; font-size: 12px; opacity: 0.7;">
        (akan otomatis dalam 3 detik)
      </div>
    </div>
    `;
    
    // Inject
    html = html.replace('<body', overlay + '<body');
    html = html.replace('</body>', script + '</body>');
    
    // Fix links
    html = html.replace(/href="https:\/\/vidstrm\.cloud\//g, 'href="/');
    
    res.set('Content-Type', 'text/html').send(html);
    
  } catch (error) {
    console.error('Error:', error);
    res.redirect('https://shope.ee/8AQUp3ZesV');
  }
});

app.listen(PORT, () => {
  console.log(`Server: http://localhost:${PORT}`);
  console.log('Mencoba deep link Shopee: shope.ee / shopee://');
});
