<template>
  <div class="pro-list-item">
    <div class="item-header">
      <div class="item-title">{{ record.warningAddr }}</div>
      <div class="item-state" v-if="['fireAmend','fireInvalid'].includes(type)" :class="generateColorByState(record.warningStatusValue)">
        {{ record.statusValue }}
      </div>
      <div class="item-state" v-else :class="generateColorByState(record.warningStatusValue)">
        {{ record.fireStatusValue }}
      </div>
    </div>
    <div class="item-type">
      <span>{{ record.fireTypeValue }}</span>
    </div>
    <div class="item-field" v-if="['fireFilled','fireReviewed','fireReject'].includes(type)">
      <img 
        style="width: 13px; height: 15px; margin-right: 8px" 
        src="../../../assets/images/icon-time@2x.png" alt="" />
      <div style="color: #929398">起火时间：</div>
      <div>{{ formatYmdHm(record.fireDate) }}</div>
    </div>
    <div class="item-field" v-if="['fireFilled','fireReviewed','fireReject'].includes(type)">
      <img
        src="../../../assets/images/icon-area@2x.png"
        style="width: 13px; height: 15px; margin-right: 8px"
        alt=""
      />
      <div style="color: #929398">警情地址：</div>
      <div>{{ record.warningAddr }}</div>
    </div>
    <div class="item-field" v-if="['fireAmend'].includes(type)">
      <img 
        style="width: 13px; height: 15px; margin-right: 8px" 
        src="../../../assets/images/icon-time@2x.png" alt="" />
      <div style="color: #929398">申请单位：</div>
      <div>{{ formatYmdHm(record.createOrg) }}</div>
    </div>
    <div class="item-field" v-if="['fireAmend'].includes(type)">
      <img
        src="../../../assets/images/icon-area@2x.png"
        style="width: 13px; height: 15px; margin-right: 8px"
        alt=""
      />
      <div style="color: #929398">审批时间：</div>
      <div>{{ record.reviewTime }}</div>
    </div>
    <div class="item-field" v-if="['fireAmend'].includes(type)">
      <img 
        style="width: 13px; height: 15px; margin-right: 8px" 
        src="../../../assets/images/icon-time@2x.png" alt="" />
      <div style="color: #929398">申请类型：</div>
      <div>{{ formatYmdHm(record.applyTypeValue) }}</div>
    </div>
    <div class="item-field" v-if="['fireAmend'].includes(type)">
      <img
        src="../../../assets/images/icon-area@2x.png"
        style="width: 13px; height: 15px; margin-right: 8px"
        alt=""
      />
      <div style="color: #929398">申请原因：</div>
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