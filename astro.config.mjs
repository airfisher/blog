import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
if (existsSync('.env')) loadEnvFile('.env');
const site = process.env.SITE_URL || process.env.CF_PAGES_URL || 'http://localhost:4321';
export default defineConfig({ site, integrations: [sitemap()], output: 'static' });
