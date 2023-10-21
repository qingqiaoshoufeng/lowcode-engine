<template>
<div class="header-title" >
  <div class="arrow">
    <van-icon @click="router.go(-1)" name="arrow-left" />
  </div>
  <div>{{ title }}</div>
</div>
</template>
<script setup>
import router from '@/router/index.js'

const props = defineProps({
  title:{
    type:String,
    default:'标题'
  }
})
</script>

<script>
export default {
  name:'HeaderTitle'
}
</script>
<style lang="scss" scoped>
.header-title{
  height: 44px;
  background: #0C207F;
  display: flex;
  position: relative;
  font-size: 20px;
  color: #fff;
  text-align: center;
  justify-content: center;
  align-items: center;
  .arrow{
    position: absolute;
    top: 50%;
    left: 16px;
    font-size: 18px;
    transform: translateY(-50%);
  }
}
</style>