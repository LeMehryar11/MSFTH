import { sites } from '@openai/sites-vite-plugin';
import { defineConfig } from 'vite';
import { copyFileSync } from 'node:fs';
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
