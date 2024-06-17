<template>
  <div v-if="quest_show" class="questionnaire">
    <div class="quest-main">
      <h2 class="quest-title">{{ curr_quest['title'] }}</h2>
      <h3 class="quest-desc">{{ curr_quest['desc'] }}</h3>
      <div class="quest-underline"></div>
      <button class="button-base downlaod-button" @click="downloadExcel()">导出Excel</button>
      <div v-for="(question, x) in curr_question_list" :key="x" class="question-part">
        <div class="question-card">
          <div class="question-info" :id="'question-' + (x + 1)">
            <label v-if="question['is_required'] === true" class="question-required">*</label>
            <h4 class="question-index">{{x+1}}.</h4>
            <label class="question-desc">{{ question['title'] }}</label>
          </div>
          <div class="question-separator"></div>
          <div class="question-options">
            <template v-if="question['question_type'] !== 3">
              <label class="title-form">
                <label class="title-text">选项内容</label>
                <label class="result-text">选择次数</label>
                <label class="result-text">选择比例</label>
              </label>
              <label v-for="(option, y) in question['options']" :key="y" class="option-group">
                <label class="title-text">{{ y+1 }}. {{option['title']}}</label>
                <label class="result-text">{{ getOptionResult(option)['count'] }}</label>
                <label class="result-text">{{ getOptionResult(option)['percentage'] }}%</label>
              </label>
            </template>
          </div>
        </div>
        <div v-if="question['question_type'] !== 3" class="chart-button-group">
          <button class="button-base chart-button" @click="showChart(x, 'column')">柱状图</button>
          <button class="button-base chart-button" @click="showChart(x, 'bar')">条形图</button>
          <button class="button-base chart-button" @click="showChart(x, 'pie')">饼状图</button>
          <button class="button-base chart-button" @click="showChart(x, 'circle')">圆环图</button>
          <button class="button-base chart-button" @click="showChart(x, '')">隐藏图表</button>
        </div>
        <div v-else class="chart-button-group">
          <button v-if="chart_show[x] === true" class="button-base chart-button" 
                  @click="showContent(x)">收起</button>
          <button v-else class="button-base chart-button" 
                  @click="showContent(x)">详细内容</button>
        </div>
        <div v-if="chart_show[x] === true && question['question_type'] !== 3" class="chart-card">
          <v-chart :option="chart_list[x]" autoresize></v-chart>
        </div>
        <div v-if="chart_show[x] === true && question['question_type'] === 3" class="content-card">
          <div v-for="(text, y) in getContent(x)" :key="y">
            <label class="text-label">{{ text }}</label>
            <div class="text-separator"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <InfoModal
      v-if="modal_show"
      :type="modal_type"
      :message="modal_message"
      @close="modal_show = false"
      visible/>
  <!-- 弹窗：问卷错误 -->
  <InfoModal
      v-if="to_show"
      :type="to_type"
      :message="to_message"
      @submit="Router.toHome()"
      @close="Router.toHome()"
      visible/> 
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import axios from 'axios';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart, PieChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, TitleComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import API from '../components/js/API.js';
import Router from "@/components/js/Router.js";
import InfoModal from '@/components/Modal-Info.vue';

use
([
  CanvasRenderer, GridComponent, TooltipComponent, TitleComponent, 
  BarChart, PieChart
]);

const route = useRoute();
const store = useStore();
const user_info = (computed(() => store.getters['getUserInfo']));

const curr_quest = ref({});    /* 当前问卷信息 */
const curr_question_list = ref([]);    /* 当前问卷问题列表 */
const result_list = ref([]);    /* 问卷结果列表 */
const quest_show = ref(false);    /* 是否显示问卷 */

const modal_show = ref(false); 
const modal_type = ref(''); 
const modal_message = ref('');

const to_show = ref(false);
const to_type = ref('');
const to_message = ref('');

const chart_show = ref([]);
const chart_list = ref([]);

onMounted
(async () => {
  await getResult();
  await initQuest();
  await initQuestions();
});

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

const initQuest = async () =>
{
  try
  {
    const id = route.params.id.toString();
    const url = API.GET_quest_list.replace('{id}', id);
    const response = await axios.get(url);

    if (response.status === 200)
    {
      if (route.name === 'result' && response.data['status'] !== 0)
      {
        curr_quest.value = response.data;
        console.log('问卷内容获取成功：', curr_quest.value);
        quest_show.value = true;
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
      curr_question_list.value = response.data;
      chart_list.value.length = curr_question_list.value.length;
      chart_show.value.length = curr_question_list.value.length;
      console.log('问题列表获取成功：', curr_question_list.value);
    }
  }
  catch (error)
  {
    console.log('问题列表获取失败：', error.response ? error.response.data : error.message);
  }
};

const getResult = async () => 
{
  const id = route.params.id;
  const token = user_info['token'];
  const url = API.POST_result_get.replace('{id}', id);

  try 
  {
    const response = await axios.post(url, {}, { headers: { Authorization: `Bearer ${token}` } });
    
    if (response.status === 200)
    {
      result_list.value = response.data;
      console.log('结果获取成功：', response.data);
    }
  }
  catch (error)
  {
    console.error('结果获取失败：', error.response ? error.response.data : error.message);
  }
};

const downloadExcel =  async () =>
{
  const id = route.params.id;
  const token = user_info['token'];
  const url = API.POST_result_excel.replace('{id}', id);

  try 
  {
    const response = await axios.post
    (
      url, 
      {}, 
      { 
        responseType: 'blob',    /* 将文件作为二进制接受 */
        headers: { Authorization: `Bearer ${token}` } 
      }
    );

    if (response.status === 200)
    {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', curr_quest.value['title'] + '.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
  catch (error)
  {
    console.error('结果下载失败：', error.response ? error.response.data : error.message);
    showModal('error', '结果下载失败', true);
  }
};

const getOptionResult = (option) =>
{
  const question_id = option['question_id'];
  const id = option['id'];
  const question_result = result_list.value.find(item => item['question_id'] === question_id);
  const option_result = question_result['options'].find(item => item['id'] === id);
  return option_result;
};

const showChart = (index, type) =>
{
  if (type === '')
  {
    chart_show.value[index] = false;
    return;
  }
  else
    chart_show.value[index] = true;
  
  const question_id = curr_question_list.value[index]['id'];
  const option_result_list = result_list.value.find(item => item['question_id'] === question_id)['options'];
  
  switch (type)
  {
    case 'column': showColumn(option_result_list, index); break;
    case 'bar': showBar(option_result_list, index); break;
    case 'pie': showPie(option_result_list, index); break;
    case 'circle': showCircle(option_result_list, index); break;
    default: break;
  }
};

const showColumn = (option_result_list, index) =>
{
  const x_axis_data = [];
  for (let i = 0; i < option_result_list.length; i++)
    x_axis_data.push('选项' + (i + 1));

  const series_data = [];
  for (let i = 0; i < option_result_list.length; i++)
    series_data.push(option_result_list[i]['count']);

  chart_list.value[index] = 
  {
    title: { text: '' },
    tooltip: {},
    xAxis: { data: x_axis_data },
    yAxis: {},
    series: [{ name: '选择人数', type: 'bar', data: series_data }]
  };
};

const showBar = (option_result_list, index) =>
{
  const y_axis_data = [];
  for (let i = 0; i < option_result_list.length; i++)
    y_axis_data.push('选项' + (i + 1));

  const series_data = [];
  for (let i = 0; i < option_result_list.length; i++)
    series_data.push(option_result_list[i]['count']);

  chart_list.value[index] = 
  {
    title: { text: '' },
    tooltip: {},
    xAxis: {},
    yAxis: { data: y_axis_data },
    series: [{ name: '选择人数', type: 'bar', data: series_data }]
  };
};

const showPie = (option_result_list, index) =>
{
  const series_data = [];
  for (let i = 0; i < option_result_list.length; i++)
  {
    series_data.push
    (
      {
        value: option_result_list[i]['count'],
        name: '选项' + (i + 1)
      }
    );
  }
  
  chart_list.value[index] = 
  { 
    title: { text: '' },
    tooltip: {},
    series: [{ type: 'pie', data: series_data }] 
  };
};

const showCircle = (option_result_list, index) =>
{
  const series_data = [];
  for (let i = 0; i < option_result_list.length; i++)
  {
    series_data.push
    (
      {
        value: option_result_list[i]['count'],
        name: '选项' + (i + 1)
      }
    );
  }
  
  chart_list.value[index] = 
  { 
    title: { text: '' },
    tooltip: {},
    series: [{ type: 'pie', data: series_data, radius: ['40%', '70%'] }] 
  };
};

const showContent = (index) => { chart_show.value[index] = !chart_show.value[index];}

const getContent = (index) =>
{
  const question_id = curr_question_list.value[index]['id'];
  const text_list = result_list.value.find(item => item['question_id'] === question_id)['free_text_answers'];
  return text_list;
};
</script>

<style scoped>
@import url('../components/css/Style-Quest.css');

.questionnaire
{
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-color: var(--color-base);
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px var(--color-shadow);
  overflow: auto;
  z-index: -1;
}

.quest-main
{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 60%;
  margin-top: 60px;
  margin-bottom: 20px;
}

.question-part
{
  flex-direction: column;
  align-items: center;
}

.question-card
{
  width: 70%;
  margin-bottom: 5px;
}

.question-separator
{
  margin-top: 2px;
  margin-bottom: 2px;
  width: 100%;
  height: 0.1vh;
  background-color: var(--color-shadow-darken);
}

.button-base.downlaod-button
{
  padding: 5px 8px;
  margin-bottom: 10px;
}

.title-form 
{
  display: flex;
  flex-direction: row;
  width: 100%; 
}

.title-form label { font-weight: bold; }

.title-text 
{ 
  width: 60%;
  
  cursor: unset;
  word-wrap: unset;    
  overflow: hidden;    /* 隐藏超出范围的文本 */
  text-overflow: ellipsis; /* 添加省略号 */
  white-space: nowrap;   /* 确保文本在一行内显示 */
}

.result-text { width: 20%; }

.chart-button-group
{
  width: 70%;
  display: flex;
  flex-direction: row;
}

.button-base.chart-button
{
  padding: 5px 8px;
  margin-top: 5px;
  margin-left: 10px;
  margin-bottom: 10px;
}

.chart-card
{
  width: 70%;
  height: 300px;
}

.content-card
{
  width: 70%;
  height: auto;
}

.text-label
{
  width: 100%;
  word-break: break-all;    /* 允许在任何字符点换行 */
  word-wrap: break-word;    /* 自动换行 */
}

.text-separator
{
  margin-top: 2px;
  margin-bottom: 2px;
  width: 100%;
  height: 0.1vh;
  background-color: var(--color-shadow-darken);
}
</style>
