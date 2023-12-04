<template>
  <div class="title">业务</div>
  <div class="statistics">
    <template v-for="(item, index) in menuListMap" :key="index">
      <DisplayEntry
        v-if="item && item.length"
        :list="item"
        :title="titleList[index]"
      />
    </template>
  </div>
  <Tabbar :currentTab="currentab" />
</template>
    
<script setup>
import { ref, computed } from "vue";
import store from "@/store/index.js";
console.log(store);
const currentab = ref(3);
const titleList = ["", "信息采集", "审核/审批", "统计监督"];
const menuListMap = computed(() => {
  const menuList = store.state?.menuInfo.menuInfo?.appMenuList || [];
  const result = menuList.reduce((current, item, index) => {
    const { menuType } = item;
    const list = current[menuType] || [];
    list.push(item);
    current[menuType] = list;
    return current;
  }, []);
  return result;
});
</script>
    
<style scoped lang="scss">
.title {
  position: fixed !important;
  top: 0;
  height: 44px;
  box-sizing: content-box;
  line-height: 44px;
  border-top: 0px solid #0c207f;
  background-color: #0c207f;
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
</style>
    