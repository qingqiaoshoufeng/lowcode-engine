<script setup>
import { onMounted, ref, watch, computed, nextTick } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  state: {
    type: Boolean,
    default: true,
  },
  showOpenClose: {
    type: Boolean,
    default: true,
  }
});

const openState = ref(props.state);

const handleClose = (value) => {
  openState.value = value
}

defineOptions({
  name: "ProCard",
});
</script>

<template>
  <div class="pro-card">
    <div class="pro-card-title">
      <img src="@/assets/images/icon_title@2x.png" alt="" />
      <span>{{ title }}</span>
      <van-icon v-if="openState && showOpenClose" name="arrow-up" class="arrow" @click="handleClose(false)" />
      <van-icon v-else-if="showOpenClose" name="arrow-down" class="arrow" @click="handleClose(true)" />
    </div>
    <div v-if="openState" class="pro-card-content" :style="{ height: openState ? 'unset' : '0px;' }">
      <slot />
    </div>
    <div class="pro-card-close" v-if="openState && showOpenClose" @click="handleClose(false)">收起</div>
  </div>
</template>

<style lang="scss" scoped>
.pro-card {
  display: flex;
  flex-direction: column;
  background-color: white;
  margin-bottom: 10px;
  .pro-card-title {
    display: flex;
    align-items: center;
    padding: 10px 16px;
    img {
      width: 14px;
      height: 18px;
      margin-right: 10px;
    }
    span {
      font-size: 14px;
      font-weight: bold;
    }
    .arrow {
      font-size: 14px;
      color: #8D94A1;
      margin-left: auto;
    }
  }
  .pro-card-content {

  }
  .pro-card-close {
    font-size: 14px;
    color: var(--van-primary-color);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 10px;
  }
}
</style>
