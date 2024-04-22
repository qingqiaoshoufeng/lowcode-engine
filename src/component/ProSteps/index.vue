<script setup>
import { computed, inject, onMounted, provide, ref } from "vue";
import dayjs from "dayjs";
import { generateColorByState, formatYmdHm } from '@/utils/tools.js'

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  withHeader:{
    default:true,
    type:Boolean
  },
  detail: {
    type: Object,
    default: () => ({}),
  },
});

const renderState = (item) => {
  if (['警情确认', '出动审核', '火灾审核'].includes(item.transferType) && item.advice?.indexOf('退回') > -1) {
    return true
  }
  if (['任务退回', '警情驳回', '退回上一级', '退回填报员', '出动驳回', '火灾驳回'].includes(item.transferType)) {
    return true
  }
  if (item.advice?.indexOf('不通过') > -1) {
    return true
  }
  return false
}

const renderAdvice = (transferType) => {
  switch (transferType) {
  // 警情
  case '警情创建':
  case '警情归档':
    return ''
  case '警情确认':
    return '确认结果：'
  case '任务退回':
    return '退回原因：'
  case '警情驳回':
    return '驳回原因：'
  case '更正申请':
    return '申请类型：'
  case '更正审批':
    return '审批结果：'
  case '作废申请':
    return '作废原因：'
  case '作废审批':
    return '审批结果：'
  case '警情修改':
    return '修改内容：'
    // 出动
  case '出动填报':
  case '出动归档':
    return ''
  case '出动审核':
    return '审核结果：'
  case '出动驳回':
    return '驳回原因：'
  case '出动修改':
    return '修改内容：'
    // 火灾
  case '火灾转派':
  case '火灾填报':
  case '火灾归档':
    return ''
  case '火灾审核':
    return '审核结果：'
  case '火灾驳回':
    return '驳回原因：'
  case '火灾修改':
    return '修改内容：'
  default:
    return ''
  }
}

const renderRemark = (transferType) => {
  switch (transferType) {
  // 警情
  case '警情创建':
  case '警情归档':
    return ''
  case '警情确认':
    return '确认意见：'
  case '任务退回':
    return '备注：'
  case '警情驳回':
    return '备注：'
  case '更正申请':
    return '备注：'
  case '更正审批':
    return '审批意见：'
  case '作废申请':
    return '备注：'
  case '作废审批':
    return '审批意见：'
  case '警情修改':
    return '修改内容：'
    // 出动
  case '出动填报':
  case '出动归档':
    return ''
  case '出动审核':
    return '审核意见：'
  case '出动驳回':
    return '备注：'
  case '出动修改':
    return '修改内容：'
    // 火灾
  case '火灾转派':
  case '火灾填报':
  case '火灾归档':
    return ''
  case '火灾审核':
    return '审核意见：'
  case '火灾驳回':
    return '备注：'
  case '火灾修改':
    return '修改内容：'
  default:
    return ''
  }
}

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
      <div class="steps-name">
        {{ item.transferType }}
      </div>
      <div class="steps-box">
        <div v-if="renderState(item)" class="steps-icon-red" />
        <div v-else class="steps-icon" />
        <div v-if="index < data.length - 1" class="steps-line" />
      </div>
      <div class="steps-content">
        <div class="steps-title">
          {{ item.createOrg }}
        </div>
        <div>{{ formatYmdHm(item.createDate, 'YYYY-MM-DD HH:mm:ss') }}</div>
        <div v-if="item.applyType">{{ renderAdvice(item.transferType) }}{{ item.applyType }}</div>
        <div v-if="item.advice">{{ renderAdvice(item.transferType) }}{{ item.advice }}</div>
        <div v-if="item.remark">{{ renderRemark(item.transferType) }}{{ item.remark }}</div>
        <div v-if="item.editContents?.length > 0" class="steps-history">
          <div class="sub-title">
            修改内容：
          </div>
          <div class="sub">
            <div v-for="temp in item.editContents" :key="temp">
              {{ temp }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="steps-next">
      <div v-if="detail?.warningStatusValue" class="steps-next-current">
        当前状态：
        <span :class="generateColorByState(detail?.warningStatusValue)">
          {{ detail?.warningStatusValue }}
        </span>
      </div>
      <div v-if="detail?.fireDispatch?.dispatchStatusValue" class="steps-next-current">
        当前状态：
        <span :class="generateColorByState(detail?.fireDispatch?.dispatchStatusValue)">
          {{ detail?.fireDispatch?.dispatchStatusValue }}
        </span>
      </div>
      <div v-if="detail?.fireInfo?.fireStatusValue" class="steps-next-current">
        当前状态：
        <span :class="generateColorByState(detail?.fireInfo?.fireStatusValue)">
          {{ detail?.fireInfo?.fireStatusValue }}
        </span>
      </div>
      <div v-if="detail?.nextDealOrg" class="steps-next-org">
        下个处理单位：{{ detail?.nextDealOrg }}
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
    .steps-icon-red {
      width: 12px;
      height: 12px;
      background: #f8d8d8;
      box-shadow: 0px 0px 4px 0px rgba(255, 103, 103, 0.5);
      border: 1px solid #FF4D16;
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
    .steps-history {
      display: flex;
      flex-direction: column;
      .sub-title {
        color: #48556a;
        white-space: nowrap;
      }
    }
  }
}
.steps-next {
  display: flex;
  flex-direction: column;
  margin: 20px 0 0 0;
  &-current {
    margin-bottom: 10px;
  }
}
</style>
