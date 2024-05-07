<template>
  <div class="LoginContainer">
    <div class="LoginBox">
      <h2 class="LoginTitle">登录</h2>
      <form class="LoginForm">
        <div class="FormGroup">
          <!-- 用户图标 -->
          <span class="IconFont">&#xe656;</span>
          <input type="text" id="username" v-model="username" placeholder="请输入用户名">
        </div>
        <div class="FormGroup">
          <!-- 密码图标 -->
          <span class="IconFont">&#xe64d;</span>
          <input type="password" id="password" v-model="password" placeholder="请输入密码">
        </div>
        <button type="submit" class="LoginButton" @click="login">登录</button>
      </form>
    </div>
  </div>
</template>

<script>
export default
{
  data()
  {
    return { username: '', password: '' };
  },
  methods:
  {
    // 登录逻辑
    login() { console.log('登录信息:', this.username, this.password); }
  }
};
</script>

<style scoped>
.LoginContainer
{
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;

}

.LoginBox
{
  width: 800px;
  height: 400px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.LoginTitle
{
  text-align: center;
  margin-bottom: 20px;
}

.LoginForm
{
  display: flex;
  flex-direction: column;
}

.FormGroup
{
  margin-bottom: 10px;
}

.LoginButton
{
  padding: 8px 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.IconFont
{
    font-family: "iconfont" !important;
    font-size: 20px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height:22px;
    color:#007bff;
    margin-right:10px;
    margin-top:3px;
}

label
{
  font-weight: bold;
}

input
{
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>