<template>
  <div class="auth-box">
    <form class="image-form"></form>
    <!-- 分隔线 -->
    <div class="separator"></div>
    <form class="auth-form">
      <h2 class="auth-title">注册</h2>
      <div class="form-group">
        <!-- 用户图标 -->
        <span class="icon-email auth-icon"></span>
        <input class="input-field" type="email" id="email"
               v-model="email" placeholder="请输入邮箱">
      </div>
      <div class="form-group">
        <!-- 密码图标 -->
        <span class="icon-password auth-icon"></span>
        <input class="input-field" type="password" id="password"
               v-model="password" placeholder="请输入密码">
      </div>
      <div class="form-group">
        <!-- 确认密码图标 -->
        <span class="icon-password auth-icon"></span>
        <input class="input-field" type="password" id="passwordAgain"
               v-model="passwordAgain" placeholder="请再次输入密码">
      </div>
      <button type="submit" class="button-base auth-button" @click.prevent="register">注册</button>
      <button class="to-button-base auth-to-button" @click="Router.toLogin">已有账号？点此登录</button>
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
import axios from 'axios';

import Modal from '@/components/Modal-Info.vue';
import API from '@/components/js/API.js';
import Router from '@/components/js/Router.js';

let email = ref('');
let password = ref('');
let passwordAgain = ref('');
let modal_show = ref(false);
let modal_type = ref('');
let modal_message = ref('');

const showModal = (type, message, show) =>
{
  modal_type.value = type;
  modal_message.value = message;
  modal_show.value = show;
};

const checkAuthInfo = () =>
{
  if (email.value === '' || password.value === '' || passwordAgain.value === '')
  {
    showModal('error', '邮箱或密码不可为空', true);
    return false;
  }

  if (password.value !== passwordAgain.value)
  {
    showModal('error', '密码不一致，请重新输入', true);
    password.value = '';
    passwordAgain.value = '';
    return false;
  }

  if (password.value.length < 3)
  {
    showModal('error', '密码不得少于三个字符', true);
    return false;
  }

  return true;
};

const register = async () =>
{
  if (!checkAuthInfo()) return;

  const data =
      {
        'email': email.value,
        'password': password.value,
        'is_active': true,
        'is_superuser': false,
        'is_verified': false,
      };

  try
  {
    const response = await axios.post
    (
        API.POST_auth_register,
        data,
        { headers: { 'Content-Type': 'application/json' } }
    );

    if (response.status === 201)
    {
      console.log('用户注册成功：', response.data);
      showModal('success', '注册成功，点击前往登录', true);
    }
  }
  catch (error)
  {
    console.error('用户注册失败：', error.response ? error.response.data : error.message);

    switch (error.response.status)
    {
      case 400:
        showModal('error', '注册失败，邮箱已被注册', true);
        break;
      case 422:
        showModal('error', '注册失败，邮箱名不合法', true);
        break;
      default:
        showModal('error', '注册失败，请稍后再试', true);
        break;
    }
  }
};

const handleEnsure = (data) =>
{
  if (data === true)
  {
    console.log('注册成功，即将跳转到登录');
    Router.toLogin();
  }
};
</script>

<style scoped>
@import url("@/components/css/Style-Auth.css");
</style>