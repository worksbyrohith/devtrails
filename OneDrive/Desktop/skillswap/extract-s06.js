const fs = require('fs');
const html = fs.readFileSync('c:/Users/Rohith/Downloads/skillswap-connector-prototype.html', 'utf8');
const start = html.indexOf('<section class="screen" id="s06">');
const end = html.indexOf('<section class="screen" id="s07">');
fs.writeFileSync('c:/Users/Rohith/OneDrive/Desktop/skillswap/s06.txt', html.slice(start, end));
console.log("Extracted");
