// Run:  node scripts/fetch_epic_fixtures.mjs
// With key:  $env:NASA_API_KEY='your_key'; node scripts/fetch_epic_fixtures.mjs
import fs from 'node:fs';
import path from 'node:path';

const KEY = process.env.NASA_API_KEY || 'DEMO_KEY';
const OUT = path.join('public', 'fixtures');
const IMG = path.join(OUT, 'img');
fs.mkdirSync(IMG, { recursive: true });

const day = (off) => new Date(Date.now() - off * 86400000).toISOString().slice(0, 10);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getMetadata() {
  // Insurance: if you saved metadata JSON from the browser, use it and skip the network
  const localRaw = path.join('scripts', 'epic_raw.json');
  if (fs.existsSync(localRaw)) {
    const j = JSON.parse(fs.readFileSync(localRaw, 'utf8'));
    if (Array.isArray(j) && j.length && j[0].image) {
      console.log('metadata from scripts/epic_raw.json');
      return j;
    }
  }
  // EPIC publishes with a 1-3 day lag: walk backwards until a date answers
  for (let off = 2; off <= 14; off++) {
    const d = day(off);
    const url = `https://api.nasa.gov/EPIC/api/natural/images/${d}?api_key=${KEY}`;
    let r;
    try { r = await fetch(url); } catch (e) { console.log('net error', d, e.message); continue; }
    if (r.status === 429) {
      throw new Error("429 rate limit. Run with your free key:\n  $env:NASA_API_KEY='YOUR_KEY'; node scripts/fetch_epic_fixtures.mjs");
    }
    if (r.status === 404) { console.log('no EPIC images for', d, '- trying older'); await sleep(250); continue; }
    if (!r.ok) { console.log('HTTP', r.status, 'for', d); await sleep(250); continue; }
    const j = await r.json();
    if (Array.isArray(j) && j.length && j[0].image) {
      console.log('metadata OK for', d, `(${j.length} images)`);
      return j;
    }
    await sleep(250);
  }
  throw new Error('No EPIC images found in the last 14 days. Use the browser method below.');
}

const list = await getMetadata();
const records = [];
for (let i = 0; i < 3; i++) {
  const m = list[i];
  const date = (m.date || '').slice(0, 10);
  const jpg = `https://epic.gsfc.nasa.gov/archive/natural/${date}/jpg/${m.image}.jpg`;
  const png = `https://epic.gsfc.nasa.gov/archive/natural/${date}/png/${m.image}.png`;
  let imgRes = await fetch(jpg); let ext = 'jpg';
  if (!imgRes.ok) { imgRes = await fetch(png); ext = 'png'; }
  if (!imgRes.ok) throw new Error('Image download failed: ' + png);
  const file = `epic_${i + 1}.${ext}`;
  fs.writeFileSync(path.join(IMG, file), Buffer.from(await imgRes.arrayBuffer()));
  records.push({
    id: m.image,
    date: m.date || date,
    caption: m.caption || '',
    centroid: m.centroid_coordinates || { lat: 0, lon: 0 },
    image: `fixtures/img/${file}`,
    source_url: ext === 'jpg' ? jpg : png,
    dataset_id: 'NASA EPIC (DSCOVR) via api.nasa.gov'
  });
  console.log('saved', file);
  await sleep(250);
}
fs.writeFileSync(path.join(OUT, 'epic.json'), JSON.stringify({ images: records }, null, 2));
console.log('Done. Commit public/fixtures/ to Git.');