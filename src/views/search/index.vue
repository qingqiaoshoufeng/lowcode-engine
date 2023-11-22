<template>
  <div class="statistics">
    <!-- <HeaderTitle withCheck>
      <template v-slot:check="">
        <div @click="checkSearch">
          <div class="">111</div>
        </div>
      </template>
    </HeaderTitle> -->
    <component :is="globalSearch" />
    <Tabbar :currentTab="currentab" />
  </div>
</template>
    
<script setup>
import Tabbar from '@/component/tabbar/index.vue'
import globalSearch from '@/views/globalSearch/index.vue'
import {ref} from 'vue'
const currentab = ref(2)
const searchType = 'globalSearch'
const checkSearch = ()=>{
  
}
  
</script>
    
<style scoped lang="scss" ></style>
    