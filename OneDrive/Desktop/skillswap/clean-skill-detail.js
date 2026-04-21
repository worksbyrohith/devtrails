const fs = require('fs');

const detailPath = 'c:/Users/Rohith/OneDrive/Desktop/skillswap/src/app/components/skills/skill-detail/skill-detail.component.html';
if (fs.existsSync(detailPath)) {
  let html = fs.readFileSync(detailPath, 'utf8');
  
  // Replace ugly emojis with clean characters or nothing
  html = html.replace(/&#128205;/g, '·'); // map pin -> dot
  html = html.replace(/&#128221;/g, '·'); // memo
  html = html.replace(/&#128187;/g, '·'); // laptop
  html = html.replace(/&#127919;/g, '·'); // target
  html = html.replace(/&#10003;/g, '?');
  html = html.replace(/&#9889;/g, '?'); // lightning -> star
  
  // Add animation classes
  if (!html.includes('class="detail-wrap slide-up-1"')) {
    html = html.replace('<div class="detail-wrap">', '<div class="detail-wrap slide-up-1">');
    html = html.replace('<!-- About -->\n        <div class="card block">', '<!-- About -->\n        <div class="card block slide-up-2">');
    html = html.replace('<!-- Skills -->\n        <div class="card block">', '<!-- Skills -->\n        <div class="card block slide-up-3">');
    html = html.replace('<!-- Reviews -->\n        <div class="card block">', '<!-- Reviews -->\n        <div class="card block slide-up-4">');
  }

  fs.writeFileSync(detailPath, html);
}

const detailPathScss = 'c:/Users/Rohith/OneDrive/Desktop/skillswap/src/app/components/skills/skill-detail/skill-detail.component.scss';
if (fs.existsSync(detailPathScss)) {
  let scss = fs.readFileSync(detailPathScss, 'utf8');
  
  // Soften the gradient to match the elegant palette
  scss = scss.replace('background: linear-gradient(135deg, var(--accent) 0%, var(--gold) 50%, var(--plum) 100%);', 'background: linear-gradient(135deg, var(--accent-soft) 0%, var(--gold-soft) 50%, var(--paper-3) 100%);');
  
  // Add border radius to banner strip for neatness? The prototype stretches full width, but maybe it looks better with subtle inset or just softer colors.
  
  fs.writeFileSync(detailPathScss, scss);
}

console.log("Skill Detail cleaned up.");
