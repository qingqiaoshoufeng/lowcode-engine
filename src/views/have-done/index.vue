<template>
 <HeaderTitle title="我的已办"/>
 <div class="statistics">
    <template v-for="(item, index) in menuListMap" :key="index">
      <DisplayEntry
        v-if="item && item.length"
        :list="item"
        :title="titleList[index]"
      />
    </template>
  </div>
</template>
<script setup>
import {menuListMap,titleList} from './config.js'
</script>
<style lang="scss" scoped>
.statistics {
  height: calc(100% - 88px - 56px);
  // margin-top: 88px;
  padding: 18px 16px 10px 16px;
  background-color: #fff;
  overflow-y: auto;
}
</style>