<template>
  <!-- 头部 -->
  <Header :class="{ 'header-hidden': showHeader === false }"/>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import Header from "@/components/Header.vue";

const route = useRoute();

const showHeader = computed
(() => {
  // 列出需要隐藏头部的路由名称或路径
  const hidden_routes = ['view', 'questionnaire'];    // 以路由名称为依据
  return !hidden_routes.includes(route.name);
});
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

.header-hidden
{
  transform: translateY(-200%);
}
</style>