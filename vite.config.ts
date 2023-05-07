import { fileURLToPath, URL } from 'node:url'
import Components from 'unplugin-vue-components/vite'
import Pages from 'vite-plugin-pages'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Layouts from 'vite-plugin-vue-layouts';
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue(),
  UnoCSS(),
  Components({
    resolvers: [
      NaiveUiResolver()
    ],
    extensions: ['vue'],
    // allow auto import and register components used in markdown
    include: [/\.vue$/, /\.vue\?vue/],
    dts: 'src/components.d.ts',
  }), Pages(), Layouts(),
  AutoImport({
    imports: [
      'vue',
      'vue-router',
      {
        'naive-ui': [
          'useDialog',
          'useMessage',
          'useNotification',
          'useLoadingBar'
        ]
      }
    ],
    dts: 'src/auto-imports.d.ts',
    vueTemplate: true,
  }),],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})

