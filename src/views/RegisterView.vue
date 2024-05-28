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
      <button class="to-button-base auth-to-button" @click="toLogin">已有账号？点此登录</button>
    </form>
  </div>
  <!-- 使用 Modal 组件 -->
  <Modal
      v-if="modal_show"
      :type="modal_type"
      :message="modal_message"
      @close="modal_show = false"
      visible/>
</template>

<script>
import axios from "axios";

import Modal from '@/components/Modal-Info.vue';

import Router from '@/components/js/Router.js';
import API from "@/components/js/API.js";

export default
{
  data()
  {
    return {
      email: '',
      password: '',
      passwordAgain: '',

      /* 弹出式窗口 */
      modal_show: false,
      modal_type: '',
      modal_message: ''
    }
  },

  mixins: [ Router ],

  components: { Modal },

  methods:
      {
        /* 调用弹窗 */
        showModal(type, message, show)
        {
          this.modal_type = type;
          this.modal_message = message;
          this.modal_show = show;
        },

        /* 检测用户信息合法性 */
        checkAuthInfo()
        {
          if (this.email === '' || this.password === '' || this.passwordAgain === '')
          {
            this.showModal('error', '邮箱或密码不可为空', true);

            return false;
          }

          if (this.password !== this.passwordAgain)
          {
            this.showModal('error', '密码不一致，请重新输入', true);

            this.password = '';
            this.passwordAgain = '';

            return false
          }

          if (this.password.length < 3)
          {
            this.showModal('error', '密码不得少于三个字符', true);

            return false;
          }

          return true;
        },

        /* 请求注册 */
        async register()
        {
          if (!this.checkAuthInfo())
            return;

          const data =
              {
                "email": this.email,
                "password": this.password,
                "is_active": true,
                "is_superuser": false,
                "is_verified": false
              };

          try
          {
            const response = await axios.post
            (
                API.URL_POST_auth_register,
                data,
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.status === 201)
            {
              console.log('用户注册成功：', response.data);

              this.showModal('success', '注册成功，点击前往登录', true);
            }
          }
          catch (error)
          {
            console.error('用户注册失败：', error.response ? error.response.data : error.message);

            switch (error.response.status)
            {
              case 400:
              {
                this.showModal('error', '注册失败，邮箱已被注册', true);
                break;
              }
              case 422:
              {
                this.showModal('error', '注册失败，邮箱名不合法', true);
                break;
              }
              default:
              {
                this.showModal('error', '注册失败，请稍后再试', true);
                break;
              }
            }
          }
        }
      },

  /* 监听 */
  watch:
      {
        modal_show(value)
        {
          /* 当注册成功且弹出窗口关闭后跳转到登录界面 */
          if (this.modal_type === 'success' && value === false)
            this.toLogin();
        }
      }
}
</script>

<style scoped>
@import url("../components/css/Style-Auth.css");
</style>