<template>
  <div class="auth-box">
    <form class="image-form"></form>
    <div class="separator"></div>
    <form class="auth-form">
      <h2 class="auth-title">忘记密码</h2>
      <div class="form-group">
        <span class="icon-email auth-icon"></span>
        <input class="input-field" type="email" v-model="email" placeholder="请输入邮箱">
      </div>
      <div class="form-group">
        <span class="icon-password auth-icon"></span>
        <input class="input-field" type="password" autocomplete="new-password"
               v-model="password" placeholder="请输入新密码">
      </div>
      <div class="form-group">
        <span class="icon-verification-code auth-icon"></span>
        <input class="input-field input-code" type="text"
               v-model="code" placeholder="请输入验证码">
        <button class="button-base get-code" :disabled="button_disabled"
                :class="{ 'disabled-button': button_disabled }"
                @click.prevent="getCode">{{ button_text }}</button>
      </div>
      <button class="button-base auth-button reset-password"
              @click.prevent="resetPassword">重置密码</button>
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

const email = ref('');
const password = ref('');
const code = ref('');
const reset_success = ref(false);

const button_text = ref('获取');
const button_disabled = ref(false);
const count_down = ref(15);
const timer = ref(-1);

const modal_show = ref(false);
const modal_type = ref('');
const modal_message = ref('');

/* 调用弹窗 */
const showModal = (type, message, show) =>
{
  modal_type.value = type;
  modal_message.value = message;
  modal_show.value = show;
};

const countDown = () =>
{
  button_disabled.value = true;
  button_text.value = `${count_down.value}`;

  timer.value = setInterval
  (() => {
    count_down.value--;
    if (count_down.value > 0)
      button_text.value = `${count_down.value}`;
    else
    {
      clearInterval(timer.value);
      button_disabled.value = false;
      button_text.value = '获取';
      count_down.value = 15;
    }
  }, 1000);
};

const checkAuthInfo = () =>
{
  if (email.value === '' || password.value === '')
  {
    showModal('error', '邮箱或新密码不可为空', true);
    return false;
  }

  if (password.value.length < 3)
  {
    showModal('error', '密码不得少于三个字符', true);
    return false;
  }

  return true;
};

const getCode = async () =>
{
  if (button_disabled.value)
    return;
  if (!checkAuthInfo())
    return;
  countDown();    /* 开始计时 */
  console.log('正在获取验证码...');
  const data = { 'email': email.value };
  try
  {
    const response = await axios.post
    (
        API.POST_default_send_verification_code,
        data,
        { headers: { 'Content-Type': 'application/json' } }
    );

    if (response.status === 200)
    {
      console.log('验证码发送成功', response.data);
      showModal('success', '验证码发送成功，请注意查收', true);
    }
  }
  catch (error)
  {
    console.error('验证码发送失败：', error.response ? error.response.data : error.message);
    showModal('error', '验证码发送失败，请稍后再试', true);
  }
};

const resetPassword = async () =>
{
  if (!checkAuthInfo())
    return;

  if (code.value === '')
  {
    showModal('error', '未输入验证码',true);
    return;
  }

  const data =
      {
        'email': email.value,
        'password': password.value,
        'is_active': true,
        'is_superuser': false,
        'is_verified': false,
        'verification_code': code.value,
      };

  try
  {
    const response = await axios.post
    (
        API.POST_default_forget_password,
        data,
        { headers: { 'Content-Type': 'application/json' } }
    );

    if (response.status === 200)
    {
      console.log('密码重置成功', response.data);
      reset_success.value = true;
      showModal('success', '密码重置成功，点击前往登录', true);
    }
  }
  catch (error)
  {
    console.error('密码重置失败：', error.response ? error.response.data : error.message);

    switch (error.response.status)
    {
      case 400:
        showModal('error', '密码重置失败：验证码错误', true);
        break;
      default:
        showModal('error', '密码重置失败，请稍后再试', true);
        break;
    }
  }
};

const handleEnsure = () =>
{
  if (reset_success.value)
  {
    console.log('密码重置成功，即将跳转到登录');
    Router.toLogin();
  }
};
</script>

<style scoped>
@import url("../components/css/Style-Auth.css");

.button-base.auth-button.reset-password
{
  padding: 10px;
  margin-top: 10px;
}
</style>