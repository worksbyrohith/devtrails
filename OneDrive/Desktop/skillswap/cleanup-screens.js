const fs = require('fs');

const files = [
  'c:/Users/Rohith/OneDrive/Desktop/skillswap/src/app/components/landing/landing.component.html',
  'c:/Users/Rohith/OneDrive/Desktop/skillswap/src/app/components/swap/swap-dashboard/swap-dashboard.component.html',
  'c:/Users/Rohith/OneDrive/Desktop/skillswap/src/app/components/swap/inbound-review/inbound-review.component.html',
  'c:/Users/Rohith/OneDrive/Desktop/skillswap/src/app/components/reviews/review-form/review-form.component.html'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Remove screen-tag
  const screenTagRegex = /<div class="screen-tag">[\s\S]*?<\/div>/g;
  content = content.replace(screenTagRegex, '');
  
  // Remove nav
  const navRegex = /<div class="nav">[\s\S]*?<\/div>\s*<\/div>/g; // Tries to grab .nav structure but be careful
  // Let's do it more safely:
  // It starts with <div class="nav"> and ends with the closing div of nav-cta's parent
  // We can just find the start, and find the corresponding close tag.
  
  const startIdx = content.indexOf('<div class="nav">');
  if (startIdx !== -1) {
      let openCount = 0;
      let endIdx = -1;
      for (let i = startIdx; i < content.length; i++) {
          if (content.substr(i, 4) === '<div') openCount++;
          if (content.substr(i, 5) === '</div') {
              openCount--;
              if (openCount === 0) {
                  endIdx = i + 6;
                  break;
              }
          }
      }
      if (endIdx !== -1) {
          content = content.substring(0, startIdx) + content.substring(endIdx);
      }
  }

  // Remove <section class="screen" id="...">
  content = content.replace(/<section class="screen"[^>]*>/, '<div class="page-fade-in">');
  content = content.replace(/<\/section>(?!.*<\/section>)/, '</div>'); // Replace last </section>
  
  fs.writeFileSync(file, content);
}
console.log("Cleanup done.");
