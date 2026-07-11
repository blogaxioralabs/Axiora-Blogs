// scripts/generate-og-image.mjs
// One-shot script to generate the static OG image for Axiora Blogs
// Uses sharp (already in dependencies) to render a 1200×630 PNG
// Run: node scripts/generate-og-image.mjs

import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const WIDTH = 1200;
const HEIGHT = 630;

// SVG overlay with the Axiora branding
const svgOverlay = `
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1e293b;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#38bdf8;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#818cf8;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)" />

  <!-- Decorative grid lines -->
  <g stroke="#334155" stroke-width="0.5" opacity="0.3">
    <line x1="0" y1="210" x2="${WIDTH}" y2="210" />
    <line x1="0" y1="420" x2="${WIDTH}" y2="420" />
    <line x1="400" y1="0" x2="400" y2="${HEIGHT}" />
    <line x1="800" y1="0" x2="800" y2="${HEIGHT}" />
  </g>

  <!-- Accent bar -->
  <rect x="80" y="180" width="200" height="6" rx="3" fill="url(#accent)" />

  <!-- Main title -->
  <text x="80" y="260" font-family="Arial, Helvetica, sans-serif" font-size="64" font-weight="800" fill="#ffffff">
    Axiora Blogs
  </text>

  <!-- Subtitle -->
  <text x="80" y="340" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="600" fill="#94a3b8">
    The Edge of Tomorrow
  </text>

  <!-- Tagline -->
  <text x="80" y="400" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400" fill="#64748b">
    Future of STEM, AI &amp; Technology
  </text>

  <!-- Bottom bar -->
  <rect x="0" y="${HEIGHT - 3}" width="${WIDTH}" height="3" fill="url(#accent)" />

  <!-- URL -->
  <text x="80" y="${HEIGHT - 40}" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="500" fill="#475569">
    axiorablogs.com
  </text>

  <!-- Logo mark -->
  <circle cx="${WIDTH - 100}" cy="150" r="40" fill="none" stroke="#38bdf8" stroke-width="3" opacity="0.6" />
  <text x="${WIDTH - 100}" y="160" font-family="Arial, Helvetica, sans-serif" font-size="36" font-weight="800" fill="#38bdf8" text-anchor="middle" opacity="0.8">
    A
  </text>
</svg>
`;

async function generate() {
  const outputPath = join(__dirname, '..', 'public', 'axiora-og-image.png');

  await sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 4,
      background: { r: 15, g: 23, b: 42, alpha: 1 },
    },
  })
    .composite([{ input: Buffer.from(svgOverlay), top: 0, left: 0 }])
    .png({ quality: 90, compressionLevel: 9 })
    .toFile(outputPath);

  console.log(`✅ OG image generated: ${outputPath}`);
}

generate().catch((err) => {
  console.error('❌ Failed to generate OG image:', err);
  process.exit(1);
});
