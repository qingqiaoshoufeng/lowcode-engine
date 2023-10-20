<template>
  <div class="year_rank">
    <div class="min-title">{{ title }}</div>
      <div class="tab">
        <div v-for="item in tabList" :key="item.label" class="tab_item">{{ item.label }}</div>
      </div>
      <div class="info_list">
        <div class="info_item" v-for="(item ,index) in infoList" :key="item.label">
          <div class="index">{{ index }}</div>
          <div class="name">{{ item.name }}</div>
          <div class="times">{{ item.times }}</div>
          <div class="cars">{{ item.cars }}</div>
          <div class="people">{{ item.people }}</div>
        </div>
      </div>
    </div>
 </template>
   
<script setup>
const tabList = [
  {
    label:'警接警出动'
  },
  {
    label:'亡人火灾'
  }
  
]
const infoList = [
  {
    name:'xxxxx救援站备份 7',
    times:'2330起',
    cars:'2330辆',
    people:'110人'
  },
  {
    name:'xxxxx救援站备份 7',
    times:'2330起',
    cars:'2330辆',
    people:'110人'
  },
  {
    name:'xxxxx救援站备份 7',
    times:'2330起',
    cars:'2330辆',
    people:'110人'
  }
]
const props = defineProps({
  chartData:{
    type:Array,
    default:[]
  },
  title:{
    type:String,
  }
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
    height: 263px;
    background: #FFFFFF;
    padding: 0 16px;;
    .tab{
      width: 220px;
      height: 30px;
      background: #F6F6F6;
      border-radius: 19px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 5px;
      .tab_item{
        width: 92px;
        height: 22px;
        background: #FFFFFD;
        border-radius: 19px;
        align-items: center;
        display: flex;
        justify-content: center;
    }
    }
    .info_list{
      .info_item{
        height: 34px;
        border-bottom: 1px solid #E1E6EE;
        display: flex;
        div{
          display: flex;
          align-items: center;
        }
        .index{
          width:36px;
          justify-content: center;
        }
        .name{
          width: 140px;
        }
        .times,.cars{
          width:64px;
        }
        
      }
    }
 }
 </style>
   