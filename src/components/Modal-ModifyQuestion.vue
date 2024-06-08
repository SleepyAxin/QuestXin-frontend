<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal" @click.stop>
      <h2>添加问题</h2>
      <div class="form-group form-desc">
        <span class="icon-desc"></span>
        <label for="question_desc">问题描述</label>
        <textarea class="input-desc" v-model="title"></textarea>
      </div>
      <div class="form-group">
        <span class="icon-type"></span>
        <label>问题类型</label>
        <label class="radio">
          <input v-if="type === 1" class="icon-single-choice-checked radio-input"
                 type="radio" :value=1 v-model="type"/>
          <input v-else class="icon-single-choice-unchecked radio-input"
                 type="radio" :value=1 v-model="type"/>
          单选题
        </label>
        <label class="radio">
          <input v-if="type === 2" class="icon-single-choice-checked radio-input"
                 type="radio" :value=2 v-model="type"/>
          <input v-else class="icon-single-choice-unchecked radio-input"
                 type="radio" :value=2 v-model="type"/>
          多选题
        </label>
        <label class="radio">
          <input v-if="type === 3" class="icon-single-choice-checked radio-input"
                 type="radio" :value=3 v-model="type"/>
          <input v-else class="icon-single-choice-unchecked radio-input"
                 type="radio" :value=3 v-model="type"/>
          填空题
        </label>
      </div>
      <div class="form-group">
        <span class="icon-required"></span>
        <label>是否必填</label>
        <label class="radio">
          <input v-if="required === true" class="icon-single-choice-checked radio-input"
                 type="radio" :value=true v-model="required"/>
          <input v-else class="icon-single-choice-unchecked radio-input"
                 type="radio" :value=true v-model="required"/>
          是
        </label>
        <label class="radio">
          <input v-if="required === false" class="icon-single-choice-checked radio-input"
                 type="radio" :value=false v-model="required"/>
          <input v-else class="icon-single-choice-unchecked radio-input"
                 type="radio" :value=false v-model="required"/>
          否
        </label>
      </div>
      <div v-if="type === 1 || type === 2" class="form-group form-options">
        <div class="form-group form-options-title">
          <span class="icon-option"></span>
          <label>编辑选项</label>
          <div><button class="button-base" @click="addOption">添加选项</button></div>
        </div>
        <div class="options-list">
          <div class="form-group option-part" v-for="index in options.length" :key="index">
            <span class="icon-arrow-right"></span>
            <label>选项{{index}}</label>
            <input type="text" v-model="options[index-1]['title']" placeholder="请输入选项内容"/>
            <button @click="removeOption(index-1)">删除</button>
          </div>
        </div>
      </div>
      <div>
        <button class="button-base submit-button" type="submit" @click.prevent="submitQuestion">确定</button>
        <button class="button-base cancel-button" @click.prevent="close">取消</button>
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
  question_title: { type: String, required: false, default: '' },
  question_type: { type: Number, required: false, default: 0 },
  question_required: { type: Boolean, required: false, default: null },
  question_options: { type: Array, required: false, default: [] }
});

const emit = defineEmits(['submit', 'close']);

let modal_show = ref(false);
let modal_type = ref('');
let modal_message = ref('');

let title = ref(props.question_title);
let type = ref(props.question_type);
let required = ref(props.question_required);
let options = ref(props.question_options);

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
  if (title.value === '')
  {
    showModal('error', '问题描述不可为空', true);
    return;
  }

  if (type.value === 0)
  {
    showModal('error', '请选择问题类型', true);
    return;
  }

  if (required.value === null)
  {
    showModal('error', '请选择是否必填', true);
    return;
  }

  if (type.value === 1 || type.value === 2)
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

  const question =
      {
        'title': title.value,
        'type': type.value,
        'required': required.value,
        'options': options.value
      };

  emit('submit', question);
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

.question_type option
{
  font-size: 16px;
  text-align: center;
}

.radio
{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: safe center;
  cursor: pointer;
}

.icon-single-choice-unchecked.radio-input,
.icon-single-choice-checked.radio-input
{
  /* 清除默认样式 */
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  /* 自定义样式 */
  cursor: pointer;
  width: 25px;
  height: 25px;
  margin: 0 0 0 0;
  background-size: cover;
  background-position: center;
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
