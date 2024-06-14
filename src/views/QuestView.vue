<template>
  <div class="quest-box">
    <div class="all-quest-part">
      <button class="button-base create-button" @click="showCreateQuest()">
        <span class="icon-create icon-button"></span>
        创建问卷
      </button>
      <div v-if="quest_list.length !== 0" class="quest-list">
        <button v-for="(quest, index) in quest_list" :key="index"
                class="quest-item-button"
                :class="{ 'active-quest': activeQuest(index) }"
                @click="switchQuest(index)">
          <span class="icon-quest quest-icon"></span>
          <label class="quest-list-title">{{ quest['title'] }}</label>
        </button>
      </div>
      <div v-else class="quest-list no-quest-info">当前用户没有问卷</div>
    </div>
    <div class="blank"></div>
    <div class="curr-quest-part">
      <div v-if="JSON.stringify(curr_quest) !== '{}'" class="opera-content">
        <label v-if="curr_quest['status'] === 0"
               class="status-unstarted">未发布</label>
        <label v-else-if="curr_quest['status'] === 1"
               class="status-published">已发布</label>
        <label v-else-if="curr_quest['status'] === 2"
               class="status-paused">已暂停</label>
        <button class="icon-edit   icon-button" title="修改问卷" @click="showEditQuest()"></button>
        <button class="icon-view   icon-button" title="预览问卷" @click="showView()"></button>
        <button class="icon-share  icon-button" title="分享问卷" @click="showShare()"></button>
        <button v-if="curr_quest['status'] === 1" class="icon-pause  icon-button"
                title="暂停问卷" @click="showPause()"></button>
        <button v-else class="icon-publish  icon-button"
                title="发布问卷" @click="showPublish()"></button>
        <button class="icon-delete icon-button" title="删除问卷" @click="showDeleteQuest()"></button>
        <button v-if="curr_quest['status'] !== 0" class="button-base  result-button" 
                @click="showResult()">查看结果</button>
      </div>
      <div v-if="JSON.stringify(curr_quest) !== '{}'" class="quest-content">
        <h2 class="quest-title">{{ curr_quest['title'] }}</h2>
        <h3 class="quest-desc">{{ curr_quest['desc'] }}</h3>
        <div class="quest-underline"></div>
        <div v-for="(question, x) in curr_question_list" :key="x" class="question-part">
          <div class="question-card">
            <div class="question-info">
              <label v-if="question['is_required'] === true" class="question-required">*</label>
              <h4 class="question-index">{{x+1}}.</h4>
              <label class="question-desc">{{question['title']}}</label>
            </div>
            <div class="question-options">
              <template v-if="question['question_type'] === 1">
                <label v-for="(option, y) in question['options']" :key="y"
                     class="option-group">
                <input v-if="curr_question_answer_list[x] === y" type="radio"
                       :value=y v-model="curr_question_answer_list[x]" class="icon-single-choice-checked choice-icon"/>
                <input v-else type="radio" :value=y v-model="curr_question_answer_list[x]"
                       class="icon-single-choice-unchecked choice-icon"/>
                {{option['title']}}
              </label>
              </template>
              <template v-if="question['question_type'] === 2">
                <label v-for="(option, y) in question['options']" :key="y"
                     class="option-group">
                <input v-if="curr_question_answer_list[x].includes(y)" type="checkbox"
                       :value=y v-model="curr_question_answer_list[x]" class="icon-multi-choice-checked choice-icon"/>
                <input v-else type="checkbox" :value=y v-model="curr_question_answer_list[x]"
                       class="icon-multi-choice-unchecked choice-icon"/>
                {{option['title']}}
              </label>
              </template>
              <textarea v-if="question['question_type'] === 3" v-model="curr_question_answer_list[x]"
                        class="fill-blank-area"></textarea>
            </div>
          </div>
          <!-- 当问卷未发布时才允许修改 -->
          <div v-if="curr_quest['status'] === 0" class="opera-part">
            <button class="button-base edit-question-button" @click="showEditQuestion(x)">编辑</button>
            <button class="button-base delete-question-button" @click="showDeleteQuestion(x)">删除</button>
          </div>
        </div>
        <button v-if="curr_quest['status'] === 0" class="button-base add-question-button" @click="showAddQuestion()">
          <span class="icon-add icon-button"/>添加问题
        </button>
      </div>
      <div v-else class="init-info">
        <span class="info-image"></span>
        <h2>请先创建或者选择问卷</h2>
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
  <!-- 弹窗：预览问卷 -->
  <InfoModal
      v-if="view_show"
      :type="'success'"
      :message="'点击前往预览问卷'"
      :cancel="true"
      @submit="toView"
      @close="view_show = false"
      visible/>
  <!-- 弹窗：分享问卷 -->
  <InfoModal
      v-if="share_show"
      :type="'success'"
      :message="share_message"
      :ensure_text="'复制'"
      :cancel="true"
      @submit="copyLink"
      @close="share_show = false"
      visible/>
  <!-- 弹窗：发布问卷 -->
  <InfoModal
      v-if="publish_show"
      :type="'normal'"
      :message="'确定要发布当前问卷吗'"
      :cancel="true"
      @submit="changeStatus(1)"
      @close="publish_show = false"
      visible/>
  <!-- 弹窗：暂停问卷 -->
  <InfoModal
      v-if="pause_show"
      :type="'warning'"
      :message="'确定要暂停当前问卷吗'"
      :cancel="true"
      @submit="changeStatus(2)"
      @close="pause_show = false"
      visible/>
  <!-- 弹窗：创建问卷 -->
  <ModifyQuestModal
      v-if="create_quest_show"
      :quest_desc="'感谢您抽出时间填写本次问卷，您的意见和建议就是我们前行的最大动力！'"
      @submit="createQuest"
      @close="create_quest_show = false"
      visible/>
  <!-- 弹窗：修改问卷 -->
  <ModifyQuestModal
      v-if="edit_quest_show"
      :quest_title="edit_quest_title"
      :quest_desc="edit_quest_desc"
      @submit="editQuest"
      @close="edit_quest_show = false"
      visible/>
  <!-- 弹窗：删除问卷 -->
  <InfoModal
      v-if="delete_quest_show"
      :type="'delete'"
      :message="'确定要删除当前问卷吗？'"
      :cancel="true"
      @submit="deleteQuest"
      @close="delete_quest_show = false"
      visible/>
      <!-- 弹窗：查看结果 -->
  <InfoModal
      v-if="result_show"
      :type="'success'"
      :message="'点击确定前往查看结果'"
      :cancel="true"
      @submit="toResult"
      @close="result_show = false"
      visible/>
  <!-- 弹窗：添加问题 -->
  <ModifyQuestionModal
      v-if="add_question_show"
      :question_options="[]"
      @submit="addQuestion"
      @close="add_question_show = false"
  visible/>
  <!-- 弹窗：修改问题 -->
  <ModifyQuestionModal
      v-if="edit_question_show"
      :question_title="edit_question_title"
      :question_type="edit_question_type"
      :question_required="edit_question_required"
      :question_options="edit_question_options"
      @submit="editQuestion"
      @close="edit_question_show = false"
  visible/>
  <!-- 弹窗：删除问题 -->
  <InfoModal
      v-if="delete_question_show"
      :message="'确定要删除当前问题吗？'"
      :type="'delete'"
      :cancel="true"
      @submit="deleteQuestion"
      @close="delete_question_show = false"
      visible/>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
import { useRouter } from "vue-router";

import InfoModal from '@/components/Modal-Info.vue';
import ModifyQuestModal from '@/components/Modal-ModifyQuest.vue';
import ModifyQuestionModal from '@/components/Modal-ModifyQuestion.vue';
import API from '@/components/js/API.js';

const route = useRouter();

const store = useStore();
const user_info = store.getters.getUserInfo;

const quest_list = ref([]);    /* 当前用户全部问卷的列表 */
const curr_quest = ref({});    /* 当前问卷信息 */
const curr_question_list = ref([]);    /* 当前问卷问题列表 */
const curr_question_answer_list = ref([]);    /* 当前问卷答案 */

const modal_show = ref(false);
const modal_type = ref('');
const modal_message = ref('');

const view_show = ref(false);
const share_show = ref(false);
const share_message = ref('');
const share_link = ref('');
const publish_show = ref(false);
const pause_show = ref(false);

const create_quest_show = ref(false);
const edit_quest_show = ref(false);
const edit_quest_title = ref('');
const edit_quest_desc = ref('');
const delete_quest_show = ref(false);
const result_show = ref(false);

const add_question_show = ref(false);
const edit_question_show = ref(false);
const edit_question_id = ref('');
const edit_question_title = ref('');
const edit_question_type = ref(0);
const edit_question_required = ref(false);
const edit_question_options = ref([]);
const delete_question_show = ref(false);
const delete_question_id = ref('');

onMounted(() => { initQuestList(); });

const initQuestList = async () =>
{
  const token = user_info['token'];

  try
  {
    const response = await axios.get
    (
        API.GET_quest_list_by_user,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
    );

    if (response.status === 200)
    {
      quest_list.value = response.data;    /* 装载当前用户问卷列表 */
      console.log('问卷列表获取成功', quest_list.value);
    }
  }
  catch (error)
  {
    switch (error.response.status)
    {
      case 404:
        console.error('问卷列表获取失败：当前用户没有问卷', error.response ? error.response.data : error.message);
        break;
      default:
        console.error('问卷列表获取失败，请稍后再试', error.response ? error.response.data : error.message);
        break;
    }
  }
};

const activeQuest = (index) =>
{
  if (JSON.stringify(curr_quest.value) !== '{}' && quest_list.value.length !== 0)
    return curr_quest.value.id === quest_list.value[index].id;

  return false;
};

const switchQuest = (index) =>
{
  curr_quest.value = quest_list.value[index];
  getQuestionList();
};

const getQuestionList = async () =>
{
  const token = user_info['token'];
  const url = API.GET_question_list.replace('{id}', curr_quest.value['id']);

  try
  {
    const response = await axios.get
    (
        url,
        { headers: { 'Authorization': `Bearer ${token}` } }
    );

    if (response.status === 200)
    {
      curr_question_list.value = response.data;
      curr_question_answer_list.value = [];
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
      console.log('问题列表获取成功：', curr_question_list.value);
    }
  }
  catch (error)
  {
    console.error('问题列表获取失败：', error.response ? error.response.data : error.message);
  }
};

const showInfoModal = (type, message, show) =>
{
  modal_type.value = type;
  modal_message.value = message;
  modal_show.value = show;
};

const showView = () => { view_show.value = true; };
const toView = () =>
{
  const id = curr_quest.value['id'];
  const url = route.resolve({ name: 'view', params: {id} }).href;
  window.open(url, '_blank');    /* 打开新网页 */
};

const showShare = () =>
{
  const protocol = window.location.protocol + '//';
  const hostname = window.location.hostname + ':';
  const port = window.location.port;
  const id = curr_quest.value['id'];
  const url = route.resolve({ name: 'questionnaire', params: { id } }).href;
  share_link.value = protocol + hostname + port + url;

  switch (curr_quest.value['status'])
  {
    case 0:
      showInfoModal('error', '问卷未发布，无法分享', true);
      break;
    case 1:
      share_message.value = share_link.value;
      share_show.value = true;
      break;
    case 2:
      showInfoModal('error', '问卷已暂停，无法分享', true)
      break;
    default: break;
  }
};
const copyLink = async () =>
{
  try
  {
    await navigator.clipboard.writeText(share_link.value);
    console.log('链接复制成功：', share_link.value);
  }
  catch (error)
  {
    console.error('链接复制失败:', error);
    showInfoModal('error', '链接复制失败，请稍后再试', true);
  }
};

const showPublish = () => { publish_show.value = true; };
const showPause = () => { pause_show.value = true; };
const changeStatus = async (status) =>
{
  console.log('当前问卷状态：', curr_quest.value['status']);

  const token = user_info['token'];
  const data = 
  {
    'questionnaire_id': curr_quest.value['id'],
    'status': status
  };

  try 
  {
    const response = await axios.patch
    (
      API.PATCH_quest_status,
      data,
      {
        headers:
          {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
      }
    );

    if (response.status === 200)
    {
      curr_quest.value['status'] = status;

      switch (curr_quest.value['status'])
      {
        case 1:
          console.log('问卷已发布：', curr_quest.value);
          showInfoModal('success', '问卷已发布', true);
          break;
        case 2:
          console.log('问卷已暂停：', curr_quest.value);
          showInfoModal('success', '问卷已暂停', true);
          break;
        default: break;
      }
    }
  }
  catch (error)
  {
    console.error('问卷状态修改失败：', error.response ? error.response.data : error.message);
    showInfoModal('error', '问卷状态修改失败，请稍后再试', true);
  }
}

const showCreateQuest = () => { create_quest_show.value = true; };
const createQuest = async (quest) =>
{
  console.log('当前创建问卷：', quest);

  const token = user_info['token'];
  const data =
      {
        'title': quest['title'],
        'status': 0,
        'desc': quest['desc'],
      };

  try
  {
    const response = await axios.post
    (
        API.POST_quest_add,
        data,
        {
          headers:
          {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

    if (response.status === 201)
    {
      curr_quest.value = response.data;
      quest_list.value.push(curr_quest.value);    /* 更新问卷列表 */
      curr_question_list.value = [];
      curr_question_answer_list.value = [];
      console.log('问卷创建成功：', curr_quest.value);
      showInfoModal('success', '问卷创建成功', true);
    }
  }
  catch (error)
  {
    console.error('问卷创建失败：', error.response ? error.response.data : error.message);
    showInfoModal('error', '问卷创建失败，请稍后再试', true);
  }
};

const showEditQuest = () =>
{
  edit_quest_title.value = curr_quest.value['title'];
  edit_quest_desc.value = curr_quest.value['desc'];
  edit_quest_show.value = true;
};
const editQuest = async (quest) =>
{
  console.log('当前修改问卷：', quest);

  const token = user_info['token'];
  const data =
      {
        'title': quest['title'],
        'status': curr_quest.value['status'],
        'desc': quest['desc'],
        'user_id': curr_quest.value['user_id'],
        'id': curr_quest.value['id'],
      };

  try
  {
    const response = await axios.post
    (
        API.POST_quest_edit,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

    if (response.status === 200)
    {
      curr_quest.value = response.data;
      /* 更新问卷列表 */
      const index = quest_list.value.findIndex(item => item['id'] === curr_quest['id']);
      quest_list.value.splice(index, 1, curr_quest.value);
      console.log('问卷修改成功：', curr_quest.value);
      showInfoModal('success', '问卷修改成功', true);
    }
  }
  catch (error)
  {
    console.error('问卷修改失败：', error.response ? error.response.data : error.message);
    showInfoModal('error', '问卷修改失败，请稍后再试', true);
  }
};

const showDeleteQuest = () => { delete_quest_show.value = true; };
const deleteQuest = async () =>
{
  console.log('当前删除问卷：', curr_quest.value);

  const token = user_info['token'];
  const id = curr_quest.value['id'];
  const url = API.DELETE_quest_delete.replace('{id}', id);

  try
  {
    const response = await axios.delete
    (
        url,
        {
          headers:
              {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
        }
    );

    if (response.status === 200)
    {
      curr_quest.value = {};
      const index = quest_list.value.findIndex(quest => quest['id'] === id);    /* 要删除问卷的索引号 */
      quest_list.value.splice(index, 1);    /* 更新问卷列表 */
      console.log('问卷删除成功：', response.data);
      showInfoModal('success', '问卷删除成功', true);
    }
  }
  catch (error)
  {
    console.error('问卷删除失败：', error.response ? error.response.data : error.message);
    showInfoModal('error', '问卷删除失败，请稍后再试', true);
  }
};

const showResult = () => { result_show.value = true; };
const toResult = () =>
{
  const id = curr_quest.value['id'];
  const url = route.resolve({ name: 'result', params: {id} }).href;
  window.open(url, '_blank');    /* 打开新网页 */
};

const showAddQuestion = () => { add_question_show.value = true; };
const addQuestion = async (question) =>
{
  console.log('当前添加问题：', question);

  const token = user_info['token'];
  const data =
      {
        'title': question['title'],
        'question_type': question['type'],
        'questionnaire_id': curr_quest.value['id'],
        'is_required': question['required'],
        'row': 0,
        'options': question['options']
      };

  try
  {
    const response = await axios.post
    (
        API.POST_question_add,
        data,
        {
          headers:
              {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
        }
    );

    if (response.status === 200)
    {
      curr_question_list.value.push(response.data);
      switch (curr_question_list.value[curr_question_list.value.length-1]['question_type'])
      {
        case 1: curr_question_answer_list.value.push(-1); break;
        case 2: curr_question_answer_list.value.push([]); break;
        case 3: curr_question_answer_list.value.push(''); break;
        default: break;
      }
      console.log('问题添加成功：', curr_question_list.value[curr_question_list.value.length - 1]);
      showInfoModal('success', '问题添加成功', true);
    }
  }
  catch (error)
  {
    console.error('问题添加失败：', error.response ? error.response.data : error.message);
    showInfoModal('error', '问题添加失败，请稍后再试', true);
  }
};

const showEditQuestion = (index) =>
{
  edit_question_show.value = true;
  edit_question_id.value = curr_question_list.value[index]['id'];
  edit_question_title.value = curr_question_list.value[index]['title'];
  edit_question_type.value = curr_question_list.value[index]['question_type'];
  edit_question_required.value = curr_question_list.value[index]['is_required'];
  edit_question_options.value = curr_question_list.value[index]['options'];
};
const editQuestion = async (question) =>
{
  console.log('当前修改问题：', question);

  const token = user_info['token'];
  const data =
      {
        'title': question['title'],
        'question_type': question['type'],
        'questionnaire_id': curr_quest.value['id'],
        'id': edit_question_id.value,
        'is_required': question['required'],
        'row': 0,
        'options': question['options']
      };

  try
  {
    const response = await axios.post
    (
        API.POST_question_edit,
        data,
        {
          headers:
              {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
        }
    );

    if (response.status === 200)
    {
      const index = curr_question_list.value.findIndex(item => item['id'] === data['id']);
      curr_question_list.value.splice(index, 1, response.data)
      switch (curr_question_list.value[index]['question_type'])
      {
        case 1: curr_question_answer_list.value[index] = -1; break;
        case 2: curr_question_answer_list.value[index] = []; break;
        case 3: curr_question_answer_list.value[index] = ''; break;
        default: break;
      }
      console.log('问题修改成功：', curr_question_list.value[index]);
      showInfoModal('success', '问题修改成功', true);
    }
  }
  catch (error)
  {
    console.error('问题修改失败：', error.response ? error.response.data : error.message);
    showInfoModal('error', '问题修改失败，请稍后再试', true);
  }
};

const showDeleteQuestion = (index) =>
{
  delete_question_show.value = true;
  delete_question_id.value = curr_question_list.value[index]['id'];
};
const deleteQuestion = async (question) =>
{
  console.log('当前删除问题：', question);
  const token = user_info['token'];
  const id = delete_question_id.value;
  const url = API.DELETE_question_delete.replace('{id}', id);

  try
  {
    const response = await axios.delete
    (
        url,
        { headers: { 'Authorization': `Bearer ${token}` } }
    );

    if (response.status === 200)
    {
      const index = curr_question_list.value.findIndex(item => item['id'] === id);
      curr_question_list.value.splice(index, 1);
      curr_question_answer_list.value.splice(index, 1);
      console.log('问题删除成功：', response.data);
      showInfoModal('success', '问题删除成功', true);
    }
  }
  catch (error)
  {
    console.error('问题删除失败：', error.response ? error.response.data : error.message);
    showInfoModal('error', '问题删除失败，请稍后再试', true);
  }
}
</script>

<style scoped>
@import url('../components/css/Style-Quest.css');

.quest-box
{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
  position: fixed;
  top: 72px;
  left: 16px;
  right: 16px;
  bottom: 10px;
}

.all-quest-part
{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 30%;
  height: 100%;
  background-color: var(--color-base);
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px var(--color-shadow);
}

.button-base.create-button
{
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 5%;
  font-size: 18px;
}

.icon-button
{
  cursor: pointer;
  background-size: cover;
  border-style: none;
  border-radius: var(--border-radius);
  margin: 0 5px;
  width: 28px;
  height: 28px;
}

.result-button
{
  width: 76px;
  height: 28px;
  padding: 0 0;
  font-size: 15px;
  margin-left: auto;
}

.quest-list
{
  display: flex;
  flex-direction: column-reverse;    /* 倒序排列 */
  align-items: center;    /* 居中对齐 */
  justify-content: safe start;    /* 顶部对齐 */
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px var(--color-shadow-darken);
  width: 95%;
  height: 100%;
  margin-top: 15px;
  margin-bottom: 10px;
  padding-top: 10px;
  padding-bottom: 5px;
  overflow: auto;
}

.quest-list.no-quest-info
{
  justify-content: safe center;
  font-size: 20px;
  font-weight: bold;
}

.quest-item-button
{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: safe start;
  position: relative;
  margin-bottom: 5px;
  cursor: pointer;
  width: 95%;
  min-height: 32px;
  border-style: none;
  border-radius: var(--border-radius);
  background-color: transparent;
}

.quest-item-button:hover
{
  background-color: var(--color-shadow);
}

.active-quest
{
  color: var(--color-fill);
  background-color: var(--color-shadow);
}

.icon-quest.quest-icon
{
  width: 24px;
  height: 24px;
  margin: 0 5px 0 0;
  background-size: cover;
  background-position: center;
}

.quest-list-title
{
  max-width: 36vh;
  font-size: 18px;
  overflow: hidden;    /* 隐藏超出范围的文本 */
  text-overflow: ellipsis; /* 添加省略号 */
  white-space: nowrap;   /* 确保文本在一行内显示 */
}

.blank
{
  width: 20px;
  height: 100%;
}

.curr-quest-part
{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  background-color: var(--color-base);
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px var(--color-shadow);
}

.opera-content
{
  display: flex;
  align-items: center;
  justify-content: left;
  width: 96%;
  height: 8%;
}

.opera-content label
{
  font-size: 14px;
  margin-right: 4px;
  padding: 4px 6px;
  border-radius: var(--border-radius);
}

.status-unstarted { background-color: #D3D3D3; }
.status-published { background-color: #CCFFCC; }
.status-paused { background-color: #FFCCCC; }

.init-info
{
  display: flex;
  flex-direction: column;
  align-items: center;
}

.info-image
{
  background: var(--image-background-quest);
  background-size: cover;
  background-repeat: no-repeat;
  width: 450px;
  height: 255px;
  margin-bottom: -65px;
}

.button-base.add-question-button
{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 20px;
  font-size: 18px;
}
</style>