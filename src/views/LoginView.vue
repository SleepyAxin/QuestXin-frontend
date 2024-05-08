<template>
  <div class="LoginContainer">
    <div class="LoginBox">
      <form class="ImageForm">
      </form>
      <!-- 分隔线 -->
      <div class="Separator">
      </div>
      <form class="LoginForm">
        <h2 class="LoginTitle">登录</h2>
        <div class="FormGroup">
          <!-- 用户图标 -->
          <span class="IconFont">&#xe656;</span>
          <input class="InputField" type="text" id="username" v-model="username" placeholder="请输入用户名">
        </div>
        <div class="FormGroup">
          <!-- 密码图标 -->
          <span class="IconFont">&#xe64d;</span>
          <input class="InputField" type="password" id="password" v-model="password" placeholder="请输入密码">
        </div>
        <button type="submit" class="LoginButton" @click="login">登录</button>
        <button class="ToRegisterButton" @click="toRegister">没有账号？点此注册</button>
      </form>
    </div>
  </div>
</template>

<script>
export default
{
  data()
  {
    return {
      username: '',
      password: ''
    }
  },
  methods:
      {
        // 登录逻辑
        login()
        {
          console.log('登录信息:', this.username, this.password)
        },

        // 跳转到注册页
        toRegister()
        {
          this.$router.push("/register");
        }
      }
}
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
  height: 400px;
  width: 800px;
}

.LoginBox
{
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
}

.Separator
{
  width: 0.5%;
  height: 100%;

  margin: 2.5% 2.5%; /* 设置上下的边距 */
  background-color: #007bff;
}

.LoginTitle
{
  text-align: center;
  margin-bottom: 20px;
}

.LoginForm
{
  width: 100%;
  display: flex;
  flex-direction: column;
}

.FormGroup
{
  margin-bottom: 15px;
}

.InputField
{
  width: 80%;
  border: none;
  background-color:transparent;
}

.LoginButton
{
  padding: 8px 40px; /* 缩小按钮宽度 */
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: auto; /* 恢复按钮宽度自适应 */
  margin: auto;
}

.ToRegisterButton
{
  background-color: transparent;
  border: none;
  transform: translateY(200%);
}

.ToRegisterButton::after
{
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;    /* 控制下划线的位置 */
  width: 100%;
  height: 7.5%;
  background-color: #007bff;    /* 设置下划线颜色 */
  transform: scaleX(0);    /* 初始状态下下划线不可见 */
  transition: transform 0.3s ease-in-out;    /* 添加过渡效果 */
}

.ToRegisterButton:hover::after
{
  transform: scaleX(0.5); /* 鼠标移至按钮时显示下划线 */
}

.ImageForm
{
  width: 175%;
  height: 100%;
  padding: 20px;
  background: #f5f5f5 url("../assets/quest.svg") no-repeat;
  background-size: cover;
  border-radius: 4px;
}

.IconFont
{
  font-family: "IconFont" !important;
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