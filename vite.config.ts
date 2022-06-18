/// <reference types="vitest" />
import * as fs from 'node:fs/promises'
import glob from 'fast-glob'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const pkg = JSON.parse(
  await fs.readFile(new URL('package.json', import.meta.url).pathname, 'utf8')
)

// glob all ts files in src/ directory
const input = await glob('src/**/!(*.d).ts')
// const input = await glob('src/**/!(*.d).(js|ts)')

export default defineConfig({
  define: {
    'import.meta.vitest': 'undefined',
  },
  build: {
    emptyOutDir: true,
    target: 'esnext',
    sourcemap: true,
    outDir: 'build',
    ssr: true,
    lib: {
      entry: './src/index.ts',
      name: pkg.name,
      formats: ['es'],
      fileName: (format) => `[name].js`,
    },
    rollupOptions: {
      input,
      // external: Object.keys(pkg.dependencies || {}),
      output: {
        inlineDynamicImports: false,
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    },
  },
  plugins: [dts()],
  test: {
    includeSource: ['src/**/*.{js,ts}'],
  },
})
