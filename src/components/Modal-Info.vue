<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal" @click.stop>
      <!-- 普通 -->
      <span v-if="type === 'normal'" class="icon-normal icon"></span>
      <!-- 成功 -->
      <span v-else-if="type === 'success'" class="icon-success icon"></span>
      <!-- 警告 -->
      <span v-else-if="type === 'warning'" class="icon-warning icon"></span>
      <!-- 错误 -->
      <span v-else-if="type === 'error'" class="icon-error icon"></span>
      <!-- 其它（普通） -->
      <span v-else class="icon-normal icon"></span>
      <p class="modal-message">{{ message }}</p>
      <button class="button-base modal-close" @click="close">确定</button>
    </div>
  </div>
</template>

<script>
export default
{
  mounted()
  {
    document.addEventListener('keydown', this.handleKeydown);
  },

  beforeUnmount()
  {
    document.removeEventListener('keydown', this.handleKeydown);
  },

  props:
      {
        visible: { type: Boolean, required: true, default: false },
        message: { type: String, required: true, default: '' },
        type: { type: String, required: true, default: '' }
      },

  methods:
      {
        close()
        {
          this.$emit('close');
        },

        handleKeydown(event)
        {
          if (event.key === 'Escape')
            this.close();
        }
      }
}
</script>

<style scoped>
.modal-overlay
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

.modal
{
  background: var(--color-base);
  padding: 20px;
  border-radius: var(--border-radius);
  width: 300px;
  height: 175px;
  box-shadow: 0 2px 4px var(--color-shadow);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.icon
{
  background-size: cover;
  width: 50px;
  height: 50px;
  margin-bottom: 15px;
}

.modal-message
{
  margin: 0 0 20px;
  text-align: center;
}

.modal-close
{
  display: block;
}
</style>
