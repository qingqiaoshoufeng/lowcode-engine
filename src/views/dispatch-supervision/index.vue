<template>
  <div class="dispatch-supervision">
    <ProList
        ref="proListRef"
        :defaultFilterValue="defaultFilterValue"
        :getListFn="getDispatchSupervisionList"
        title="出动质量监督"
      >
      <template #search="{ tabsActive, filterFormState, resetForm }">
        <div class="form">
          <SelectTags class="select_tags" :menus="menus" :selects="proListRef?.query?.tags" :select-callback="selectTagsCallback" />
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
              <div class="item-title">{{ record.warningAddr }}</div>
              <div class="item-state" :class="generateColorByState(record.warningStatusValue)">
                {{ record.warningStatusValue }}
              </div>
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
              <div>{{ record.warningAreaValue }}</div>
            </div>
            <div class="item-field">
              <img style="width: 13px; height: 15px; margin-right: 8px" src="../../assets/images/icon-time@2x.png" alt="" />
              <div style="color: #929398">出动队伍：</div>
              <div>{{ record.dispatchGroupName }}</div>
            </div>
            <!-- <div class="item-field">
              <img style="width: 13px; height: 15px; margin-right: 8px" src="../../assets/images/icon-time@2x.png" alt="" />
              <div style="color: #929398">起火场所：</div>
              <div>{{ record.firePlaceValue }}</div>
            </div> -->
            <div class="item-line" />
            <div class="item-operate" @click.stop>
              <van-button
                v-p="['admin', 'dispatch-supervision:look']"
                type="link"
                size="mini"
                color="#1989fa"
                class="item-btn"
                @click="handleLook(record)"
              >
                查看
              </van-button>
              <van-button
                v-p="['admin', 'fire-supervision:back']"
                size="mini"
                color="#1989fa"
                class="item-btn"
                v-if="checkInputRejectState(record.dispatchStatusValue)"
                type="link"
                @click="handleReject(record)"
              >
                驳回
              </van-button>
            </div>
          </div>
        </template>
    </ProList>
    <!-- 驳回 -->
    <DialogInfo v-model:visible="show.rejectVisible" title="发起驳回说明">
      <template v-slot="{setHandleOk}">
        <ApplyReject
          type="2"
          :current-row="currentRow"
          :selected-keys="selectedRowKeys"
          :set-handle-ok="setHandleOk"
          :finish-callback="finishCallback"
        />
      </template>
    </DialogInfo>
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
import SelectTags from '@/component/SelectTags/index.vue'
import { computed, createVNode, onMounted, ref ,reactive,toRaw} from 'vue'
import ApplyReject from "@/views/police-supervision/apply-reject.vue";
import { getLastMonth,checkRejectState } from '@/utils/tools.js'
import { MSG_LOCKING_TEXT, isNot } from '@/utils/constants.js';
import { generateColorByState ,checkInputRejectState} from "@/utils/tools.js";
import SelectMore from "@/component/SelectMore/index";
import { getDispatchSupervisionList } from '@/apis/index.js'
import { formatYmdHm } from "@/utils/format.js";
import { showToast,showLoadingToast,closeToast } from 'vant';
// import store from '@/store/index.js'

onMounted(() => {
})
const menus = [
  {
    label: '跨省增援',
    key: 'crossProvinceFlag',
  },
  {
    label: '跨市增援',
    key: 'crossCityFlag',
  },
  {
    label: '参战人员伤亡',
    key: 'injuryFlag',
  },
  {
    label: '人车比异常',
    key: 'personCarRatioFlag',
  },
  {
    label: '时速异常',
    key: 'carSpeedFlag',
  },
  {
    label: '现场距离异常',
    key: 'distanceFlag',
  },
  {
    label: '无车辆出动的抢险救援/火灾',
    key: 'noDispatchFlag',
  },
  {
    label: '现场被困超20人',
    key: 'trappedFlag',
  },
  {
    label: '抢救人员/疏散人员超20人',
    key: 'rescueFlag',
  },
  {
    label: '抢救财产/保护财产超1千万',
    key: 'rescuePropertyFlag',
  },
  {
    label: '全勤指挥部出动',
    key: 'headFlag',
  },
  {
    label: '驳回过的出动',
    key: 'rejectFlag',
  },
]
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
    value: 'queryOrd',
  }
]))
const currentRow = ref({})
const proListRef = ref(null);
const defaultFilterValue = {
  tags: [],
  time: getLastMonth(),
  queryOrd: [],
}

const show = ref({})
const tabType = ref('running')
const refreshCallback = () => {
  proListRef.value.filter()
}

const onTimeChange = (value) => {
  showLoadingToast();
  proListRef.value.filter().then((res) => {
    closeToast();
  });
};
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
  // finishCallback()
}

</script>
<style lang="scss" scoped>
  .dispatch-supervision{
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
    padding: 10px 12px 0 12px;
  }
  
  .item-collect {
        font-size: 20px;
        margin-right: auto;
      }
      .select_tags{
        border-top: 10px solid #fff;
      }
  </style>