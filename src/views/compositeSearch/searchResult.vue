<script setup>
import { ref, onMounted, nextTick, inject, watch } from "vue";
import ProList from "@/component/ProList/index";
import { generateColorByState } from "@/utils/tools.js";
import router from "@/router/index.js";
import PoliceEntryDetail from '@/views/policeEntryDetail/index.vue';
import SearchInfo from './searchInfo.vue'
import { showToast, showLoadingToast, closeToast } from "vant";
import { getSearchResult } from "@/apis/index.js";
import { formatYmdHm } from "@/utils/format.js";
import { useStore } from "vuex";
import { useModal } from '@/hooks/useModal.js';

const props = defineProps({
  params: {
    type: Object,
    default: () => {},
  }
})

const searchType = inject('searchType');

const searchInfo = inject('searchInfo');

const store = useStore();

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

onMounted(() => {
  nextTick(() => {
    proListRef.value.query = props.params
    proListRef.value.filter()
  })
})
</script>

<template>
  <div class="search-result">
    <ProList
      ref="proListRef"
      title="查询结果"
      :getListFn="getSearchResult"
      :rowKey="searchType === 4 ? 'boFireInfoId' : (searchType === 1 ? 'boFireWarningId' : boFireDispatchId)"
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
          <div class="item-field">
            <img src="../../assets/images/icon-time@2x.png" alt="" />
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
        </div>
      </template>
    </ProList>

    <!-- 警情详情 -->
    <ProModal v-model:visible="show.lookVisible" :showBack="true" :showHeader="false" title="警情详情">
      <PoliceEntryDetail :current-row="currentRow" />
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
}
</style>
