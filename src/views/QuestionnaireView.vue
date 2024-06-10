<template>
  <div v-if="quest_show" class="questionnaire">
    <div class="quest-main">
      <h2 class="quest-title">{{ curr_quest['title'] }}</h2>
      <h3 class="quest-desc">{{ curr_quest['desc'] }}</h3>
      <div class="quest-underline"></div>
      <div v-for="(question, x) in curr_question_list" :key="x" class="question-part">
        <div class="question-card">
          <div class="question-info" :id="'question-' + (x + 1)">
            <label v-if="question['is_required'] === true" class="question-required">*</label>
            <h4 class="question-index">{{x+1}}.</h4>
            <label class="question-desc">{{ question['title'] }}</label>
          </div>
          <div class="question-options">
            <template v-if="question['question_type'] === 1">
              <label v-for="(option, y) in question['options']" :key="y"
                   class="option-group">
                <input v-if="curr_question_answer_list[x] === y" type="radio" :value=y v-model="curr_question_answer_list[x]"
                      class="icon-single-choice-checked choice-icon"/>
                <input v-else type="radio" :value=y v-model="curr_question_answer_list[x]"
                      class="icon-single-choice-unchecked choice-icon"/>
                {{option['title']}}
              </label>
            </template>
            <template v-if="question['question_type'] === 2">
              <label v-for="(option, y) in question['options']" :key="y"
                   class="option-group">
                <input v-if="curr_question_answer_list[x].includes(y)" type="checkbox" :value=y v-model="curr_question_answer_list[x]"
                      class="icon-multi-choice-checked choice-icon"/>
                <input v-else type="checkbox" :value=y v-model="curr_question_answer_list[x]"
                      class="icon-multi-choice-unchecked choice-icon"/>
                {{option['title']}}
              </label>
            </template>
            <textarea v-if="question['question_type'] === 3" v-model="curr_question_answer_list[x]"
                      class="fill-blank-area"></textarea>
          </div>
        </div>
        <div class="opera-part">
            <button class="button-base edit-question-button" @click="clearOptions(x)">清除</button>
          </div>
      </div>
    </div>
    <button type="submit" class="button-base submit-button"
            @click.prevent="showSubmit">提交</button>
  </div>
  <InfoModal
      v-if="modal_show"
      :type="modal_type"
      :message="modal_message"
      @close="modal_show = false"
      visible/>
  <!-- 弹窗：提交问卷 -->
  <InfoModal
      v-if="submit_show"
      :type="'warning'"
      :message="'确定要提交吗'"
      :cancel="true"
      @submit="submitAnswers"
      @close="submit_show = false"
      visible/>
  <!-- 弹窗：问卷错误 -->
  <InfoModal
      v-if="error_show"
      :type="'error'"
      :message="error_message"
      @submit="Router.toHome()"
      @close="Router.toHome()"
      visible/>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from 'vue-router';
import axios from "axios";
import API from "@/components/js/API.js";
import Router from "@/components/js/Router.js";
import InfoModal from '@/components/Modal-Info.vue';

const route = useRoute();

let curr_quest = ref({});    /* 当前问卷信息 */
let curr_question_list = ref([]);    /* 当前问卷问题列表 */
let curr_question_answer_list = ref([]);    /* 当前问卷答案列表 */
let quest_show = ref(false);    /* 是否显示问卷 */

let modal_show = ref(false); 
let modal_type = ref(''); 
let modal_message = ref('');
let error_show = ref(false);
let error_message = ref('');
let submit_show = ref(false);

onMounted
(() =>
{
  window.addEventListener('hashchange', handleHashChange);
  initQuest();    /* 装载问卷信息 */
  initQuestions();    /* 装载问卷问题 */
});

const handleHashChange = () => 
  {
    const hash = window.location.hash;
    if (hash) 
    {
      const targetElement = document.querySelector(hash);
      if (targetElement)
        {
          targetElement.scrollIntoView({ behavior: 'smooth' });
          history.replaceState(null, null, ' ');      /* 清除历史哈希值 */
        }
    }
  };

const initQuest = async () =>
{
  try
  {
    const id = route.params.id.toString();
    const url = API.GET_quest_list.replace('{id}', id);
    const response = await axios.get(url);

    if (response.status === 200)
    {
      if (route.name === 'view' || (route.name === 'questionnaire' && response.data['status'] === 1))
      {
        curr_quest.value = response.data;
        quest_show.value = true;
        console.log('问卷内容获取成功：', curr_quest.value);
      }
      else
      {
        console.error('问卷内容获取失败：', '问卷未发布或已暂停');
        showError('问卷未发布或已暂停', true);
      }
    }
  }
  catch (error)
  {
    console.error('问卷内容获取失败：', error.response ? error.response.data : error.message);
    showError('问卷未找到', true);
  }
};

const initQuestions = async () =>
{
  try
  {
    const id = route.params.id.toString();
    const url = API.GET_question_list.replace('{id}', id);
      const response = await axios.get(url);

    if (response.status === 200)
    {
      if (route.name === 'view' || (route.name === 'questionnaire' && JSON.stringify(curr_quest.value) !== '{}'))
      {
        curr_question_list.value = response.data
        console.log('问题列表获取成功：', curr_question_list.value);
        for (let i = 0; i < response.data.length; i++)
        {
          switch (curr_question_list.value[i]['question_type'])
          {
            case 1: curr_question_answer_list.value.push(-1); break;
            case 2: curr_question_answer_list.value.push([]); break;
            case 3: curr_question_answer_list.value.push(''); break;
            default: break;
          }
        }
        console.log('答案列表初始化成功：', curr_question_answer_list.value);
      }
    }
  }
  catch (error)
  {
    console.log('问题列表获取失败：', error.response ? error.response.data : error.message);
  }
};

const showModal = (type, message, show) =>
{
  modal_type.value = type;
  modal_message.value = message;
  modal_show.value = show;
};

const showError = (message, show) =>
{
  error_message.value = message;
  error_show.value = show;
};

const showSubmit = () => { submit_show.value = true; };
const submitAnswers = async () =>
{
  if (route.name === 'view')
  {
    showModal('error', '预览状态下无法提交问卷！', true);
    return;
  }
  console.log('提交问卷：', curr_question_answer_list.value);
  checkRequiredQuestions();
};

/* 检查必答题目并跳转到未填写的题目位置 */
const checkRequiredQuestions = () => 
{
  for (let i = 0; i < curr_question_list.value.length; i++)
  {
    if (curr_question_list.value[i]['is_required'])
    {
      switch (curr_question_list.value[i]['question_type'])
      {
        case 1:
          if (curr_question_answer_list.value[i] === -1) 
          {
            showModal('error', '第' + (i + 1) + '题是必答题，请填写！', true);
            window.location.hash = `#question-${i + 1}`;
            return;
          }
          break;
        case 2:
          if (curr_question_answer_list.value[i].length === 0)
          {
            showModal('error', '第' + (i + 1) + '题是必答题，请填写！', true);
            window.location.hash = `#question-${i + 1}`;
            return;
          }
          break;
        case 3:
          if (curr_question_answer_list.value[i] === '')
          {
            showModal('error', '第' + (i + 1) + '题是必答题，请填写！', true);
            window.location.hash = `#question-${i + 1}`;
            return;
          }
          break;
        default: break;
      }
    }
  }
};

const clearOptions = (index) =>
{
  switch (curr_question_list.value[index]['question_type']) 
  {
    case 1: curr_question_answer_list.value.splice(index, 1, -1); break;
    case 2: curr_question_answer_list.value.splice(index, 1, []); break;
    case 3: curr_question_answer_list.value.splice(index, 1, ''); break;
    default: break;
  }
};
</script>

<style scoped>
@import url('@/components/css/Style-Quest.css');

.questionnaire
{
  position: absolute;
  top: 70px;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: auto;
}

.quest-main
{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 60%;
  background-color: transparent;
}

.question-card
{
  margin-left: 7.5%;
  width: 70%;
}

.button-base.submit-button
{
  width: 150px;
  height: 50px;
  margin-top: 20px;
  margin-bottom: 40px;
  font-size: 20px;
}

.info-card
{
  position: fixed;
  top: 800%;
  left: 50%;
  width: 400px;
  height: 200px;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--color-base);
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px var(--color-shadow);
}

.info-card label
{
  font-size: 24px;
  font-weight: bold;
}
</style>