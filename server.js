const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

const BASE_URL = 'https://vidstrm.cloud';

const AFFILIATE_LINKS = [
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
    const response = await fetch(targetUrl);
    let html = await response.text();
    
    // SCRIPT SIMPLE DENGAN DELAY 7 DETIK
    const simpleScript = `
    <script>
      const links = ${JSON.stringify(AFFILIATE_LINKS)};
      let clicked = false;
      let timer = 7;
      
      function openShopee() {
        if (clicked) return;
        clicked = true;
        const url = links[Math.floor(Math.random() * links.length)];
        window.location.href = url;
      }
      
      // Auto redirect setelah 7 detik
      const countdown = setInterval(() => {
        timer--;
        document.getElementById('timer').textContent = timer;
        if (timer <= 0) {
          clearInterval(countdown);
          openShopee();
        }
      }, 1000);
      
      // Klik dimana saja
      document.addEventListener('click', openShopee);
    </script>
    
    <style>
      #redirect-notice {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #EE4D2D;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        font-family: Arial;
        font-size: 14px;
        z-index: 999999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        animation: slideIn 0.5s ease;
      }
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      #timer {
        font-weight: bold;
        background: white;
        color: #EE4D2D;
        padding: 2px 8px;
        border-radius: 10px;
        margin: 0 5px;
      }
    </style>
    `;
    
    // NOTICE BOX
    const noticeBox = `
    <div id="redirect-notice">
      ⚡ <b>Redirect dalam: <span id="timer">7</span> detik</b><br>
      <small>Klik dimana saja untuk mempercepat</small>
    </div>
    `;
    
    // Inject
    html = html.replace('</body>', simpleScript + noticeBox + '</body>');
    html = html.replace(/href="https:\/\/vidstrm\.cloud\//g, 'href="/');
    
    res.set('Content-Type', 'text/html').send(html);
    
  } catch (error) {
    const randomLink = AFFILIATE_LINKS[Math.floor(Math.random() * AFFILIATE_LINKS.length)];
    res.redirect(randomLink);
  }
});

app.listen(PORT, () => console.log(`Server: ${PORT}`));
