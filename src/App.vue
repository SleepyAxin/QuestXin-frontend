<template>
  <!-- 头部 -->
  <Header @showUserCard="showUserCard"></Header>
  <!-- 用户卡片 -->
  <UserCard
      v-if="user_card_show"
      @close="user_card_show=false"
      visible></UserCard>
</template>

<script>
import Header from "@/components/Header.vue";
import UserCard from "@/components/UserCard.vue";

export default
{
  data()
  {
    return {
      user_card_show: false,    /* 用户卡片 */
      header_hidden: false,    /* 头部 */
    }
  },

  components: { Header, UserCard },

  methods:
      {
        /* 调用用户卡片 */
        showUserCard()
        {
          /* 如果用户信息存在，允许访问用户卡片 */
          if (this.user_info !== null)
            this.user_card_show = true;
        }
      }
};
</script>

<style>
@import url("@/components/css/Style.css");     /* 全局样式 */
@import url("@/components/css/Variable.css");    /* 全局变量 */

body
{
  /* 网站背景图片 */
  background-image: var(--image-background);
  background-repeat: no-repeat;    /* 无重复 */
  background-size: cover;    /* 填充 */
  background-attachment: fixed;    /* 使背景图片填充整个页面 */
}
</style>