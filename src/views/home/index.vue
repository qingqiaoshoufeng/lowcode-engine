<template>
  <div class="home">
    <div class="time" @click="openTimePop">
        <span>{{ currentTime[0] }}</span>年<span>{{ currentTime[1]}}</span><span v-show="currentTime[1] !== '全年'">月</span>
        <div class="triangle "></div>
    </div>
    <div class="wrapper">
      <div class="card_list" v-if="!isStanding">
        <div>
          <DisplayCard :info="policeCardInfo" color="blue"/>
        </div>
        <div>
          <DisplayCard :info="fireCardInfo" color="red"/>
        </div>
        <div>
          <DisplayCard :info="dispatchCardInfo" color="green"/>
        </div>
      </div>
      <NoticeList class="notice_list" :list="noticeList" @click="goNotice"/>
      <template v-if="!isStanding">
        <StatisticsInfo class="pt10 statistics_info" ref="statisticsInfoRef" :list="statisticsList" title="整体概况" :withTab="!isStanding" />
        <Chart class="mt10" title="百万人口火灾" type="FireInfo" :chartData="FireInfoList"/>
        <Chart class="mt10" title="火警平均出动时长（分钟)" type="DispatchInfo" :chartData="DispatchInfoList" />
        <YearRank class="mt10 year_rank" title="全年榜单 TOP10"  type="FireInfo" :handleChange="getRank" :list="rankList"/>
        <Chart class="mt10" title="高频起火原因" type="InitialFuels" :chartData="InitialFuelsList" />
      </template>
      <template v-else>
        <StatisticsInfo :list="policelist" class="pt10 statistics_info" title="辖区警情统计" />
        <StatisticsInfo :list="dispatchList" class="pt10 statistics_info" title="出动情况统计" />
        <StatisticsInfo :list="fitghtList" class="pt10 statistics_info"  title="战斗成果统计" />
        <Chart class="mt10" title="途中时长分布" type="WayTime" :chartData="WayTimeList"/>
        <Chart class="mt10" title="战斗时长分布" type="FightingTime" :chartData="FightingTimeList" />
        <Chart class="mt10" title="参战形式分布" type="FireArea"/>
      </template>
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
import YearRank from './components/YearRank.vue'
import Chart from './components/Chart.vue'
import {ref} from 'vue'

const currentab = ref(1)
const statisticsInfoRef = ref(null)
const show=ref(true)
const dataPickerRef = ref(null)
const {
  currentTime,
  isShow,
  openTimePop,
  policeCardInfo,
  dispatchCardInfo,
  fireCardInfo,
  // confirmTime,
  isStanding,
  FireInfoList,
  InitialFuelsList,
  WayTimeList,
  FightingTimeList,
  statisticsList,
  fitghtList,
  policelist, //
  dispatchList,
  DispatchInfoList,
  noticeList,
  rankList,
  getRank,
  goNotice
} = useSearch({dataPickerRef,statisticsInfoRef})


</script>
  
<style scoped lang="scss">
.home{
    background-image: url('~@/assets/images/mine-bg.png');
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: 0% 0%;
    overflow: hidden;
    background-color: #F6F7F8;
    height: 100%;
    padding-top: 94px;
    padding-bottom: 56px;
    overflow-y: scroll;
    .time{
        margin-bottom: 18px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding-right: 20px;
        .triangle{
          margin-left: 4px;
          margin-top: 2px;
          width: 0;
          height: 0;
          border-top: 6px solid #fff;
          border-right: 6px solid transparent;
          border-left: 6px solid transparent;
        }
    }
    .wrapper{
      border-radius: 16px;
      background-color: #F6F7F8 ;
      // padding: 16px 16px 0px;
      padding-top: 16px;
      .card_list{
        height: 78px;
        width: 100%;
        display: flex;
        padding: 0 16px;
        padding-bottom: 12px;;
        background: #fff;
        >div{
          // width: 108px;
          flex:1;
          display: flex;
          align-items: center;
          justify-content: center;
          
        }
        .red{
          margin: 0 9px;
        }
      }
      .year_rank,.notice_list{
        // height: 100px;
        background: #F7F8FF;
        border-radius: 4px;
        // margin-top: 12px;
      }
      .year_rank{
        background: #fff;
      }
    } 
    .mt10{
      margin-top: 10px;
    }
    .pt10{
      padding-top: 10px;
    }
    .statistics_info{
      padding-bottom: 15px;
    }
}
</style>
  