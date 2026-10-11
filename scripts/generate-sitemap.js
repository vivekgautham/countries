import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read package.json to get homepage or default
const pkgPath = path.resolve(__dirname, "../package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

// Support BASE_URL from environment or fallback to package.json homepage
const BASE_URL = process.env.BASE_URL || pkg.homepage || "https://vivekgautham.github.io/countries";
const cleanBaseUrl = BASE_URL.replace(/\/+$/, "");

const countriesPath = path.resolve(__dirname, "../src/data/countries.json");
const countries = JSON.parse(fs.readFileSync(countriesPath, "utf-8"));

const today = new Date().toISOString().split("T")[0];

// Static core routes
const routes = [
  { path: "", changefreq: "daily", priority: "1.0" },
  { path: "#/rankings", changefreq: "weekly", priority: "0.9" },
  { path: "#/tax-atlas", changefreq: "weekly", priority: "0.9" },
  { path: "#/compare", changefreq: "weekly", priority: "0.8" },
];

// Add each country route
for (const country of countries) {
  if (country.code) {
    const code = country.code.toLowerCase();
    routes.push({
      path: `#/country/${code}`,
      changefreq: "weekly",
      priority: "0.7",
    });
  }
}

// Generate XML content
let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

for (const route of routes) {
  const loc = route.path ? `${cleanBaseUrl}/${route.path}` : `${cleanBaseUrl}/`;
  xml += `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>
`;
}

xml += `</urlset>
`;

const outputPath = path.resolve(__dirname, "../public/sitemap.xml");
fs.writeFileSync(outputPath, xml, "utf-8");

console.log(
  `Generated sitemap.xml with ${routes.length} URLs at ${outputPath} for base: ${cleanBaseUrl}`,
);
