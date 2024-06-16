<template>
  <header>
    <div class="left-box">
      <div class="img-logo" @click="Router.toHome"></div>
      <button class="web-title" @click="Router.toHome">问卷鑫</button>
    </div>
    <div v-if="user_info !== null" ref="dropdown_container">
      <div class="right-box user-box" @click="toggleDropdown">
        <span class="icon-user icon"></span>
        <button class="mine">我的</button>
      </div>
      <button class="dropdown" v-if="show_dropdown">
        <button @click="handleAction('user_info')">用户信息</button>
        <button @click="handleAction('quest_manage')">问卷管理</button>
      </button>
    </div>
    <!-- 未检测到用户登录，显示登录/注册按钮 -->
    <div v-else class="right-box">
      <div class="group">
        <button class="to-button-base to-auth-button"
                :class="{'active-link': $route.name === 'login'}"
                @click="Router.toLogin">登录</button>
      </div>
      |
      <div class="group">
        <button class="to-button-base to-auth-button"
                :class="{'active-link': $route.name === 'register'}"
                @click="Router.toRegister">注册</button>
      </div>
    </div>
    <!-- 渲染当前路由对应的组件内容 -->
    <router-view/>
  </header>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import Router from '@/components/js/Router.js';
import Cookie from "@/components/js/Cookie.js";

const store = useStore();
const user_info = computed(() => store.getters.getUserInfo);

const show_dropdown = ref(false);
const dropdown_container = ref(null);

onMounted(() =>
{
  store.dispatch('updateUserInfo', Cookie.getUserInfoFromCookie());
  window.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() =>
{
  window.removeEventListener('click', handleClickOutside);
});

const handleClickOutside = (event) =>
{
  if (dropdown_container.value && !dropdown_container.value.contains(event.target))
    show_dropdown.value = false;
};

const toggleDropdown = () => { show_dropdown.value = !show_dropdown.value };

const handleAction = (action) =>
{
  switch (action)
  {
    case 'user_info':
      Router.toUser();
      break;
    case 'quest_manage':
      Router.toQuest();
      break;
    default:
      break;
  }
  show_dropdown.value = false;
};
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
  margin: 0;
}

.web-title
{
  background-color: transparent;
  border: none;
  font-size: 22px;
  font-weight: bold;
  cursor: pointer;
}

.right-box.user-box
{
  width: 100px;
  cursor: pointer;
}

.mine
{
  background-color: var(--color-base);
  border: none;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
}

.dropdown 
{
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 20px;
  margin-top: 20px;
  padding: 7px 10px;
  background-color: var(--color-base);
  border: none;
  border-radius: var(--border-radius);
  box-shadow: 0 2px 10px var(--color-shadow);
  z-index: 1000;
}

.dropdown button
{
  border: none;
  border-radius: var(--border-radius);
  background-color: transparent;
  font-size: 16px;
  margin-top: 3px;
  margin-bottom: 3px;
  padding: 5px 10px;
}

.dropdown button:hover
{
  background-color: var(--color-shadow);
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
  margin: 0;
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