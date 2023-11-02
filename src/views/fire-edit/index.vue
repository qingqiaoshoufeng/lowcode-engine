<template>
  <div class="fire-manage">
    <ProList
        ref="proListRef"
        :defaultFilterValue="defaultFilterValue"
        :getListFn="getFireManageList"
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
              <span>{{ record.firePlaceValue }}</span>
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
              <div>{{ record.warningAreaValue }}</div>
            </div>
            <div class="item-field">
              <img style="width: 13px; height: 15px; margin-right: 8px" src="../../assets/images/icon-time@2x.png" alt="" />
              <div style="color: #929398">责任区大队：</div>
              <div>{{ record.areaDutyGroupName }}</div>
            </div>
            <!-- <div class="item-field">
              <img style="width: 13px; height: 15px; margin-right: 8px" src="../../assets/images/icon-time@2x.png" alt="" />
              <div style="color: #929398">起火场所：</div>
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
const handleLook = (row) => {
  currentRow.value = { ...row, boFireInfoId: undefined }
  isDraft.value = false
  isEdit.value = false
  show.value.lookVisible = true
}

// 查询辖区火灾
const getPrefectureFire = ()=>{
  proListRef.value.query.unEditFlag = false
  proListRef.value.filter()
}
const handleEdit = (row) => {
  currentRow.value = row
  relevanceDraft.value = null
  isDraft.value = true
  isEdit.value = true
  show.value.editVisible = true
}
const setHandleOk = ()=>{}
</script>
  <style lang="scss" scoped>
  .fire-manage{
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
  .list-tabs1 {
    display: flex;
    padding: 10px 16px 0 16px;
  }
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
  //     .item-collect {
  //       font-size: 20px;
  //       margin-right: auto;
  //     }
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
  </style>