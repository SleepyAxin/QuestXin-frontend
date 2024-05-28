<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal" @click.stop>
      <h2>填写问卷信息</h2>
      <div class="form-group">
        <label for="title">问卷标题</label>
        <input class="input-title" type="text" id="title" v-model="title"/>
      </div>
      <div class="form-group form-description">
        <label for="description">问卷描述</label>
        <textarea class="input-description" id="description" v-model="description"></textarea>
      </div>
      <div class="form-actions">
        <button class="button-base submit-button" type="submit" @click.prevent="submitTitleDescription">确定</button>
        <button class="button-base cancel-button" @click="close">取消</button>
      </div>
    </div>
  </div>
  <!-- 使用 Modal 组件 -->
  <Modal
      v-if="modal_show"
      :type="modal_type"
      :message="modal_message"
      @close="modal_show = false"
      visible/>
</template>

<script>
import Modal from "@/components/Modal-Info.vue";

export default
{
  components: { Modal },
  emits: ['submit', 'close'],

  data()
  {
    return {
      title: this.quest_title,
      description: this.quest_description,

      /* 弹出式窗口 */
      modal_show: false,
      modal_type: '',
      modal_message: ''
    }
  },

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
        quest_title: { type: String, required: false, default: '' },
        quest_description: { type: String, required: false, default: '' }
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
        },

        /* 调用弹窗 */
        showModal(type, message, show)
        {
          this.modal_type = type;
          this.modal_message = message;
          this.modal_show = show;
        },

        submitTitleDescription()
        {
          if (this.title.trim() === '' || this.description.trim() === '')
          {
            console.log("提交失败：问卷标题或描述不可为空");
            this.showModal('error', '问卷标题或描述不可为空', true);
            return;
          }

          this.$emit
          ('submit',
              {
                title: this.title,
                desc: this.description
              }
          );
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
  width: 500px;
  height: 300px;
  box-shadow: 0 2px 4px var(--color-shadow);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-group
{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  width: 90%;
}

.form-group label
{
  margin-right: 10px;
}

.form-description
{
  height: 100%;
}

.input-title
{
  width: 80%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid var(--color-fill);
  border-radius: var(--border-radius);
}

.input-description
{
  font-size: 16px;
  width: 80%;
  height: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid var(--color-fill);
  border-radius: var(--border-radius);
  resize: none;    /* 禁止调整大小 */
}

.form-actions
{
  display: flex;
  justify-content: flex-end;
}

.submit-button
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
