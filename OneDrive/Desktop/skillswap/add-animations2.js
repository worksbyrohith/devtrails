const fs = require('fs');

const dDashPath = 'c:/Users/Rohith/OneDrive/Desktop/skillswap/src/app/components/swap/swap-dashboard/swap-dashboard.component.html';
if (fs.existsSync(dDashPath)) {
  let dash = fs.readFileSync(dDashPath, 'utf8');
// slide up KPIs
  dash = dash.replace('<!-- KPI row -->\n    <div style="display: grid;', '<!-- KPI row -->\n    <div class="slide-up-1" style="display: grid;');
  dash = dash.replace('<!-- Tabs -->\n    <div style="border-bottom', '<!-- Tabs -->\n    <div class="slide-up-2" style="border-bottom');
  dash = dash.replace('<!-- Table -->\n    <div style="background:', '<!-- Table -->\n    <div class="slide-up-3" style="background:');
  fs.writeFileSync(dDashPath, dash);
}

const ibReviewPath = 'c:/Users/Rohith/OneDrive/Desktop/skillswap/src/app/components/swap/inbound-review/inbound-review.component.html';
if (fs.existsSync(ibReviewPath)) {
  let r = fs.readFileSync(ibReviewPath, 'utf8');
  r = r.replace('<!-- Banner -->\n    <div style="background: var(--accent-soft);', '<!-- Banner -->\n    <div class="slide-up-1" style="background: var(--accent-soft);');
  r = r.replace('<div style="display: grid; grid-template-columns: 2fr 1fr; gap: 32px;">', '<div class="slide-up-2" style="display: grid; grid-template-columns: 2fr 1fr; gap: 32px;">');
  fs.writeFileSync(ibReviewPath, r);
}

const rfPath = 'c:/Users/Rohith/OneDrive/Desktop/skillswap/src/app/components/reviews/review-form/review-form.component.html';
if (fs.existsSync(rfPath)) {
  let f = fs.readFileSync(rfPath, 'utf8');
  f = f.replace('<!-- Completion celebration -->\n      <div style="text-align: center;', '<!-- Completion celebration -->\n      <div class="slide-up-1" style="text-align: center;');
  f = f.replace('<!-- Summary strip -->\n      <div style="background: var(--card);', '<!-- Summary strip -->\n      <div class="slide-up-2" style="background: var(--card);');
  f = f.replace('<!-- Review card -->\n      <div style="background: var(--card);', '<!-- Review card -->\n      <div class="slide-up-3" style="background: var(--card);');
  fs.writeFileSync(rfPath, f);
}
console.log('Animations configured properly.')
