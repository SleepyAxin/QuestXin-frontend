<template>
  <div class="quest-box">
    <div class="all-quest-part">
      <button class="button-base create-button" @click="showCreateModal">
        <span class="icon-create icon-button"></span>
        创建问卷
      </button>
      <div class="quest-list">
        <button v-for="(quest_list, index) in quest_list" :key="index"
                class="quest-item-button"
                :class="{ 'active-quest': this.activeQuest(index) }"
                @click="this.curr_quest = this.quest_list[index]">
          <span class="icon-quest quest-item-icon"></span>
          {{ quest_list['title'] }}
        </button>
      </div>
    </div>
    <div class="blank"></div>
    <div class="curr-quest-part">
      <div v-if="curr_quest !== undefined" class="opera-content">
        <button class="icon-edit   icon-button" title="修改问卷" @click="showEditModal"></button>
        <button class="icon-view   icon-button" title="预览问卷" @click="viewQuest"></button>
        <button class="icon-share  icon-button" title="分享问卷" @click="shareQuest"></button>
        <button class="icon-pause  icon-button" title="暂停问卷" @click="pauseQuest"></button>
        <button class="icon-delete icon-button" title="删除问卷" @click="showDeleteModal"></button>
      </div>
      <div v-if="curr_quest !== undefined" class="quest-content">
        <h2 class="quest-title">{{ quest_title }}</h2>
        <h3 class="quest-desc">{{ quest_desc }}</h3>
        <div class="underline"></div>
        <button class="button-base question-button">添加问题</button>
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
      v-if="create_show"
      @submit="handleCreateQuest"
      @close="create_show = false"
      visible/>
  <!-- 弹窗：修改问卷 -->
  <ModifyQuestModal
      v-if="edit_show"
      :quest_title="edit_title"
      :quest_description="edit_description"
      @submit="handleEditQuest"
      @close="edit_show = false"
      visible/>
  <!-- 弹窗：删除问卷 -->
  <DeleteQuestModal
      v-if="delete_show"
      @deleteQuest="deleteQuest"
      @close="delete_show = false"
      visible/>
</template>

<script>
import axios from "axios";

import InfoModal from '@/components/Modal-Info.vue';
import ModifyQuestModal from "@/components/Modal-ModifyQuest.vue";
import DeleteQuestModal from "@/components/Modal-DeleteQuest.vue";
import API from '@/components/js/API.js';

export default
{
  data()
  {
    return {
      quest_list: [],    /* 当前用户全部问卷的列表 */
      curr_quest: undefined,    /* 当前问卷 */

      quest_title: '',
      quest_desc: '',

      /* 弹出式窗口 */
      modal_show: false,
      modal_type: '',
      modal_message: '',

      /* 创建问卷 */
      create_show: false,

      /* 修改问卷 */
      edit_show: false,
      edit_title: '',
      edit_description: '',

      /* 删除问卷 */
      delete_show: false
    }
  },

  created()
  {
    this.initQuestList();    /* 初始化问卷列表 */
  },

  components: { InfoModal, ModifyQuestModal, DeleteQuestModal },

  methods:
      {
        /* 初始化问卷列表 */
        async initQuestList()
        {
          const token = this.$store.getters.getUserInfo['token'];

          try
          {
            const response = await axios.get
            (
                API.URL_POST_quest_list,
                { headers: { 'Authorization': `Bearer ${token}` } }
            )

            if (response.status === 200)
            {
              console.log('问卷列表获取成功', response.data);
              this.quest_list = response.data;    /* 装载当前用户问卷列表 */
            }
          }
          catch (error)
          {
            switch (error.response.status)
            {
              case 404:
              {
                console.error('问卷列表获取失败：当前用户没有问卷', error.response ? error.response.data : error.message);
                break;
              }
              default:
              {
                console.error('问卷列表获取失败，请稍后再试', error.response ? error.response.data : error.message);
                break;
              }
            }
          }
        },

        activeQuest(index)
        {
          if (this.curr_quest !== undefined && this.quest_list.length !== 0)
            return this.curr_quest['id'] === this.quest_list[index]['id'];

          return false;
        },

        handleCreateQuest(data)
        {
          if (data !== undefined)
          {
            console.log('创建问卷抓取成功', data);
            this.createQuest(data);
          }
        },

        handleEditQuest(data)
        {
          if (data !== undefined)
          {
            console.log('修改问卷抓取成功', data);
            this.editQuest(data);
          }
        },

        /* 调用信息弹窗 */
        showInfoModal(type, message, show)
        {
          this.modal_type = type;
          this.modal_message = message;
          this.modal_show = show;
        },

        /* 显示创建问卷弹窗 */
        showCreateModal() { this.create_show = true; },
        /* 显示修改问卷弹窗 */
        showEditModal()
        {
          this.edit_title = this.curr_quest['title'];
          this.edit_description = this.curr_quest['desc'];
          this.edit_show = true;
        },
        /* 显示删除问卷弹窗 */
        showDeleteModal() { this.delete_show = true; },

        async createQuest(data)
        {
          console.log('当前创建问卷：', this.curr_quest);

          const token = this.$store.getters.getUserInfo['token'];
          const quest =
              {
                "title": data['title'],
                "status": 0,
                "desc": data['desc'],
              };

          try
          {
            const response = await axios.post
            (
                API.URL_POST_quest_add,
                quest,
                {
                  headers:
                      {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                      }
                }
            );

            if (response.status === 201)
            {
              this.curr_quest = quest;
              this.curr_quest['id'] = response.data['id'];
              this.quest_list.push(this.curr_quest);    /* 更新问卷列表 */
              console.log('问卷创建成功：', response.data);
              this.showInfoModal('success', '问卷创建成功', true);
            }
          }
          catch (error)
          {
            this.showInfoModal('error', '问卷创建失败', true);

            switch (error.response.status)
            {
              case 422:
              {
                this.showInfoModal('error', '问卷创建失败：格式错误', true);
                break;
              }
              default:
              {
                this.showInfoModal('error', '问卷创建失败，请稍后再试', true);
                break;
              }
            }
          }
        },
        async editQuest(data)
        {

        },
        async viewQuest()
        {

        },
        async shareQuest()
        {

        },
        async pauseQuest()
        {

        },
        async deleteQuest()
        {
          console.log('当前删除问卷：', this.curr_quest);

          const token = this.$store.getters.getUserInfo['token'];
          const id = this.curr_quest['id'];
          const url = API.URL_DELETE_quest_delete.replace('{id}', id);

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
            )

            if (response.status === 200)
            {
              this.curr_quest = undefined;
              const index = this.quest_list.findIndex(quest => quest['id'] === id);    /* 要删除问卷的索引号 */
              this.quest_list.splice(index, 1);    /* 更新问卷列表 */
              console.log('问卷删除成功：', response.data);
              this.showInfoModal('success', '问卷删除成功', true);
            }
          }
          catch (error)
          {
            this.showInfoModal('error', '问卷删除失败', true);

            switch (error.response.status)
            {
              case 422:
              {
                this.showInfoModal('error', '问卷删除失败：格式错误', true);
                break;
              }
              default:
              {
                this.showInfoModal('error', '问卷删除失败，请稍后再试', true);
                break;
              }
            }
          }
        }
      },

  watch:
      {
        curr_quest(value)
        {
          if (value !== undefined)
          {
            this.quest_title = value['title'];
            this.quest_desc = value['desc'];
          }
        }
      }
}
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

  width: 25%;
  height: 100%;

  background-color: var(--color-base);
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px var(--color-shadow);
}

.create-button
{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
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
  justify-content: start;   /* 顶端对齐 */

  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px var(--color-shadow-darken);

  height: 100%;
  width: 90%;

  margin-top: 5%;
  margin-bottom: 5%;
}

.quest-item-button
{
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  top: 10px;
  bottom: -10px;
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 5px;
  cursor: pointer;
  height: 32px;
  font-size: 18px;
  font-style: normal;
  text-align: center;
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
</style>