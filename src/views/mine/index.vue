<template>
  <div class="mine">
    <InfoCard />
    <ListEntry :list="list" class="mt9" />
    <van-button v-if="!isInsert" type="primary" plain block style="margin-top: 20px" @click="handleOut">
      退出登录
    </van-button>
    <van-button v-else type="primary" plain block style="margin-top: 20px" @click="handleBack">
      退出登录
    </van-button>
  </div>
  <Tabbar :currentTab="currentab" />
</template>
    
<script setup>
import { ref, onMounted, onUnmounted,provide } from "vue";
import InfoCard from "./components/InfoCard.vue";
import { entryList } from "./config.js";
import { showLoadingToast, closeToast } from "vant";
import { loginOut, getRemind, getNotice } from "@/apis/index.js";
import { useRouter } from "vue-router";
import { resetLocalStorage } from '@/utils/tools.js'

const currentab = ref(5);

// 判断是否为接入平台
const isInsert = ref(localStorage.platform === 'ydyj-app')

const list = ref(entryList.filter(item=>{
  const flag = (item.label === '修改密码' && isInsert.value)
  return !flag
}))

const router = useRouter();

provide('isInsert',isInsert)
const id = ref(-1)

const handleOut = () => {
  showLoadingToast();
  loginOut({}).finally(() => {
    closeToast();
    // 记住密码存在了 localStorage，这里不使用 localStorage.clear()
    resetLocalStorage(1)
    router.replace({
      path: "/login",
    });
  });
};

const handleBack = () => {
  if (window.ecpot) {
    window.ecpot.close()
  }
}

const getNewNumber = async() => {
  const res = await getRemind()
  const res1 = await getNotice()
  list.value[3].number = Number(res1.uncheckNoticeNum)
  list.value[1].number = Number(res.messageNum)
  if(id.value) {
    clearTimeout(id.value)
  }
  id.value = setTimeout(getNewNumber,30*1000)
}

onMounted(() => {
  getNewNumber()
})

onUnmounted(()=> {
  if (id.value) {
    clearTimeout(id.value)
  }
})
</script>
    
<style scoped lang="scss">
.mine {
  background-image: url("~@/assets/images/home-bg.png");
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: 0% 0%;
  overflow: hidden;
  background-color: #f6f7f8;
  padding: 82px 16px 0px;
  height: 100%;
  .mt9 {
    margin-top: 9px;
  }
}
</style>
    