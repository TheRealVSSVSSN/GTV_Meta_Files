const fs = require('fs');
const path = require('path');

// Define root directory
const root = process.cwd();

// category patterns
const categoryPatterns = [
  { pattern: /weapon/i, label: 'weapon' },
  { pattern: /vehicle|car/i, label: 'vehicle' },
  { pattern: /prop/i, label: 'props' },
  { pattern: /content|unlock/i, label: 'content' },
  { pattern: /ped/i, label: 'ped' },
  { pattern: /shop/i, label: 'shop' },
  { pattern: /mission|heist/i, label: 'mission' },
  { pattern: /trigger/i, label: 'trigger' },
  { pattern: /audio|sound/i, label: 'audio' },
];

// Function to categorize file based on patterns
function categorize(fileName) {
  for (const { pattern, label } of categoryPatterns) {
    if (pattern.test(fileName)) return label;
  }
  return 'misc';
}

const entries = fs.readdirSync(root);

const records = entries.filter(name => /\.(meta|xml)$/i.test(name)).map(name => {
  const absPath = path.resolve(root, name);
  const category = categorize(name);
  return { path: absPath, category };
});

// Prepare CSV
let csv = 'path,category\n';
for (const { path: p, category } of records) {
  csv += `${p},${category}\n`;
}

fs.writeFileSync('meta_files.csv', csv);
console.log(`Wrote ${records.length} records to meta_files.csv`);
