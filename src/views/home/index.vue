<template>
  <div class="home">
    <div class="time" @click="openTimePop">
        <span>{{ currentTime[0] }}</span>年 <span>{{ currentTime[1]}}</span>月
    </div>
    <div class="wrapper">
      <div class="card_list">
        <DisplayCard v-for="item in cardList" :key="item.title" :color="item.color" />
      </div>
      <NoticeList class="notice_list" />
      <StatisticsInfo class="statistics_info" />
      <FireInfo />
    </div>
  </div>
  <AllTimePicker v-model:show="isShow.time" v-model:defaultValue="currentTime"/>
  <Tabbar :currentTab="currentab" />
</template>
  
<script setup>
import Tabbar from '@/component/tabbar/index.vue'
import AllTimePicker from '@/component/AllTimePicker/index.vue'
import useSearch from './hooks/useSearch.js'
import DisplayCard from './components/DisplayCard.vue'
import NoticeList from './components/NoticeList.vue'
import StatisticsInfo from './components/StatisticsInfo.vue'
import FireInfo from './components/FireInfo.vue'
import Time from '@/utils/time.js'
import {ref} from 'vue'
const currentab = ref(1)
const show=ref(true)
const dataPickerRef = ref(null)
const {
  currentTime,
  minDate,
  maxDate,
  isShow,
  openTimePop,
  cardList,
  confirmTime,
  formatter,
  filterOptions
} = useSearch({dataPickerRef})


</script>
  
<style scoped lang="scss">
.home{
    background-image: url('~@/assets/images/mine-bg.png');
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: 0% 0%;
    overflow: hidden;
    background-color: #fff;
    height: 100%;
    padding-top: 56px;
    overflow-y: scroll;
    .time{
        margin-bottom: 18px;
    }
    .wrapper{
      border-radius: 16px;
      background-color: #fff;
      padding: 16px 16px 0px;
      .card_list{
        height: 66px;
        width: 100%;
        display: flex;
        .red{
          margin: 0 9px;
        }
      }
      .notice_list{
        // height: 100px;
        background: #F7F8FF;
        border-radius: 4px;
        margin-top: 12px;
      }
    } 
}
</style>
  