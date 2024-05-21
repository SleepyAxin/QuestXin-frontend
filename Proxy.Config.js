const BASE_URL = 'http://127.0.0.1:8000/'    /* 目标接口的域名和端口号 */

module.exports =
    {
        host: 'localhost',    /* 本地主机 */
        port: 8080,    /* 端口号的配置 */
        open: false,  /* 自动打开浏览器 */
        proxy:
            {
                '/auth':    /*  拦截/auth接口 */
                    {
                        target: BASE_URL,   /* 调用的接口域名和端口号 */
                        changeOrigin: true,    /* 这里true表示实现跨域 */
                        secure: false,    /* 如果是https接口，需要配置这个参数 */

                        /* 用‘/api’代替target里面的地址 */
                        /* 后面组件中调用接口时直接用api代替 */
                        pathRewrite: {'^/api': '/'}
                    },
                '/user':    /*  拦截/user接口 */
                    {
                        target: BASE_URL,   /* 调用的接口域名和端口号 */
                        changeOrigin: true,    /* 这里true表示实现跨域 */
                        secure: false,    /* 如果是https接口，需要配置这个参数 */

                        /* 用‘/api’代替target里面的地址 */
                        /* 后面组件中调用接口时直接用api代替 */
                        pathRewrite: {'^/api': '/'}
                    },
            }
    }