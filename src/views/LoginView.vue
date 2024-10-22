<template>
  <div class="auth-box">
    <form class="image-form"></form>
    <div class="separator"></div>
    <form class="auth-form">
      <h2 class="auth-title">登录</h2>
      <div class="form-group">
        <span class="icon-email auth-icon"></span>
        <input class="input-field" type="email" v-model="email" placeholder="请输入邮箱">
      </div>
      <div class="form-group">
        <span class="icon-password auth-icon"></span>
        <input class="input-field" type="password" v-model="password" placeholder="请输入密码">
      </div>
      <button class="button-base auth-button" @click.prevent="login">登录</button>
      <button class="to-button-base auth-to-button forget-password"
              @click="Router.toForgetPassword">忘记密码</button>
      <button class="to-button-base auth-to-button to-register-button"
              @click="Router.toRegister">没有账号？点此注册</button>
    </form>
  </div>
  <!-- 使用 Modal 组件 -->
  <Modal
      v-if="modal_show"
      :type="modal_type"
      :message="modal_message"
      @submit="handleEnsure"
      @close="modal_show = false"
      visible/>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
import qs from 'qs';
import Modal from '@/components/Modal-Info.vue';
import API from '@/components/js/API.js';
import Cookie from '@/components/js/Cookie.js';
import Router from '@/components/js/Router.js';

const store = useStore();

const email = ref('');
const password = ref('');

const modal_show = ref(false);
const modal_type = ref('');
const modal_message = ref('');

const login_success = ref(false);

/* 调用弹窗 */
const showModal = (type, message, show) =>
{
  modal_type.value = type;
  modal_message.value = message;
  modal_show.value = show;
};

/* 检测用户信息合法性 */
const checkAuthInfo = () =>
{
  if (email.value === '' || password.value === '')
  {
    showModal('error', '邮箱或密码不可为空', true);
    return false;
  }
  return true;
};

/* 请求登录 */
const login = async () =>
{
  if (!checkAuthInfo()) return;

  const data = qs.stringify
  (
      {
        'username': email.value,
        'password': password.value
      }
  );

  try
  {
    const response = await axios.post
    (
        API.POST_auth_login,
        data,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    if (response.status === 200)
    {
      console.log('用户登录成功：', response.data);

      /* 在用户登录成功后调用saveUserInfoToCookie函数，将用户信息保存到Cookie中 */
      try
      {
        const user_info =
            {
              "token": response.data["access_token"],
              "email": email.value
            };

        await store.dispatch('updateUserInfo', user_info);

        Cookie.saveUserInfoToCookie(user_info);

        if (Cookie.getUserInfoFromCookie() !== null)
          console.log('保存Cookie成功：', user_info);
        else
          console.log('保存Cookie失败：可能浏览器禁用了该网页的Cookie');
      }
      catch (error)
      {
        console.log('保存Cookie失败：', error);
      }
      login_success.value = true;
      showModal('success', '登录成功，点击确定前往首页', true);
    }
  }
  catch (error)
  {
    console.error('用户登录失败：', error.response ? error.response.data : error.message);

    switch (error.response.status)
    {
      case 400:
        showModal('error', '登录失败，邮箱或密码错误', true);
        break;
      case 422:
        showModal('error', '登录失败，邮箱名不合法', true);
        break;
      default:
        showModal('error', '登录失败，请稍后再试', true);
        break;
    }
  }
};

const handleEnsure = () =>
{
  if (login_success.value)
  {
    console.log('登录成功，即将跳转到首页');
    Router.toHome();
  }
};
</script>

<style scoped>
@import url("../components/css/Style-Auth.css");

.to-button-base.auth-to-button.forget-password
{
  margin-top: 40px;
}

.to-button-base.auth-to-button.forget-password:hover::after
{
  transform: scaleX(0.25);   /* 鼠标移至按钮时显示下划线 */
}

.to-button-base.auth-to-button.to-register-button
{
  margin-top: 10px;
}
</style>