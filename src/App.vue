<!--
 * @version: v 1.0.0
 * @Github: https://github.com/GitHubGanKai
 * @Author: GitHubGanKai
 * @Date: 2020-04-29 22:08:12
 * @LastEditors: gankai
 * @LastEditTime: 2021-01-02 14:32:14
 * @FilePath: /refactor-with-vue3/src/App.vue
 -->
<template>
  <router-view v-slot="{ Component, route }">
    <transition>
      <keep-alive v-if="route.meta.keepAlive" :include="cachedComponents">
        <component :is="Component" />
      </keep-alive>
      <component v-else :is="Component" />
    </transition>
  </router-view>
</template>

<script setup>
import { ref } from 'vue';

const cachedComponents = ref(['NoticeList'])
</script>

<script>
export default {
  name: "App"
};
</script>

<style lang="scss">
@import "./styles/base.scss";

html,
body,
#app {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background-color: #efeff4;
  overflow: hidden;
  -webkit-overflow-scrolling: touch;
}
</style>
