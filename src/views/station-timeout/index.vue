<template>
  <div class="police-timeout">
    <ProList
        ref="proListRef"
        :defaultFilterValue="defaultFilterValue"
        :getListFn="getUnworkTimeout"
        title="警情超时统计"
      >
      <template #search="{ tabsActive, filterFormState, resetForm }">
        <div class="form">
          <div class="list-tabs1">
            <SelectTime
              v-model:value="filterFormState.time"
              title="选择时间"
              @change="onTimeChange"
            />
            <SelectMore
              :options="searchOptions"
              :reset-fn="resetForm"
              @confirmCallback="onSearchConfirm"
            />
          </div>
        </div>
      </template>
        <template #list="{ record }">
          <div class="list-item" @click="handleItem(record)">
            <div class="item-header">
              <div class="item-title">{{ record.name }}</div>
              <div class="item-state" :class="generateColorByState(record.warningStatusValue)">
                {{ record.deptNatureValue }}
              </div>
            </div>
            <!-- <div class="item-type">
              <span>{{ record.warningTypeValue }}</span>
            </div> -->
            <div class="item-field">
              <img 
                style="width: 13px; height: 15px; margin-right: 8px" 
                src="../../assets/images/icon-time@2x.png" alt="" />
              <div style="color: #929398">上级大队：</div>
              <div>{{ record.parentFireBrigadeName }}</div>
            </div>
            <!-- <div class="item-field">
              <img
                src="../../assets/images/icon-area@2x.png"
                style="width: 13px; height: 15px; margin-right: 8px"
                alt=""
              />
              <div style="color: #929398">行政区域：</div>
              <div>{{ record.warningAreaValue }}</div>
            </div> -->
            <div class="item-field">
              <img style="width: 13px; height: 15px; margin-right: 8px" src="../../assets/images/icon-time@2x.png" alt="" />
              <div style="color: #929398">上级支队：</div>
              <div>{{ record.parentFireDetachmentName }}</div>
            </div>
            <div class="item-field">
              <img style="width: 13px; height: 15px; margin-right: 8px" src="../../assets/images/icon-time@2x.png" alt="" />
              <div style="color: #929398">最近录入报告时间：</div>
              <div>{{ formatYmdHm(record.lastCommitDate) }}</div>
            </div>
          </div>
        </template>
    </ProList>
    <!-- 驳回 -->
    <DialogInfo v-model:visible="show.rejectVisible" title="发起驳回说明">
      <template v-slot="{setHandleOk}">
        <ApplyReject
          type="1"
          :current-row="currentRow"
          :selected-keys="selectedRowKeys"
          :set-handle-ok="setHandleOk"
          :finish-callback="finishCallback"
        />
      </template>
    </DialogInfo>
    <!-- 警情详情 -->
    <ProModal v-model:visible="show.lookVisible" :showBack="true" :showHeader="false" title="警情详情">
      <PoliceEntryDetail :current-row="currentRow" />
    </ProModal>
  </div>
</template>
  
<script setup>
import { getFireReviewList } from '@/apis/index.js'
import SelectTags from '@/component/SelectTags/index.vue'
import { computed, createVNode, onMounted, ref ,reactive,toRaw} from 'vue'
import PoliceEntryDetail from '@/views/policeEntryDetail/index.vue';
// import ApplyReject from "./apply-reject.vue";
import ApplyRecheck from "@/views/policeManageList/apply-recheck.vue";
import { getLastMonth,checkRejectState } from '@/utils/tools.js'
import { MSG_LOCKING_TEXT, isNot } from '@/utils/constants.js';
import { generateColorByState } from "@/utils/tools.js";
import SelectMore from "@/component/SelectMore/index";
import { getUnworkTimeout} from '@/apis/index.js'
import { formatYmdHm } from "@/utils/format.js";
import { showToast,showLoadingToast,closeToast } from 'vant';
import store from '@/store/index.js'
const getSystemDictSync = store.getters['dict/getSystemDictSync']
const options = {}
getSystemDictSync(['JQ_TYPE', 'JQ_TIMEOUT_TYPE'], null, (res) => {
  options.warningType = res.JQ_TYPE
  options.timeOutType = res.JQ_TIMEOUT_TYPE
})
onMounted(() => {
})
const searchOptions = computed(()=>([
  {
    title: '选择时间',
    type: 'select-range',
    placeholder: '请选择时间',
    value: 'time',
  },
  {
    title: '所属队伍',
    type: 'select-org',
    placeholder: '请选择所属队伍',
    params: { permission: true },
    single: true,
    selectLeaf: false,
    headersDisabled: true, 
    value: 'xqOrgId',
  },
]))
const currentRow = ref({})
const proListRef = ref(null);
const defaultFilterValue = {
  statisticsDateType: '2',
  xqOrgId: [],
  time: [],
}

const show = ref({})
const tabType = ref('running')
const refreshCallback = () => {
  proListRef.value.filter()
}
const onSearchConfirm = () => {
  showLoadingToast();
  proListRef.value.filter().then((res) => {
    closeToast();
  });
}
const handleLook = (row) => {
  currentRow.value = row
  show.value.lookVisible = true
}

const handleItem = (row) => {
  currentRow.value = row
  show.value.lookVisible = true
};

const handleReject = (row) => {
  if (row.isLock === '1') {
    showToast(MSG_LOCKING_TEXT)
    return
  }
  currentRow.value = row
  show.value.rejectVisible = true
}
const finishCallback = () => {
  currentRow.value = null
  proListRef.value.filter()
}
const selectTagsCallback = (selects) => {
  proListRef.value.query.tags = selects
  onSearchConfirm()
  finishCallback()
}

</script>
<style lang="scss" scoped>
  .police-timeout{
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
          min-width: 67px;
          max-width: 100px;
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
  .item-collect {
        font-size: 20px;
        margin-right: auto;
      }
      .select_tags{
        border-top: 10px solid #fff;
      }
  </style>