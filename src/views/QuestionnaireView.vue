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
                <input v-if="curr_question_answer_list[x] === option['id']" type="radio" 
                       :value="option['id']" v-model="curr_question_answer_list[x]"
                      class="icon-single-choice-checked choice-icon"/>
                <input v-else type="radio" :value="option['id']" v-model="curr_question_answer_list[x]"
                      class="icon-single-choice-unchecked choice-icon"/>
                {{option['title']}}
              </label>
            </template>
            <template v-if="question['question_type'] === 2">
              <label v-for="(option, y) in question['options']" :key="y"
                   class="option-group">
                <input v-if="curr_question_answer_list[x].includes(option['id'])" type="checkbox" 
                       :value="option['id']" v-model="curr_question_answer_list[x]"
                      class="icon-multi-choice-checked choice-icon"/>
                <input v-else type="checkbox" :value="option['id']" v-model="curr_question_answer_list[x]"
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
  <!-- 弹窗：问卷错误/提交成功 -->
  <InfoModal
      v-if="to_show"
      :type="to_type"
      :message="to_message"
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

const curr_quest = ref({});    /* 当前问卷信息 */
const curr_question_list = ref([]);    /* 当前问卷问题列表 */
const curr_question_answer_list = ref([]);    /* 当前问卷答案列表 */
const quest_show = ref(false);    /* 是否显示问卷 */

const modal_show = ref(false); 
const modal_type = ref(''); 
const modal_message = ref('');
const submit_show = ref(false);
const to_show = ref(false);
const to_type = ref('');
const to_message = ref('');

const curr_ip = ref('');

onMounted
(async () =>
{
  window.addEventListener('hashchange', handleHashChange);
  await initQuest();    /* 装载问卷信息 */
  await initQuestions();    /* 装载问卷问题 */
  await getIP();    /* 获取IP地址 */
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
        showTo('error', '问卷未发布或已暂停', true);
      }
    }
  }
  catch (error)
  {
    console.error('问卷内容获取失败：', error.response ? error.response.data : error.message);
    showTo('error', '问卷未找到', true);
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

const showTo = (type, message, show) =>
{
  to_type.value = type;
  to_message.value = message;
  to_show.value = show;
};

const showSubmit = () => 
{ 
  if (route.name === 'view')
  {
    showModal('error', '预览状态下无法提交问卷！', true);
    return;
  }

  submit_show.value = true; 
};
const submitAnswers = async () =>
{
  if (route.name === 'view') return;
  if (!checkRequiredQuestions()) return;

  const submit_time = new Date().toLocaleString();
  console.log('提交时间：', submit_time);

  let answer = [];

  for (let i = 0; i < curr_question_answer_list.value.length; i++)
  {
    switch (curr_question_list.value[i]['question_type'])
    {
      case 1:    /* 单选题 */
        answer.push
        ({
          'question_id': curr_question_list.value[i]['id'],
          'question_type': curr_question_list.value[i]['question_type'],
          'answer_option': [curr_question_answer_list.value[i]],
          'answer_text': '',
          'ip_address': curr_ip.value,
          'create_time': submit_time,
        });
        break;
      case 2:    /* 多选题 */
        answer.push
        ({
          'question_id': curr_question_list.value[i]['id'],
          'question_type': curr_question_list.value[i]['question_type'],
          'answer_option': curr_question_answer_list.value[i],
          'answer_text': '',
          'ip_address': ip_address.value,
          'create_time': submit_time,
        });
        break;
      case 3:    /* 填空题（不为空时上传答案） */
        if (curr_question_answer_list.value[i] !== '')
        {
          answer.push
          ({
            'question_id': curr_question_list.value[i]['id'],
            'question_type': curr_question_list.value[i]['question_type'],
            'answer_option': [0],
            'answer_text': curr_question_answer_list.value[i],
            'ip_address': ip_address.value,
            'create_time': submit_time,
          });
        }
        break;
      default: break;
    }
  }

  console.log('答案列表：', answer);

  try
  {
    const response = await axios.post
    (
      API.POST_answer_upload,
      answer,
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (response.status === 200)
    {
      console.log('提交问卷成功：', response.data);
      showTo('success', '提交问卷成功！', true);
    }
  }
  catch (error)
  {
    console.error('提交问卷失败：', error.response ? error.response.data : error.message);
    showModal('error', '提交问卷失败，请稍后再试', true);
  }
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
            return false;
          }
          break;
        case 2:
          if (curr_question_answer_list.value[i].length === 0)
          {
            showModal('error', '第' + (i + 1) + '题是必答题，请填写！', true);
            window.location.hash = `#question-${i + 1}`;
            return false;
          }
          break;
        case 3:
          if (curr_question_answer_list.value[i] === '')
          {
            showModal('error', '第' + (i + 1) + '题是必答题，请填写！', true);
            window.location.hash = `#question-${i + 1}`;
            return false;
          }
          break;
        default: break;
      }
    }
  }

  return true;    /* 所有必答题目均已回答 */
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

const getIP = async () =>
{
  try 
  {
    const response = await axios.get('https://api.ipify.org?format=json');
    curr_ip.value = response.data['ip'];
    console.log('IP地址：', curr_ip.value);
  }
  catch (error)
  {
    console.error('获取IP地址失败：', error.response ? error.response.data : error.message);
    curr_ip.value = '';
  }
};
</script>

<style scoped>
@import url('../components/css/Style-Quest.css');

.questionnaire
{
  position: absolute;
  background-color: var(--color-base);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow: auto;
}

.quest-main
{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 60%;
  margin-top: 40px;
  background-color: transparent;
}

.question-card
{
  margin-left: 7.5%;
  margin-bottom: 20px;
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
</style>