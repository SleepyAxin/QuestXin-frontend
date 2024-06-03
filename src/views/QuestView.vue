<template>
  <div class="quest-box">
    <div class="all-quest-part">
      <button class="button-base create-button" @click="showCreateQuest">
        <span class="icon-create icon-button"></span>
        创建问卷
      </button>
      <div class="quest-list">
        <button v-for="(quest_list, index) in quest_list" :key="index"
                class="quest-item-button"
                :class="{ 'active-quest': activeQuest(index) }"
                @click="switchQuest(index)">
          <span class="icon-quest quest-item-icon"></span>
          <label>{{ quest_list['title'] }}</label>
        </button>
      </div>
    </div>
    <div class="blank"></div>
    <div class="curr-quest-part">
      <div v-if="JSON.stringify(curr_quest) !== '{}'" class="opera-content">
        <button class="icon-edit   icon-button" title="修改问卷" @click="showEditQuest"></button>
        <button class="icon-view   icon-button" title="预览问卷" @click=""></button>
        <button class="icon-share  icon-button" title="分享问卷" @click=""></button>
        <button class="icon-pause  icon-button" title="暂停问卷" @click=""></button>
        <button class="icon-delete icon-button" title="删除问卷" @click="showDeleteQuest"></button>
      </div>
      <div v-if="JSON.stringify(curr_quest) !== '{}'" class="quest-content">
        <h2 class="quest-title">{{ quest_title }}</h2>
        <h3 class="quest-desc">{{ quest_desc }}</h3>
        <div class="underline"></div>
        <button class="button-base add-question-button" @click="showAddQuestion">
          <span class="icon-add icon-button"></span>
          添加问题
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
  <!-- 弹窗：创建问卷 -->
  <ModifyQuestModal
      v-if="create_quest_show"
      @submit="handleCreateQuest"
      @close="create_quest_show = false"
      visible/>
  <!-- 弹窗：修改问卷 -->
  <ModifyQuestModal
      v-if="edit_quest_show"
      :quest_title="edit_quest_title"
      :quest_description="edit_quest_desc"
      @submit="handleEditQuest"
      @close="edit_quest_show = false"
      visible/>
  <!-- 弹窗：删除问卷 -->
  <DeleteQuestModal
      v-if="delete_quest_show"
      @submit="handleDeleteQuest"
      @close="delete_quest_show = false"
      visible/>
  <!-- 弹窗：添加问题 -->
  <ModifyQuestionModal
      v-if="add_question_show"
      @close="add_question_show = false"
  visible/>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';

import InfoModal from '@/components/Modal-Info.vue';
import ModifyQuestModal from '@/components/Modal-ModifyQuest.vue';
import DeleteQuestModal from '@/components/Modal-DeleteQuest.vue';
import ModifyQuestionModal from '@/components/Modal-ModifyQuestion.vue';
import API from '@/components/js/API.js';

const user_info = useStore().getters.getUserInfo;

let quest_list = ref([]);    /* 当前用户全部问卷的列表 */
let curr_quest = ref({});    /* 当前问卷信息 */
let curr_questions = ref([]);    /* 当前问卷问题 */

let quest_title = ref('');
let quest_desc = ref('');

let modal_show = ref(false);
let modal_type = ref('');
let modal_message = ref('');

let create_quest_show = ref(false);

let edit_quest_show = ref(false);
let edit_quest_title = ref('');
let edit_quest_desc = ref('');

let delete_quest_show = ref(false);

let add_question_show = ref(false);

const initQuestList = async () =>
{
  const token = user_info['token'];

  try
  {
    const response = await axios.get
    (
        API.POST_quest_list,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
    );

    if (response.status === 200)
    {
      console.log('问卷列表获取成功', response.data);
      quest_list.value = response.data;    /* 装载当前用户问卷列表 */
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
  quest_title.value = curr_quest.value['title'];
  quest_desc.value = curr_quest.value['desc'];
};

const handleCreateQuest = (data) =>
{
  if (JSON.stringify(curr_quest.value) !== '{}')
  {
    console.log('创建问卷抓取成功', data);
    createQuest(data);
  }
};

const handleEditQuest = (data) =>
{
  if (JSON.stringify(curr_quest.value) !== '{}')
  {
    console.log('修改问卷抓取成功', data);
    editQuest(data);
  }
};

const handleDeleteQuest = (data) =>
{
  if (data === true)
  {
    console.log('删除问卷抓取成功');
    deleteQuest();
  }
};

const showInfoModal = (type, message, show) =>
{
  modal_type.value = type;
  modal_message.value = message;
  modal_show.value = show;
};

const showCreateQuest = () => { create_quest_show.value = true; };
const showEditQuest = () =>
{
  edit_quest_title.value = curr_quest.value['title'];
  edit_quest_desc.value = curr_quest.value['desc'];
  edit_quest_show.value = true;
};
const showDeleteQuest = () => { delete_quest_show.value = true; };
const showAddQuestion = () => { add_question_show.value = true; };

const createQuest = async (data) =>
{
  console.log('当前创建问卷：', data);

  const token = user_info['token'];
  const quest =
      {
        "title": data.title,
        "status": 0,
        "desc": data.desc,
      };

  try
  {
    const response = await axios.post
    (
        API.POST_quest_add,
        quest,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

    if (response.status === 201)
    {
      curr_quest.value = quest;
      curr_quest.value['id'] = response.data['id'];
      quest_title.value = curr_quest.value['title'];
      quest_desc.value = curr_quest.value['desc'];
      quest_list.value.push(curr_quest.value);    /* 更新问卷列表 */
      console.log('问卷创建成功：', response.data);
      showInfoModal('success', '问卷创建成功', true);
    }
  }
  catch (error)
  {
    switch (error.response.status)
    {
      case 422:
        showInfoModal('error', '问卷创建失败：格式错误', true);
        break;
      default:
        showInfoModal('error', '问卷创建失败，请稍后再试', true);
        break;
    }
  }
};

const editQuest = async (data) =>
{

};

const deleteQuest = async () =>
{
  console.log('当前删除问卷：', curr_quest.value);

  const token = user_info['token'];
  const id = curr_quest.value['id'];
  console.log('问卷id：', id);
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
      const index = quest_list.value.findIndex(quest => quest.id === id);    /* 要删除问卷的索引号 */
      quest_list.value.splice(index, 1);    /* 更新问卷列表 */
      console.log('问卷删除成功：', response.data);
      showInfoModal('success', '问卷删除成功', true);
    }
  }
  catch (error)
  {
    showInfoModal('error', '问卷删除失败', true);

    switch (error.response.status)
    {
      case 422:
        showInfoModal('error', '问卷删除失败：格式错误', true);
        break;
      default:
        showInfoModal('error', '问卷删除失败，请稍后再试', true);
        break;
    }
  }
};

const getQuestions = async (id) =>
{

};

onMounted(() => { initQuestList(); });
</script>

<style scoped>
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
  margin-left: 5px;
  margin-right: 5px;
  width: 28px;
  height: 28px;
}

.icon-button:hover
{
  background-color: var(--color-shadow);
}

.quest-list
{
  display: flex;
  flex-direction: column-reverse;    /* 倒序排列 */
  align-items: center;    /* 居中对齐 */
  justify-content: start;   /* 顶端对齐 */
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px var(--color-shadow-darken);
  height: 100%;
  width: 90%;
  max-width: 90%;
  margin-top: 5%;
  margin-bottom: 5%;
}

.quest-item-button
{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: safe start;
  position: relative;
  top: 10px;
  bottom: -10px;
  margin-bottom: 5px;
  cursor: pointer;
  width: 95%;
  height: 32px;
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

.quest-item-icon
{
  cursor: pointer;
  background-size: cover;
  background-position: center;
  width: 20px;
  height: 20px;
  margin-right: 5px;
}

.quest-item-button label
{
  max-width: 35vh;
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

.quest-content
{
  display: flex;
  flex-direction: column;
  align-items: center;

  border-style: none;
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px var(--color-shadow-darken);

  width: 96%;
  height: 100%;

  margin-bottom: 1%;
}

.quest-title
{
  text-align: center;
  word-break: break-all;    /* 允许在任何字符点换行 */
  margin-top: 1%;
  width: 96%
}

.quest-desc
{
  width: 96%;
  word-break: break-all;    /* 允许在任何字符点换行 */
  text-align: left;    /* 确保文本左对齐 */
  margin-bottom: 2px;
}

.underline
{
  width: 97%;
  height: 2px;
  background-color: var(--color-fill);    /* 设置下划线颜色 */
}

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

.add-question-button
{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  font-size: 18px;
}
</style>