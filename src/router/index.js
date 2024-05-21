import { createRouter, createWebHistory } from 'vue-router'

import store from '@/store'

import HomeView from '@/views/HomeView.vue'    /* 首页界面 */
import LoginView from '@/views/LoginView.vue'    /* 用户登录界面 */
import RegisterView from '@/views/RegisterView.vue'    /* 用户注册页面 */
import QuestView from "@/views/QuestView.vue"    /* 问卷界面 */

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
        },
        {
            path: '/quest',
            name: 'quest',
            component: QuestView
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

    /* 如果用户信息存在并且访问的是登录或注册页面，则跳转到首页 */
    if (is_user_info_exist && (to.name === 'login' || to.name === 'register'))
        next({ name: 'home' });
    /* 否则放行 */
    else
        next();
});

export default router
