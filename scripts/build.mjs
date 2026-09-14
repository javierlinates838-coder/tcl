import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const root = path.join(project, 'dist');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const hosting = JSON.parse(fs.readFileSync(path.join(project, '.openai/hosting.json'), 'utf8'));
if (hosting.static.directory !== 'dist') throw Error('Preserve the existing static output directory.');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
if (new Set(ids).size !== ids.length) throw Error('Duplicate HTML ids.');
for (const [, anchor] of html.matchAll(/href="#([^"]+)"/g)) if (!ids.includes(anchor)) throw Error('Missing anchor: ' + anchor);
const localReferences = [...html.matchAll(/(?:src|href)="(\/[^"#]*)"/g)].map(match => match[1]);
for (const match of css.matchAll(/url\(['"]?(\/[^'"\)]+)['"]?\)/g)) localReferences.push(match[1]);
for (const ref of localReferences) if (!fs.statSync(path.join(root, ref.split(/[?#]/)[0]), { throwIfNoEntry: false })?.isFile()) throw Error('Missing asset: ' + ref);
if (/(?:unsplash|pexels|hero\.jpg|detail\.jpg)/i.test(html + css)) throw Error('Disallowed stock media reference.');
const files = fs.readdirSync(root, { recursive: true }).filter(name => fs.statSync(path.join(root, name)).isFile()).sort();
const digest = createHash('sha256');
let bytes = 0;
for (const name of files) {
  const filename = path.join(root, name);
  const content = fs.readFileSync(filename);
  bytes += content.length;
  digest.update(name).update(content);
  if (name.endsWith('.js')) {
    const result = spawnSync(process.execPath, ['--check', filename], { encoding: 'utf8' });
    if (result.status !== 0) throw Error(result.stderr);
    for (const [, imported] of content.toString().matchAll(/from ['"](\.\/[^'"]+)['"]/g)) {
      if (!fs.existsSync(path.resolve(path.dirname(filename), imported))) throw Error('Missing import: ' + imported);
    }
  }
}
const revision = digest.digest('hex').slice(0, 12);
const output = path.join(project, '.sites-build', revision);
fs.mkdirSync(output, { recursive: true });
fs.cpSync(root, output, { recursive: true });
console.log(JSON.stringify({ status: 'passed', type: 'static build', files: files.length, bytes, output, media: JSON.parse(fs.readFileSync(path.join(project, 'content/approved-media.json'), 'utf8')) }, null, 2));
