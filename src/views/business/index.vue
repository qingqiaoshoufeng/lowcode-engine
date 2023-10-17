<template>
    <div class="title">标题</div>
    <div class="statistics">
        <DisplayEntry />
        <DisplayEntry />
        <DisplayEntry />
        <DisplayEntry />
        <DisplayEntry />
    </div>
    <Tabbar :currentTab="currentab" />
  </template>
    
<script setup>
import {ref} from 'vue'
const currentab = ref(3)
  
</script>
    
<style scoped lang="scss">
 .title{
        position: fixed !important;
        top: 0;
        height: 44px;
        line-height: 44px;
        background-color: #0C207F;
        color: #fff;
        width: 100%;
        text-align: center;
        font-size: 20px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #FFFFFF;
    }
.statistics{
    margin-top: 60px;
    padding:0 16px;
    background-color: #fff;
   
}

</style>
    