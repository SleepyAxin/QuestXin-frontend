import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import "./css/IconFont.css"    // 图标文件

createApp(App).use(store).use(router).mount('#app')