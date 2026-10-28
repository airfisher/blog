#!/usr/bin/env node
/**
 * Preflight gate before shipping homepage/visual changes.
 * Exit non-zero on failure. Run after `npm run build`.
 * Uses sharp (already present via Astro) — no Python required.
 */
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('..', import.meta.url));
let failed = false;
const fail = (msg) => { console.error(`FAIL: ${msg}`); failed = true; };
const ok = (msg) => console.log(`OK: ${msg}`);

for (const rel of [
  'public/images/paper-noise.png',
  'public/images/hero-collage.png',
  'dist/images/paper-noise.png',
  'dist/images/hero-collage.png',
]) {
  const p = join(root, rel);
  if (!existsSync(p)) { fail(`${rel} missing`); continue; }
  const n = statSync(p).size;
  if (n < 1024) fail(`${rel} too small (${n} bytes)`);
  else ok(`${rel} present (${n} bytes)`);
}

async function analyze(rel) {
  const p = join(root, rel);
  if (!existsSync(p)) return;
  const { data, info } = await sharp(p).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const n = width * height;
  let sum = 0;
  let dark = 0;
  const lum = new Float64Array(n);
  for (let i = 0, px = 0; i < data.length; i += channels, px++) {
    const y = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    lum[px] = y;
    sum += y;
    if (y < 80) dark++;
  }
  const mean = sum / n;
  let varSum = 0;
  for (let i = 0; i < n; i++) varSum += (lum[i] - mean) ** 2;
  const std = Math.sqrt(varSum / n);
  const darkRatio = dark / n;

  let rowDiff = 0;
  let colDiff = 0;
  for (let x = 0; x < width; x++) rowDiff += Math.abs(lum[x] - lum[(height - 1) * width + x]);
  for (let y = 0; y < height; y++) colDiff += Math.abs(lum[y * width] - lum[y * width + (width - 1)]);
  rowDiff /= width;
  colDiff /= height;

  if (std > 12) fail(`${rel} std too high (${std.toFixed(2)}); looks like content not grain`);
  else if (darkRatio > 0.002) fail(`${rel} has dark ink pixels (${(darkRatio * 100).toFixed(3)}%); likely cropped UI text`);
  else if (mean < 200) fail(`${rel} mean too dark (${mean.toFixed(1)})`);
  else if (rowDiff > 8 || colDiff > 8) fail(`${rel} not seamless (edgeΔ row=${rowDiff.toFixed(2)} col=${colDiff.toFixed(2)})`);
  else ok(`${rel} grain std=${std.toFixed(2)} dark=${(darkRatio * 100).toFixed(3)}% mean=${mean.toFixed(1)} seamΔ=${rowDiff.toFixed(2)}/${colDiff.toFixed(2)}`);
}

await analyze('public/images/paper-noise.png');
await analyze('dist/images/paper-noise.png');

const indexHtml = join(root, 'dist/index.html');
if (!existsSync(indexHtml)) fail('dist/index.html missing — run npm run build first');
else {
  const html = readFileSync(indexHtml, 'utf8');
  for (const needle of ['AIRFISHER', 'hero-collage']) {
    if (!html.includes(needle)) fail(`dist/index.html missing marker: ${needle}`);
    else ok(`marker present: ${needle}`);
  }
  for (const bad of ['了解更多', '近期在做什么']) {
    if (html.includes(bad)) fail(`dist/index.html still contains removed copy: ${bad}`);
  }
}

const cssDir = join(root, 'dist/_astro');
let cssHit = false;
let cssRuleOk = false;
if (existsSync(cssDir)) {
  for (const f of readdirSync(cssDir).filter((x) => x.endsWith('.css'))) {
    const css = readFileSync(join(cssDir, f), 'utf8');
    if (!css.includes('paper-noise')) continue;
    cssHit = true;
    // Astro/Vite may minify; accept either longhand or shortened forms
    const hasUrl = /paper-noise\.png/.test(css);
    const hasSize = /256px/.test(css);
    const hasRepeat = /repeat/.test(css);
    if (hasUrl && (hasSize || hasRepeat)) cssRuleOk = true;
  }
}
if (!cssHit) fail('built CSS does not reference paper-noise');
else if (!cssRuleOk) fail('built CSS mentions paper-noise but missing size/repeat tiling cues');
else ok('built CSS references paper-noise with tiling cues');

if (failed) {
  console.error('\nPreflight FAILED — do not push.');
  process.exit(1);
}
console.log('\nPreflight PASSED.');
