<template>
  <div v-show="quest_show" class="questionnaire">
    <div class="quest-main">
      <h2 class="quest-title">{{ curr_quest['title'] }}</h2>
      <h3 class="quest-desc">{{ curr_quest['desc'] }}</h3>
      <div class="quest-underline"></div>
      <div v-for="(question, x) in curr_question_list" :key="x" class="question-part">
        <div class="question-card">
          <div class="question-info">
            <label class="question-index">{{x+1}}.</label>
            <label class="question-desc">{{ question['title'] }}</label>
          </div>
          <div class="question-options">
            <label v-if="question['question_type'] === 1" v-for="(option, y) in question['options']" :key="y"
                   class="option-group">
              <input v-if="curr_question_answer_list[x] === y" type="radio" :value=y v-model="curr_question_answer_list[x]"
                     class="icon-single-choice-checked choice-icon"/>
              <input v-else type="radio" :value=y v-model="curr_question_answer_list[x]"
                     class="icon-single-choice-unchecked choice-icon"/>
              {{option['title']}}
            </label>
            <label v-if="question['question_type'] === 2" v-for="(option, y) in question['options']" :key="y"
                   class="option-group">
              <input v-if="curr_question_answer_list[x].includes(y)" type="checkbox" :value=y v-model="curr_question_answer_list[x]"
                     class="icon-multi-choice-checked choice-icon"/>
              <input v-else type="checkbox" :value=y v-model="curr_question_answer_list[x]"
                     class="icon-multi-choice-unchecked choice-icon"/>
              {{option['title']}}
            </label>
            <textarea v-if="question['question_type'] === 3" v-model="curr_question_answer_list[x]"
                      class="fill-blank-area"></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import { useRoute } from 'vue-router';
import axios from "axios";
import API from "@/components/js/API.js";

const route = useRoute();
let id = ref('');

const curr_quest = ref({});    /* 当前问卷信息 */
const curr_question_list = ref([]);    /* 当前问卷问题列表 */

let curr_question_answer_list = ref([]);    /* 当前问卷答案列表 */
let quest_show = ref(true);

onMounted
(() =>
{
  initQuest();    /* 装载问卷信息 */
});

const initQuest = async () =>
{
  try
  {
    id.value = route.params.id;
    const quest_url = API.GET_quest_list.replace('{id}', id.value);
    const quest_res = await axios.get(quest_url);
    const questions_url = API.GET_question_list.replace('{id}', id.value);
    const question_res = await axios.get(questions_url);

    if (quest_res.status === 200 && question_res.status === 200)
    {
      curr_quest.value = quest_res.data;
      console.log('问卷内容获取成功：', curr_quest.value);

      curr_question_list.value = question_res.data
      console.log('问题列表获取成功：', curr_question_list.value);

      for (let i = 0; i < curr_question_list.value.length; i++)
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
  catch (error)
  {
    console.log('问卷内容获取失败：', error.response ? error.response.data : error.message);
  }
};
</script>

<style scoped>
@import url('@/components/css/Style-Quest.css');

.questionnaire
{
  position: fixed;
  top: 200%;
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
  width: 70%;
}
</style>