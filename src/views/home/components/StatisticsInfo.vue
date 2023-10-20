<template>
  <div class="statistics_info" :class="color">
      <div class="min-title">{{ title }}</div>
      <div class="tab" v-if="withTab">
        <div v-for="item in tabList" :key="item.label" class="tab_item">{{ item.label }}</div>
      </div>
      <div class="card_list">
          <div class="card_item" :class="{ml9:index%2}" v-for="(item, index) in cardList" :key="item.label">
              <div class="top">
                <div class="title">{{ item.title }}</div>
              </div>
              <div class="buttom">
                <div class="number">{{ item.number }}</div>
                <div class="percent">{{ item.percent }}</div>
              </div>
          </div>
      </div>
  </div>
</template>
  
<script setup>
import { cardList} from '../config.js'
const props = defineProps({
  info:{
    type:Object,
    default:()=>({
      title:'标题',
      number:'数量',
      percent:'百分比',
    })
  },
  color:{
    type:String
  },
  withTab:{
    default:false
  },
  title:{
    type:String
  }
})

const tabList = [
  {
    label:'警情'
  },{
    label:'出动'
  },
  {
    label:'火灾'
  }
]
</script>
<script>
export default {
  name:'DisplayCard'
}
</script>
  
<style scoped lang="scss">
.statistics_info{
  padding: 0 16px;
  background: #FFFFFF;
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
        width: 68px;
        height: 22px;
        background: #FFFFFD;
        border-radius: 19px;
        align-items: center;
        display: flex;
        justify-content: center;
    }
  }
  .card_list{
    display: flex;
    flex-wrap:wrap;
    .card_item{
      width: 164px;
      height: 76px;
      background: #F3F7FD;
      border-radius: 4px;
      padding: 11px 10px 0 12px;
      box-sizing: border-box;
      margin-top: 10px;
      .title{
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #545A66;
      }
      .buttom{
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .number{
        font-size: 21px;
        font-family: D-DINExp-Bold, D-DINExp;
        font-weight: bold;
        color: #0B2E59;
      }
      .percent{
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #FF7F2C;
      }
    }
  }
}
.ml9{
  margin-left: 9px;
}
</style>
  