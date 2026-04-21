const fs = require('fs');

const stylesPath = 'c:/Users/Rohith/OneDrive/Desktop/skillswap/src/styles.scss';
let styles = fs.readFileSync(stylesPath, 'utf8');

if (!styles.includes('page-fade-in')) {
  styles += `
/* ===== PREMIUM ANIMATIONS ===== */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.slide-up-1 {
  opacity: 0;
  animation: slideUpFade 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: 0.1s;
}
.slide-up-2 {
  opacity: 0;
  animation: slideUpFade 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: 0.2s;
}
.slide-up-3 {
  opacity: 0;
  animation: slideUpFade 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: 0.3s;
}
.slide-up-4 {
  opacity: 0;
  animation: slideUpFade 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: 0.4s;
}

/* Card hover scaling */
.card {
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.btn {
  transition: all 0.2s ease, transform 0.1s ease;
}
.btn:active {
  transform: scale(0.97);
}
`;
  fs.writeFileSync(stylesPath, styles);
  console.log("Animations added globally.");
}

const landingPath = 'c:/Users/Rohith/OneDrive/Desktop/skillswap/src/app/components/landing/landing.component.html';
let landing = fs.readFileSync(landingPath, 'utf8');

// adding slide up to hero elements
landing = landing.replace('<!-- Left: headline -->\n      <div>', '<!-- Left: headline -->\n      <div class="slide-up-1">');
landing = landing.replace('<!-- Right: Live match card -->\n      <div style="position: relative;">', '<!-- Right: Live match card -->\n      <div class="slide-up-2" style="position: relative;">');
landing = landing.replace('<!-- Value pillars -->\n  <div style="padding: 80px 80px 100px; background: var(--paper-3); border-top: 1px solid var(--line);">', '<!-- Value pillars -->\n  <div class="slide-up-3" style="padding: 80px 80px 100px; background: var(--paper-3); border-top: 1px solid var(--line);">');

fs.writeFileSync(landingPath, landing);
console.log("Landing animations updated.");
