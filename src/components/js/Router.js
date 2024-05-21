export default
{
    methods:
    {
        toHome()
        {
            try { this.$router.push({name: 'home'}); }
            catch (error) { console.error('“首页”的路由未找到', error); }
        },
        toLogin()
        {
            try { this.$router.push({name: 'login'}); }
            catch (error) { console.error('“登录”的路由未找到', error); }
        },
        toRegister()
        {
            try { this.$router.push({name: 'register'}); }
            catch (error) { console.error('“注册”的路由未找到', error); }
        },
        toQuest()
        {
            try { this.$router.push({name: 'quest'}); }
            catch (error) { console.error('“问卷”的路由未找到', error); }
        }
    }
};