<template>
    <div class="entry_list">
      
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
  title:{
    default:'标题',
    type:Number
  },
  list:{
    default:()=>([]),
    type:Array
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
  name:'ListEntry'
}
</script>
  <style lang="scss" scoped>
  .entry_list{
    width: 100%;
    background-color: #fff;
    justify-content: space-between;
    .title{
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #0E203C;
        line-height: 22px;
        margin-bottom: 13px;
    }
    .tab_item{
      display: flex;
      flex-direction: column;
      display: inline-block;
      width: 25%;
      padding-bottom: 18px;
      .item_wrapper{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .label{
            font-size: 13px;
            font-family: PingFang-SC-Medium, PingFang-SC;
            font-weight: 500;
            color: #0E203C;
        }
        img{
            height: 30px;
            width: 30px;
            background-color: #fff;

        }
      }
  
    }
  }
  </style>
  
    