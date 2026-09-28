import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
if (existsSync('.env')) loadEnvFile('.env');
const site = process.env.SITE_URL || process.env.CF_PAGES_URL || 'http://localhost:4321';
export default defineConfig({
  site,
  integrations: [sitemap()],
  output: 'static',
  vite: { plugins: [tailwindcss()] },
  markdown: { shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } } },
});
