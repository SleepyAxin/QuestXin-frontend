import { createRouter, createWebHistory } from 'vue-router'

import store from '@/store'

import Home from '@/views/HomeView.vue'    /* 首页界面 */
import Login from '@/views/LoginView.vue'    /* 用户登录界面 */
import Register from '@/views/RegisterView.vue'    /* 用户注册页面 */
import Quest from "@/views/QuestView.vue"    /* 问卷界面 */

const routes =
    [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/register',
            name: 'register',
            component: Register
        },
        {
            path: '/quest',
            name: 'quest',
            component: Quest
        }
    ]

const router = createRouter
(
    {
      history: createWebHistory(process.env.BASE_URL),
      routes
    }
)

/* 添加全局导航守卫 */
router.beforeEach((to, from, next) =>
{
    const is_user_info_exist = store.getters.getUserInfo !== null;

    /* 如果用户信息存在 */
    if (is_user_info_exist)
    {
        /* 如果访问的是登录或注册页面，则跳转到首页 */
        if (to.name === 'login' || to.name === 'register')
            next({ name: 'home' });
        else
            next();
    }
    /* 如果用户信息不存在 */
    else
    {
        /* 如果访问的是问卷管理页面，则跳转到登录界面 */
        if (to.name === 'quest')
            next({ name: 'login' });
        /* 否则放行 */
        else
            next();
    }
});

export default router
