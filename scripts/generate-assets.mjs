import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const publicDir = path.join(rootDir, "public");
const brandingDir = path.join(publicDir, "images", "branding");
const eventsDir = path.join(publicDir, "images", "events");

// Ensure directories exist
fs.mkdirSync(brandingDir, { recursive: true });
fs.mkdirSync(eventsDir, { recursive: true });

const rawPngPath = path.join(brandingDir, "acm-logo.png");
const rawSvgPath = path.join(brandingDir, "acm-logo.svg");

if (!fs.existsSync(rawPngPath)) {
  console.error("Missing raw PNG:", rawPngPath);
  process.exit(1);
}

// 1. Prepare SVG with viewBox for scalable vector use
let svgContent = fs.readFileSync(rawSvgPath, "utf8");
if (!svgContent.includes("viewBox")) {
  svgContent = svgContent.replace("<svg", '<svg viewBox="0 0 300 299.97186"');
}
// Clean up XML header if needed for standalone SVG
fs.writeFileSync(rawSvgPath, svgContent);
fs.writeFileSync(path.join(publicDir, "icon.svg"), svgContent);
fs.writeFileSync(path.join(rootDir, "src", "app", "icon.svg"), svgContent);
console.log("✓ Saved optimized vector SVG to public/icon.svg and src/app/icon.svg");

// Helper to create an ICO file from PNG buffers (16x16, 32x32, 48x48)
function createIco(pngBuffers) {
  const numImages = pngBuffers.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  let offset = headerSize + numImages * dirEntrySize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // ICO type
  header.writeUInt16LE(numImages, 4);

  const dirEntries = [];
  const imageDataBuffers = [];

  for (const { buffer, size } of pngBuffers) {
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // color palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(buffer.length, 8); // size of image data
    entry.writeUInt32LE(offset, 12); // offset

    dirEntries.push(entry);
    imageDataBuffers.push(buffer);
    offset += buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...imageDataBuffers]);
}

async function generateAll() {
  console.log("Generating standard favicons and PWA icons with sharp...");

  const baseLogo = sharp(rawPngPath);

  // Favicons
  const png16 = await sharp(rawPngPath).resize(16, 16).png().toBuffer();
  const png32 = await sharp(rawPngPath).resize(32, 32).png().toBuffer();
  const png48 = await sharp(rawPngPath).resize(48, 48).png().toBuffer();

  fs.writeFileSync(path.join(publicDir, "favicon-16x16.png"), png16);
  fs.writeFileSync(path.join(publicDir, "favicon-32x32.png"), png32);
  fs.writeFileSync(path.join(publicDir, "favicon-48x48.png"), png48);

  const icoBuffer = createIco([
    { buffer: png16, size: 16 },
    { buffer: png32, size: 32 },
    { buffer: png48, size: 48 },
  ]);
  fs.writeFileSync(path.join(publicDir, "favicon.ico"), icoBuffer);
  console.log("✓ Generated multi-size public/favicon.ico (16, 32, 48)");

  // Apple Touch Icon (180x180)
  const apple180 = await sharp(rawPngPath)
    .resize(180, 180, { fit: "contain", background: { r: 18, g: 18, b: 20, alpha: 1 } })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, "apple-icon.png"), apple180);
  fs.writeFileSync(path.join(publicDir, "apple-touch-icon.png"), apple180);
  console.log("✓ Generated public/apple-icon.png and public/apple-touch-icon.png");

  // Standard PWA Icons (192x192, 512x512)
  await sharp(rawPngPath).resize(192, 192).png().toFile(path.join(publicDir, "icon-192.png"));
  await sharp(rawPngPath).resize(512, 512).png().toFile(path.join(publicDir, "icon-512.png"));
  await sharp(rawPngPath).resize(512, 512).png().toFile(path.join(publicDir, "icon.png"));
  console.log("✓ Generated public/icon-192.png, icon-512.png, icon.png");

  // Maskable PWA Icons (Safe zone padding ~20% on deep dark slate background)
  const maskable192Logo = await sharp(rawPngPath).resize(144, 144).toBuffer();
  await sharp({
    create: {
      width: 192,
      height: 192,
      channels: 4,
      background: { r: 18, g: 18, b: 20, alpha: 1 },
    },
  })
    .composite([{ input: maskable192Logo, gravity: "center" }])
    .png()
    .toFile(path.join(publicDir, "icon-maskable-192.png"));

  const maskable512Logo = await sharp(rawPngPath).resize(384, 384).toBuffer();
  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 18, g: 18, b: 20, alpha: 1 },
    },
  })
    .composite([{ input: maskable512Logo, gravity: "center" }])
    .png()
    .toFile(path.join(publicDir, "icon-maskable-512.png"));
  console.log("✓ Generated maskable PWA icons (192 & 512)");

  // Standalone high-res logo copy
  fs.copyFileSync(rawPngPath, path.join(publicDir, "logo.png"));
  console.log("✓ Copied public/logo.png");

  // ----------------------------------------------------
  // OPEN GRAPH IMAGE GENERATION (1200 x 630)
  // ----------------------------------------------------
  console.log("Generating high-resolution OpenGraph cards (1200x630)...");

  // Logo sized for OG card
  const ogLogo = await sharp(rawPngPath).resize(260, 260).png().toBuffer();

  const ogCardSvg = `
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0a0c10"/>
        <stop offset="50%" stop-color="#0e131b"/>
        <stop offset="100%" stop-color="#080a0d"/>
      </linearGradient>
      <radialGradient id="glow" cx="25%" cy="40%" r="50%">
        <stop offset="0%" stop-color="#0080a5" stop-opacity="0.32"/>
        <stop offset="60%" stop-color="#00354a" stop-opacity="0.08"/>
        <stop offset="100%" stop-color="#0a0c10" stop-opacity="0"/>
      </radialGradient>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-width="0.75" stroke-opacity="0.04"/>
      </pattern>
    </defs>

    <!-- Canvas Background -->
    <rect width="1200" height="630" fill="url(#bg)"/>
    <rect width="1200" height="630" fill="url(#glow)"/>
    <rect width="1200" height="630" fill="url(#grid)"/>

    <!-- Subtle Border Frame -->
    <rect x="24" y="24" width="1152" height="582" rx="16" fill="none" stroke="#253346" stroke-width="1.5" stroke-opacity="0.6"/>

    <!-- Left Logo Ambient Backplate -->
    <rect x="80" y="165" width="300" height="300" rx="28" fill="#131c26" fill-opacity="0.7" stroke="#2c3e55" stroke-width="1.5"/>

    <!-- Right Content Layout -->
    <g transform="translate(430, 140)">
      <!-- Category Badge -->
      <rect x="0" y="0" width="360" height="32" rx="6" fill="#0080a5" fill-opacity="0.18" stroke="#00a3e0" stroke-width="1" stroke-opacity="0.4"/>
      <text x="16" y="21" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace" font-size="12" font-weight="700" letter-spacing="2" fill="#38bdf8">
        ACM STUDENT CHAPTER • BIT MESRA
      </text>

      <!-- Main Title -->
      <text x="0" y="95" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="56" font-weight="800" fill="#ffffff" letter-spacing="-1">
        ACM BIT Mesra
      </text>

      <!-- Subtitle -->
      <text x="0" y="138" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="600" fill="#94a3b8">
        Birla Institute of Technology, Mesra, Ranchi
      </text>

      <!-- Summary Copy -->
      <text x="0" y="184" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" fill="#cbd5e1" opacity="0.9">
        Eastern India's premier student computing chapter. Advancing algorithmic
      </text>
      <text x="0" y="210" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" fill="#cbd5e1" opacity="0.9">
        excellence, open source engineering, AI research, and technical leadership.
      </text>

      <!-- Pill Badges -->
      <g transform="translate(0, 245)">
        <rect x="0" y="0" width="105" height="28" rx="14" fill="#1e293b" stroke="#334155" stroke-width="1"/>
        <text x="14" y="18" font-family="monospace" font-size="11" font-weight="600" fill="#e2e8f0">Hack-A-Bit</text>

        <rect x="115" y="0" width="100" height="28" rx="14" fill="#1e293b" stroke="#334155" stroke-width="1"/>
        <text x="129" y="18" font-family="monospace" font-size="11" font-weight="600" fill="#e2e8f0">CodeZilla</text>

        <rect x="225" y="0" width="115" height="28" rx="14" fill="#1e293b" stroke="#334155" stroke-width="1"/>
        <text x="239" y="18" font-family="monospace" font-size="11" font-weight="600" fill="#e2e8f0">ICPC &amp; CP</text>

        <rect x="350" y="0" width="145" height="28" rx="14" fill="#1e293b" stroke="#334155" stroke-width="1"/>
        <text x="364" y="18" font-family="monospace" font-size="11" font-weight="600" fill="#e2e8f0">Open Source &amp; AI</text>
      </g>
    </g>

    <!-- Bottom Bar -->
    <line x1="80" y1="540" x2="1120" y2="540" stroke="#1e293b" stroke-width="1"/>
    <text x="80" y="575" font-family="monospace" font-size="14" font-weight="600" fill="#38bdf8">
      https://acmbitm.campsy.app
    </text>
    <text x="1120" y="575" text-anchor="end" font-family="monospace" font-size="13" fill="#64748b">
      Association for Computing Machinery • Est. 2008
    </text>
  </svg>
  `;

  const ogCardBase = await sharp(Buffer.from(ogCardSvg)).png().toBuffer();
  const finalOgCard = await sharp(ogCardBase)
    .composite([
      {
        input: ogLogo,
        top: 185,
        left: 100,
      },
    ])
    .png({ quality: 95 })
    .toBuffer();

  fs.writeFileSync(path.join(publicDir, "og.png"), finalOgCard);
  fs.writeFileSync(path.join(publicDir, "og-image.png"), finalOgCard);
  fs.writeFileSync(path.join(brandingDir, "og-image.png"), finalOgCard);
  console.log("✓ Generated main OpenGraph image: public/og.png & public/images/branding/og-image.png");

  // ----------------------------------------------------
  // HACKTOBERFEST 2026 EVENT OPEN GRAPH IMAGE
  // ----------------------------------------------------
  console.log("Generating Hacktoberfest 2026 specific OpenGraph card (1200x630)...");

  const htfCardSvg = `
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="htfBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0c0d12"/>
        <stop offset="50%" stop-color="#14111d"/>
        <stop offset="100%" stop-color="#0a0a0f"/>
      </linearGradient>
      <radialGradient id="htfGlow" cx="20%" cy="30%" r="55%">
        <stop offset="0%" stop-color="#ff6b4a" stop-opacity="0.30"/>
        <stop offset="45%" stop-color="#7c3aed" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="#0a0a0f" stop-opacity="0"/>
      </radialGradient>
      <pattern id="htfGrid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-width="0.75" stroke-opacity="0.04"/>
      </pattern>
    </defs>

    <rect width="1200" height="630" fill="url(#htfBg)"/>
    <rect width="1200" height="630" fill="url(#htfGlow)"/>
    <rect width="1200" height="630" fill="url(#htfGrid)"/>

    <rect x="24" y="24" width="1152" height="582" rx="16" fill="none" stroke="#ff6b4a" stroke-width="1.5" stroke-opacity="0.35"/>

    <!-- Left Logo Plate -->
    <rect x="80" y="165" width="280" height="280" rx="24" fill="#171424" fill-opacity="0.8" stroke="#ff6b4a" stroke-width="1.2" stroke-opacity="0.5"/>

    <!-- Right Content -->
    <g transform="translate(410, 125)">
      <!-- Top Season Tag -->
      <rect x="0" y="0" width="340" height="32" rx="6" fill="#ff6b4a" fill-opacity="0.18" stroke="#ff7a59" stroke-width="1" stroke-opacity="0.6"/>
      <text x="14" y="21" font-family="monospace" font-size="12" font-weight="700" letter-spacing="2" fill="#ff9070">
        ACM BIT MESRA • OCTOBER 2026
      </text>

      <!-- Event Title -->
      <text x="0" y="95" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="56" font-weight="800" fill="#ffffff" letter-spacing="-1">
        Hacktoberfest 2026
      </text>

      <!-- Tagline -->
      <text x="0" y="135" font-family="monospace" font-size="20" font-weight="600" fill="#f87171">
        Build. Experiment. Share.
      </text>

      <!-- Theme Badge -->
      <rect x="0" y="155" width="310" height="34" rx="8" fill="#38bdf8" fill-opacity="0.12" stroke="#38bdf8" stroke-width="1" stroke-opacity="0.4"/>
      <text x="14" y="177" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#38bdf8">
        Theme: AI belongs to everyone.
      </text>

      <!-- Description -->
      <text x="0" y="225" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" fill="#cbd5e1" opacity="0.9">
        Celebrate open source with ACM BIT Mesra. Explore open-source AI,
      </text>
      <text x="0" y="250" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" fill="#cbd5e1" opacity="0.9">
        work with open-weight models, and build community prototypes.
      </text>

      <!-- Status Pill -->
      <g transform="translate(0, 285)">
        <rect x="0" y="0" width="220" height="30" rx="15" fill="#f59e0b" fill-opacity="0.2" stroke="#f59e0b" stroke-width="1"/>
        <text x="16" y="20" font-family="monospace" font-size="12" font-weight="700" fill="#fbbf24">
          ● Registration Opening Soon
        </text>

        <rect x="235" y="0" width="170" height="30" rx="15" fill="#1e293b" stroke="#334155" stroke-width="1"/>
        <text x="249" y="19" font-family="monospace" font-size="12" font-weight="600" fill="#e2e8f0">
          Prizes: To Be Decided
        </text>
      </g>
    </g>

    <!-- Bottom Bar -->
    <line x1="80" y1="540" x2="1120" y2="540" stroke="#2a2238" stroke-width="1"/>
    <text x="80" y="575" font-family="monospace" font-size="14" font-weight="600" fill="#ff7a59">
      https://acmbitm.campsy.app/events/hacktoberfest-2026
    </text>
    <text x="1120" y="575" text-anchor="end" font-family="monospace" font-size="13" fill="#94a3b8">
      Independent Community Challenge • ACM BIT Mesra
    </text>
  </svg>
  `;

  const htfCardBase = await sharp(Buffer.from(htfCardSvg)).png().toBuffer();
  const finalHtfCard = await sharp(htfCardBase)
    .composite([
      {
        input: await sharp(rawPngPath).resize(240, 240).png().toBuffer(),
        top: 185,
        left: 100,
      },
    ])
    .png({ quality: 95 })
    .toBuffer();

  fs.writeFileSync(path.join(eventsDir, "hacktoberfest-2026-og.png"), finalHtfCard);
  console.log("✓ Generated Hacktoberfest 2026 card: public/images/events/hacktoberfest-2026-og.png");

  console.log("\nAll assets generated successfully!");
}

generateAll().catch((err) => {
  console.error("Error generating assets:", err);
  process.exit(1);
});
