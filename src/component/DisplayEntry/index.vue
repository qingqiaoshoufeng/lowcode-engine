<template>
    <div class="entry_list">
      <div class="title">{{ title }}</div>
        <div class="list">
            <div 
                :class="{
                tab_item:true,
                }" 
                v-for="item in list" 
                :key="item.menuName"
                @click="handleClick(item)"
                v-p="permission[item.iconId] || []"
            >
               <div class="item_wrapper">
                    <!-- <img :src="item.activeImage" alt=""> -->
                    <svg class="icon svg-icon" aria-hidden="true">
                      <use v-bind:xlink:href="`#icon-${item.iconId}`"></use>
                    </svg>
                    <span>{{ item.menuName }}</span>
               </div>
            </div>
        </div>
    </div>
  </template>
  
<script setup>
import { computed, ref, getCurrentInstance,defineProps, onMounted } from "vue";
import { useStore } from "vuex";
import router from '@/router/index.js'
import {pathMap,permission} from './pathMap.js'

const props = defineProps({
  title:{
    default:'标题',
    type: String,
  },
  list:{
    default:()=>([]),
    type:Array
  }
})
const handleClick = (val)=>{
  const {iconId} = val
  const path = pathMap[iconId]
  router.push({
    path
  })
}
</script>
<script>
export default {
  name:'DisplayEntry'
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
    .icon{
      width: 30px;
      height: 30px;
    }
  }
  </style>
  
    