import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'

import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'    // 用户登录界面
import RegisterView from '../views/RegisterView.vue'    // 用户注册页面

const routes =
    [
      {
        path: '/',
        name: 'home',
        component: HomeView
      },
      {
        path: '/login',
        name: 'login',
        component: LoginView
      },
      {
        path: '/register',
        name: 'register',
        component: RegisterView
      }
    ]

const router = createRouter
(
    {
      history: createWebHistory(process.env.BASE_URL),
      routes
    }
)

export default router
