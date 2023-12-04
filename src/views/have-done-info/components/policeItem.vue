<template>
  <div class="pro-list-item">
    <div class="item-header">
      <div class="item-title">{{ record.warningName }}</div>
      <div class="item-state" v-if="['policeAmend','policeInvalid'].includes(type)" :class="generateColorByState(record.warningStatusValue)">
        {{ record.statusValue }}
      </div>
      <div class="item-state" v-else :class="generateColorByState(record.warningStatusValue)">
        {{ record.warningStatusValue }}
      </div>
    </div>
    <div class="item-type" v-if="['policeDispatched','policeRejected','policeConfirmed','policeDispatchArea'].includes(type)">
      <span>{{ record.warningTypeValue }}</span>
    </div>
    <div class="item-field" v-if="['policeDispatched','policeRejected','policeConfirmed','policeDispatchArea'].includes(type)">
      <img 
        style="width: 13px; height: 15px; margin-right: 8px" 
        src="../../../assets/images/icon-time@2x.png" alt="" />
      <div style="color: #929398">接警时间：</div>
      <div>{{ formatYmdHm(record.warningDate) }}</div>
    </div>
    <div class="item-field" v-if="['policeDispatched','policeRejected','policeConfirmed','policeDispatchArea'].includes(type)">
      <img
        src="../../../assets/images/icon-area@2x.png"
        style="width: 13px; height: 15px; margin-right: 8px"
        alt=""
      />
      <div style="color: #929398">警情地址：</div>
      <div>{{ record.warningAddr }}</div>
    </div>
    <div class="item-field" v-if="['policeAmend','policeInvalid'].includes(type)">
      <img 
        style="width: 13px; height: 15px; margin-right: 8px" 
        src="../../../assets/images/icon-time@2x.png" alt="" />
      <div style="color: #929398">申请单位：</div>
      <div>{{ record.createOrg }}</div>
    </div>
    <div class="item-field" v-if="['policeAmend','policeInvalid'].includes(type)">
      <img
        src="../../../assets/images/icon-area@2x.png"
        style="width: 13px; height: 15px; margin-right: 8px"
        alt=""
      />
      <div style="color: #929398">申请时间：</div>
      <div>{{ record.createDate }}</div>
    </div>
    <div class="item-field" v-if="['policeAmend'].includes(type)">
      <img 
        style="width: 13px; height: 15px; margin-right: 8px" 
        src="../../../assets/images/icon-time@2x.png" alt="" />
      <div style="color: #929398">申请类型：</div>
      <div>{{ record.applyTypeValue }}</div>
    </div>
    <div class="item-field" v-if="['policeAmend'].includes(type)">
      <img
        src="../../../assets/images/icon-area@2x.png"
        style="width: 13px; height: 15px; margin-right: 8px"
        alt=""
      />
      <div style="color: #929398">申请原因：</div>
      <div>{{ record.recheckReason }}</div>
    </div>
    <div class="item-field" v-if="['policeInvalid'].includes(type)">
      <img
        src="../../../assets/images/icon-area@2x.png"
        style="width: 13px; height: 15px; margin-right: 8px"
        alt=""
      />
      <div style="color: #929398">申请原因：</div>
      <div>{{ record.cancelReasonValue }}</div>
    </div>
    <div class="item-field" v-if="['policeConfirmed'].includes(type)">
      <img d
        style="width: 13px; height: 15px; margin-right: 8px" 
        src="../../../assets/images/icon-time@2x.png" alt="" />
      <div style="color: #929398">增援总队：</div>
      <div>{{ record.otherProvinceName }}</div>
    </div>
    <div class="item-field" v-if="['policeConfirmed'].includes(type)">
      <img
        src="../../../assets/images/icon-area@2x.png"
        style="width: 13px; height: 15px; margin-right: 8px"
        alt=""
      />
      <div style="color: #929398">增援支队：</div>
      <div>{{ record.otherCityName }}</div>
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