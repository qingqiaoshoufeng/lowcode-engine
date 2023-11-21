<template>
    <div class="entry_list">
        <van-cell v-for="item in list" :key="item.label" title="单元格" is-link>
            <template #title>
                <div class="title" @click="item.click">
                    <img :src="item.icon" alt="">
                    <div class="label">{{ item.label }}</div>
                </div>
            </template> 
        </van-cell>
    </div>
  </template>
  
<script setup>
import {defineProps } from "vue";
const props = defineProps({
  list:{
    default:()=>([]),
    type:Array
  }
})

</script>
<script>
export default {
  name:'ListEntry'
}
</script>
<style lang="scss" scoped>
  .entry_list{
    width: 100%;
    background-color: #fff;
    justify-content: space-between;
    border-radius: 8px;
    overflow: hidden;
    .title{
        display: flex;
        align-items: center;
        img{
            height: 18px;
            width: 18px;
            display: block;
            margin-right: 11px;
        }
    }
  }
  </style>
  
    