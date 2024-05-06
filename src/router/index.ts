import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'

// 用户登录、注册和信息界面
import LoginView from '../views/LoginView.vue'

const routes: Array<RouteRecordRaw> = 
[
  {
    path: '/',
    name: '首页',
    component: HomeView
  },
  {
    path: '/about',
    name: '关于',
    // component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
    component: AboutView
  },
  {
    path: '/login',
    name: '登录',
    component: LoginView
  }
]

const router = createRouter
({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
