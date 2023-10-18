<template>
  <div class="home">
    <div class="time" @click="openTimePop">
        <span>{{ Time.of(currentTime).getYear() }}</span>年 <span>{{ Time.of(currentTime).getMonth() }}</span>月
    </div>
  </div>
  <AllTimePicker v-model:show="isShow.time" />
  <Tabbar :currentTab="currentab" />
</template>
  
<script setup>
import Tabbar from '@/component/tabbar/index.vue'
import AllTimePicker from '@/component/AllTimePicker/index.vue'
import useSearch from './hooks/useSearch.js'
import Time from '@/utils/time.js'
import {ref} from 'vue'
const currentab = ref(1)
const show=ref(true)
const dataPickerRef = ref(null)
const {
  currentTime,
  minDate,
  maxDate,
  isShow,
  openTimePop,
  confirmTime,
  formatter,
  filterOptions
} = useSearch({dataPickerRef})


</script>
  
<style scoped lang="scss">
.home{
    background-image: url('~@/assets/images/mine-bg.png');
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: 0% 0%;
    overflow: hidden;
    background-color: #F6F7F8;
    padding: 82px 16px 0px;
    height: 100%;
}
</style>
  