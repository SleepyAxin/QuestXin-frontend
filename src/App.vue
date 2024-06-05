<template>
  <!-- 头部 -->
  <Header @showUserCard="showUserCard"></Header>
  <!-- 用户卡片 -->
  <UserCard
      v-if="user_card_show"
      @close="user_card_show=false"
      visible></UserCard>
</template>

<script setup>
import { ref } from "vue";
import Header from "@/components/Header.vue";
import UserCard from "@/components/UserCard.vue";

let user_card_show = ref(false);

const showUserCard = () =>
{
  user_card_show.value = true;
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