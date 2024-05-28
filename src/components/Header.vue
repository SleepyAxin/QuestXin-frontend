<template>
  <header>
    <div class="left-box">
      <div class="img-logo" @click="toHome"></div>
      <button class="web-title" @click="toHome">问卷鑫</button>
    </div>
    <!-- 检测到用户登录，显示用户操作按钮 -->
    <div v-if="user_info !== null" class="right-box">
      <div v-if="this.$route.name !== 'quest'" class="container">
        <span class="icon-quest icon"></span>
        <button class="to-button-base button" @click="toQuest">问卷管理</button>
      </div>
      <div class="blank"></div>
      <div class="container">
        <span class="icon-user icon"></span>
        <button class="to-button-base button" @click="clickShowUserCard">用户信息</button>
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
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import Router from '@/components/js/Router.js';
import Cookie from "@/components/js/Cookie.js";

export default
{
  created()
  {
    this.checkUserInfo()
  },

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
          this.updateUserInfo(Cookie.getUserInfoFromCookie());
        },

        clickShowUserCard()
        {
          this.$emit('showUserCard');
        }
      }
}
</script>

<style scoped>
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
  box-shadow: 0 2px 4px var(--color-shadow);
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

  cursor: pointer;
}

.web-title
{
  background-color: transparent;
  border: none;

  font-size: 22px;
  font-weight: bold;

  cursor: pointer;
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
  background-position: center;
  width: 28px;
  height: 28px;
}

.button
{
  font-size: 18px;
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
  font-size: 18px;
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