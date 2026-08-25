import { sites } from '@openai/sites-vite-plugin';
import { defineConfig } from 'vite';
import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs';
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
        const serverDirectory = resolve(root, 'dist', 'server');
        mkdirSync(serverDirectory, { recursive: true });
        writeFileSync(
          resolve(serverDirectory, 'index.js'),
          "export default { fetch(request, env) { return env.ASSETS.fetch(request); } };\n",
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
