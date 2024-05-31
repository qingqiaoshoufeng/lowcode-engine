<template>
  <div class="authorization-wrapper">
    <div v-if="userList && userList.length > 0" class="authorization-account">
      <div class="authorization-title">
        您的手机号绑定了多个帐号，请选择其中一个登录：
      </div>
      <div
        v-for="item in userList"
        :key="item.userId"
        class="authorization-item"
        @click="handleEnter(item)"
        >
        <img src="@/assets/images/avatar.png">
        <div class="authorization-item-info">
          <div class="authorization-item-name">{{ item.userName }}</div>
          <div class="authorization-item-account">{{ item.loginName }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { showToast, showLoadingToast, closeToast } from "vant";
import { startAuthorization, loginIn } from '@/apis/index.js';
import { getParams } from '@/utils/tools.js';
import router from '@/router/index.js';
import { useStore } from "vuex";
import { encrypt } from '@/utils/tools.js';

const store = useStore()

const userList = ref([])

const initStore = async () => {
	const storeList = ['rules', 'userInfo', 'dict']
	const isInited = await Promise.all(
		storeList.map(item => {
			return store.dispatch(item + '/init')
		})
	)
	return isInited
}

const initError = (msg) => {
  if (msg) {
    showFailToast(msg)
  } else {
    closeToast()
  }
  setTimeout(() => {
    router.replace({
      path:'login'
    })
  }, 1000);
}

const handleEnter = async (item) => {
  showToast({
		message: '登录中...',
		duration: 0,
	})
  const res = await loginIn({
      loginid: encrypt(item.loginName),
      password: encrypt(item.password),
      ssoTag: 'abcdefg', // 跳过验证码
      doubleFactor: '1', // 跳过双因子
    }).catch((error) => {
      initError()
    })
  if (res?.token) {
    localStorage.token = res.token
    localStorage.platform = 'ydyj-app'
    await initStore()
    closeToast()
    router.replace({
      path:'home'
    })
  } else {
    initError(res?.msg)
  }
}

onMounted(async () => {
  localStorage.saveInfo = "" // vuex-persistedstate 缓存内容清除
  showLoadingToast({
    duration: 0,
  })
  const params = getParams(location.href)
  if (params?.a2_ticket) {
    const res = await startAuthorization({
      ticket: params.a2_ticket,
      ssoTag: 'abcdefg', // 跳过验证码
      doubleFactor: '1', // 跳过双因子
     }).catch((error) => {
      initError()
    })
    if (res?.users?.length === 1) {
      handleEnter(res?.users?.[0])
    }
    else if (res?.users?.length > 1) {
      userList.value = res.users
      closeToast()
    } else {
      initError(res?.msg)
    }
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
  background-size: 100% 100%;
  .authorization-account {
    width: 100vw;
    height: 100vh;
    overflow-y: auto;
    background-color: #ebebeb;
    .authorization-title {
      width: 100%;
      text-align: center;
      padding: 50px 0 50px 0;
    }
    .authorization-item {
      display: flex;
      align-items: center;
      margin: 50px 50px 0px 50px;
      background-color: white;
      img {
        width: 48px;
        height: 48px;
        border-radius: 24px;
        margin: 10px 20px 10px 10px;
      }
      .authorization-item-name {
        font-weight: bold;
      }
      .authorization-item-account {
        color: gray;
      }
    }
    .authorization-item:last-child {
      margin-bottom: 20px;
    }
  }
}
</style>
  