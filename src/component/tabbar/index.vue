<!--
 * @version: v 1.0.0
 * @Github: https://github.com/GitHubGanKai
 * @Author: GitHubGanKai
 * @Date: 2021-01-01 13:57:27
 * @LastEditors: gankai
 * @LastEditTime: 2021-01-02 15:07:37
 * @FilePath: /refactor-with-vue3/src/component/tabbar/index.vue
-->
<template>
  <div class="tabbar">
    <div 
      :class="{
        tab_item:true,
        is_active:item.value === props.currentTab,
      }" 
      v-for="item in menuList" 
      :key="item.label"
      @click="handleClick(item.path)"
    >
      <img :class="{ wb3:item.value === 3}" :src="item[item.value === props.currentTab ? 'activeImage' : 'deactiveImage']" alt="">
      <span :class="{label:true, ty3:item.value === 3}">{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, getCurrentInstance,defineProps } from "vue";
import { useStore } from "vuex";
import router from '@/router/index.js'
// import businessDeactive from '@/assets/images/business-deactive.png'
import businessActive from '@/assets/images/business-active.png'
import mineActive from '@/assets/images/mine-active.png'
import mineDeactive from '@/assets/images/mine-deactive.png'
import searchActive from '@/assets/images/search-active.png'
import searchDeactive from '@/assets/images/search-deactive.png'
import statisticsDeactive from '@/assets/images/statistics-deactive.png'
import statisticsActive from '@/assets/images/statistics-active.png'
import homeDeactive from '@/assets/images/home-deactive.png'
import homeActive from '@/assets/images/home-active.png'
import { Handler } from "leaflet";
const props = defineProps({
  currentTab:{
    default:null,
    type:Number
  }
})
const menuList = [
  {
    activeImage:homeActive,
    deactiveImage: homeDeactive,
    label:'首页',
    value: 1,
    path:'/home'
  },
  {
    activeImage:searchActive,
    deactiveImage: searchDeactive,
    label:'查询',
    value: 2,
    path:'/search'
  },
  {
    activeImage:businessActive,
    deactiveImage: businessActive,
    label:'业务',
    value: 3,
    path:'/business'
  },
  {
    activeImage:statisticsActive,
    deactiveImage: statisticsDeactive,
    label:'统计',
    value: 4,
    path:'/statistics'
  },
  {
    activeImage:mineActive,
    deactiveImage: mineDeactive,
    label:'我的',
    value: 5,
    path:'/mine'
  }
]
const handleClick = (val)=>{
  router.push({
    path:val
  })
}
</script>


<script>
export default {
  name:'Tabbar'
}
</script>
<style lang="scss" scoped>
.tabbar{
  position: fixed;
  bottom:0 ;
  width: 100%;
  height: 56px;
  background-color: #fff;
  padding: 0 38px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0px -2px 4px 0px rgba(23,28,44,0.1);
  .tab_item{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .label{
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #A4A6AC;
      font-size: 12px;
      // scale: .5;
    }
    img{
      height: 28px;
      width: 28px;
      background-color: #fff;
      border-radius: 50%;
    }
  }
  .is_active{
    .label{
      color: #1833A9 ;
    }
  }
  .wb3{
    border:3px solid #fff;
    transform: translateY(-50%);
    width:40px !important;
    height: 40px !important;
  }
  .ty3{
    transform:translateY(-9px);
  }
}
</style>
