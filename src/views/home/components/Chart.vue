<template>
  <div class="fire_info">
    <div class="min-title mt10">{{ title }}</div>
    <div v-show="checkEmpty" class="empty_wrapper chart" id="chart">
      <img src="~@/assets/images/empty.png" alt="">
    </div>
    <div v-show="!checkEmpty" ref="chartRef" id="chart" class="chart"></div>
  </div>
 </template>
   
<script setup>
import { nextTick, onMounted,ref, watch,computed } from 'vue';
import useChat from '@/hooks/useChart/index.js'
const chartRef = ref(null)
const props = defineProps({
  chartData:{
    type:[Array,Object,String]
  },
  type:{
    type:String,
    require:true
  },
  title:{
    type:String,
  }
})
const {init,render} = useChat({dom:chartRef,type:props.type})
watch(()=>props.chartData,(val)=>{
  nextTick(()=>{
    render(val)
  })
},{
  immediate:true
})
const checkEmpty = computed(()=>{
  if(!props.chartData || props.chartData.length === 0){
    return true
  }else{
    false
  }
})
</script>
 <script>
 export default {
   name:'Chart'
 }
 </script>
   
 <style scoped lang="scss">
 .fire_info{
    width: 100%;
    height: 263px;
    background: #FFFFFF;
    padding: 0 16px;
    padding-top: 10px;
 }
 .chart{
  width: 343px;
  height: 230px;
 }
 .mt10{
    margin-top: 10px;
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
   