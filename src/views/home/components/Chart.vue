<template>
  <div class="fire_info">
    <div class="min-title mt10">{{ title }}</div>
    <div ref="chartRef" id="chart" class="chart"></div>
  </div>
 </template>
   
<script setup>
import { nextTick, onMounted,ref, watch } from 'vue';
import useChat from '@/hooks/useChart/index.js'
const chartRef = ref(null)
const props = defineProps({
  chartData:{
    type:[Array,Object]
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
setTimeout(()=>{
  const data = null
  render() 
},2000)

watch(()=>props.chartData,(val)=>{
  nextTick(()=>{
    render(val)
  })
})

</script>
 <script>
 export default {
   name:'DisplayCard'
 }
 </script>
   
 <style scoped lang="scss">
 .fire_info{
    width: 100%;
    height: 263px;
    background: #FFFFFF;
 }
 .chart{
  width: 343px;
  height: 230px;
 }
 .mt10{
    margin-top: 10px;
 }
 </style>
   