import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        results = results.concat(walk(fullPath));
      }
    } else {
      if (/\.(tsx|ts|jsx|js|mjs|json|css|md|html)$/.test(file)) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

const files = walk('src');
let changedFiles = 0;

for (const file of files) {
  // Skip modifying firebase project config ids
  const original = fs.readFileSync(file, 'utf8');
  let content = original;

  // Replacements:
  // 1. Group variants
  content = content.replace(/NUTTY TALES GROUP/g, 'NUTY TALES');
  content = content.replace(/Nutty Tales Group/g, 'Nuty Tales');

  // 2. URL-encoded
  content = content.replace(/Hello%20Nutty%20Tales/g, 'Hello%20Nuty%20Tales');

  // 3. All uppercase
  content = content.replace(/NUTTY TALES/g, 'NUTY TALES');

  // 4. Standard title case
  // Protect firebase projectId nutty-tales-1c667
  // So replace "Nutty Tales" -> "Nuty Tales"
  content = content.replace(/Nutty Tales/g, 'Nuty Tales');

  // 5. In case of lowercase
  content = content.replace(/nutty tales/g, 'nuty tales');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
    console.log(`Updated brand in: ${file}`);
  }
}

console.log(`Brand standardization complete. Modified ${changedFiles} files.`);
