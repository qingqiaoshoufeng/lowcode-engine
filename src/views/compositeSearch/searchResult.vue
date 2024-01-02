<script setup>
import { ref, onMounted, nextTick, inject, watch } from "vue";
import ProList from "@/component/ProList/index";
import { generateColorByState } from "@/utils/tools.js";
import PoliceEntryDetail from '@/views/policeEntryDetail/index.vue';
import ProModal from "@/component/ProModal/index";
import SearchInfo from './searchInfo.vue';
import ReportGenerate from "@/views/statistics/components/reportGenerate.vue";
import { showToast, showLoadingToast, closeToast } from "vant";
import { getSearchResult, getAdvanceSearchResult } from "@/apis/index.js";
import { formatYmdHm } from "@/utils/format.js";
import { MSG_EXPORT_NO_DATA, MSG_NO_HEAD_REPORT } from '@/utils/constants.js';
import { useModal } from '@/hooks/useModal.js';

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

const getSearchParams = inject('getSearchParams')

const { show } = useModal();

const currentRow = ref(null);

const proListRef = ref(null);

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

const handleGenerate = () => {
  if (proListRef.value.list?.length <= 0) {
    showToast(MSG_EXPORT_NO_DATA)
    return
  }
  if (searchType.value === 3) {
    showToast(MSG_NO_HEAD_REPORT)
    return
  }
  show.value.reportUseVisible = true
}

onMounted(() => {
  nextTick(() => {
    proListRef.value.query = props.params
    proListRef.value.filter()
  })
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
            <div class="item-type">
              <span>{{ record.warningTypeValue }}</span>
            </div>
            <template v-if="searchType === 4">
              <div class="item-field">
                <img src="../../assets/images/icon-time@2x.png" alt="" />
                <div style="color: #929398">起火时间：</div>
                <div>{{ formatYmdHm(record.fireDate) }}</div>
              </div>
            </template>
            <template v-else>
              <div class="item-field">
                <img src="../../assets/images/icon-time@2x.png" alt="" />
                <div style="color: #929398">接警时间：</div>
                <div>{{ formatYmdHm(record.warningDate) }}</div>
              </div>
            </template>
            <div class="item-field">
              <img
                src="../../assets/images/icon-area@2x.png"
                style="width: 13px; height: 15px; margin-right: 8px"
                alt=""
              />
              <div style="color: #929398">行政区域：</div>
              <div>{{ record.warningAreaValue }}</div>
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
          :query-params="() => ({ fireType: searchType, ...getSearchParams() })"
        />
      </template>
      <template v-else-if="type === 2">
        <ReportGenerate
          :current-row="{ sceneType: searchType === 1 ? '警情' : (searchType === 4 ? '火灾' : '出动') }"
          :search-type="3"
          :query-params="() => getSearchParams()"
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
