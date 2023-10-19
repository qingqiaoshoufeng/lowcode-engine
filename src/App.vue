<template>
  <keep-alive>
    <router-view />
  </keep-alive>
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
