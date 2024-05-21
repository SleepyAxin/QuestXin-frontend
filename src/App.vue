<template>
  <header>
    <div class="left-box">
      <div class="img-logo" @click="toHome"></div>
      <button class="web-title" @click="toHome">问卷鑫</button>
    </div>
    <!-- 检测到用户登录，显示用户操作按钮 -->
    <div v-if="user_info !== null" class="right-box">
      <div v-if="this.$route.name !== 'quest'" class="container">
        <span class="icon-user icon"></span>
        <button class="to-button-base button" @click="toQuest">问卷管理</button>
      </div>
      <div class="blank"></div>
      <div class="container">
        <span class="icon-user icon"></span>
        <button class="to-button-base button" @click="showUserCard">用户信息</button>
      </div>
    </div>
    <!-- 未检测到用户登录，显示登录/注册按钮 -->
    <div v-else class="right-box">
      <div class="group">
        <button class="to-button-base to-auth-button"
                :class="{'active-link': this.$route.name === 'login'}"
                @click="toLogin">登录</button>
      </div>
      |
      <div class="group">
        <button class="to-button-base to-auth-button"
                :class="{'active-link': this.$route.name === 'register'}"
                @click="toRegister">注册</button>
      </div>
    </div>
    <!-- 渲染当前路由对应的组件内容 -->
    <router-view/>
  </header>
  <!-- 使用用户卡片 -->
  <UserCard
      v-if="user_card_show"
      @close="user_card_show=false"
      visible></UserCard>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import Modal from "@/components/Modal.vue";
import UserCard from "@/components/UserCard.vue";
import Router from '@/components/js/Router.js';
import Cookie from "@/components/js/Cookie.js";

export default
{
  data()
  {
    return {
      /* 用户卡片 */
      user_card_show: false,
    }
  },

  created()
  {
    this.checkUserInfo()
  },

  components: { UserCard, Modal },

  mixins: [ Router ],

  computed:
      {
        ...mapGetters(['getUserInfo']),
        user_info()
        {
          return this.getUserInfo;
        }
      },

  methods:
      {
        ...mapActions(['updateUserInfo']),
        checkUserInfo()
        {
          /* 获取用户信息 */
          this.updateUserInfo(Cookie.getUserInfoFromCookie())
        },

        /* 调用用户卡片 */
        showUserCard()
        {
          /* 如果用户信息存在，允许访问用户卡片 */
          if (this.user_info !== null)
            this.user_card_show = true;
        }
      }
};
</script>

<style>
@import url("@/components/css/Assets.css");    /* 全局资源 */
@import url("@/components/css/Style.css");     /* 全局样式 */
@import url("@/components/css/Variable.css");    /* 全局变量 */

header
{
  padding: 10px;

  margin-top: 8px;    /* 距离网页顶端距离 */
  margin-left: 8px;   /* 距离网页左端距离 */
  margin-right: 8px;   /* 距离网页右端距离 */

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;    /* 使子元素两端对齐 */
  background-color: var(--color-base);
  border-radius: var(--border-radius);
}

body
{
  /* 网站背景图片 */
  background-image: var(--image-background);
  background-repeat: no-repeat;    /* 无重复 */
  background-size: cover;    /* 填充 */
  background-attachment: fixed;    /* 使背景图片填充整个页面 */
}

.left-box
{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  border-radius: var(--border-radius);

  margin-left: 1%;    /* 距离左边界距离 */
}

.img-logo
{
  background: var(--image-logo) no-repeat;
  background-size: cover;

  width: 30px;
  height: 30px;
}

.web-title
{
  background-color: transparent;
  border: none;

  font-size: 20px;
  font-weight: bold;
}

.right-box
{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  margin-right: 1%;    /* 距离右边界距离 */

  border-radius: var(--border-radius);

  font-size: 20px;
  font-weight: bold;
}

.container
{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.blank
{
  width: 5px;
}

.icon
{
  background-size: cover;
  width: 25px;
  height: 25px;
}

.button
{
  font-size: 15px;
  font-weight: bold;
}

.button::after
{
  height: 10%;
}

.button:hover::after
{
  transform: scaleX(0.9);    /* 鼠标移至按钮时显示下划线 */
}

.to-auth-button
{
  font-size: 15px;
  font-weight: bold;
  position: relative;
}

.to-auth-button::after
{
  height: 10%;
}

.to-auth-button:hover::after
{
  transform: scaleX(0.8);    /* 鼠标移至按钮时显示下划线 */
}

.active-link
{
  color: var(--color-fill);
}
</style>