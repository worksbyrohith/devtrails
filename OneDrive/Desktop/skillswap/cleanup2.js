const fs = require('fs');

const files = [
  'c:/Users/Rohith/OneDrive/Desktop/skillswap/src/app/components/landing/landing.component.html',
  'c:/Users/Rohith/OneDrive/Desktop/skillswap/src/app/components/swap/swap-dashboard/swap-dashboard.component.html',
  'c:/Users/Rohith/OneDrive/Desktop/skillswap/src/app/components/swap/inbound-review/inbound-review.component.html',
  'c:/Users/Rohith/OneDrive/Desktop/skillswap/src/app/components/reviews/review-form/review-form.component.html'
];
for (const f of files) {
  let c = fs.readFileSync(f, 'utf8');
  let idx = c.lastIndexOf('</section>');
  if (idx !== -1) {
    c = c.substring(0, idx) + '</div>' + c.substring(idx + 10);
  }
  fs.writeFileSync(f, c);
}
console.log("Cleanup 2 done.");
