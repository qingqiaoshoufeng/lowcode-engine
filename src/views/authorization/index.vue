<template>
  <div class="authorization-wrapper">
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { showLoadingToast, closeToast } from "vant";
import { startAuthorization } from '@/apis/index.js';
import { getParams } from '@/utils/tools.js';
import router from '@/router/index.js';

onMounted(() => {
  showLoadingToast({
    message: '授权认证中...',
    duration: 0,
  })
  const params = getParams(location.href)
  if (params?.a2_ticket) {
    startAuthorization({ a2_ticket: params.a2_ticket }).then(res => {
      router.replace({
        path:'home'
      })
    })
  } else {
    setTimeout(() => {
      closeToast()
      router.replace({
        path:'login'
      })
    }, 1000);
  }
})
</script>

<style lang="scss" scoped>
.authorization-wrapper {
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  background: url('~@/assets/images/start@2x.png') no-repeat center center;
  background-size: 100% 100%
}
</style>
  