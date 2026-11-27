import { resolve } from 'node:path'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const rootDir = import.meta.dirname

const external = (id: string): boolean => {
  if (id === 'vue' || id.startsWith('vue/')) return true
  if (id === '@vue/runtime-core' || id.startsWith('@vue/')) return true
  if (id === 'antdv-next' || id.startsWith('antdv-next/')) return true
  if (id === '@antdv-next/icons' || id.startsWith('@antdv-next/icons/')) return true
  if (id.startsWith('@formvk/')) return true
  if (id === 'dayjs' || id.startsWith('dayjs/')) return true
  if (id === 'sortablejs' || id.startsWith('sortablejs/')) return true
  return false
}

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    dts({
      tsconfigPath: './tsconfig.build.json',
      entryRoot: 'src',
      bundleTypes: true,
    }),
  ],
  build: {
    target: 'es2022',
    sourcemap: true,
    minify: false,
    lib: {
      entry: {
        index: resolve(rootDir, 'src/index.ts'),
        resolver: resolve(rootDir, 'src/resolver.ts'),
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external,
      output: {
        preserveModules: false,
      },
    },
  },
})
