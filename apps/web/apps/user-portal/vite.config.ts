import path from 'path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import {
  defineConfig,
  loadEnv,
  type PluginOption,
  type UserConfig,
} from 'vite';

/** Resolves reliably when `import.meta.dirname` is unavailable (older Node). */
const __dirname =
  typeof import.meta.dirname === 'string'
    ? import.meta.dirname
    : path.dirname(fileURLToPath(import.meta.url));

const injectPublicUrl = (publicUrl?: string): PluginOption => ({
  name: 'inject-public-url',
  transformIndexHtml(html) {
    if (publicUrl) {
      return html.replace(
        /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i,
        `<meta property="og:image" content="${publicUrl}/preview-image.png" />`,
      );
    }
    return html;
  },
});

export default defineConfig(async ({ mode }): Promise<UserConfig> => {
  // Populate import.meta.env so t3-env can validate at config time
  Object.defineProperty(import.meta, 'env', {
    value: loadEnv(mode, process.cwd()),
    configurable: true,
  });
  // eslint-disable-next-line -- require() needed: dynamic import() pulls the entire src tree into tsconfig.node
  require('./src/config/env');

  const env = loadEnv(mode, process.cwd());
  const publicUrl = env.VITE__USER_PORTAL__PUBLIC_URL;

  return {
    assetsInclude: ['**/*.hdr', '**/*.exr', '**/*.glb', '**/*.lottie'],
    server: {
      host: process.env.HOST,
      port: parseInt(process.env.USER_PORTAL_DEV_PORT ?? '', 10) || 3021,
    },
    // plugins: [
    //   react(),
    //   svgr({
    //     svgrOptions: {},
    //     esbuildOptions: {},
    //     include: '**/*.svg?react',
    //     exclude: '',
    //   }),
    //   injectPublicUrl(publicUrl),
    // ],
    plugins: [
      // tsconfigPaths(),
      // tsconfigPaths({
      //   projects: ['tsconfig.base.json'],
      // }),
      react(),
      svgr({
        // svgr options: https://react-svgr.com/docs/options/
        svgrOptions: {
          // ...
        },

        // esbuild options, to transform jsx to js
        esbuildOptions: {
          // ...
        },

        // A minimatch pattern, or array of patterns, which specifies the files in the build the plugin should include.
        include: '**/*.svg?react',

        //  A minimatch pattern, or array of patterns, which specifies the files in the build the plugin should ignore. By default no files are ignored.
        exclude: '',
      }),
      injectPublicUrl(publicUrl),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@shared': path.resolve(__dirname, '../../packages/shared/src'),
      },
    },
  } as UserConfig;
});
