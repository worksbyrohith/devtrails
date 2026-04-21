const fs = require('fs');

const extractSection = (html, startId) => {
  const startIndex = html.indexOf(`<section class="screen" id="${startId}">`);
  if (startIndex === -1) return '';
  const endIndex = html.indexOf(`</section>`, startIndex) + 10;
  return html.substring(startIndex, endIndex);
};

const proto = fs.readFileSync('c:/Users/Rohith/Downloads/skillswap-connector-prototype.html', 'utf8');

const s01 = extractSection(proto, 's01');
const s08 = extractSection(proto, 's08');
const s09 = extractSection(proto, 's09');
const s10 = extractSection(proto, 's10');

// Fix angular routes in s01
const s01Fixed = s01.replace(/href="#s02"/g, 'routerLink="/register"').replace(/href="#s03"/g, 'routerLink="/login"').replace(/href="#s05"/g, 'routerLink="/skills"').replace(/href="#s07"/g, 'routerLink="/skills"');

// Fix angular routes in s08
const s08Fixed = s08
  .replace(/href="#s05"/g, 'routerLink="/skills"')
  .replace(/href="#s04"/g, 'routerLink="/profile"')
  .replace(/href="#s09"/g, 'routerLink="/swap/inbound/1"')
  .replace(/href="#s10"/g, 'routerLink="/swap/1/review"');

// Fix angular routes in s09
const s09Fixed = s09
  .replace(/href="#s08"/g, 'routerLink="/swap/dashboard"')
  .replace(/href="#s05"/g, 'routerLink="/skills"')
  .replace(/href="#s04"/g, 'routerLink="/profile"')
  .replace(/href="#s06"/g, 'routerLink="/profile/1"');

// Fix angular routes in s10
const s10Fixed = s10
  .replace(/href="#s08"/g, 'routerLink="/swap/dashboard"')
  .replace(/href="#s05"/g, 'routerLink="/skills"')
  .replace(/href="#s04"/g, 'routerLink="/profile"');

fs.writeFileSync('c:/Users/Rohith/OneDrive/Desktop/skillswap/src/app/components/landing/landing.component.html', s01Fixed);
fs.writeFileSync('c:/Users/Rohith/OneDrive/Desktop/skillswap/src/app/components/swap/swap-dashboard/swap-dashboard.component.html', s08Fixed);
fs.writeFileSync('c:/Users/Rohith/OneDrive/Desktop/skillswap/src/app/components/swap/inbound-review/inbound-review.component.html', s09Fixed);
fs.writeFileSync('c:/Users/Rohith/OneDrive/Desktop/skillswap/src/app/components/reviews/review-form/review-form.component.html', s10Fixed);
