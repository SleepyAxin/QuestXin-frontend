<template>
  <div v-if="visible" class="user-card-overlay">
    <div class="user-card" @click.stop>
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
        <button class="to-button-base button-opera">修改密码</button>
        <button class="to-button-base button-opera">登出</button>
        <button class="to-button-base button-opera">删除账号</button>
        <button class="button-base user-card-close" @click="close">关闭</button>
      </div>
    </div>
  </div>
  <InfoModal
      v-if="modal_show"
      :type="modal_type"
      :message="modal_message"
      @close="modal_show = false"
  visible/>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useStore } from "vuex";
import axios from "axios";
import InfoModal from "@/components/Modal-Info.vue";
import API from "@/components/js/API.js";

const store = useStore();
const user_info = store.getters.getUserInfo;

let modal_show = ref(false);
let modal_type = ref('');
let modal_message = ref('');

const emit = defineEmits(['close']);

defineProps
({
  visible: { type: Boolean, required: true, default: false }
});

onMounted(() =>
{
  document.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() =>
{
  document.removeEventListener('keydown', handleKeydown);
});

const close = () =>
{
  emit('close');
};

const handleKeydown = (event) =>
{
  if (event.key === 'Escape')
    close();
};

const showInfoModal = (type, message, show) =>
{
  modal_type.value = type;
  modal_message.value = message;
  modal_show.value = show;
};

const forgetPassword = async () =>
{
  const token = user_info['token'];
  const data = { 'email': user_info['email'] };

  try
  {
    const response = await axios.post
    (
        API.POST_auth_forget_password,
        data,
        { headers: { 'Authorization': `Bearer ${token}` } }
    );

    if (response.status === 202)
    {
      console.log('密码获取成功：', response);
      showInfoModal('success', '您的密码是：' + response.data, true);
    }
  }
  catch (error)
  {
    console.log('密码获取失败：', error);

    switch (error.response.status)
    {
      case 422:
        showInfoModal('error', '密码获取失败：格式错误', true);
        break;
      default:
        showInfoModal('error', '密码获取失败，请稍后再试', true);
        break;
    }
  }
};
</script>

<style scoped>
.user-card-overlay
{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--color-mask);
  display: flex;
  justify-content: center;
  align-items: center;
}

.user-card
{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  background: var(--color-base);
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

.button-opera
{
  font-size: 16px;
  margin-bottom: 15px;
}

.button-opera::after
{
  height: 7.5%;
}

.button-opera:hover::after
{
  transform: scaleX(0.9);    /* 鼠标移至按钮时显示下划线 */
}

.separator
{
  width: 0.5%;
  height: 100%;

  margin: 2.5% 2.5%; /* 设置上下的边距 */
  background-color: var(--color-fill);
}

.user-card-close
{
  padding: 8px 30px;
  transform: translateY(200%);
}
</style>