const express = require('express');
const app = express();
const PORT = 3000;

// Affiliate links
const affiliateLinks = [
  'https://doobf.pro/8AQUp3ZesV',
  'https://doobf.pro/9pYio8K2cw',
  'https://doobf.pro/8pgBcJjIzl',
  'https://doobf.pro/60M0F7txlS',
  'https://vidoyy.fun/7VAo1N0hIp',
  'https://vidoyy.fun/9KcSCm0Xb7',
  'https://vidoyy.fun/3LLF3lT65E',
  'https://vidoyy.fun/6VIGpbCEoc'
];

// Tangkap SEMUA request
app.get('*', (req, res) => {
  // Ambil path dari URL
  const path = req.path;
  
  // Generate user ID sederhana
  const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
  
  // Pilih random affiliate
  const randomLink = affiliateLinks[Math.floor(Math.random() * affiliateLinks.length)];
  
  // Tentukan target URL
  let targetUrl = 'https://vidstrm.cloud';
  
  // Jika ada path seperti /d/123, jadikan https://vidstrm.cloud/d/123
  if (path && path !== '/') {
    targetUrl = 'https://vidstrm.cloud' + path;
  }
  
  console.log(`📤 Request: ${path}`);
  console.log(`🎯 Target: ${targetUrl}`);
  console.log(`🔗 Affiliate: ${randomLink}`);
  
  // HTML SANGAT SIMPLE
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Redirect...</title>
    <style>
      body {
        background: #667eea;
        color: white;
        text-align: center;
        padding: 50px;
        font-family: Arial;
      }
    </style>
  </head>
  <body>
    <h1>Redirecting...</h1>
    <p>ID: ${userId}</p>
    <p>Target: ${targetUrl}</p>
    <script>
      // Simple redirect
      setTimeout(() => {
        const affiliate = '${randomLink}?ref=' + '${userId}';
        window.open(affiliate, '_blank');
        setTimeout(() => {
          window.location.href = '${targetUrl}';
        }, 100);
      }, 2000);
      
      // Click anywhere
      document.body.onclick = function() {
        const affiliate = '${randomLink}?ref=' + '${userId}';
        window.open(affiliate, '_blank');
        setTimeout(() => {
          window.location.href = '${targetUrl}';
        }, 100);
      };
    </script>
  </body>
  </html>
  `;
  
  res.send(html);
});

app.listen(PORT, () => {
  console.log(`✅ Server running: http://localhost:${PORT}`);
  console.log(`\n🔗 Test these:`);
  console.log(`   http://localhost:${PORT}/d/123`);
  console.log(`   http://localhost:${PORT}/d/abc`);
  console.log(`   http://localhost:${PORT}/`);
});
