<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal" @click.stop>
      <span class="icon-warning icon"></span>
      <p class="modal-message">确定要删除当前问卷吗？</p>
      <div class="form-actions">
        <button class="button-base ensure-button" @click="clickDeleteQuest">确定</button>
        <button class="button-base cancel-button" @click="close">取消</button>
      </div>
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
        visible: {type: Boolean, required: true, default: false},
      },

  methods:
      {
        clickDeleteQuest()
        {
          this.$emit('deleteQuest');
          this.close();
        },

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

.form-actions
{
  display: flex;
  justify-content: flex-end;
}

.ensure-button
{
  margin-right: 8px;
  padding: 8px 16px;
}

.cancel-button
{
  margin-left: 8px;
  padding: 8px 16px;
  color: black;
  background-color: transparent;
  border: 1px solid var(--color-fill);;
}

.cancel-button:hover
{
  background: var(--color-shadow);
}
</style>
