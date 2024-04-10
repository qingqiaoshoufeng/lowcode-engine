<template>
<div class="tips-selected-multiple">
  <div class="wrapper">
    <div 
      class="tip_item" 
      :class="{'is_active':value.some(itm=>(itm.key === item.key))}" 
      v-for="item in menus" 
      :key="item.label"
      @click="click(item)"
    >
     {{ item.label }}
     <img v-show="value.some(itm=>(itm.key === item.key))" src="~@/assets/images/selected_angle.png" alt="">
    </div>
  </div>
</div>
</template>
<script setup>
import { ref } from 'vue'
defineOptions({
  name: 'SelectTags'
})
const props = defineProps({
  menus:{
    type:Array,
    default:()=>([])
  },
  selects:{
    type:Array,
    default:()=>([])
  },
  selectCallback:{
    type:Function
  },
  multiple:{
    default:true
  }
})

const value = ref(props.selects)
const emit = defineEmits(['update:value'])
const click = (data)=>{
  let selects
  if(props.multiple){
    if(value.value.some(item=>item.key === data.key)){
      selects = value.value.filter(item=>item.key !== data.key)
    }else{
      selects= [...value.value,{
        checked: data.key,
        hidden: false,
        key: data.key,
        label:data.label,
      }]
    }
  }else{
    selects = [
      {
        checked: data.key,
        hidden: false,
        key: data.key,
        label:data.label,
      }
    ]
  }
 
  value.value = selects
  props.selectCallback(value)
}
</script>
<!-- <script>
export default {
  name:'SelectTags'
}
</script> -->
<style lang="scss" scoped>
.tips-selected-multiple{
  overflow-x: scroll;
  scrollbar-width: none;
  padding-bottom: 7px;
  .wrapper{
    // width: auto;
    display: inline-block;
    display: flex;
    // background-color: #fff;
    padding-bottom: 5px;
    .tip_item {
      flex-shrink: 0;
      flex-grow: 0;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 17px;
      // display: inline-block;
      float: left;
      height: 24px;
      line-height: 24px;
      padding: 0 10px;
      border-radius: 2px;
      border: 1px solid #E0E0E0;
      background-color: #fff;
      margin-left: 10px;
      position: relative;
      img{
        position: absolute;
        bottom: 0;
        right: 0;
        width: 14px;
        height: 14px;
      }
    }
    .tip_item.is_active{
      border: 1px solid #1942A8;
      color: #1942A8;
    }
  }
}
</style>