<template>
  <div class="display_card" :class="color">
    <div class="desc">
      <div class="title">{{ info.name }}</div>
      <div class="percent">{{ (info.percent || '-').includes('-') ? info.percent : `+${info.percent}`  }}</div>
    </div>
    <div class="number">
      <span>{{info.number }}</span>
      <span class="unit">{{ info.unit }}</span>
    </div>
  </div>
</template>
  
<script setup>
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
  }
})
</script>
<script>
export default {
  name:'DisplayCard'
}
</script>
  
<style scoped lang="scss">
.display_card{
  height: 100%;
  width: 108px;
  box-shadow: 0px 2px 6px 0px rgba(255,84,42,0.2);
  border-radius: 8px;
  padding-top: 9px;
  padding-left: 9px;
  padding-right: 7px;
  // margin: 16px;
  background: #FFFFFF;
  box-sizing: border-box;
  .desc{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .title{
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFFFF; 
    // min-width: 50px;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    white-space: nowrap;
  }
  .number{
    font-size: 18px;
    font-family: D-DINExp-Bold, D-DINExp;
    font-weight: bold;
    color: #FFFFFF;
    // max-width: 80px;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    white-space: nowrap;
    margin-top: 5px;
    .unit{
      float: right;
      font-size: 12px;
      font-weight: 400;
      margin-top: 4px;
    }
  }
  .percent{
    font-size: 11px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFFFF; 
    max-width: 150px;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    white-space: nowrap;
  }
}
.blue{
  background: linear-gradient(180deg, #355ECC 0%, #718DF6 100%);
  box-shadow: 0px 2px 6px 0px rgba(138,108,252,0.2);
}
.red{
  background: linear-gradient(180deg, #FF5B3E 0%, #FF846F 100%);
  box-shadow: 0px 2px 6px 0px rgba(255,84,42,0.2);
}
.green{
  background: linear-gradient(180deg, #38C68C 0%, #66E3C0 100%);
  box-shadow: 0px 2px 6px 0px rgba(73,198,148,0.2);
}
</style>
  