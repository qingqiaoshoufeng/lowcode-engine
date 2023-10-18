<template>
    <div class="mine">
      <InfoCard />
      <ListEntry :list="entryList" class="mt9" />
    </div>
    <Tabbar :currentTab="currentab" />
  </template>
    
<script setup>
import {ref} from 'vue'
import InfoCard from './components/InfoCard.vue' 
import {entryList} from './config.js'
const currentab = ref(5)
  
</script>
    
<style scoped lang="scss">
.mine{
    background-image: url('~@/assets/images/mine-bg.png');
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: 0% 0%;
    overflow: hidden;
    background-color: #F6F7F8;
    padding: 82px 16px 0px;
    height: 100%;
    .mt9{
        margin-top: 9px;
    }

}
</style>
    