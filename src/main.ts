import './style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import generatedRoutes from '~pages'
import App from './App.vue'
import 'virtual:uno.css'
import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'

const app = createApp(App)
const routes = setupLayouts(generatedRoutes)
const pinia = createPinia()

const router = createRouter({
    routes,
    history: createWebHistory()
});

app.use(router)
app.use(pinia)
app.mount('#app')
