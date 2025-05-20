import { SitemapStream, streamToPromise } from 'sitemap';
import { createGzip } from 'zlib';
import fs from 'fs';
import path from 'path';
import { Express, Request, Response } from 'express';

// Base URL for your website
const SITE_URL = 'https://stupidsimpleapps.com';

// This array should contain all your routes
const routes = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/hubspot-dashboard', changefreq: 'weekly', priority: 0.8 }
];

// Function to generate sitemap
export async function generateSitemap(): Promise<Buffer> {
  const smStream = new SitemapStream({ hostname: SITE_URL });
  const pipeline = smStream.pipe(createGzip());

  // Add each route to the sitemap
  routes.forEach(route => {
    smStream.write({
      url: route.url,
      changefreq: route.changefreq as any,
      priority: route.priority
    });
  });

  // End the stream
  smStream.end();

  // Get the result as a Buffer
  const data = await streamToPromise(pipeline);
  return data;
}

// Save sitemap to file
export function saveSitemap(sitemapData: Buffer): void {
  const publicDir = path.resolve('./client/public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  fs.writeFileSync(path.resolve(publicDir, 'sitemap.xml.gz'), sitemapData);
  console.log('Sitemap created successfully at client/public/sitemap.xml.gz');
}

// Add sitemap routes to Express app
export function setupSitemapRoutes(app: Express): void {
  let sitemap: Buffer | null = null;

  app.get('/sitemap.xml', async (req: Request, res: Response) => {
    res.header('Content-Type', 'application/xml');
    res.header('Content-Encoding', 'gzip');
    
    // Generate sitemap if not already generated
    if (!sitemap) {
      try {
        sitemap = await generateSitemap();
        saveSitemap(sitemap);
      } catch (e) {
        console.error('Error generating sitemap:', e);
        res.status(500).end();
        return;
      }
    }
    
    res.send(sitemap);
  });
}

// Create sitemap at startup
export async function createSitemapAtStartup(): Promise<void> {
  try {
    const sitemap = await generateSitemap();
    saveSitemap(sitemap);
  } catch (e) {
    console.error('Error generating sitemap at startup:', e);
  }
}