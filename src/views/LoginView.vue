<template>
  <div class="auth-box">
    <form class="image-form"></form>
    <!-- 分隔线 -->
    <div class="separator"></div>
    <form class="auth-form">
      <h2 class="auth-title">登录</h2>
      <div class="form-group">
        <!-- 用户图标 -->
        <span class="icon-email auth-icon"></span>
        <input class="input-field" type="email" id="email" v-model="email" placeholder="请输入用户名">
      </div>
      <div class="form-group">
        <!-- 密码图标 -->
        <span class="icon-password auth-icon"></span>
        <input class="input-field" type="password" id="password" v-model="password" placeholder="请输入密码">
      </div>
      <button type="submit" class="button-base" @click.prevent="postLogin">登录</button>
      <button class="to-button-base auth-to-button" @click="toRegister">没有账号？点此注册</button>
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
import axios from 'axios';
import qs from 'qs';
import { mapActions } from 'vuex';

import Modal from '@/components/Modal.vue';
import Router from '@/components/js/Router.js';
import API from '@/components/js/API.js';
import Cookie from '@/components/js/Cookie.js'

export default
{
  data()
  {
    return {
      email: '',
      password: '',

      /* 弹出式窗口 */
      modal_show: false,
      modal_type: '',
      modal_message: ''
    }
  },

  components: { Modal },

  mixins: [ Router ],

  methods:
      {
        ...mapActions(['updateUserInfo']),

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
          if (this.email === '' || this.password === '')
          {
            this.showModal('error', '邮箱或密码不可为空', true);

            return false;
          }

          return true;
        },

        /* 请求登录 */
        async postLogin()
        {
          if (!this.checkAuthInfo())
            return;

          const data = qs.stringify
              (
                  {
                    username: this.email,
                    password: this.password
                  }
              );

          try
          {
            const response = await axios.post
            (
                API.URL_POST_login,
                data,
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            );

            if (response.status === 200)
            {
              console.log('用户登录成功：', response.data);

              /* 在用户登录成功后调用saveUserInfoToCookie函数，将用户信息保存到Cookie中 */
              try
              {
                const the_user_info =
                    {
                      "token": response.data["access_token"],
                      "email": this.email
                    };

                await this.updateUserInfo(the_user_info);

                Cookie.saveUserInfoToCookie(the_user_info);

                if (Cookie.getUserInfoFromCookie() !== null)
                  console.log('保存Cookie成功：', the_user_info);
                else
                  console.log('保存Cookie失败：可能浏览器禁用了该网页的Cookie');
              }
              catch (error) { console.log('保存Cookie失败：', error); }

              this.showModal('success', '登录成功，点击确定前往首页', true);
            }
          }
          catch (error)
          {
            console.error('用户登录失败：', error.response ? error.response.data : error.message);

            switch (error.response.status)
            {
              case 400:
              {
                this.showModal('error', '登录失败，邮箱或密码错误', true);
                break;
              }
              case 422:
              {
                this.showModal('error', '登录失败，邮箱名不合法', true);
                break;
              }
              default:
              {
                this.showModal('error', '登录失败', true);
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
          /* 当登录成功且弹出窗口关闭后跳转到主界面 */
          if (this.modal_type === 'success' && value === false)
            this.toHome();
        }
      }
}
</script>

<style scoped>
@import url("../components/css/Style-Auth.css");
</style>