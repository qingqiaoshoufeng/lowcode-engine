<script setup>
const emits = defineEmits('searchCallback');

const handleSearch = () => {
  emits('searchCallback');
}
</script>

<template>
  <div class="search-btn">
    <img class="collect" src="../../assets/images/icon-collect@2x.png" alt="" />
    <van-button type="primary" size="small" round @click="handleSearch">查询</van-button>
  </div>
</template>

<style lang="scss" scoped>
.search-btn {
  width: 100%;
  height: 66px;
  position: absolute;
  bottom: 56px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  .collect {
    width: 34px;
    height: 34px;
  }
}
</style>
