import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  theme: {
    colors: {},
    breakpoints: {
      sm: '320px',
      md: '640px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },
  shortcuts: {
    fc: 'flex flex-col',
    fr: 'flex flex-row',
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      cdn: 'https://esm.sh/',
      scale: 1.2,
      warn: true,
    }),
    presetTypography(),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
