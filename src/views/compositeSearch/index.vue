<script setup>
import { ref } from 'vue'

const searchType = ref(1)
</script>

<template>
  <div class="composite-search">
    <van-tabs v-model:active="searchType">
      <van-tab title="警情" :name="1"></van-tab>
      <van-tab title="出动" :name="2"></van-tab>
      <van-tab title="指挥部出动" :name="3"></van-tab>
      <van-tab title="火灾" :name="4"></van-tab>
    </van-tabs>
  </div>
</template>

<style lang="scss" scoped>
.composite-search {
}
</style>
