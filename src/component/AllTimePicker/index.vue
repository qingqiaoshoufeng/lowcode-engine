<script setup>
import useAllTimePicker from './hooks/useAllTimePicker.js'
import {computed } from 'vue'
// console.log(defineEmits,computed);
const props = defineProps({
  columns:{
    default:()=>([]),
    type:Array
  },
  defaultValue:{
    type:Array,
    default:()=>([])
  },
  formatter:{
    type:Function,
    default:(type,val)=>{
      if(type === 'year'){
        return val + '年'
      }
      if(type === 'month'){
        return val + '月'
      }
    }
  },
  clearformat:{
    type:Function,
    default:(type,val)=>{
      if(type === 'year'){
        return val.replace(/年/g,"")
      }
      if(type === 'month'){
        return val.replace(/月/g,"")
      }
    }
  },
  show:{
    default:false,
    type:Boolean
  }
})
const emit = defineEmits(['update:defaultValue','update:show'])


const { columsData ,isShow, onConfirm, onCancel} = useAllTimePicker(props,emit)
</script>
<script>
export default {
  name: 'AllTimePicker',
}
</script>
<template>
  <van-popup :show="isShow" position="bottom" :style="{ height: '50%' }">
    <van-picker
        title="选择时间"
        :columns="columsData"
        @confirm="onConfirm"
        @cancel="onCancel"
        @change="onChange"
    />
  </van-popup>
</template>
<style>
</style>
