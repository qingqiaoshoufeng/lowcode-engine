<template>
<div class="fire-report">
  <ProList
      ref="proListRef"
      :defaultFilterValue="defaultFilterValue"
      :getListFn="getFireReportList"
      :tabs="[]"
      title="火灾填报"
    >
      <template #list="{ record }">
        <div class="pro-list-item" @click.stop="handleclick({type:'look' ,record})">
          <div class="item-header">
            <div class="item-title">{{ record.warningName }}</div>
            <div class="item-state" :class="generateColorByState(record.fireStatusValue || '待填报')">
              {{ record.fireStatusValue || '待填报'}}
            </div>
          </div>
          <div class="item-type">
            <span>{{ record.warningTypeValue }}</span>
          </div>
          <div class="item-field">
            <img 
              style="width: 13px; height: 15px; margin-right: 8px" 
              src="../../assets/images/icon-time@2x.png" alt="" />
            <div class="item-field-label">接警时间：</div>
            <div>{{ formatYmdHm(record.warningDate) }}</div>
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
            <div class="item-field-label">派发单位：</div>
            <div>{{ record.createOrg }}</div>
          </div>
          <div class="item-field">
            <img style="width: 13px; height: 15px; margin-right: 8px" src="../../assets/images/icon-time@2x.png" alt="" />
            <div class="item-field-label">已派时长：</div>
            <div v-if="checkTimeout(record.dispatchedInfoTime)" class="test-timeout">
              {{ record.dispatchedInfoTime }}
            </div>
            <div v-else>
              {{ record.dispatchedInfoTime }}
            </div>
          </div>
          <div class="item-line" />
          <div class="item-operate">
            <!-- <van-button
              v-p="['admin', 'fire-report:look']"
              type="success"
              size="mini"
              color="#1989fa"
              class="item-btn"
              @click.stop="handleclick({type:'look' ,record})"
            >
              查看
            </van-button> -->
            <van-button
              v-p="['admin', 'fire-report:input']"
              type="success"
              size="mini"
              color="#1989fa"
              class="item-btn"
              @click.stop="handleclick({type:'editor' ,record})"
            >
              填报
            </van-button>
            <van-button
              v-p="['admin', 'fire-report:reback']"
              type="success"
              size="mini"
              color="#1989fa"
              class="item-btn"
              @click.stop="handleclick({type:'return' ,record})"
            >
              退回
            </van-button>
            <van-button
              size="mini"
              color="#1989fa"
              class="item-btn"
              v-if="record.isDistribute !== '1'" 
              v-p="['admin', 'fire-report:transfer']" 
              @click.stop="handleTransfer(record)"
            >
              转派
            </van-button>
          </div>
        </div>
      </template>
  </ProList>
  <!-- 填报窗口 -->
  <ProModal
    v-model:visible="show.editVisible"
    :showConfirmBack="true"
    :showHeader="false"
    title="火灾填报"
  >
    <template #default="{ setHandleOk, setHandleExtend }">
        <EditorForm
          :is-edit="isEdit"
          :current-row="{ ...currentRow, fillFlag: 1 }"
          :relevance-draft="relevanceDraft"
          :show-draft="isDraft"
          :set-handle-ok="setHandleOk"
          :set-handle-extend="setHandleExtend"
          @finish-callback="refreshCallback"
        />
      </template>
  </ProModal> 
  <!-- 警情窗口 -->
  <ProModal v-model:visible="show.lookVisible" :showBack="true" :showHeader="false" title="警情详情">
    <PoliceForm
      :current-row="currentRow"
      :show-preview="true"
      :show-steps="true"
    />
  </ProModal>
  <!-- 转派窗口 -->
  <ProModal
    title="任务转派"
    v-model:visible="show.transferVisible"
    :showConfirmBack="true"
    :showHeader="false"
    v-slot="{setHandleOk}"
  >
    <TransferTask :current-row="currentRow" :set-handle-ok="setHandleOk" @finish-callback="refreshCallback" />
  </ProModal>
  <!-- 退回窗口 -->
  <ProModal
    title="退回"
    v-model:visible="show.rejectVisible"
    :showConfirmBack="true"
    :showHeader="false"
    v-slot="{setHandleOk}"
  >
    <ApplyReject :setHandleOk="setHandleOk" :current-row="currentRow" @finish-callback="refreshCallback" />
  </ProModal>
</div>
</template>

<script setup>
import {  
  // deleteFireReportDraft, 
  getFireReportList } from '@/apis/index.js'
import { showToast } from 'vant';
import { computed, createVNode, onMounted, ref,provide } from 'vue'
import { generateColorByState, checkTimeout } from "@/utils/tools.js";
import { formatYmdHm } from "@/utils/format.js";
import EditorForm from './components/EditorForm.vue'
import PoliceForm from '@/views/policeEntryForm/index.vue';
import TransferTask from './components/transfer-task.vue'
import ApplyReject from './components/apply-reject.vue'
const currentRow = ref({})
const proListRef = ref(null);
const defaultFilterValue = {
  draftFlag: '2',
}
const isShowTemporary = ref(true)
const show = ref({})
const isEdit = ref(false)
const isDraft = ref(false)
isShowTemporary
const relevanceDraft = ref(null)
const refreshCallback = () => {
  proListRef.value.filter()
}

provide('isShowTemporary', isShowTemporary)


const handleInput = (row) => {
  if (row.isLock === '1') {
    showToast(MSG_LOCKING_TEXT)
    return
  }
  currentRow.value = row
  isDraft.value = false
  isEdit.value = false
  show.value.editVisible = true
  isShowTemporary.value = true
}
const handleLook = (row) => {
  currentRow.value = { ...row, boFireInfoId: undefined }
  isDraft.value = false
  isEdit.value = false
  show.value.lookVisible = true
}
const handleTransfer = (row) => {
  currentRow.value = row
  show.value.transferVisible = true
}
const handleReject = (row) => {
  currentRow.value = row
  show.value.rejectVisible = true
}
const handleclick = ({type,record})=>{
  isShowTemporary.value = false
  const map = {
    'editor':handleInput,
    'look':handleLook,
    'transfer':handleTransfer,
    'return':handleReject
  }
  map[type](record)
}
const handleItem = (record)=>{
  // selectVisible
}


const postTransfer = (callback)=>{
  callback(()=>{

  })
}

const handleEdit = (row) => {
  currentRow.value = row
  relevanceDraft.value = null
  isDraft.value = true
  isEdit.value = true
  show.value.editVisible = true
}

const handleAddDraft = () => {
  currentRow.value = null
  relevanceDraft.value = null
  isDraft.value = true
  isEdit.value = false
  show.value.draftVisible = true
}

const handleAddUnDispatch = () => {
  currentRow.value = null
  relevanceDraft.value = null
  isDraft.value = false
  isEdit.value = false
  show.value.unDispatchVisible = true
}
const setHandleOk = ()=>{}
</script>
<style lang="scss" scoped>
.fire-report{
  // .list-item {
  //   display: flex;
  //   flex-direction: column;
  //   background: #ffffff;
  //   margin-top: 10px;
  //   .item-header {
  //     display: flex;
  //     padding: 8px 10px;
  //     .item-title {
  //       width: 260px;
  //       font-size: 16px;
  //       font-weight: bold;
  //       white-space: nowrap;
  //       overflow: hidden;
  //       text-overflow: ellipsis;
  //     }
  //     .item-state {
  //       width: 57px;
  //       height: 24px;
  //       font-size: 12px;
  //       display: flex;
  //       align-items: center;
  //       justify-content: center;
  //       border-radius: 2px;
  //       margin-left: auto;
  //     }
  //   }
  //   .item-field {
  //     font-size: 14px;
  //     color: #1f1f1f;
  //     display: flex;
  //     align-items: center;
  //     padding: 0 0 8px 10px;
  //     img {
  //       width: 14px;
  //       height: 14px;
  //       margin-right: 6px;
  //     }
  //   }
  //   .item-type {
  //     margin: 0 0 8px 10px;
  //     span {
  //       display: inline-block;
  //       font-size: 12px;
  //       font-family: PingFangSC-Regular, PingFang SC;
  //       font-weight: 400;
  //       color: #fc2902;
  //       background: #ffefec;
  //       border-radius: 2px;
  //       padding: 4px 10px;
  //     }
  //   }
  //   .item-line {
  //     width: 100%;
  //     border-top: 1px solid rgba(31, 31, 31, 0.15);
  //   }
  //   .item-operate {
  //     display: flex;
  //     align-items: center;
  //     justify-content: flex-end;
  //     padding: 8px 10px;
  //     .item-btn {
  //       padding: 0 16px;
  //       margin-left: 10px;
  //       :deep(.van-button__content) {
  //         height: 18px;
  //       }
  //       :deep(.van-button__text) {
  //         white-space: nowrap;
  //         word-break: break-all;
  //       }
  //     }
  //   }
  // }
}
</style>