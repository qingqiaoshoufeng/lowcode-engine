<script setup>
import useAllTimePicker from './hooks/useAllTimePicker.js'
// import {defineEmits,computed } from 'vue'
// console.log(defineEmits,computed);
const props = defineProps({
  columns:{
    default:()=>([]),
    type:Array
  },
  defaultValue:{
    type:Array,
    default:false
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
  show:{
    default:false,
    type:Boolean
  }
})
debugger;
const emit = defineEmits(['update:defaultValue','update:show'])

const isShow = computed({
  get(){
    // debugger;
    return !!props.show
  },
  set(val){
    debugger;
    emit('update:show',val)
  }
})
const { columsData , onConfirm, onCancel} = useAllTimePicker(props)
</script>
<script>
export default {
  name: 'AllTimePicker',
}
</script>
<template>
  <van-popup :show="isShow" position="bottom" :style="{ height: '50%' }">
    <van-picker
        title="标题"
        :columns="columsData"
        @confirm="onConfirm"
        @cancel="onCancel"
        @change="onChange"
    />
  </van-popup>
</template>
<style>
</style>
