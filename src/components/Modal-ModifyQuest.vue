<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal" @click.stop>
      <h2>填写问卷信息</h2>
      <div class="form-group">
        <span class="icon-title"></span>
        <label>问卷标题</label>
        <input class="input-title" type="text" v-model="title"/>
      </div>
      <div class="form-group form-desc">
        <span class="icon-desc"></span>
        <label>问卷描述</label>
        <textarea class="input-desc" v-model="desc"></textarea>
      </div>
      <div>
        <button class="button-base submit-button" type="submit" @click.prevent="submitTitleDesc">确定</button>
        <button class="button-base cancel-button" @click.prevent="close">取消</button>
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

<script setup>
import { onBeforeUnmount, onMounted, ref} from "vue";
import Modal from "@/components/Modal-Info.vue";

const emit = defineEmits(['submit', 'close']);

const props = defineProps
({
  visible: { type: Boolean, required: true, default: false },
  quest_title: { type: String, required: false, default: '' },
  quest_desc: { type: String, required: false, default: '' }
});

let title = ref(props.quest_title);
let desc = ref(props.quest_desc);

let modal_show = ref(false);
let modal_type = ref('');
let modal_message = ref('');

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

const submitTitleDesc = () =>
{
  if (title.value === '' || desc.value === '')
  {
    console.log("提交失败：问卷标题或描述不可为空");
    showModal('error', '问卷标题或描述不可为空', true);
    return;
  }

  const quest =
      {
        'title': title.value,
        'desc': desc.value
      };

  emit('submit', quest);

  close();
}
</script>

<style scoped>
@import url('@/components/css/Style-Modal.css');

.modal
{
  width: 600px;
  height: 250px;
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
  margin-right: 10px;
  font-weight: bold;
}

.input-title
{
  font-size: 16px;
  width: 80%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid var(--color-fill);
  border-radius: var(--border-radius);
}
</style>
