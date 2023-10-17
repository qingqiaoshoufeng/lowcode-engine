<template>
    <div class="mine">
      <ListEntry />
      <Tabbar :currentTab="currentab" />
    </div>
  </template>
    
<script setup>
import {ref} from 'vue'
const currentab = ref(5)
  
</script>
    
<style scoped lang="scss">
.mine{
    background-image: url('~@/assets/images/mine-bg.png');
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: 0% 0%;
    overflow: hidden;
    background-color: #fff;
}
</style>
    