import Router from "@/router";

export default
{
    toHome()
    {
        try { Router.push({name: 'home'}).then(); }
        catch (error) { console.error('“首页”的路由未找到', error); }
    },
    toLogin()
    {
        try { Router.push({name: 'login'}).then(); }
        catch (error) { console.error('“登录”的路由未找到', error); }
    },
    toRegister()
    {
        try { Router.push({name: 'register'}).then(); }
        catch (error) { console.error('“注册”的路由未找到', error); }
    },
    toQuest()
    {
        try { Router.push({name: 'quest'}).then(); }
        catch (error) { console.error('“问卷”的路由未找到', error); }
    }
};