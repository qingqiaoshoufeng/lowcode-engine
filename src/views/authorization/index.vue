<template>
  <div class="authorization-wrapper">
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { showLoadingToast } from "vant";

onMounted(() => {
  showLoadingToast({
    message: '授权认证中...',
    duration: 0,
  })
})
</script>

<style lang="scss" scoped>
.authorization-wrapper {
  width: 100vw;
  height: 100vh;
  background-color: #fff;
}
</style>
