<template>
  <div class="fire-manage">
    <ProList
        ref="proListRef"
        :defaultFilterValue="defaultFilterValue"
        :getListFn="getFireManageList"
        title="火灾修改"
      >
        <template #list="{ record }">
          <div class="pro-list-item" @click.stop="handleLook(record)" v-if="checkChange(record)">
            <div class="item-header">
              <div class="item-title">{{ record.warningName }}</div>
              <div class="item-state" :class="generateColorByState(record.fireStatusValue)">
                {{ record.fireStatusValue }}
              </div>
            </div>
            <div class="item-type" v-if="renderFirePlace(record)">
              <span>{{ renderFirePlace(record) }}</span>
            </div>
            <div class="item-field">
              <img 
                style="width: 13px; height: 15px; margin-right: 8px" 
                src="../../assets/images/icon-time@2x.png" alt="" />
              <div class="item-field-label">起火时间：</div>
              <div>{{ formatYmdHm(record.fireDate) }}</div>
            </div>
            <div class="item-field">
              <img
                src="../../assets/images/icon-area@2x.png"
                style="width: 13px; height: 15px; margin-right: 8px"
                alt=""
              />
              <div class="item-field-label">行政区域：</div>
              <div>{{ record.warningAreaValue }}</div>
            </div>
            <div class="item-field">
              <img style="width: 13px; height: 15px; margin-right: 8px" src="../../assets/images/icon_power@2x.png" alt="" />
              <div class="item-field-label">责任区大队：</div>
              <div>{{ record.areaDutyGroupName }}</div>
            </div>
            <div class="item-field">
              <img style="width: 13px; height: 15px; margin-right: 8px" src="../../assets/images/icon_menu@2x.png" alt="" />
              <div class="item-field-label">起火场所：</div>
              <div>{{ record.firePlaceValue }}</div>
            </div>
            <!-- <div class="item-field">
              <img style="width: 13px; height: 15px; margin-right: 8px" src="../../assets/images/icon-time@2x.png" alt="" />
              <div class="item-field-label">起火场所：</div>
              <div>{{ record.firePlaceValue }}</div>
            </div> -->
            <div class="item-line" />
            <div class="item-operate">
              <van-button
                v-p="['admin', 'fire-manage:edit']"
                type="success"
                size="mini"
                color="#1989fa"
                class="item-btn"
                @click.stop="handleEdit(record)"
              >
                修改
              </van-button>
            </div>
          </div>
        </template>
    </ProList>
    <ProModal  v-model:visible="show.editVisible" title="火灾填报">
      <template #default="{ setHandleOk, setHandleExtend }">
          <EditorForm
            :isAgain="isAgain"
            :is-edit="isEdit"
            :current-row="currentRow"
            :relevance-draft="relevanceDraft"
            :show-draft="false"
            :set-handle-ok="setHandleOk"
            :set-handle-extend="setHandleExtend"
            @finish-callback="refreshCallback"
          />
        </template>
    </ProModal>
    <ProModal
      v-model:visible="show.lookVisible"
      :showBack="true" :showHeader="false" 
      title="火灾详情"
      :ok-display="false"
      :footer="null"
      pro-card-id="card-wrap"
    >
      <EditorForm :current-row="currentRow" :is-detail="true" />
    </ProModal>
  </div>
</template>
  
<script setup>
import {  
  // deleteFireReportDraft, 
  getFireManageList } from '@/apis/index.js'
import { computed, createVNode, onMounted, ref } from 'vue'
import { getLastMonth } from '@/utils/tools.js'
import { generateColorByState } from "@/utils/tools.js";
const tabs = ref([
  {
    title: "辖区火灾",
    value: 0,
  },
  {
    title: "我的火灾",
    value: 1,
  },
  {
    title: "收藏的火灾",
    value: 2,
  },
]);
import SelectMore from "@/component/SelectMore/index";
import { formatYmdHm } from "@/utils/format.js";
import EditorForm from '../fire-report/components/EditorForm.vue'
const currentRow = ref({})
const proListRef = ref(null);
const defaultFilterValue = {
  onlyMy: false,
  time: getLastMonth(),
  unEditFlag: true,
  orgId: [],
}
const show = ref({})
const isEdit = ref(false)
const isDraft = ref(false)
const relevanceDraft = ref(null)
const refreshCallback = () => {
  proListRef.value.filter()
}
const isAgain = ref(false)
// const onSearchConfirm = () => {
//   showLoadingToast();
//   proListRef.value.filter().then((res) => {
//     closeToast();
//   });
// }
const handleInput = (row) => {
  if (row.isLock === '1') {
    message.warning(MSG_LOCKING_TEXT)
    return
  }
  currentRow.value = row
  isDraft.value = false
  isEdit.value = false
  show.value.editVisible = true
}
const checkChange = (record) => {
  return record.updatePermission && (['待更正', '更正中', '被退回', '被驳回', '待完善'].includes(record.fireStatusValue) || record.taskId)
}
const handleLook = (row) => {
  currentRow.value = row
  show.value.lookVisible = true
}

// 查询辖区火灾
const getPrefectureFire = ()=>{
  proListRef.value.query.unEditFlag = false
  proListRef.value.filter()
}
// 火灾场所格式化
const renderFirePlace = (record) => {
  let prefix = ''
  if (record.fireTypeValue) {
    const types = record.fireTypeValue?.split('/')
    prefix = `${types[types.length - 1]}${record.firePlaceValue ? '/' : ''}`
  }
  return `${prefix}${record.firePlaceValue}`
}
const handleEdit = (row) => {
  currentRow.value = row
  if (row.taskId) {
    isAgain.value = true
  }else{
    isAgain.value = false
  }
  relevanceDraft.value = null
  isDraft.value = true
  isEdit.value = true
  show.value.editVisible = true
}
const setHandleOk = ()=>{}
</script>
  <style lang="scss" scoped>
  .list-tabs1 {
    display: flex;
    padding: 10px 12px 0 12px;
  }

  </style>