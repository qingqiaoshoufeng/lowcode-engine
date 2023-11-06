<script setup>
import { computed, inject, onMounted, provide, ref } from "vue";
import dayjs from "dayjs";

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  withHeader:{
    default:true,
    type:Boolean
  }
});

defineOptions({
  name: "ProSteps",
});
</script>
<script>
export default {
  name: "ProSteps"
}
</script>

<template>
  <div id="proSteps" class="pro-steps">
    <div id="proSteps-title" v-if="withHeader" class="steps-header">
      <img src="@/assets/images/icon_title@2x.png" alt="" />
      <strong>操作记录</strong>
    </div>
    <div v-for="(item, index) in data" :key="index" class="steps-wrap">
      <div class="steps-name" :class="{ green: index === 0 }">
        {{ item.transferType }}
      </div>
      <div class="steps-box">
        <div class="steps-icon" />
        <div v-if="index < data.length - 1" class="steps-line" />
      </div>
      <div class="steps-content">
        <div class="steps-title">
          {{ item.createOrg }}
        </div>
        <div>{{ dayjs(item.createDate).format("YYYY-MM-DD HH:mm:ss") }}</div>
        <div v-if="item.advice">审批意见：{{ item.advice }}</div>
        <div v-if="item.remark">备注：{{ item.remark }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pro-steps {
  display: flex;
  flex-direction: column;
  padding: 10px 0 10px 10px;
  background-color: white;
  .steps-header {
    font-size: 16px;
    font-weight: 500;
    color: #1f2329;
    margin-bottom: 10px;
    span {
      color: #0f7de4;
      margin-right: 10px;
    }
    img {
      width: 14px;
      height: 16px;
      margin-right: 10px;
    }
  }
}
.steps-wrap {
  display: flex;
  .steps-name {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: bold;
    color: #2f6bff;
    width: 65px;
    text-align: right;
    &.green {
      color: #3cd757;
    }
  }
  .steps-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 6px 16px 0 6px;
    .steps-icon {
      width: 9px;
      height: 9px;
      background: #d8e4ff;
      box-shadow: 0px 0px 4px 0px rgba(89, 171, 255, 0.5);
      border: 1px solid #1f67ff;
      border-radius: 100%;
      margin-bottom: 6px;
    }
    .steps-line {
      width: 1px;
      min-height: 70px;
      border: 1px solid #9ec2ff;
      flex: 1;
    }
  }
  .steps-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    font-size: 14px;
    font-weight: 400;
    color: #48556a;
    .steps-title {
      font-weight: bold;
      display: flex;
      align-items: center;
      span {
        font-size: 11px;
        font-weight: 400;
        color: #7989a1;
      }
    }
  }
}
</style>
