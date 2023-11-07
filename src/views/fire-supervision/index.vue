<template>
  <div class="police-supervision">
    <ProList
        ref="proListRef"
        :defaultFilterValue="defaultFilterValue"
        :getListFn="getFireSupervisionList"
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
              <div style="color: #929398">稽查标签：</div>
              <div>{{ record.auditLabel }}</div>
            </div>
            <!-- <div class="item-field">
              <img style="width: 13px; height: 15px; margin-right: 8px" src="../../assets/images/icon-time@2x.png" alt="" />
              <div style="color: #929398">起火场所：</div>
              <div>{{ record.firePlaceValue }}</div>
            </div> -->
            <div class="item-line" />
            <div class="item-operate" @click.stop>
              <van-button
                v-p="['admin', 'police-supervision:look']"
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
                v-if="checkInputRejectState(record.fireStatusValue)"
                type="link"
                @click="handleReject(record)"
              >
                驳回
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
import SelectTags from '@/component/SelectTags/index.vue'
import { computed, createVNode, onMounted, ref ,reactive,toRaw} from 'vue'
import ApplyRecheck from "@/views/policeManageList/apply-recheck.vue";
import { getLastMonth,checkRejectState } from '@/utils/tools.js'
import { MSG_LOCKING_TEXT, isNot } from '@/utils/constants.js';
import { generateColorByState ,checkInputRejectState} from "@/utils/tools.js";
import SelectMore from "@/component/SelectMore/index";
import { getFireSupervisionList } from '@/apis/index.js'
import { formatYmdHm } from "@/utils/format.js";
import { showToast,showLoadingToast,closeToast } from 'vant';
// import store from '@/store/index.js'

onMounted(() => {
})
const menus = [
  {
    label: '亡人火灾',
    key: 'deadFire',
  },
  {
    label: '重要信息更正火灾',
    key: 'recheckFire',
  },
  {
    label: '驳回过的火灾',
    key: 'rejectFire',
  },
  {
    label: '过火面积超100平方的建构筑轻微火灾',
    key: 'buildingsBurnedArea',
  },
  {
    label: '过火面积超500平方的非建构筑火灾',
    key: 'nonBuildingsBurnedArea',
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
    value: 'unit',
  }
]))
const currentRow = ref({})
const proListRef = ref(null);
const defaultFilterValue = {
  tags: [],
  time: getLastMonth(),
  unit: [],
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

const handleReject = (row) => {
  if (row.isLock === '1') {
    showToast(MSG_LOCKING_TEXT)
    return
  }
  currentRow.value = row
  show.value.rejectVisible = true
}

const selectTagsCallback = (selects) => {
  proListRef.value.query.tags = selects
  onSearchConfirm()
  // finishCallback()
}

</script>
<style lang="scss" scoped>
  .police-supervision{
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
  
  .item-collect {
        font-size: 20px;
        margin-right: auto;
      }
      .select_tags{
        border-top: 10px solid #fff;
      }
  </style>