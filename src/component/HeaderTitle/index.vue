<template>
  <div class="header-title" >
    <div v-if="showArrow" class="arrow">
      <van-icon @click="router.go(-1)" name="arrow-left" />
    </div>
    <div v-if="withCheck">
      <slot name="check" />
    </div>
    <div v-else>{{ title }}</div>
   
    <div class="explain">
      <slot name="explain" />
    </div>
  </div>
</template>
<script setup>
import router from '@/router/index.js'

const props = defineProps({
  title:{
    type:String,
    default:''
  },
  withCheck:{
    type:Boolean,
    default:false
  },
  showArrow: {
    type: Boolean,
    default: true
  }
})
</script>

<script>
export default {
  name:'HeaderTitle'
}
</script>
<style lang="scss" scoped>
.header-title {
  height: 44px;
  background: var(--van-header-title-color);
  display: flex;
  position: relative;
  font-size: 18px;
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
  .explain{
    position: absolute;
    right: 16px;
  }
}
</style>