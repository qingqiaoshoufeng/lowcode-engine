<template>
    <div class="entry_list">
        <van-cell v-for="item in list" :key="item.label" title="单元格" is-link @click="handleItem(item)">
            <template #title>
                <div class="title" @click="item.click">
                    <img :src="item.icon" alt="">
                    <div class="label">
                      {{ item.label }}
                      <div class="dot" v-if="item.number">{{ item.number }}</div>
                    </div>
                </div>
            </template> 
        </van-cell>
    </div>
  </template>
  
<script setup>
import { Item } from "@castle/ant-design-vue/lib/menu";
import {defineProps } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  list:{
    default:()=>([]),
    type:Array
  }
})

const router = useRouter();

const handleItem = (item) => {
  if (item.path) {
    router.push({
      path: item.path,
    })
  }
}

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
    .label{
      position: relative;
      .dot{
        position: absolute;
        right: -15px;
        top:0;
        background: #FF3131;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        font-size: 12px;
        color: #fff;
        line-height: 16px;
        text-align: center;
      }
    }
  }
  </style>
  
    