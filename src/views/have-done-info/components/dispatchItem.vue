<template>
  <div class="pro-list-item">
    <div class="item-header">
      <div class="item-title">{{ record.warningName }}</div>
      <div class="item-state" v-if="['dispatchAmend','dispatchInvalid'].includes(type)" :class="generateColorByState(record.statusValue)">
        {{ record.statusValue }}
      </div>
      <div class="item-state" v-else :class="generateColorByState(record.warningStatusValue)">
        {{ record.warningStatusValue }}
      </div>
    </div>
    <div class="item-field" v-if="['dispatchFilled','dispatchReviewed','dispatchIdRejected'].includes(type)">
      <img 
        style="width: 13px; height: 15px; margin-right: 8px" 
        src="../../../assets/images/icon-time@2x.png" alt="" />
      <div class="item-field-label">接警时间：</div>
      <div>{{ formatYmdHm(record.warningDate) }}</div>
    </div>
    <div class="item-field" v-if="['dispatchFilled','dispatchReviewed','dispatchIdRejected'].includes(type)">
      <img
        src="../../../assets/images/icon-area@2x.png"
        style="width: 13px; height: 15px; margin-right: 8px"
        alt=""
      />
      <div class="item-field-label">警情地址：</div>
      <div>{{ record.warningAddr }}</div>
    </div>
    <div class="item-field" v-if="['dispatchAmend'].includes(type)">
      <img 
        style="width: 13px; height: 15px; margin-right: 8px" 
        src="../../../assets/images/icon-time@2x.png" alt="" />
      <div class="item-field-label">申请单位：</div>
      <div>{{ record.createOrg }}</div>
    </div>
    <div class="item-field" v-if="['dispatchAmend'].includes(type)">
      <img
        src="../../../assets/images/icon-area@2x.png"
        style="width: 13px; height: 15px; margin-right: 8px"
        alt=""
      />
      <div class="item-field-label">审批时间：</div>
      <div>{{ formatYmdHm(record.reviewTime) }}</div>
    </div>
    <!-- <div class="item-field" v-if="['policeAmend'].includes(type)">
      <img 
        style="width: 13px; height: 15px; margin-right: 8px" 
        src="../../../assets/images/icon-time@2x.png" alt="" />
      <div class="item-field-label">申请类型：</div>
      <div>{{ formatYmdHm(record.applyTypeValue) }}</div>
    </div> -->
    <div class="item-field" v-if="['dispatchAmend'].includes(type)">
      <img
        src="../../../assets/images/icon-area@2x.png"
        style="width: 13px; height: 15px; margin-right: 8px"
        alt=""
      />
      <div class="item-field-label">申请原因：</div>
      <div>{{ record.recheckReason }}</div>
    </div>
  </div>
  </template>
<script setup>
import { generateColorByState } from "@/utils/tools.js";
import { formatYmdHm } from "@/utils/format.js";

const props = defineProps({
  record:{
    type:Object
  },
  type:{
    type:String
  }
})
</script>