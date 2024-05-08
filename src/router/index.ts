import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'

import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'    // 用户登录界面
import RegisterView from '../views/RegisterView.vue'    // 用户注册页面

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
            component: AboutView
        },
        {
            path: '/login',
            name: '登录',
            component: LoginView
        },
        {
            path: '/register',
            name: '注册',
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
