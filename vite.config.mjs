import { sites } from '@openai/sites-vite-plugin';
import { defineConfig } from 'vite';
import { copyFileSync, mkdirSync, readdirSync, renameSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();

export default defineConfig({
  plugins: [
    sites(),
    {
      name: 'copy-shared-roi-assets',
      writeBundle() {
        for (const file of ['roi-model.js', 'ROI-Model.md']) {
          copyFileSync(resolve(root, file), resolve(root, 'dist', file));
        }
      },
      closeBundle() {
        const distributionDirectory = resolve(root, 'dist');
        const clientDirectory = resolve(distributionDirectory, 'client');
        mkdirSync(clientDirectory, { recursive: true });
        for (const entry of readdirSync(distributionDirectory)) {
          if (['.openai', 'client', 'server'].includes(entry)) continue;
          renameSync(resolve(distributionDirectory, entry), resolve(clientDirectory, entry));
        }

        const serverDirectory = resolve(root, 'dist', 'server');
        mkdirSync(serverDirectory, { recursive: true });
        writeFileSync(
          resolve(serverDirectory, 'index.js'),
          `export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) return response;
    const url = new URL(request.url);
    if (url.pathname === '/' || !url.pathname.split('/').pop().includes('.')) {
      url.pathname = '/index.html';
      return env.ASSETS.fetch(new Request(url, request));
    }
    return response;
  },
};
`,
        );
        writeFileSync(
          resolve(serverDirectory, 'wrangler.json'),
          `${JSON.stringify({
            name: 'msfth-contoso-roi-dashboard',
            main: 'index.js',
            compatibility_date: '2026-05-15',
            compatibility_flags: ['nodejs_compat'],
            no_bundle: true,
            rules: [{ type: 'ESModule', globs: ['**/*.js', '**/*.mjs'] }],
            assets: { directory: '../client' },
          })}\n`,
        );
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        dashboard: resolve(root, 'index.html'),
        calculator: resolve(root, 'calculator.html'),
        deck: resolve(root, 'pitch-deck.html'),
      },
    },
  },
});
