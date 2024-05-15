<template>
  <div class="statistics_info" :class="color">
      <div class="min-title">{{ title }}</div>
      <div class="tab" v-if="withTab">
        <div 
          v-for="item in tabList" 
          :class="{isActive:(item.value === currentTab)}" 
          :key="item.label" 
          class="tab_item"
          @click="tabChange(item.value)"
        >{{ item.label }}</div>
      </div>
      <div v-if="currentTab === 0 && withTab" class="general">
        <div class="wrapper">
          <!-- <div class="tip_per">
              “-”表示同、环期无数据或者数据为0，无法计算出同环比
            </div> -->
          <div v-for="(itm, index) in generalInfo" :key="index" class="generalInfo_item" v-html="itm"></div>
        </div>
      </div>
      <div v-else-if="currentTab === 5 && withTab" class="general">
        <div class="wrapper">
          <!-- <div class="tip_per">
              “-”表示同、环期无数据或者数据为0，无法计算出同环比
            </div> -->
          <div v-for="(itm, index) in formInfo" :key="index" class="generalInfo_item" v-html="itm"></div>
        </div>
      </div>
      <div v-else class="card_list">
          <div class="card_item" :class="{ml9:index%2,[item.color]: withTab}" v-for="(item, index) in list.filter(item=>((item.type === currentTab) || !item.type))" :key="item.label">
              <div class="top">
                <div class="title" :style="item.labelStyle || {}">{{ item.title }}</div>
              </div>
              <div class="buttom">
                <div class="number">{{ item.number }}<span>{{ item.unit }}</span></div>
                <div class="percent" :class="getStatusColor(item.percent)">{{ (item.percent || '-').includes('-') ? item.percent : `+${item.percent}` }}</div>
              </div>
          </div>
      </div>
  </div>
</template>
  
<script setup>
import useTab from '../hooks/useTab.js'
// import { ref,onMounted  } from 'vue'
const props = defineProps({
  info:{
    type:Object,
    default:()=>({
      title:'标题',
      number:'数量',
      percent:'百分比',
    })
  },
  generalInfo: {
    type: Array,
  },
  formInfo:{
    type: Array,
  },
  color:{
    type:String
  },
  withTab:{
    default:false
  },
  title:{
    type:String
  },
  list:{
    type: Array,
    default:()=>([])
  },
  handleChange:{
    type:Function,
  }
})

// const isAutoJump = ref(true)
const {
  currentTab,
  tabList,tabChange} = useTab({
  list:[
    {
      label: '录入情况',
      value: 0,
    },
    {
      label:'警情',
      value:1,
    },
    {
      label:'出动',
      value:2,
    },
    {
      label:'火灾',
      value:3,
    },
    {
      label: '形势分析',
      value: 5,
    },
  ],
  defaultTab:5,
  handleChange:props.handleChange,
  paramsKey:'annual'
})

// 自动轮播暂时关闭
// const jumpNext = () => {
//   setTimeout(() => {
//     jumpNext()
//     if (!isAutoJump.value) {
//       return
//     }
//     const index = tabList.value.findIndex(item => item.value === currentTab.value)
//     currentTab.value = tabList.value[(index + 1) % tabList.value.length].value
//   }, 3000)
// }

// onMounted(() => {
//   jumpNext()
// })

const getStatusColor = (val) => {
  if ((val || '-').includes('-') && val !== '-') {
    return 'green'
  }
  else {
    return 'orange'
  }
}
</script>
<script>
export default {
  name:'StatisticsInfo'
}
</script>
  
<style scoped lang="scss">
.statistics_info{
  padding: 0 16px;
  background: #FFFFFF;
  .tab{
      // width: 220px;
      height: 30px;
      background: #F6F6F6;
      border-radius: 19px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 5px;
      margin-top: 5px;
      .tab_item{
        width: 68px;
        height: 22px;
        background: #F6F6F6;
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
      // background: #F6F6F6;
      background: #F3F7FD;
      border-radius: 4px;
      padding: 11px 10px 0 12px;
      box-sizing: border-box;
      margin-top: 10px;
      .title{
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #545A66;
        margin-bottom: 8px;
      }
      .buttom{
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .number{
        font-size: 18px;
        font-family: D-DINExp-Bold, D-DINExp;
        font-weight: bold;
        color: #0B2E59;
        max-width: 150px;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
        white-space: nowrap;
        max-width: 60%;
        overflow: hidden;
        >span{
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 12px;
          color: #333333;
          margin-left: 2px
        }
      }
      .percent{
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #FF7F2C;
        max-width: 40%;
        overflow: hidden;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
        white-space: nowrap;
      }
      .percent.green{
        color: #4ED274 ;
      }
      .percent.orange{
        color: #FF7F2C ;
      }
    }
    .blue.card_item{
      background: #F7FAFF;
      border-radius: 8px;
      border: 1px solid #E6E9EF;
    }

    .red.card_item{
      background: #EEF8F8;
      border-radius: 8px;
      border: 1px solid #B2E7D7;
    }
    .green.card_item{
      background: rgba(243,176,93,0.05);
      border-radius: 8px;
      border: 1px solid #F9D8B0;
    }
  }
  .isActive{
        color: #1833A9 !important;
        background-color: #FFFFFD !important;
      }
}

.tip_per{
    margin-top: 10px;
    color:red;
    font-size: 12px;
  }
.general{
  padding: 0 6px;
  .generalInfo_item{
    padding: 5px 5px;
    text-indent: 2em;
    background: linear-gradient(93deg, #E5F0FF 0%, #FFFFFF 100%);
    margin-top: 8px;
  }
}
.ml9{
  margin-left: 9px;
}
</style>
  