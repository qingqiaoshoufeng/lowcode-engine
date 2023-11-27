<script setup>
import { ref, onMounted, nextTick } from "vue";
import ProList from "@/component/ProList/index";
import { generateColorByState } from "@/utils/tools.js";
import router from "@/router/index.js";
import { showToast, showLoadingToast, closeToast } from "vant";
import { getSearchResult } from "@/apis/index.js";
import { formatYmdHm } from "@/utils/format.js";
import { useStore } from "vuex";
import { useModal } from '@/hooks/useModal.js';

const store = useStore();

const { show } = useModal();

const currentRow = ref(null);

const proListRef = ref(null);

const handleItem = (row) => {
  currentRow.value = row
  show.value.lookVisible = true
};
</script>

<template>
  <div class="search-result">
    <ProList
      ref="proListRef"
      title="查询结果"
      :getListFn="getSearchResult"
      :tabs="tabs"
      rowKey="boFireWarningId"
      :showLoad="false"
    >
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
  </div>
</template>

<style lang="scss" scoped>
.search-result {
}
</style>
