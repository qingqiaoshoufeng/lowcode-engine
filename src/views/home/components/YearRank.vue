<template>
  <div class="year_rank">
    <div class="min-title">{{ title }}</div>
      <div class="tab">
        <div 
          :class="{isActive:(item.value === currentTab)}" 
          v-for="item in tabList" :key="item.label" 
          class="tab_item"
          @click="tabChange(item.value)"
        >{{ item.label }}</div>
      </div>
      <div class="info_list">
        <div class="info_item" :class="{no_line:index===9}" v-for="(item,index) in list" :key="item.name + currentTab">
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
      label:'警接警出动',
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

</script>
<script>
export default {
  name:'YearRank'
}
</script>
   
 <style scoped lang="scss">
 .year_rank{
    width: 100%;
    min-height: 263px;
    background: #FFFFFF;
    padding: 0 16px;
    padding-bottom: 5px;
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
        height: 34px;
        border-bottom: 1px solid #E1E6EE;
        display: flex;
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
          max-width: 180px;
          width: 180px;
          // flex-shrink: 0;
          // flex-grow: 0;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
          white-space: nowrap;
          line-height: 34px;
        }
        .warningName{
          max-width: 200px;
          width: 200px;
          // flex-shrink: 0;
          // flex-grow: 0;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
          white-space: nowrap;
          line-height: 34px;
        }
        .times,.cars{
          width:64px;
          text-align: center;
          height: 34px;
        }
        .deadNum{
          width:80px;
          text-align: center;
          height: 34px;
        }
        .people{
          height: 34px;
        }
      }
      .no_line{
        border-bottom:none;
      }
    }
 }
 </style>
   