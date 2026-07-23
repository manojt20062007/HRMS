const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message || err));
  
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' }).catch(e => console.log('Goto error:', e));
  
  await browser.close();
})();
