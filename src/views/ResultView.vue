<template>
  <div class="result-main"></div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

const route = useRoute();
const store = useStore();

const user_info = (computed(() => store.getters['getUserInfo']));

onMounted
(() => {
  getResult();
});

const getResult = () => 
{
  const id = route.params.id;
  const token = user_info['token'];
};
</script>

<style scoped>
@import url('../components/css/Style-Quest.css');

.result-main
{
  position: absolute;
  top: 70px;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: auto;
}
</style>
