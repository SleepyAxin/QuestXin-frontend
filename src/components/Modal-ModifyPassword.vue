<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal" @click.stop>
      <h2>修改密码</h2>
      <div class="form-group">
        <span class="icon-password"></span>
        <label>原密码：</label>
        <input type="password" v-model="oldPassword" placeholder="请输入原密码">
      </div>
      <div class="form-group">
        <span class="icon-password"></span>
        <label>新密码：</label>
        <input type="password" v-model="newPassword" placeholder="请输入新密码">
      </div>
      <div>
        <button class="button-base submit-button" type="submit" @click.prevent="submitPassword">确定</button>
        <button class="button-base cancel-button" @click.prevent="close">取消</button>
      </div>
    </div>
  </div>
  <!-- 使用 Modal 组件 -->
  <Modal
      v-if="modal_show"
      :type="modal_type"
      :message="modal_message"
      @close="closeModal()"
      visible/>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref} from "vue";
import Modal from "@/components/Modal-Info.vue";

defineProps
({
  visible: { type: Boolean, required: true, default: false }
});

const emit = defineEmits(['submit', 'close']);

const modal_show = ref(false);
const modal_type = ref('');
const modal_message = ref('');

const oldPassword = ref('');
const newPassword = ref('');

onMounted(() =>
{
  document.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() =>
{
  document.removeEventListener('keydown', handleKeydown);
});

const showModal = (type, message, show) =>
{
  modal_type.value = type;
  modal_message.value = message;
  modal_show.value = show;
  document.removeEventListener('keydown', handleKeydown);
};

const closeModal = () =>
{
  document.addEventListener('keydown', handleKeydown);
  modal_show.value = false;
};

const handleKeydown = (event) =>
{
  if (event.key === 'Escape')
    close();
};

const close = () =>
{
  emit('close');
};

const submitPassword = () =>
{
  if (oldPassword.value === '' || newPassword.value === '')
  {
    console.log("提交失败：旧密码或新密码不可为空");
    showModal('error', '旧密码或新密码不可为空', true);
    return;
  }

  if (oldPassword.value.length < 3 || newPassword.value.length < 3)
  {
    console.log("提交失败：旧密码或新密码不得少于三个字符");
    showModal('error', '旧密码或新密码不得少于三个字符', true);
    return;
  }

  const password =
      {
        'password': oldPassword.value,
        'newPassword': newPassword.value
      };

  emit('submit', password);

  close();
}
</script>

<style scoped>
@import url('../components/css/Style-Modal.css');

.modal
{
  width: 400px;
  height: 200px;
}

.form-group
{
  width: 100%;
  justify-content: center;
}

.form-group span
{
  background-size: cover;
  width: 20px;
  height: 20px;
  margin: 0 8px 0 0;
}

.form-group label
{

  font-weight: bold;
}

.form-group input
{
  width: 60%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid var(--color-fill);
  border-radius: var(--border-radius);
}
</style>