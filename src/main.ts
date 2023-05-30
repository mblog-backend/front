import './style.css'
import '@unocss/reset/normalize.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import generatedRoutes from '~pages'
import App from './App.vue'
import 'virtual:uno.css'
import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { installDirectives } from './directives/directives'

const app = createApp(App)
const routes = setupLayouts(generatedRoutes)
const pinia = createPinia()

const router = createRouter({
  routes,
  history: import.meta.env.MODE === 'all' ? createWebHashHistory() : createWebHistory(),
})

router.beforeEach((to, from, next) => {
  const userinfo = useStorage('userinfo', { username: '', token: '' })
  if (userinfo.value.token) {
    if (to.path === '/login') {
      return next('/')
    }
  } else {
    if (['/', '/register', '/login'].includes(to.path) || to.path.startsWith('/memo/')) {
      return next()
    } else {
      return next('/login?redirect=' + to.path)
    }
  }
  next()
})
app.use(router)
app.use(pinia)

installDirectives(app)

app.mount('#app')
