<template>
<van-dialog class="dialog—info" v-bind="$attrs" :show="visible" :title="title" show-cancel-button @confirm="confirm" @cancel="cancel">
  <template v-slot:title>
    <div class="header">
      <div class="title">{{title }}</div>
      <div class="cha" @click="close">×</div>
    </div>
  </template>
  <div class="content">
    <slot :setHandleOk="setHandleOk" />
  </div>
</van-dialog>
</template>
<script setup>
import { watch } from 'vue';
// import {} from ''
const props = defineProps({
  visible:{
    default:false,
    type:Boolean
  },
  title:{
    type:String,
    default:'标题'
  }
})
let beforeConfirm = (val)=>{
  
}
const setHandleOk = (fn)=>{
  beforeConfirm = fn
}
const close = ()=>{
  emit('update:visible',false)
}
const confirm = async()=>{
  beforeConfirm(close)
  // emit('update:visible',false)
}
const emit = defineEmits(['update:visible'])
const cancel = ()=>{
  emit('update:visible',false)
}
</script>
<script>
export default {
  name:'DialogInfo'
}

</script>
<style scoped lang="scss">
.header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 19px;
  padding-bottom: 5px;
  .title{
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #323233;
    line-height: 22px;
  }
  .cha{
    font-size: 22px;
    color:#C8C9CC;

  }
}
.dialog—info{
  :deep(.van-dialog__header){
    padding-top: 13px !important;
  }
}
.content{
    padding-left: 19px !important;
    padding-right: 19px !important;
}
</style>