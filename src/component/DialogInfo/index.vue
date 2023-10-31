<template>
<van-dialog v-bind="$attrs" :show="visible" :title="title" show-cancel-button @confirm="setHandleOk" @cancel="cancel">
  <template v-slot:title>
    <div class="header">
      <div class="title">{{title }}</div>
      <div class="cha">×</div>
    </div>
  </template>
  <div>
    <slot :setHandleOk="setHandleOk" />
  </div>
</van-dialog>
</template>
<script setup>
import { watch } from 'vue';
import {} from ''
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
// const beforeConfirm = (val)=>{
  
// }
// const setHandleOk = (fn)=>{
//   beforeConfirm = fn
// }

// const confirm = ()=>{
//   beforeConfirm()
// }
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
</style>