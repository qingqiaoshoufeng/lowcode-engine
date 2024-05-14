<template>
  <div class="mine">
    <InfoCard />
    <ListEntry :list="list" class="mt9" />
    <van-button type="primary" plain block style="margin-top: 20px" @click="handleOut">
      退出登录
    </van-button>
  </div>
  <Tabbar :currentTab="currentab" />
</template>
    
<script setup>
import { ref } from "vue";
import InfoCard from "./components/InfoCard.vue";
import { entryList } from "./config.js";
import { showLoadingToast, closeToast } from "vant";
import { loginOut,getRemind,getNotice } from "@/apis/index.js";
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import { onUnmounted } from "vue";

const currentab = ref(5);

const list = ref(entryList)

const router = useRouter();

const id = ref(1)

const handleOut = () => {
  showLoadingToast();
  loginOut({}).finally(() => {
    closeToast();
    localStorage.token = "";
    router.replace({
      path: "/login",
    });
  });
};

const getNewNumber = async()=>{
  const res = await getRemind()
  const res1 = await getNotice()
  list.value[3].number = Number(res1.uncheckNoticeNum)
  list.value[1].number = Number(res.messageNum)
  clearTimeout(id.value)
  if(id.value){
    id.value = setTimeout(getNewNumber,30*1000)
  }
}
onMounted(()=>{
  getNewNumber()
})

onUnmounted(()=>{
  id.value = 0
  clearTimeout(id.value)
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
    