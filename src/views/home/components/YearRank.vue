<template>
  <div class="year_rank">
    <div class="min-title">{{ title }}</div>
      <div class="tab">
        <div 
          :class="{isActive:(item.value === currentTab)}" 
          v-for="item in tabList" :key="item.id + item.name + item.label" 
          class="tab_item"
          @click="tabChange(item.value)"
        >{{ item.label }}</div>
      </div>
      <div v-show="checkEmpty" class="empty_wrapper info_list" id="chart">
        <img src="~@/assets/images/empty.png" alt="">
      </div>
      <div v-show="!checkEmpty" class="info_list">
        <div class="info_item" :class="{no_line:index===9}" v-for="(item,index) in list" :key="item.id + item.name + item.label + currentTab">
          <div class="index">
            <img v-if="iconList[index] && currentTab === 1" :src="iconList[index]" alt="">
            <span v-else>{{ index + 1  }}</span>
          </div>
          <template v-if="currentTab === 1">
            <div class="name">{{ item.name || item.warningName }}</div>
            <div class="times">{{ item.qs ? (item.qs + '起') : '-' }}</div>
            <!-- <div class="cars">{{ item.qs ? (item.car + '辆' ) : '-' }}</div> -->
            <div class="people">{{item.qs ? (item.person + '人') : '-'  }}</div>
          </template>
          <template v-else>
            <div class="warningName">{{ item.warningName }}</div>
            <div class="deadNum">
              {{ item.deadNum ? (`${item.deadNum}人`) : '-' }}
            </div>
          </template>
        </div>
      </div>
    </div>
 </template>
   
<script setup>
import useTab from '../hooks/useTab.js'
import first from '@/assets/images/first.png'
import second from '@/assets/images/second.png'
import third from '@/assets/images/third.png'
import {computed } from 'vue' 
const iconList = [first,second,third]
const props = defineProps({
  list:{
    type:Array,
    default:()=>([])
  },
  title:{
    type:String,
  },
  handleChange:{
    type:Function,
  }
})

const {
  currentTab,
  tabList,tabChange} = useTab({
  list:[
    {
      label:'接警出动',
      value:1,
    },
    {
      label:'亡人火灾',
      value:2,
    }
  ],
  defaultTab:1,
  handleChange:props.handleChange,
  paramsKey:'annual'
})


defineExpose({
  currentTab
})

const checkEmpty = computed(()=>{
  if(!props.list || props.list.length === 0){
    return true
  }else{
    return false
  }
})

defineOptions({
  name:'YearRank'
})

</script>
   
 <style scoped lang="scss">
 .year_rank{
    width: 100%;
    min-height: 263px;
    background: #FFFFFF;
    padding: 0 16px;
    padding-bottom: 5px;
    overflow: hidden;
    .min-title{
      padding: 10px;
    }
    .tab{
      width: 220px;
      height: 30px;
      background: #F6F6F6;
      border-radius: 19px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 5px;
      margin-bottom: 5px;
      .tab_item{
        width: 92px;
        height: 22px;
        background: #F6F6F6;
        border-radius: 19px;
        align-items: center;
        display: flex;
        justify-content: center;
       
      }
      
      .isActive{
        color: #1833A9;
        background-color: #FFFFFD ;
      }
    }
    .info_list{
      .info_item{
        min-height: 34px;
        border-bottom: 1px solid #E1E6EE;
        display: flex;
        padding-right: 10px;
        img{
          width: 20px;
          height: 20px;
        }
        div{
          // display: flex;
          align-items: center;
        }
        .index{
          width:36px;
          display: flex;
          justify-content: center;
        }
        .name{
          // max-width: 180px;
          width: 180px;
          display: flex;
          flex: 1;
        }
        .warningName{
          // max-width: 200px;
          width: 200px;
          flex: 1;
          display: flex;
          align-items: center;
          // flex-shrink: 0;
          // flex-grow: 0;
          // text-overflow: ellipsis;
          // overflow: hidden;
          // word-break: break-all;
          // white-space: nowrap;
          // line-height: 34px;
        }
        .times,.cars{
          width:64px;
          text-align: center;
          line-height: 34px;

        }
        .deadNum{
          width:60px;
          text-align: center;
          text-align: right;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .people{
          line-height: 34px;
        }
      }
      .no_line{
        border-bottom:none;
      }
    }
 }
 .empty_wrapper{
  display: flex;
  align-items: center;
  justify-content: center;
  img{
    width: 50%;
  }
 }
 </style>
   