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
import { useStore } from "vuex";

const store = useStore()

const initStore = async () => {
	const storeList = ['rules', 'userInfo', 'dict']
	const isInited = await Promise.all(
		storeList.map(item => {
			return store.dispatch(item + '/init')
		})
	)
	return isInited
}

const initError = () => {
  setTimeout(() => {
    closeToast()
    router.replace({
      path:'login'
    })
  }, 1000);
}

onMounted(() => {
  localStorage.saveInfo = "" // vuex-persistedstate 缓存内容清除
  showLoadingToast({
    message: '授权认证中...',
    duration: 0,
  })
  const params = getParams(location.href)
  if (params?.a2_ticket) {
    startAuthorization({ a2_ticket: params.a2_ticket }).then(async (res) => {
      if (res?.token) {
        localStorage.token = res.token
        localStorage.platform = 'ydyj-app'
        await initStore()
		    closeToast()
        router.replace({
          path:'home'
        })
      } else {
        initError()
      }
    }).catch((error) => {
      initError()
    })
  } else {
    initError()
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
  