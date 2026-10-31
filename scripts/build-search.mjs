import { execSync } from 'node:child_process';
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dist = 'dist';
const htmlFiles = readdirSync(dist, { recursive: true })
  .map(String)
  .filter((file) => file.endsWith('.html'));

const hasIndexableContent = htmlFiles.some((file) =>
  readFileSync(join(dist, file), 'utf8').includes('data-pagefind-body'),
);

if (!hasIndexableContent) {
  // Pagefind exits with an error when there is no page to index. An empty
  // blog is a valid state, so leave a tiny stub for the search dialog.
  mkdirSync(join(dist, 'pagefind'), { recursive: true });
  writeFileSync(
    join(dist, 'pagefind', 'pagefind.js'),
    [
      'export async function options() { return {}; }',
      'export async function init() { return {}; }',
      'export async function search() { return { results: [] }; }',
      '',
    ].join('\n'),
  );
  console.log('No published entries yet; wrote an empty Pagefind stub.');
  process.exit(0);
}

execSync('pagefind --site dist', { stdio: 'inherit' });
