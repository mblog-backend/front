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
    colors: {
      cSelected: '#526ECC',
      cHover: '#344899',
      cMain: '#5E7CE0',
      cFMain: '#252B3A',
      cFThird: '#BABBC0',
    },
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
