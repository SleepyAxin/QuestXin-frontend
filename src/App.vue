<template>
  <header>
    <div class="left-box">
      <div class="img-logo" @click="toHome"></div>
      <button class="web-title" @click="toHome">问卷鑫</button>
    </div>
    <!-- 检测到用户登录，显示用户操作按钮 -->
    <div v-if="user_info !== null" class="right-box-user">

    </div>
    <!-- 未检测到用户登录，显示登录/注册按钮 -->
    <div v-else class="right-box-auth">
      <div class="group">
        <button class="to-button-base to-button"
                :class="{'active-link': this.$route.path === '/login'}"
                @click="toLogin">登录</button>
      </div>
      |
      <div class="group">
        <button class="to-button-base to-button"
                :class="{'active-link': this.$route.path === '/register'}"
                @click="toRegister">注册</button>
      </div>
    </div>
    <!-- 渲染当前路由对应的组件内容 -->
    <router-view/>
  </header>
</template>

<script>
import Router from '@/components/js/Router.js';
import { getUserInfoFromCookie } from "@/components/js/Cookie.js";

export default
{
  data()
  {
    return{
      user_info: null
    }
  },

  mixins: [ Router ],

  computed:
      {
        isUserInfoExist()
        {
          return getUserInfoFromCookie() !== null;
        }
      },

  watch:
      {
        isUserInfoExist(oldValue, newValue)
        {
          if (this.isUserInfoExist)
            this.user_info = value;
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

.right-box-auth
{
  display: flex;
  flex-direction: row;
  align-items: center;

  margin-right: 1%;    /* 距离右边界距离 */

  border-radius: var(--border-radius);

  font-size: 20px;
  font-weight: bold;
}

.to-button
{
  font-size: 15px;
  font-weight: bold;
  position: relative;
}

.to-button::after
{
  height: 10%;
}

.to-button:hover::after
{
  transform: scaleX(0.8);    /* 鼠标移至按钮时显示下划线 */
}


.active-link
{
  color: var(--color-fill);
}
</style>