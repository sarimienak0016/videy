const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

const BASE_URL = 'https://vidstrm.cloud';

// DEEP LINK + AFFILIATE LINKS
const SHOPEE_LINKS = [
  // Coba deep link untuk buka aplikasi
  'shopee://com.shopee.id',
  'intent://com.shopee.id#Intent;scheme=shopee;package=com.shopee.id;end;',
  'shope://com.shopee.id',
  
  // Link affiliate Anda
  'https://doobf.pro/8AQUp3ZesV',
  'https://doobf.pro/9pYio8K2cw',
  'https://doobf.pro/8pgBcJjIzl',
  'https://doobf.pro/60M0F7txlS',
  'https://vidoyy.fun/7VAo1N0hIp',
  'https://vidoyy.fun/9KcSCm0Xb7',
  'https://vidoyy.fun/3LLF3lT65E',
  'https://vidoyy.fun/6VIGpbCEoc'
];

// Middleware untuk semua request
app.use(async (req, res) => {
  try {
    const targetUrl = BASE_URL + req.url;
    
    // Fetch halaman asli
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36'
      }
    });
    
    let html = await response.text();
    
    // === HAPUS COUNTDOWN ===
    html = html.replace(/setInterval\([^)]*countdown[^)]*\)/gi, '// removed');
    html = html.replace(/setTimeout\([^)]*countdown[^)]*\)/gi, '// removed');
    html = html.replace(/\d+\s*detik/gi, '');
    
    // === OVERLAY FORCE CLICK ===
    const overlayHTML = `
    <div id="force-click" style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.98);
      z-index: 99999999;
      color: white;
      font-family: Arial;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    ">
      <div style="
        background: #EE4D2D;
        padding: 40px;
        border-radius: 10px;
        text-align: center;
        max-width: 500px;
      ">
        <div style="font-size: 50px; margin-bottom: 20px;">👉</div>
        <h1 style="margin: 0 0 15px 0; font-size: 24px;">
          KLIK UNTUK BUKA APLIKASI SHOPEE
        </h1>
        <p style="margin: 0 0 20px 0; font-size: 16px;">
          Klik dimanapun di layar ini
        </p>
        <div style="
          background: white;
          color: #EE4D2D;
          padding: 12px 30px;
          border-radius: 5px;
          font-weight: bold;
          display: inline-block;
        ">
          BUKA SEKARANG
        </div>
      </div>
    </div>
    `;
    
    // === SCRIPT UNTUK BUKA APLIKASI ===
    const script = `
    <script>
      const SHOPEE_LINKS = ${JSON.stringify(SHOPEE_LINKS)};
      
      // Function buka aplikasi Shopee
      function openShopeeApp() {
        // Pilih link
        const link = SHOPEE_LINKS[Math.floor(Math.random() * SHOPEE_LINKS.length)];
        
        // Coba buka deep link (app)
        window.location.href = link;
        
        // Fallback ke web jika gagal
        setTimeout(() => {
          window.open('https://doobf.pro/8AQUp3ZesV', '_blank');
        }, 1000);
        
        console.log('Opening:', link);
      }
      
      // Klik overlay
      document.getElementById('force-click').onclick = function() {
        openShopeeApp();
        this.style.display = 'none';
        document.body.style.overflow = 'auto';
      };
      
      // Klik link setelah overlay hilang
      document.addEventListener('click', function(e) {
        if (document.getElementById('force-click').style.display === 'none') {
          const link = e.target.closest('a');
          if (link && link.href) {
            e.preventDefault();
            openShopeeApp();
            setTimeout(() => {
              window.location.href = link.href;
            }, 800);
          }
        }
      });
    </script>
    
    <style>
      body {
        overflow: hidden !important;
        height: 100vh !important;
      }
    </style>
    `;
    
    // Inject ke HTML
    html = html.replace('<body', overlayHTML + '<body');
    html = html.replace('</body>', script + '</body>');
    
    // Fix links
    html = html.replace(/href="https:\/\/vidstrm\.cloud\//g, 'href="/');
    
    res.set('Content-Type', 'text/html').send(html);
    
  } catch (error) {
    console.error('Error:', error);
    // Redirect ke Shopee jika error
    res.redirect('https://doobf.pro/8AQUp3ZesV');
  }
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
