/// <reference types="vite/client" />
/// <reference types="vite-plugin-pages/client" />

declare module 'layouts-generated' {
  import type { RouteRecordRaw } from 'vue-router'
  export function setupLayouts(routes: RouteRecordRaw[]): RouteRecordRaw[]
}

declare module 'virtual:generated-layouts' {
  import type { RouteRecordRaw } from 'vue-router'
  export function setupLayouts(routes: RouteRecordRaw[]): RouteRecordRaw[]
}

declare global {
  interface Window {
    hello: any
  }
}
declare module 'marked-mangle'
declare module 'marked-gfm-heading-id'
declare module '@vueuse/integrations/useDrauu'
