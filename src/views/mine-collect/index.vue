<template>
  <div class="mine-collect">
    <ProList
      ref="proListRef"
      :defaultFilterValue="defaultFilterValue"
      :getListFn="getMineCollect"
      :tabs="tabs"
      :onTabFn="onTabChangeFn"
      title="我的收藏"
    >
      <template #list="{ record,tabsActive }">
        <!-- 警情列表展示 -->
        <div class="pro-list-item" @click="handleItem(record)" v-if="tabsActive ===1" :key="record.boFireWarningId">
          <div class="item-header">
            <div class="item-title">{{ record.warningName }}</div>
            <div class="item-state" :class="generateColorByState(record.warningStatusValue)">
              {{ record.warningStatusValue }}
            </div>
          </div>
          <div class="item-type">
            <span>{{ record.warningTypeValue }}</span>
          </div>
          <div class="item-field">
            <img src="../../assets/images/icon-time@2x.png" alt="" />
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
          <div class="item-line" />
          <div class="item-operate" @click.stop>
            <van-icon
              name="star"
              v-if="record.focusStatus === '1'"
              style="color: #fed547"
              class="item-collect"
              @click="handleCollect(record, false,tabsActive)"
            />
            <van-icon
              name="star-o"
              v-else
              class="item-collect"
              @click="handleCollect(record, true,tabsActive)"
            />
          </div>
        </div>
        <!-- 出动列表展示 -->
        <div class="pro-list-item" @click="handleItem(record)" v-if="tabsActive ===2" :key="record.boFireDispatchId">
          <div class="item-header">
            <div class="item-title">{{ record.warningName }}</div>
            <div class="item-state" :class="generateColorByState(record.dispatchStatusValue)">
              {{ record.dispatchStatusValue }}
            </div>
          </div>
          <div class="item-type">
            <span>{{ record.warningTypeValue }}</span>
          </div>
          <div class="item-field">
            <img src="../../assets/images/icon-time@2x.png" alt="" />
            <div class="item-field-label">接警时间：</div>
            <div>{{ formatYmdHm(record.warningDate) }}</div>
          </div>
          <div class="item-field">
            <img
              src="../../assets/images/icon-area@2x.png"
              style="width: 13px; height: 15px; margin-right: 8px"
              alt=""
            />
            <div class="item-field-label">警情地址：</div>
            <div>{{ record.warningAddr }}</div>
          </div>
          <div class="item-field">
            <img src="../../assets/images/icon_power@2x.png" alt="" />
            <div class="item-field-label">出动队伍：</div>
            <div>{{ record.dispatchGroupName }}</div>
          </div>
          <div class="item-line" />
          <div class="item-operate" @click.stop>
            <van-icon
              name="star"
              v-if="record.focusStatus === '1'"
              style="color: #fed547"
              class="item-collect"
              @click="handleCollect(record, false,tabsActive)"
            />
            <van-icon
              name="star-o"
              v-else
              class="item-collect"
              @click="handleCollect(record, true,tabsActive)"
            />
          </div>
        </div>
        <!-- 火灾列表展示 -->
        <div class="pro-list-item" @click="handleItem(record)" v-if="tabsActive ===3" :key="record.boFireInfoId">
          <div class="item-header">
            <div class="item-title">{{ record.warningName }}</div>
            <div class="item-state" :class="generateColorByState(record.fireStatusValue)">
              {{ record.fireStatusValue }}
            </div>
          </div>
          <div class="item-type">
            <span>{{ record.firePlaceValue }}</span>
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
            <div class="item-field-label">警情地址：</div> 
            <div>{{ record.warningAddr }}</div>
          </div>
          <div class="item-field">
            <img
              src="../../assets/images/icon-area@2x.png"
              style="width: 13px; height: 15px; margin-right: 8px"
              alt=""
            />
            <div class="item-field-label">火灾地址：</div>
            <div>{{ record.firePlaceValue }}</div>
          </div>
          <div class="item-field">
            <img style="width: 13px; height: 15px; margin-right: 8px" src="../../assets/images/icon-time@2x.png" alt="" />
            <div class="item-field-label">责任区大队：</div>
            <div>{{ record.areaDutyGroupName }}</div>
          </div>
          <div class="item-line" />
          <div class="item-operate" @click.stop>
            <van-icon
              name="star"
              v-if="record.focusStatus === '1'"
              style="color: #fed547"
              class="item-collect"
              @click="handleCollect(record, false,tabsActive)"
            />
            <van-icon
              name="star-o"
              v-else
              class="item-collect"
              @click="handleCollect(record, true,tabsActive)"
            />
            <!-- <van-button
              v-p="['admin', 'fire-report:look']"
              type="primary"
              size="mini"
              class="item-btn"
              @click.stop="handleLook(record)"
            >
              查看
            </van-button> -->
          </div>
        </div>
      </template>
    </ProList>
    <ProModal showBack v-model:visible="show.lookVisible" :showHeader="false" :title="title">
      <LookFireWarning v-if="lookType === 1" :current-row="currentRow" :is-detail="true"  />
      <DispatchForm v-if="lookType === 2" :current-row="currentRow" :is-detail="true"  />
      <FireForm v-if="lookType === 3" :current-row="currentRow" :is-detail="true"  />
    </ProModal>
  </div>
</template>
  
<script setup>
import { getMineCollect ,getFocus,collectFireWarning} from '@/apis/index.js'
import { computed,ref} from 'vue'
import { MSG_LOCKING_TEXT } from '@/utils/constants.js';
import { generateColorByState } from "@/utils/tools.js";
import FireForm from '@/views/fire-report/components/EditorForm.vue'
import LookFireWarning from '@/views/policeEntryDetail/index.vue'
import DispatchForm from '@/views/dispatchReportForm/index.vue'
import { formatYmdHm } from "@/utils/format.js";
import { showToast,showLoadingToast,closeToast} from 'vant';

const statisticsTotal = ref({})

const tabs = computed(()=>([
  {
    title: `收藏警情(${statisticsTotal.value.warningFocusNum || 0})`,
    value: 1,
  },
  {
    title: `收藏出动(${statisticsTotal.value.dispatchFocusNum || 0})`,
    value: 2,
  },
  {
    title: `收藏火灾(${statisticsTotal.value.fireFocusNum || 0})`,
    value: 3,
  },
]));

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
const lookType = ref(1)
const title = ref('警情详情')
const defaultFilterValue = {
  offset: 1,
  limit: 10,
  focusFlag: true,
  url:'/acws/rest/biz/firewarning/query',
}
const show = ref({})
const refreshCallback = () => {
  proListRef.value.filter()
}
// const onSearchConfirm = () => {
//   showLoadingToast();
//   proListRef.value.filter().then((res) => {
//     closeToast();
//   });
// }



const handleCollect = async (row, state,type) => {
  let focusAppid, focusCode
  if (type === 1) {
    focusAppid = row.boFireWarningId
    focusCode = row.warningCode
  }
  if (type === 2) {
    focusAppid = row.boFireDispatchId
    focusCode = row.dispatchCode
  }
  if (type === 3) {
    focusAppid = row.boFireInfoId
    focusCode = row.fireCode
  }
  const res = await collectFireWarning({
    focusAppid,
    focusCode,
    focusType: type,
    deleteFlag: state ? '1' : '2',
  })
  showToast(state ? '收藏成功' : '取消收藏成功')
  refreshCallback()
  getStatistics()
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

const getStatistics = () => {
  getFocus().then((res) => {
    statisticsTotal.value = res
  })
}
getStatistics()

// tab切换
const onTabChangeFn = (val,val1)=>{
  lookType.value = val
  const titleMap = ['','警情详情','出动填报详情','火灾填报详情']
  const paramsMap = [
    '',
    '/acws/rest/biz/firewarning/query',
    '/acws/rest/biz/firedispatch/query',
    '/acws/rest/biz/fireinfo/query'
  ]
  // tabType.value = paramsMap[val]
  proListRef.value.list = []
  proListRef.value.query.url = paramsMap[val]
  title.value = titleMap[val]
  proListRef.value.filter()
}
const handleItem = (record)=>{
  currentRow.value = record
  show.value.lookVisible =true
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
  .list-tabs1 {
    display: flex;
    padding: 10px 12px 0 12px;
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
