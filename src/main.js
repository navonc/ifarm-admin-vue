import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'
import { setupRouterGuards, setupRouterErrorHandler } from './router/guards'
import './styles/global.scss'

// 开发环境下导入API测试工具
// if (import.meta.env.DEV) {
//   import('./utils/api-test')
// }

const app = createApp(App)
const pinia = createPinia()

// 注册Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)
app.use(router)
app.use(ElementPlus)

// 设置路由守卫
setupRouterGuards(router)
setupRouterErrorHandler(router)

app.mount('#app')
