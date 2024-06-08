<template>
  <div class="user-card">
    <div class="info-part">
      <div class="icon-user icon-avatar"></div>
      <div class="info-group">
        <div class="icon-email icon-info"></div>
        <h2 class="text-type">邮箱：</h2>
        <h2 class="text-value">{{ user_info['email'] }}</h2>
      </div>
    </div>
    <!-- 分隔线 -->
    <div class="separator"></div>
    <div class="opera-part">
      <button class="to-button-base button-opera" @click="showModifyPassword">修改密码</button>
      <button class="to-button-base button-opera" @click="showLogout">登出</button>
      <button class="to-button-base button-opera button-delete" @click="showDeleteUser">删除账号</button>
      <button class="button-base user-card-close" @click="close">关闭</button>
    </div>
  </div>
  <InfoModal
      v-if="modal_show"
      :type="modal_type"
      :message="modal_message"
      @close="modal_show = false"
      visible/>
  <!-- 弹窗：修改密码 -->
  <ModifyPasswordModal
      v-if="modify_password_show"
      @submit="modifyPassword"
      @close="modify_password_show = false"
      visible/>
  <!-- 弹窗：登出 -->
  <InfoModal
      v-if="logout_show"
      :type="'warning'"
      :message="'确定要登出吗'"
      :cancel="true"
      @submit="logout"
      @close="logout_show = false"
      visible/>
</template>

<script setup>
import { ref } from "vue";
import {useStore} from "vuex";
import axios from "axios";
import InfoModal from "@/components/Modal-Info.vue";
import ModifyPasswordModal from '@/components/Modal-ModifyPassword.vue';
import API from "@/components/js/API.js";
import Cookie from '@/components/js/Cookie.js';
import Router from '@/components/js/Router.js';

const store = useStore();
let user_info = store.getters.getUserInfo;

let modal_show = ref(false);
let modal_type = ref('');
let modal_message = ref('');

let modify_password_show = ref(false);

let logout_show = ref(false);

defineProps
({
  visible: {type: Boolean, required: true, default: false}
});

const showInfoModal = (type, message, show) =>
{
  modal_type.value = type;
  modal_message.value = message;
  modal_show.value = show;
};

const showModifyPassword = () =>
{
  modify_password_show.value = true;
};
const modifyPassword = async (password) =>
{
  const token = user_info['token'];

  try {
    const response = await axios.post
    (
        API.POST_default_modify_password,
        password,
        {
          headers:
              {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
        }
    );

    if (response.status === 200)
    {
      console.log('密码修改成功：', response.data);
      showInfoModal('success', '密码修改成功', true);
    }
  }
  catch (error)
  {
    console.log('密码修改失败：', error.response ? error.response.data : error.message);

    switch (error.response.status)
    {
      case 400:
        showInfoModal('error', '密码修改失败：原密码错误', true);
        break;
      default:
        showInfoModal('error', '密码修改失败，请稍后再试', true);
        break;
    }
  }
};

const showLogout = () =>
{
  logout_show.value = true;
};
const logout = async () =>
{
  try
  {
    Cookie.clearUserInfoInCookie();
    const data = null;
    await store.dispatch('updateUserInfo', data);
    console.log('用户登出成功');
    Router.toHome();
  }
  catch (error)
  {
    console.log('用户登出失败：', error.response ? error.response.data : error.message);
    showInfoModal('error', '登出失败，请稍后再试', true);
  }
};
</script>

<style scoped>

.user-card
{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: var(--color-base);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 300px;
  padding: 20px;
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px var(--color-shadow);
}

.info-part
{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 60%;
  height: 100%;
  padding: 20px;
  border-radius: var(--border-radius);
}

.icon-avatar
{
  background-size: cover;
  width: 80px;
  height: 80px;
  margin: 0 0 15px;
}

.info-group
{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.icon-info
{
  background-size: cover;
  width: 25px;
  height: 25px;
  margin: 0 10px 0 0;
}

.text-type
{
  text-align: center;
  font-size: 15px;
}

.text-value
{
  text-align: center;
  font-size: 15px;
  font-weight: normal;
}

.opera-part
{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 25%;
  height: 100%;
  padding: 20px;
  border-radius: var(--border-radius);
}

.to-button-base.button-opera
{
  font-size: 16px;
  margin-bottom: 15px;
}

.to-button-base.button-opera::after
{
  height: 7.5%;
}

.to-button-base.button-opera:hover::after
{
  transform: scaleX(0.9);
}

.to-button-base.button-opera.button-delete
{
  color: var(--color-delete);
}

.to-button-base.button-opera.button-delete::after
{
  background-color: var(--color-delete)
}

.separator
{
  width: 0.5%;
  height: 100%;
  margin: 2.5% 2.5%;
  background-color: var(--color-fill);
}

.user-card-close
{
  padding: 8px 30px;
  transform: translateY(200%);
}
</style>