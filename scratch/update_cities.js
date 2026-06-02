const fs = require('fs');

const raw = fs.readFileSync('scratch/cities_raw.txt', 'utf8');
const cities = raw.split('\n')
  .map(s => s.trim())
  .filter(s => s.length > 0);

console.log(`Parsed ${cities.length} cities.`);

const dbPaths = [
  'web-app/travel_db.json',
  'web-simulator/travel_db.json'
];

for (const p of dbPaths) {
  const dbStr = fs.readFileSync(p, 'utf8');
  const db = JSON.parse(dbStr);
  db.sources = cities;
  fs.writeFileSync(p, JSON.stringify(db, null, 2));
  console.log(`Updated ${p}`);
}
