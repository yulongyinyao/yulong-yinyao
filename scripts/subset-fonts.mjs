import fs from 'node:fs';
import path from 'node:path';
import AdmZip from 'adm-zip';
import subsetFont from 'subset-font';

const root = process.cwd();
const sourceDir = process.env.FONT_SOURCE_DIR || path.join(root, 'tools/fonts');
const outputDir = path.join(root, 'src/assets/fonts');

const families = [
  {
    name: 'AaGuDian',
    zip: 'AaGuDianKeBenSongYouMoBan.zip',
    output: 'AaGuDianKeBenSongYouMoBan.woff2',
  },
  {
    name: 'ShanHaiJi',
    zip: 'ShanHaiJiGuSongKe-JianFan.zip',
    output: 'ShanHaiJiGuSongKe-JianFan.woff2',
  },
];

const textExtensions = new Set(['.astro', '.md', '.ts', '.js', '.json', '.css', '.html', '.txt']);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (textExtensions.has(path.extname(entry.name).toLowerCase())) files.push(full);
  }
  return files;
}

const textFiles = [
  ...walk(path.join(root, 'src')),
  ...walk(path.join(root, 'config')),
  path.join(root, 'public/admin/index.html'),
].filter((file) => fs.existsSync(file));

const chars = new Set();
for (let code = 0x20; code <= 0x7e; code += 1) chars.add(String.fromCodePoint(code));
for (const char of '，。！？：；、“”‘’（）《》【】〔〕—…·～￥％＃＠＆＊＋－／＼｜＜＞＝') chars.add(char);

for (const file of textFiles) {
  const text = fs.readFileSync(file, 'utf8');
  for (const char of text) {
    const code = char.codePointAt(0);
    if (code > 0x1f && code !== 0x7f) chars.add(char);
  }
}

const charset = [...chars].sort((a, b) => a.codePointAt(0) - b.codePointAt(0)).join('');
if (charset.length < 1000) throw new Error('字符集过小，请检查内容目录。');
console.log(`字符集：${charset.length} 个字符，来自 ${textFiles.length} 个文本文件`);

fs.mkdirSync(outputDir, { recursive: true });

for (const family of families) {
  const zipPath = path.join(sourceDir, family.zip);
  if (!fs.existsSync(zipPath)) {
    throw new Error(`缺少字体源：${zipPath}。请设置 FONT_SOURCE_DIR 或把 zip 放到 tools/fonts/。`);
  }
  const zip = new AdmZip(zipPath);
  const entry = zip.getEntries().find((item) => /\.(ttf|otf)$/i.test(item.entryName));
  if (!entry) throw new Error(`${family.zip} 中没有 TTF/OTF 文件。`);
  const source = entry.getData();
  const output = await subsetFont(source, charset, { targetFormat: 'woff2' });
  const outputPath = path.join(outputDir, family.output);
  fs.writeFileSync(outputPath, output);
  console.log(`${family.name}: ${(output.length / 1024).toFixed(1)} KB -> ${path.relative(root, outputPath)}`);
}
