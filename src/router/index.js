import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

import Home from '@/views/HomeView.vue'    /* 首页界面 */
import Login from '@/views/LoginView.vue'    /* 用户登录界面 */
import Register from '@/views/RegisterView.vue'    /* 用户注册页面 */
import ForgetPassword from "@/views/ForgetPasswordView.vue";
import User from '@/views/UserView.vue'    /* 用户界面 */
import Quest from "@/views/QuestView.vue"    /* 问卷管理界面 */
import Questionnaire from "@/views/QuestionnaireView.vue";    /* 问卷预览/填写界面 */
import Result from "@/views/ResultView.vue";    /* 问卷统计结果界面 */

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
            path: '/forget_password',
            name: 'forget_password',
            component: ForgetPassword
        },
        {
            path: '/user',
            name: 'user',
            component: User
        },
        {
            path: '/quest',
            name: 'quest',
            component: Quest
        },
        {
            path: '/q/:id',
            name: 'questionnaire',
            component: Questionnaire
        },
        {
            path: '/v/:id',
            name: 'view',
            component: Questionnaire,
        },
        {
            path: '/r/:id',
            name: 'result',
            component: Result
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
