<template>
  <div class="home">
    <div>1111</div>
    <Tabbar :currentTab="currentab" />
  </div>
</template>
  
<script setup>
import Tabbar from '@/component/tabbar/index.vue'
import {ref} from 'vue'
const currentab = ref(1)

</script>
  
<style scoped lang="scss" ></style>
  