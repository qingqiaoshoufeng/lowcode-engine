<script setup>
import { ref } from "vue";

const props = defineProps({
  value: {
    type: [String, Array],
    default: "",
  },
  options: {
    type: Array,
    default: () => [],
  },
  setHandleOk: {
    type: Function,
  },
});

const handleSelect = (item) => {};

const handleDelete = (item) => {};
</script>

<template>
  <div class="select-tags">
    <div class="select-tag">
      <div class="item-active" v-for="item in options" :key="item.boFireTagId">
        {{ item.tagName }}
        <van-icon name="cross" @click="handleDelete(item)" />
      </div>
    </div>
    <div class="total-tags">
      <div
        class="item"
        v-for="item in options"
        :key="item.boFireTagId"
        @click="handleSelect(item)"
      >
        {{ item.tagName }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.select-tags {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f6f7f8;
  padding: 10px 10px;
  .select-tag {
    width: calc(100% - 20px);
    background: #ffffff;
    border-radius: 4px;
    display: flex;
    padding: 10px 10px;
  }
  .total-tags {
    width: calc(100% - 20px);
    display: flex;
    background: #ffffff;
    border-radius: 4px;
    margin-top: 10px;
    padding: 10px 10px;
  }
  .item {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #323233;
    background: #f7f8fa;
    border-radius: 4px;
    padding: 5px 10px;
    margin-right: 10px;
  }
  .item-active {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #1942a8;
    background: rgba(14, 63, 175, 0.1);
    border-radius: 4px;
    border: 1px solid #0e3faf;
    padding: 5px 10px;
    margin-right: 10px;
  }
}
</style>
