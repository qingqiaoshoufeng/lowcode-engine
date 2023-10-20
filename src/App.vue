<template>
  <router-view v-slot="{ Component }">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="isCached">
        <component :is="Component" />
      </keep-alive>
    </transition>
  </router-view>
</template>

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
  background-color: #fff;
  -webkit-overflow-scrolling: touch;
}
</style>
