import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import replace from '@rollup/plugin-replace'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { nodeModulesPolyfillPlugin } from 'esbuild-plugins-node-modules-polyfill'

export default defineConfig({
  base: './',
  plugins: [
    vue({
      script: {
        defineModel: true,
      },
    }),
    nodePolyfills({
      globals: {
        Buffer: true, // can also be 'build', 'dev', or false
        global: true,
        process: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@vue/compiler-dom': '@vue/compiler-dom/dist/compiler-dom.cjs.js',
      '@vue/compiler-core': '@vue/compiler-core/dist/compiler-core.cjs.js',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [nodeModulesPolyfillPlugin()],
    },
  },
  build: {
    outDir: 'website',
    commonjsOptions: {
      ignore: ['typescript'],
    },
  },
  worker: {
    format: 'es',
    plugins: () => [
      replace({
        preventAssignment: true,
        values: {
          'process.env.NODE_ENV': JSON.stringify('production'),
        },
      }),
    ],
  },
})
