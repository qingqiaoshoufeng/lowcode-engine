<template>

  <div class="title">业务</div>
  <van-pull-refresh v-model="loading" @refresh="onRefresh">
    <div class="statistics">
      <template v-for="(item, index) in menuListMap" :key="index">
        <DisplayEntry
          v-if="item && item.length"
          :list="item"
          :title="titleList[index]"
        />
      </template>
    </div>
  </van-pull-refresh>
  <Tabbar :currentTab="currentab" />
</template>
    
<script setup>
import { ref, computed } from "vue";
import store from "@/store/index.js";
import { onMounted } from "vue";
import DisplayEntry from '@/component/DisplayEntry/index.vue'

const menuInfoList = store.getters['menuInfo/menuInfoList']
const currentab = ref(3);
const titleList = ["", "信息采集", "审核/审批", "统计监督"];
const menuListMap = computed(() => {
  // const menuList = store.state?.menuInfo.menuInfo?.appMenuList || [];
  const result = menuInfoList.reduce((current, item, index) => {
    const { menuType } = item;
    const list = current[menuType] || [];
    list.push(item);
    current[menuType] = list;
    return current;
  }, []);
  return result;
});
const loading = ref(false);
const onRefresh = async() => {
  await store.dispatch('menuInfo/init')
  loading.value = false
};

onMounted(()=>{
  return store.dispatch('menuInfo/init')
})
</script>
    
<style scoped lang="scss">
.title {
  position: fixed !important;
  top: 0;
  height: 44px;
  box-sizing: content-box;
  line-height: 44px;
  border-top: 0px solid var(--van-header-title-color);
  background-color: var(--van-header-title-color);
  color: #fff;
  width: 100%;
  text-align: center;
  font-size: 20px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #ffffff;
}
.statistics {
  height: calc(100% - 44px - 56px);
  margin-top: 44px;
  padding: 18px 16px 10px 16px;
  background-color: #fff;
  overflow-y: auto;
}
.van-pull-refresh{
  height: 100%;
}
</style>
    