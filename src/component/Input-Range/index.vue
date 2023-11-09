<template>
  <div class="input-range">
    <van-field v-model="modelValue[0]" :placeholder="placeholder[0]" type="number" @update:model-value="change"/> 
      <span>~</span>
    <van-field v-model="modelValue[1]" :placeholder="placeholder[1]" type="number" @update:model-value="change" />
  </div>
</template>
<script setup>
import { ref } from 'vue';
const props = defineProps({
  start:{
    type:[String,Number],
    default:''
  },
  end:{
    type:[String,Number],
    default:''
  },
  placeholder:{
    type:Array,
    default:()=>(['请输入起始值,请输入结尾值'])
  }
})
const modelValue = ref([])
const emit = defineEmits(['update:start','update:end'])
const change = ()=>{
  emit('update:start',modelValue.value[0])
  emit('update:end',modelValue.value[1])
}

</script>
<script>
export default {
  name:"Input-Range"
}
</script>
<style lang="scss" scoped>
.input-range{
  display: flex;
  align-items: center;
}
</style>