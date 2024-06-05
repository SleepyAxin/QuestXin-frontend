<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal" @click.stop>
      <span class="icon-warning icon"></span>
      <p class="modal-message">{{ message }}</p>
      <div class="form-actions">
        <button class="button-base ensure-button" type="submit" @click.prevent="submitDeleteQuest">确定</button>
        <button class="button-base cancel-button" @click="close">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted } from "vue";

defineProps
({
  visible: { type: Boolean, required: true, default: false },
  message: { type: String, required: true, default: '' }
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

const handleKeydown = (event) =>
{
  if (event.key === 'Escape')
    close();
};

const close = () =>
{
  emit('close');
};

const submitDeleteQuest  = () =>
{
  emit('submit');
  close();
};
</script>

<style scoped>
@import url('@/components/css/Style-Modal.css');

.modal
{
  width: 300px;
  height: 175px;
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

.form-actions
{
  display: flex;
  justify-content: flex-end;
}

.button-base.ensure-button
{
  margin-right: 8px;
  padding: 8px 16px;
  background-color: var(--color-delete);
}

.button-base.ensure-button:hover
{
  background-color: var(--color-delete-darken);
}

.button-base.cancel-button
{
  margin-left: 8px;
  padding: 8px 16px;
  color: black;
  background-color: transparent;
  border: 1px solid var(--color-fill);;
}

.button-base.cancel-button:hover
{
  background: var(--color-shadow);
}
</style>
