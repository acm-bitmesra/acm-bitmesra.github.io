import fs from "node:fs";
import path from "node:path";

const OUT_DIR = fs.existsSync(path.resolve(process.cwd(), "out"))
  ? path.resolve(process.cwd(), "out")
  : path.resolve(process.cwd(), ".next/server/app");

if (!fs.existsSync(OUT_DIR)) {
  console.error("Error: Production build target directory does not exist. Run 'bun run build' first.");
  process.exit(1);
}

console.log("🔍 Validating production build output in:", OUT_DIR);

let errors = 0;
let warnings = 0;

// 1. Verify key root files exist
const requiredRoutes = [
  "index.html",
  "about",
  "activities",
  "events",
  "team",
  "resources",
  "competitive-programming",
  "icpc",
  "gallery",
  "sponsors",
  "join",
  "contact",
  "privacy",
  "terms",
  "accessibility",
];

console.log("\n1. Verifying key static route files...");
for (const route of requiredRoutes) {
  const possiblePaths = [
    path.join(OUT_DIR, route),
    path.join(OUT_DIR, `${route}.html`),
    path.join(OUT_DIR, route, "index.html"),
  ];
  const found = possiblePaths.find((p) => fs.existsSync(p));
  if (found) {
    console.log(`  ✓ ${route} -> ${path.relative(OUT_DIR, found)}`);
  } else {
    console.error(`  ✗ Missing required route target: ${route}`);
    errors++;
  }
}

// 2. Scan all HTML files for JSON-LD and internal links
function getAllFiles(dir, ext = ".html", fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, ext, fileList);
    } else if (file.endsWith(ext)) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const htmlFiles = getAllFiles(OUT_DIR, ".html");
console.log(`\n2. Inspecting ${htmlFiles.length} generated HTML files for SEO and JSON-LD...`);

let totalJsonLdFound = 0;
const linkSet = new Set();

for (const filePath of htmlFiles) {
  const content = fs.readFileSync(filePath, "utf-8");
  const relPath = path.relative(OUT_DIR, filePath);

  // Validate JSON-LD
  const jsonLdMatches = content.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs);
  for (const match of jsonLdMatches) {
    totalJsonLdFound++;
    try {
      JSON.parse(match[1]);
    } catch (e) {
      console.error(`  ✗ Invalid JSON-LD in ${relPath}: ${e.message}`);
      errors++;
    }
  }

  // Extract internal links
  const hrefMatches = content.matchAll(/href="([^"]+)"/g);
  for (const match of hrefMatches) {
    const href = match[1];
    if (
      href.startsWith("/") &&
      !href.startsWith("//") &&
      !href.startsWith("/#") &&
      !href.includes("mailto:") &&
      !href.includes("tel:")
    ) {
      linkSet.add(href);
    }
  }
}

console.log(`  ✓ Validated ${totalJsonLdFound} JSON-LD blocks across all pages`);

// 3. Validate extracted internal links
console.log(`\n3. Verifying ${linkSet.size} unique internal links point to valid export targets...`);
for (const link of linkSet) {
  const urlPath = link.split("?")[0].split("#")[0];
  if (!urlPath || urlPath === "/") continue;

  // Potential file locations for this link
  const cleanPath = decodeURIComponent(urlPath.replace(/^\//, ""));
  const possiblePaths = [
    path.join(OUT_DIR, `${cleanPath}.html`),
    path.join(OUT_DIR, cleanPath, "index.html"),
    path.join(OUT_DIR, cleanPath),
    path.join(process.cwd(), "public", cleanPath),
    path.join(process.cwd(), ".next", cleanPath.replace(/^_next\//, "")),
  ];

  const isDynamicRoute =
    urlPath.startsWith("/blog") ||
    urlPath.startsWith("/admin") ||
    urlPath.startsWith("/api");

  const found = possiblePaths.some((p) => fs.existsSync(p)) || isDynamicRoute;
  if (!found) {
    console.warn(`  ⚠️ Broken internal link detected: ${link}`);
    warnings++;
  }
}

// 4. Validate sitemap.xml
const sitemapCandidate = path.join(OUT_DIR, "sitemap.xml");
const sitemapFile =
  fs.existsSync(sitemapCandidate) && fs.statSync(sitemapCandidate).isFile()
    ? sitemapCandidate
    : path.join(OUT_DIR, "sitemap.xml.body");

if (fs.existsSync(sitemapFile) && fs.statSync(sitemapFile).isFile()) {
  const sitemapContent = fs.readFileSync(sitemapFile, "utf-8");
  const locMatches = [...sitemapContent.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  console.log(`  ✓ Sitemap contains ${locMatches.length} indexed URLs`);
  if (locMatches.length === 0) {
    console.error("  ✗ Sitemap has 0 URLs");
    errors++;
  }
} else {
  console.error("  ✗ sitemap.xml missing");
  errors++;
}

// 5. Summary
console.log("\n--- Validation Summary ---");
if (errors === 0 && warnings === 0) {
  console.log("🎉 ALL PRODUCTION CHECKS PASSED WITH 0 ERRORS AND 0 WARNINGS!\n");
  process.exit(0);
} else if (errors === 0) {
  console.log(`✅ Production validation succeeded with ${warnings} warnings and 0 errors.\n`);
  process.exit(0);
} else {
  console.error(`💥 Production validation FAILED with ${errors} errors and ${warnings} warnings.\n`);
  process.exit(1);
}
