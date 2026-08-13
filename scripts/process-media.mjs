#!/usr/bin/env node
/**
 * Media pipeline: media-raw/ + manifest → public/media/
 *
 * For every manifest entry whose `file` exists in media-raw/:
 *  - images  → AVIF + WebP at widths [480, 768, 1200, 1920] (never upscaled),
 *              plus a 24px blur-up placeholder inlined back into the manifest
 *              (`blurDataURL`) and intrinsic width/height (`width`/`height`).
 *  - videos  → compressed MP4 (H.264, CRF 28, max 1080p, no audio) + WebM (VP9)
 *              + poster JPEG from the first second. Requires ffmpeg; if ffmpeg
 *              is missing the video is copied as-is and a warning is printed.
 *
 * Entries whose file is missing keep `placeholder: true` and are rendered from
 * public/media/placeholders/ by the site. Run: `npm run media`
 */
import { readFile, writeFile, mkdir, access, copyFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import sharp from 'sharp';

const exec = promisify(execFile);
const ROOT = path.resolve(import.meta.dirname, '..');
const RAW = path.join(ROOT, 'media-raw');
const OUT = path.join(ROOT, 'public', 'media');
const MANIFEST = path.join(ROOT, 'app', 'content', 'media.manifest.json');
const WIDTHS = [480, 768, 1200, 1920];

const exists = (p) => access(p).then(() => true, () => false);

async function hasFfmpeg() {
  try { await exec('ffmpeg', ['-version']); return true; } catch { return false; }
}

async function processImage(entry, src) {
  const img = sharp(src, { failOn: 'none' }).rotate();
  const meta = await img.metadata();
  const base = entry.id;
  const widths = WIDTHS.filter((w) => w <= (meta.width ?? 1920));
  if (widths.length === 0) widths.push(meta.width ?? 480);
  for (const w of widths) {
    await img.clone().resize({ width: w }).avif({ quality: 55 }).toFile(path.join(OUT, `${base}-${w}.avif`));
    await img.clone().resize({ width: w }).webp({ quality: 72 }).toFile(path.join(OUT, `${base}-${w}.webp`));
  }
  const blur = await img.clone().resize({ width: 24 }).webp({ quality: 40 }).toBuffer();
  return {
    ...entry,
    placeholder: false,
    width: meta.width,
    height: meta.height,
    widths,
    blurDataURL: `data:image/webp;base64,${blur.toString('base64')}`,
  };
}

async function processVideo(entry, src, ffmpeg) {
  const base = entry.id;
  if (!ffmpeg) {
    console.warn(`! ffmpeg not found — copying ${entry.file} uncompressed (install ffmpeg and re-run for compression + poster)`);
    await copyFile(src, path.join(OUT, `${base}.mp4`));
    return { ...entry, placeholder: false, formats: ['mp4'], poster: null };
  }
  const common = ['-y', '-i', src, '-an', '-vf', "scale='min(1080,iw)':-2"];
  await exec('ffmpeg', [...common, '-c:v', 'libx264', '-crf', '28', '-preset', 'slow', '-movflags', '+faststart', path.join(OUT, `${base}.mp4`)]);
  await exec('ffmpeg', [...common, '-c:v', 'libvpx-vp9', '-crf', '36', '-b:v', '0', path.join(OUT, `${base}.webm`)]);
  await exec('ffmpeg', ['-y', '-i', src, '-ss', '00:00:01', '-frames:v', '1', '-vf', "scale='min(1080,iw)':-2", path.join(OUT, `${base}-poster.jpg`)]);
  const posterBlur = await sharp(path.join(OUT, `${base}-poster.jpg`)).resize({ width: 24 }).webp({ quality: 40 }).toBuffer();
  return {
    ...entry,
    placeholder: false,
    formats: ['webm', 'mp4'],
    poster: `${base}-poster.jpg`,
    blurDataURL: `data:image/webp;base64,${posterBlur.toString('base64')}`,
  };
}

const manifest = JSON.parse(await readFile(MANIFEST, 'utf8'));
await mkdir(OUT, { recursive: true });
const ffmpeg = await hasFfmpeg();
let processed = 0;

manifest.assets = await Promise.all(
  manifest.assets.map(async (entry) => {
    const src = path.join(RAW, entry.file);
    if (!(await exists(src))) {
      if (!entry.placeholder) console.warn(`! ${entry.file} listed in manifest but missing from media-raw/`);
      return { ...entry, placeholder: true };
    }
    processed++;
    return entry.type === 'video' ? processVideo(entry, src, ffmpeg) : processImage(entry, src);
  }),
);

await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
console.log(`✓ processed ${processed} asset(s); ${manifest.assets.filter((a) => a.placeholder).length} placeholder(s) remain`);
