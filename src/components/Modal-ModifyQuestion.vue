<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal" @click.stop>
      <h2>添加问题</h2>
      <div class="form-group form-desc">
        <span class="icon-desc"></span>
        <label for="question_desc">问题描述</label>
        <textarea class="input-desc" id="question_desc" v-model="desc"></textarea>
      </div>
      <div class="form-group">
        <span class="icon-type"></span>
        <label>问题类型</label>
        <select class="icon-arrow-down question_type" @click="type = $event.target.value" v-model="type">
          <option value="single_choice">单选题</option>
          <option value="multi_choice">多选题</option>
          <option value="fill_blank">填空题</option>
        </select>
      </div>
      <div class="form-group">
        <span class="icon-required"></span>
        <label>是否必填</label>
        <label class="radio"><input type="radio" value=true v-model="required"/>是</label>
        <label class="radio"><input type="radio" value=false v-model="required"/>否</label>
      </div>
      <div v-if="type === 'single_choice' || type === 'multi_choice'" class="form-group form-options">
        <div class="form-group form-options-title">
          <span class="icon-option"></span>
          <label>编辑选项</label>
          <div><button class="button-base" @click="addOption">添加选项</button></div>
        </div>
        <div class="options-list">
          <div class="form-group option-part" v-for="(options, index) in options" :key="index">
            <span class="icon-arrow-right"></span>
            <label>选项{{index+1}}</label>
            <input type="text" v-model="options[index]" placeholder="请输入选项内容"/>
            <button @click="removeOption(index)">删除</button>
          </div>
        </div>
      </div>
      <div>
        <button class="button-base submit-button" type="submit" @click.prevent="submitQuestion">确定</button>
        <button class="button-base cancel-button" @click="close">取消</button>
      </div>
    </div>
  </div>
  <!-- 弹窗：信息 -->
  <InfoModal
      v-if="modal_show"
      :type="modal_type"
      :message="modal_message"
      @close="modal_show = false"
      visible/>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import InfoModal from "@/components/Modal-Info.vue";

const props = defineProps
({
  visible: { type: Boolean, required: true, default: false },
  quest_desc: { type: String, required: false, default: '' },
  quest_type: { type: String, required: false, default: '' },
  quest_required: { type: Boolean, required: false, default: null },
  quest_options: { type: Array, required: false, default: [] }
});

const emit = defineEmits(['submit', 'close']);

let modal_show = ref(false);
let modal_type = ref('');
let modal_message = ref('');

let desc = ref(props.quest_desc);
let type = ref(props.quest_type);
let required = ref(props.quest_required);
let options = ref(props.quest_options);

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

const close = () =>
{
  emit('close');
};

const handleKeydown = (event) =>
{
  if (event.key === 'Escape')
    close();
};

const addOption = () =>
{
  options.value.push({});
};

const removeOption = (index) =>
{
  options.value.splice(index, 1);
};

const submitQuestion = () =>
{
  if (desc.value === '')
  {
    showModal('error', '问题描述不可为空', true);
    return;
  }

  if (type.value === '')
  {
    showModal('error', '请选择问题类型', true);
    return;
  }

  if (required.value === null)
  {
    showModal('error', '请选择是否必填', true);
    return;
  }

  if (type.value === 'single_choice' || type.value === 'multi_choice')
  {
    if (options.value.length === 0)
    {
      showModal('error', '请至少添加一个选项', true);
      return;
    }

    for (let i = 0; i < options.value.length; i++)
    {
      if (options.value[i] === '')
      {
        showModal('error', '选项内容不可为空', true);
        return;
      }
    }
  }

  const data =
      {
        'desc': desc.value,
        'type': type.value,
        'required': required.value,
        'options': options.value
      };

  emit('submit', data);

  close();
};
</script>

<style scoped>
@import url('@/components/css/Style-Modal.css');

.modal
{
  width: 800px;
  height: auto;
}

.form-group
{
  justify-content: flex-start;
}

.form-group span
{
  background-size: cover;
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

.form-group label
{
  margin-right: 10px;
  font-weight: bold;
}

.icon-arrow-down.question_type
{
  width: 125px;
  height: 30px;
  border-radius: var(--border-radius);
  border: 1px solid var(--color-fill);
  font-size: 16px;
  /* 清除默认样式 */
  appearance:none;
  -moz-appearance:none;
  -webkit-appearance:none;
  /* 下拉箭头图片 */
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px;
}

.question_type option
{
  font-size: 16px;
  text-align: center;
}

.form-options
{
  flex-direction: column;
}

.form-group.form-options-title
{
  width: 100%;
}

.options-list
{
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
}

.form-group.option-part
{
  width: 100%;
  margin-bottom: 5px;
}

.option-part span
{
  background-size: cover;
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

.option-part label
{
  width: 8.75%;
}

.option-part input
{
  width: 72.5%;
  margin-right: 5px;
  font-size: 16px;
  box-sizing: border-box;
  border: 1px solid var(--color-fill);
  border-radius: var(--border-radius);
}

.option-part button
{
  width: 50px;
  height: 35px;
  background-color: var(--color-delete);
  color: var(--color-base);
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
}

.option-part button:hover
{
  background-color: var(--color-delete-darken);
}
</style>
