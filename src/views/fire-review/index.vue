<template>
  <div class="fire-manage">
    <ProList
        ref="proListRef"
        :defaultFilterValue="defaultFilterValue"
        :getListFn="getFireReviewList"
        :tabs="tabs"
        :onTabFn="onTabChangeFn"
        title="火灾审核"
      >
      <template #search="{ tabsActive, filterFormState, resetForm }">
        <div class="list-tabs1" >
          <SelectTime
            v-model:value="filterFormState.time"
            title="选择时间"
            @change="onTimeChange"
          />
          <SelectMore
            v-if="options.fireCause"
            :options="searchOptions"
            :reset-fn="resetForm"
            @confirmCallback="onSearchConfirm"
          />
        </div>
      </template>
        <template #list="{ record }">
          <div class="list-item" @click="handleItem(record)">
            <div class="item-header">
              <div class="item-title">{{ record.warningAddr }}</div>
              <div class="item-state" :class="generateColorByState(record.fireStatusValue)">
                {{ record.fireStatusValue }}
              </div>
            </div>
            <div class="item-type">
              <span>{{ record.fireTypeValue }}</span>
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
              <div>{{ record.dutyOrgName }}</div>
            </div>
            <!-- <div class="item-field">
              <img style="width: 13px; height: 15px; margin-right: 8px" src="../../assets/images/icon-time@2x.png" alt="" />
              <div style="color: #929398">起火场所：</div>
              <div>{{ record.firePlaceValue }}</div>
            </div> -->
            <div class="item-line" />
            <div class="item-operate" @click.stop>
              <van-button
                v-p="['admin', 'fire-report:look']"
                type="success"
                size="mini"
                color="#1989fa"
                class="item-btn"
                @click.stop="handleLook(record)"
              >
                查看
              </van-button>
              <van-button
                type="success"
                size="mini"
                color="#1989fa"
                class="item-btn"
                v-if="tabType === 'running' && checkFireApproval(record.fireStatusValue)" 
                @click="handleReview(record)"
              >
                审核
              </van-button>
            </div>
          </div>
        </template>
    </ProList>
    <!-- 火灾填报审核 -->
    <ProModal
      v-model:visible="show.reviewVisible"
      title="火灾审核详情"
      :ok-display="true"
      ok-text="审核"
      pro-card-id="card-wrap"
    >
      <template #default="{ setHandleOk }">
        <EditorForm
          :showReviewDialog="showReviewDialog"
          :set-handle-ok="setHandleOk"
          :current-row="currentRow"
          :is-edit="true"
          :is-approval="true"
          :is-review="true"
          process-key="fireInfoFlow"
          @finish-callback="approvalCallback"
        />
      </template>
    </ProModal>
    <!-- 查看详情 -->
    <ProModal
      v-model:visible="show.lookVisible"
      title="火灾填报详情"
      :ok-display="false"
      :footer="null"
      pro-card-id="card-wrap"
    >
      <EditorForm :current-row="currentRow" :is-detail="true" />
    </ProModal>
  </div>
</template>
  
<script setup>
import { getFireReviewList } from '@/apis/index.js'
import { computed, createVNode, onMounted, ref ,reactive,toRaw} from 'vue'
import ApplyRecheck from "@/views/policeManageList/apply-recheck.vue";
import { getLastMonth,checkFireApproval } from '@/utils/tools.js'
import { MSG_LOCKING_TEXT, isNot } from '@/utils/constants.js';
import { generateColorByState } from "@/utils/tools.js";
import SelectMore from "@/component/SelectMore/index";
import ProcessReview from "@/component/ProcessReview/index.vue";

import { formatYmdHm } from "@/utils/format.js";
import EditorForm from '../fire-report/components/EditorForm.vue'
import { showToast,showLoadingToast,closeToast} from 'vant';
import store from '@/store/index.js'
const getSystemDictSync = store.getters['dict/getSystemDictSync']


const tabs = ref([
  {
    title: "待审核",
    value: 1,
  },
  {
    title: "已审核",
    value: 2,
  },
]);
const options = {}
getSystemDictSync(['HZ_STATUS', 'HZ_INFO_HZDJ', 'HZ_QHYY', 'HZ_INFO_QY', 'HZ_INFO_JJLX', 'HZ_INFO_SGBM'], null, (res) => {
  options.fireStatus = res.HZ_STATUS
  options.fireLevel = res.HZ_INFO_HZDJ
  options.fireCause = toRaw(res.HZ_QHYY)
  options.area = res.HZ_INFO_QY
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
    title: '火灾编号',
    type: 'input',
    placeholder: '请输入火灾编号',
    value: "fireCode",
  },
  {
    title: '状态',
    type: 'select',
    placeholder: '请选择状态',
    options: options.fireStatus,
    fieldNames: { value: 'boDictId', label: 'dictName' },
    value: 'fireStatus',
  },
  {
    title: '责任区大队',
    type: 'select-org',
    placeholder: '请选择责任区大队',
    params: { permission: true },
    single: false,
    selectLeaf: false,
    headersDisabled: true,
    value: 'orgList',
  },
]))
const currentRow = ref({})
const proListRef = ref(null);
const defaultFilterValue = {
  state: 'running',
  fireStatus: [],
  fireCode: '',
  fireGroup: [],
  time: getLastMonth(),
}
const show = ref({})
const isEdit = ref(false)
const isDraft = ref(false)
const relevanceDraft = ref(null)
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
// 查询辖区火灾
const getPrefectureFire = ()=>{
  proListRef.value.query.unEditFlag = false
  proListRef.value.filter()
}

// 申请更正
const handleRecheck = (row) => {
  if (row.isLock === '1') {
    showToast(MSG_LOCKING_TEXT)
    return
  }
  currentRow.value = row
  show.value.recheckVisible = true
}
// tab切换
const onTabChangeFn = (val,val1)=>{
  const paramsMap = ['','running','completed']
  tabType.value = paramsMap[val]
  proListRef.value.query.state = paramsMap[val]
  proListRef.value.filter()
}
const handleItem = (record)=>{
  // selectVisible
}
const handleReview = (row) => {
  if (row.isLock === '1') {
    showToast(MSG_LOCKING_TEXT)
    return
  }
  currentRow.value = row
  show.value.reviewVisible = true
}
const approvalCallback = () => {
  show.value.reviewVisible = false
  proListRef.value.filter()
}

const onTimeChange = (value) => {
  showLoadingToast();
  proListRef.value.filter().then((res) => {
    closeToast();
  });
};

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
  .item-collect {
        font-size: 20px;
        margin-right: auto;
      }
  </style>