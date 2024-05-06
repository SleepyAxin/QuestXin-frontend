<template>
  <div class = "Background">
    <nav>
      <router-link to = "/">首页</router-link>
      |
      <router-link to = "/about">关于</router-link>
      |
      <router-link to = "/login">登录</router-link>
    </nav>
    <router-view/>
  </div>
</template>

<style>
#app
{
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav
{
  padding: 30px;
}

nav a
{
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active
{
  color: #42b983;
}

.Background
{
  /* 渐变色的起始颜色和结束颜色可以根据需要进行调整 */
  background: "./assets/logo.png";
}
</style>
