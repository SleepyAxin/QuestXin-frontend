<template>
  <!-- 头部 -->
  <Header/>
</template>

<script setup>
import Header from "@/components/Header.vue";
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