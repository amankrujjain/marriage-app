import fs from 'fs';

const catalogPath =
  'd:/Aman/projects/upload/marriage/client/features/templates/gallery/galleryCatalog.ts';
const outPath =
  'd:/Aman/projects/upload/marriage/server/src/data/designTemplateDefaults.json';

const src = fs.readFileSync(catalogPath, 'utf8');
const re =
  /slug: '([^']+)',\s*name: '([^']+)',\s*tier: '([^']+)',\s*cat: '([^']+)',\s*faith: (\[[^\]]+\]),\s*blurb: '((?:\\'|[^'])*)'/g;

const items = [];
let m;
while ((m = re.exec(src))) {
  items.push({
    slug: m[1],
    name: m[2].replace(/\\'/g, "'"),
    tier: m[3],
    cat: m[4],
    faith: JSON.parse(m[5].replace(/'/g, '"')),
    blurb: m[6].replace(/\\'/g, "'"),
    active: true,
  });
}

fs.mkdirSync('d:/Aman/projects/upload/marriage/server/src/data', { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(items, null, 2));
console.log('wrote', items.length, 'defaults');
