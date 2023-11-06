<template>
<div class="tips-selected-multiple">
  <div class="wrapper">
    <div 
      class="tip_item" 
      :class="{'is_active'
      :defaultValue === item.value}" 
      v-for="item in list" 
      :key="item.label"
      @click="click(item)"
    >
     {{ item.label }}
    </div>
  </div>
</div>
</template>
<script setup>
import { ref } from 'vue'
const props = defineProps({
  list:{
    type:Array,
    default:()=>([])
  },
  defaultValue:{
    type:Array,
    default:()=>([])
  }
})
const emit = defineEmits(['update:defaultValue'])
const click = (data)=>{
  if(props.defaultValue.includes(data.value)){
    emit('update:defaultValue',[...props.defaultValue,data.value])
  }else{
    emit('update:defaultValue',props.defaultValue.filter(item=>item.value === data.value))
  }
}
</script>
<script>
export default {
  name:'TipsSelectedMultiple'
}
</script>
<style lang="scss" scoped>
.tips-selected-multiple{
  overflow-x: scroll;
  .wrapper{
    // width: auto;
    display: inline-block;
    overflow: hidden;
    display: flex;
    .tip_item {
      flex-shrink: 0;
      flex-grow: 0;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #1942A8;
      line-height: 17px;
      // display: inline-block;
      float: left;
      height: 24px;
      line-height: 24px;
      padding: 0 10px;
      border-radius: 2px;
      border: 1px solid #E0E0E0;
      background-color: #fff;
    }
    .tip_item.is_active{
      border: 1px solid #E0E0E0;

    }
  }
}
</style>