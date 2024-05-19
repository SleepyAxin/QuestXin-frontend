import { getUserInfoFromCookie } from "@/components/js/Cookie.js";

const HOME_ROUTER = {name: 'home'}
const LOGIN_ROUTER = {name: 'login'}
const REGISTER_ROUTER = {name: 'register'}

export default
{
    methods:
    {
        toHome()
        {
            try { this.$router.push(HOME_ROUTER); }
            catch (error) { console.error('“首页”的路由未找到', error); }
        },
        toLogin()
        {
            try { this.$router.push(LOGIN_ROUTER); }
            catch (error) { console.error('“登录”的路由未找到', error); }
        },
        toRegister()
        {
            try { this.$router.push(REGISTER_ROUTER); }
            catch (error) { console.error('“注册”的路由未找到', error); }
        }
    }
};