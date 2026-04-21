const fs = require('fs');

const profilePathHtml = 'c:/Users/Rohith/OneDrive/Desktop/skillswap/src/app/components/profile/profile/profile.component.html';
if (fs.existsSync(profilePathHtml)) {
  let html = fs.readFileSync(profilePathHtml, 'utf8');
  
  // Add animation classes
  if (!html.includes('class="avatar-card slide-up-1"')) {
    html = html.replace('class="card avatar-card"', 'class="card avatar-card slide-up-1"');
    html = html.replace('class="card form-card"', 'class="card form-card slide-up-2"');
  }
  
  html = html.replace(/&#128247;/g, '·');
  html = html.replace(/&#128205;/g, '·');

  if (!html.includes('page-fade-in')) {
     html = html.replace('class="profile-page page"', 'class="profile-page page page-fade-in"');
  }

  fs.writeFileSync(profilePathHtml, html);
}

const profilePathScss = 'c:/Users/Rohith/OneDrive/Desktop/skillswap/src/app/components/profile/profile/profile.component.scss';
if (fs.existsSync(profilePathScss)) {
  let scss = fs.readFileSync(profilePathScss, 'utf8');
  
  scss = scss.replace('background: linear-gradient(135deg, var(--paper-2) 0%, var(--paper-3) 100%);', 'background: var(--paper-2);');
  
  if (!scss.includes('.page-fade-in')) {
     scss += `\n.page-fade-in { animation: fadeIn 0.4s ease-out; }`;
  }
  fs.writeFileSync(profilePathScss, scss);
}

console.log("Profile component cleaned and animations added.");
