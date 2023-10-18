<template>
  <div class="fire_info">
    <div class="min-title mt10">百万人口火灾</div>
    <div ref="chartRef" class="chart"></div>
  </div>
 </template>
   
<script setup>
import { onMounted,ref } from 'vue';
import useChat from '@/hooks/useChart/index.js'
const chartRef = ref(null)
onMounted(()=>{
  const {init} = useChat(chartRef)
  const instance = init()
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
 .mt10{
    margin-top: 10px;
 }
 </style>
   