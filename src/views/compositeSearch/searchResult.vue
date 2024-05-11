<script setup>
import { ref, onMounted, nextTick, inject, watch, computed } from "vue";
import ProList from "@/component/ProList/index";
import { generateColorByState, checkRejectState } from "@/utils/tools.js";
import PoliceEntryDetail from '@/views/policeEntryDetail/index.vue';
import ApplyReject from "@/views/police-supervision/apply-reject.vue";
import ProModal from "@/component/ProModal/index";
import SearchInfo from './searchInfo.vue';
import ReportGenerate from "@/views/statistics/components/reportGenerate.vue";
import { showDialog, showToast, showLoadingToast, closeToast } from "vant"
import { getSearchResult, getAdvanceSearchResult } from "@/apis/index.js";
import { formatYmdHm } from "@/utils/format.js";
import { MSG_EXPORT_NO_DATA, MSG_NO_HEAD_REPORT, MSG_LOCKING_ADMIN } from '@/utils/constants.js';
import { useModal } from '@/hooks/useModal.js';
import store from '@/store/index.js'

const props = defineProps({
  type: {
    type: Number,
    default: 1,
  },
  params: {
    type: Object,
    default: () => {},
  }
})

const searchType = inject('searchType');

const searchInfo = inject('searchInfo');

const searchDimension = inject('searchDimension');

const dataTimeSource = inject('dataTimeSource');

const getQueryParams = inject('getQueryParams')

const { show } = useModal();

const currentRow = ref(null);

const proListRef = ref(null);

const rejectType = computed(() => {
  switch (searchType.value) {
  case 1:
    return '1'
  case 2:
  case 3:
    return '2'
  case 4:
    return '3'
  default:
    return '1'
  }
})

watch(() => proListRef.value?.result, () => {
  if (proListRef.value?.result) {
    searchInfo.value = {
      ...proListRef.value?.result?.fireWarning,
      ...proListRef.value?.result?.fireDispatch,
      ...proListRef.value?.result?.fireDispatchHead,
      ...proListRef.value?.result?.fireInfo,
    }
  }
})

const handleItem = (row) => {
  currentRow.value = row
  show.value.lookVisible = true
};

const handleReject = (row) => {
  if (!row.permission) {
    if (searchType.value === 1) {
      showDialog({ message: `警情状态为已发送，且申请更正/申请作废，才允许驳回！` })
    } else {
      showDialog({ message: `报告状态为已审核，且没有申请更正，才允许驳回！` })
    }
    return
  }
  if (row.isLock === '1') {
    showToast(MSG_LOCKING_ADMIN)
    return
  }
  currentRow.value = row
  show.value.rejectVisible = true
}

const handleGenerate = () => {
  if (proListRef.value?.total <= 0) {
    showToast(MSG_EXPORT_NO_DATA)
    return
  }
  if (searchType.value === 3) {
    showToast(MSG_NO_HEAD_REPORT)
    return
  }
  if (props.type === 1) {
    const { comprehensiveWarningQueryReq, comprehensiveFireQueryReq } = props.params
    if (searchType.value < 4 && !comprehensiveWarningQueryReq?.warningDateStart) {
      showToast('请先选择接警时间！')
      return true
    }
    else if (searchType.value === 4 && !comprehensiveFireQueryReq?.fireDateStart) {
      showToast('请先选择起火时间！')
      return true
    }
  } else {
    const { seniorQueryDetailReq: arr } = props.params
    const warningDateObj = arr.find(val => val.fieldKeyOne === 'warningDateStart')
    const fireDateObj = arr.find(val => val.fieldKeyOne === 'fireDateStart')
    if ([1, 2, 3].includes(searchType.value) && !warningDateObj) {
      showToast('请先选择接警时间！')
      return false
    }
    else if (searchType.value === 4 && !fireDateObj) {
      showToast('请先选择起火时间！')
      return false
    }
  }
  show.value.reportUseVisible = true
}

const finishCallback = () => {
  show.value.rejectVisible = false
  currentRow.value = null
  proListRef.value.filter()
}

onMounted(() => {
  nextTick(() => {
    proListRef.value.query = props.params
    proListRef.value.filter()
  })
})

const permissionMap = store?.getters?.['userInfo/permission'] || {}

const applyTypeFlag = computed(() => {
  const data = []
  if(permissionMap?.['admin'] || permissionMap?.['composite-search:back'] || permissionMap?.['advance-search:back']){
    data.push('1')
  }
  if(permissionMap?.['admin'] || permissionMap?.['composite-search:common-back'] || permissionMap?.['advance-search:common-back']){
    data.push('2')
  }
  return data
})
</script>

<template>
  <div class="search-result">
    <div class="result-list">
      <ProList
        ref="proListRef"
        title="查询结果"
        :getListFn="type === 1 ? getSearchResult : getAdvanceSearchResult"
        :rowKey="searchType === 4 ? 'boFireInfoId' : (searchType === 1 ? 'boFireWarningId' : 'boFireDispatchId')"
        :showLoad="false"
        :showBack="false"
      >
        <template #search>
          <SearchInfo :search-type="searchType" :search-info="searchInfo" />
        </template>
        <template #list="{ record }">
          <div class="pro-list-item" @click="handleItem(record)">
            <div class="item-header">
              <div class="item-title">{{ record.warningName }}</div>
              <div class="item-state" :class="generateColorByState(record.warningStatusValue)">
                {{ record.warningStatusValue }}
              </div>
            </div>
            <div v-if="record.firePlaceName" class="item-type">
              <span>{{ record.firePlaceName }}</span>
            </div>
            <div v-else-if="record.warningTypeValue" class="item-type">
              <span>{{ record.warningTypeValue }}</span>
            </div>
            <template v-if="searchType === 4">
              <div class="item-field">
                <img src="../../assets/images/icon-time@2x.png" alt="" />
                <div class="item-field-label">起火时间：</div>
                <div>{{ formatYmdHm(record.fireDate) }}</div>
              </div>
            </template>
            <template v-else>
              <div class="item-field">
                <img src="../../assets/images/icon-time@2x.png" alt="" />
                <div class="item-field-label">接警时间：</div>
                <div>{{ formatYmdHm(record.warningDate) }}</div>
              </div>
            </template>
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
              <van-button
                v-p="['admin', 'composite-search:back', 'advance-search:back', 'composite-search:common-back', 'advance-search:common-back']"
                size="mini"
                color="#1989fa"
                class="item-btn"
                :class="{
                  gay: !record.permission
                }"
                type="link"
                @click="handleReject(record)"
              >
                驳回
              </van-button>
            </div>
          </div>
        </template>
      </ProList>
    </div>

    <div class="result-generate">
      <van-button type="primary" round block @click="handleGenerate">
        生成报表
      </van-button>
    </div>

    <!-- 警情详情 -->
    <ProModal v-model:visible="show.lookVisible" :showBack="true" :showHeader="false" title="警情详情">
      <PoliceEntryDetail :current-row="currentRow" />
    </ProModal>
    <!-- 发起驳回说明 -->
    <ProModal
      v-model:visible="show.rejectVisible"
      :showConfirmBack="true"
      :showHeader="false"
      title="发起驳回说明"
    >
      <template #default="{ setHandleOk }">
        <ApplyReject
          :type="rejectType"
          :current-row="currentRow"
          :selected-keys="[]"
          :set-handle-ok="setHandleOk"
          :apply-type-flag="applyTypeFlag"
          @finish-callback="finishCallback"
        />
      </template>
    </ProModal>
    <!-- 报表统计 -->
    <ProModal
      v-model:visible="show.reportUseVisible"
      :showBack="true"
      :showHeader="false"
      title="报表统计"
    >
      <template v-if="type === 1">
        <ReportGenerate
          :current-row="{ sceneType: searchType === 1 ? '警情' : (searchType === 4 ? '火灾' : '出动') }"
          :search-type="2"
          :query-params="() => getQueryParams()"
        />
      </template>
      <template v-else-if="type === 2">
        <ReportGenerate
          :current-row="{ sceneType: searchType === 1 ? '警情' : (searchType === 4 ? '火灾' : '出动') }"
          :search-type="3"
          :query-params="() => getQueryParams()"
        />
      </template>
    </ProModal>
  </div>
</template>

<style lang="scss" scoped>
.search-result {
  height: 100%;
  background-color: #f6f7f8;
  .list-tabs {
    display: flex;
    padding: 10px 12px 0 12px;
  }
  .result-list {
    height: calc(100% - 60px);
  }
  .result-generate {
    width: 100%;
    height: 60px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    position: absolute;
    bottom: 0;
  }
}
</style>
