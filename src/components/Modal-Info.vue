<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal" @click.stop>
      <!-- 普通 -->
      <span v-if="type === 'normal'" class="icon-normal icon"></span>
      <!-- 成功 -->
      <span v-else-if="type === 'success'" class="icon-success icon"></span>
      <!-- 警告 -->
      <span v-else-if="type === 'warning'" class="icon-warning icon"></span>
      <!-- 删除 -->
      <span v-else-if="type === 'delete'" class="icon-warning icon"></span>
      <!-- 错误 -->
      <span v-else-if="type === 'error'" class="icon-error icon"></span>
      <!-- 其它（普通） -->
      <span v-else class="icon-normal icon"></span>
      <p class="modal-message" v-html="message"></p>
      <div class="button-group">
        <button v-if="type === 'delete'" class="button-base submit-button delete-button"
                type="submit" @click="submitEnsure">{{ ensure_text }}</button>
        <button v-else class="button-base submit-button"
                type="submit" @click="submitEnsure">{{ ensure_text }}</button>
        <button v-if="cancel" class="button-base cancel-button" @click="close">取消</button>
      </div>
    </div>
  </div>
</template>


<script setup>
import { onMounted, onBeforeUnmount } from 'vue';

defineProps
({
  visible: { type: Boolean, required: true, default: false },
  message: { type: String, required: true, default: '' },
  type: { type: String, required: true, default: '' },
  ensure_text: { type: String, required: false, default: '确定'  },
  cancel: { type: Boolean, required: false ,default: false }
});

const emit = defineEmits(['submit', 'close']);

onMounted(() =>
{
  document.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() =>
{
  document.removeEventListener('keydown', handleKeydown);
});

const close = () => { emit('close'); };

const handleKeydown = (event) =>
{
  if (event.key === 'Escape')
    close();
};

const submitEnsure = () =>
{
  emit('submit');
  close();
};
</script>

<style scoped>
@import url('../components/css/Style-Modal.css');

.modal
{
  width: 300px;
  height: 200px;
  padding: 5px 5px;
}

.icon
{
  background-size: cover;
  width: 50px;
  height: 50px;
  margin: 0 0 15px;
}

.modal-message
{
  margin: 0 0 20px;
  text-align: center;
}

.button-group
{

  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.button-base.submit-button.delete-button
{
  background-color: var(--color-delete);
}

.button-base.submit-button.delete-button:hover
{
  background-color: var(--color-delete-darken);
}
</style>
