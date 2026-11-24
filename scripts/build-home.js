// Rebuilds the "Latest" cards on index.html from data/content.json.
// Shows the three newest items by date. Run: node scripts/build-home.js
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const items = JSON.parse(fs.readFileSync(path.join(root, 'data', 'content.json'), 'utf8'));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const newest = items.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
const cards = newest.map((it, i) => `      <a class="latest-card" href="${esc(it.url)}">
        <div class="latest-meta">${i === 0 ? 'Newest &middot; ' : ''}${esc(it.type)}</div>
        <h3>${esc(it.title)}</h3>
        <p>${esc(it.blurb)}</p>
        <span class="latest-cta">${esc(it.cta || 'Read')} &rarr;</span>
      </a>`).join('\n');
const file = path.join(root, 'index.html');
let html = fs.readFileSync(file, 'utf8');
const re = /<!-- LATEST:START -->[\s\S]*?<!-- LATEST:END -->/;
if (!re.test(html)) { console.error('LATEST markers not found in index.html'); process.exit(1); }
html = html.replace(re, `<!-- LATEST:START -->\n${cards}\n      <!-- LATEST:END -->`);
fs.writeFileSync(file, html);
console.log('Latest cards:', newest.map((n) => n.title).join(' | '));
