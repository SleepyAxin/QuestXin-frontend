export default
{
    /* 在用户登录成功后，将用户信息保存到Cookie中 */
    saveUserInfoToCookie(user_info)
    {
        /* 将用户信息转换为字符串 */
        const user_info_string = JSON.stringify(user_info);

        /* 设置Cookie的过期时间为三天 */
        const expires = new Date();
        expires.setDate(expires.getDate() + 3);

        /* 将用户信息保存到Cookie中 */
        document.cookie = `UserInfo=${encodeURIComponent(user_info_string)};expires=${expires.toUTCString()};path=/`;
    },

    /* 从Cookie中读取用户信息 */
    getUserInfoFromCookie()
    {
        /* 获取Cookie字符串 */
        const cookies = document.cookie;

        /* 将Cookie字符串拆分为单个Cookie */
        const cookie_array = cookies.split(';');

        /* 遍历每个Cookie，查找名为UserInfo的Cookie */
        for (let i = 0; i < cookie_array.length; i++)
        {
            const cookie = cookie_array[i].trim();

            /* 检查Cookie是否以UserInfo开头 */
            if (cookie.startsWith('UserInfo='))
            {
                /* 提取用户信息字符串并解码 */
                const user_info_string = decodeURIComponent(cookie.substring('UserInfo='.length));

                /* 将用户信息字符串转换为对象并返回 */
                return JSON.parse(user_info_string);
            }
        }

        /* 如果找不到名为UserInfo的Cookie，则返回null */
        return null;
    },

    /* 从Cookie中删除用户信息 */
    clearUserInfoInCookie()
    {
        /* 将过期时间设置为过去的时间，即立即过期 */
        document.cookie = 'UserInfo=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
}