<template>
<div class="fire-report">
  <ProList
      ref="proListRef"
      :defaultFilterValue="defaultFilterValue"
      :getListFn="getFireReportList"
      :tabs="[]"
    >
      <template #list="{ record }">
        <div class="list-item" @click="handleItem(record)">
          <div class="item-header">
            <div class="item-title">{{ record.warningName }}</div>
            <!-- <div class="item-state" :class="generateColorByState(record.dispatchStatusValue)">
              {{ record.dispatchStatusValue }}
            </div> -->
          </div>
          <div class="item-type">
            <span>{{ record.warningTypeValue }}</span>
          </div>
          <div class="item-field">
            <img 
              style="width: 13px; height: 15px; margin-right: 8px" 
              src="../../assets/images/icon-time@2x.png" alt="" />
            <div style="color: #929398">接警时间：</div>
            <div>{{ formatYmdHm(record.warningDate) }}</div>
          </div>
          <div class="item-field">
            <img
              src="../../assets/images/icon-area@2x.png"
              style="width: 13px; height: 15px; margin-right: 8px"
              alt=""
            />
            <div style="color: #929398">行政区域：</div>
            <div>{{ record.createOrg }}</div>
          </div>
          <div class="item-field">
            <img style="width: 13px; height: 15px; margin-right: 8px" src="../../assets/images/icon-time@2x.png" alt="" />
            <div style="color: #929398">派发单位：</div>
            <div>{{ record.createOrg }}</div>
          </div>
          <div class="item-field">
            <img style="width: 13px; height: 15px; margin-right: 8px" src="../../assets/images/icon-time@2x.png" alt="" />
            <div style="color: #929398">已派时长：</div>
            <div>{{ record.dispatchedInfoTime }}</div>
          </div>
          <div class="item-line" />
          <div class="item-operate" @click.stop>
            <van-button
              v-p="['admin', 'fire-report:look']"
              type="success"
              size="mini"
              color="#1989fa"
              class="item-btn"
              @click.stop="handleclick({type:'look' ,record})"
            >
              查看
            </van-button>
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
              回退
            </van-button>
            <van-button
              v-if="record.isDistribute !== '1'" 
              v-p="['admin', 'fire-report:transfer']" 
              type="link" 
              @click="handleTransfer({type:'transfer' ,record})"
            >
              转派
            </van-button>
          </div>
        </div>
      </template>
  </ProList>
  <ProModal  v-model:visible="show.editVisible" title="火灾填报">
    <template #default="{ setHandleOk, setHandleExtend }">
        <EditorForm
          :is-edit="isEdit"
          :current-row="currentRow"
          :relevance-draft="relevanceDraft"
          :show-draft="isDraft"
          :set-handle-ok="setHandleOk"
          :set-handle-extend="setHandleExtend"
          @finish-callback="refreshCallback"
        />
      </template>
  </ProModal>
</div>
</template>

<script setup>
import {  
  // deleteFireReportDraft, 
  getFireReportList } from '@/apis/index.js'
import { computed, createVNode, onMounted, ref } from 'vue'
import { generateColorByState } from "@/utils/tools.js";
import { formatYmdHm } from "@/utils/format.js";
import EditorForm from './components/EditorForm.vue'
const currentRow = ref({})
const proListRef = ref(null);
const defaultFilterValue = {
  draftFlag: '2',
}
const show = ref({})
const isEdit = ref(false)
const isDraft = ref(false)
const relevanceDraft = ref(null)
const refreshCallback = () => {
  proListRef.value.filter()
}



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
const handleclick = ({type,record})=>{
  const map = {
    'editor':handleInput(record)
  }
  show.value[type] = true
}
const handleItem = (record)=>{
  selectVisible
}
const handleLook = (row) => {
  currentRow.value = { ...row, boFireInfoId: undefined }
  isDraft.value = false
  isEdit.value = false
  show.value.lookVisible = true
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
<style>
.fire-report{
  .list-item {
    display: flex;
    flex-direction: column;
    background: #ffffff;
    margin-top: 10px;
    .item-header {
      display: flex;
      padding: 8px 10px;
      .item-title {
        width: 260px;
        font-size: 16px;
        font-weight: bold;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .item-state {
        width: 57px;
        height: 24px;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 2px;
        margin-left: auto;
      }
    }
    .item-field {
      font-size: 14px;
      color: #1f1f1f;
      display: flex;
      align-items: center;
      padding: 0 0 8px 10px;
      img {
        width: 14px;
        height: 14px;
        margin-right: 6px;
      }
    }
    .item-type {
      margin: 0 0 8px 10px;
      span {
        display: inline-block;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #fc2902;
        background: #ffefec;
        border-radius: 2px;
        padding: 4px 10px;
      }
    }
    .item-line {
      width: 100%;
      border-top: 1px solid rgba(31, 31, 31, 0.15);
    }
    .item-operate {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 8px 10px;
      .item-btn {
        padding: 0 16px;
        margin-left: 10px;
        :deep(.van-button__content) {
          height: 18px;
        }
        :deep(.van-button__text) {
          white-space: nowrap;
          word-break: break-all;
        }
      }
    }
  }
}
</style>