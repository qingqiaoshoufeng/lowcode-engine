<script setup>
import { ref } from "vue";
import ProList from "@/component/ProList/index";
import ProModal from "@/component/ProModal/index";
import ApplyReject from "./apply-reject.vue";
import { generateColorByState, checkTimeout } from "@/utils/tools.js";
import PoliceEntryDetail from '@/views/policeEntryDetail/index.vue';
import DispatchForm from '@/views/dispatchReportForm/index.vue';
import { MSG_LOCKING_TEXT } from '@/utils/constants.js';
import { showToast, showLoadingToast, closeToast } from "vant";
import { getReportList } from "@/apis/index.js";
import { formatYmdHm } from "@/utils/format.js";
import { useModal } from '@/hooks/useModal.js'

const defaultFilterValue = {
  isDraft: 2,
};

const { show } = useModal();

const currentRow = ref(null);
const isDraft = ref(false)

const proListRef = ref(null);

const handleReject = (row) => {
  currentRow.value = row
  show.value.rejectVisible = true
};

const handleInput = (row) => {
  if (row.isLock === '1') {
    showToast(MSG_LOCKING_TEXT)
    return
  }
  currentRow.value = row
  show.value.editVisible = true
};

const handleItem = (row) => {
  currentRow.value = row
  isDraft.value = false
  show.value.lookVisible = true
};

const refreshCallback = () => {
  show.value.editVisible = false
  showLoadingToast()
  proListRef.value.filter().then(res => {
    closeToast()
  })
}
</script>

<template>
  <div class="dispatch-report-list">
    <ProList
      ref="proListRef"
      title="出动填报"
      :defaultFilterValue="defaultFilterValue"
      :getListFn="getReportList"
      :tabs="[]"
      rowKey="boFireDispatchId"
    >
      <template #list="{ record }">
        <div class="pro-list-item" @click="handleItem(record)">
          <div class="item-header">
            <div class="item-title">{{ record.warningName }}</div>
            <div class="item-state" :class="generateColorByState(record.dispatchStatusValue || '待填报')">
              {{ record.dispatchStatusValue || '待填报' }}
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
          <div class="item-field">
            <img src="../../assets/images/icon_power@2x.png" alt="" />
            <div style="color: #929398">发送单位：</div>
            <div>{{ record.distributeOrgName }}</div>
          </div>
          <div class="item-field">
            <img src="../../assets/images/icon_menu@2x.png" alt="" />
            <div style="color: #929398">已派时长：</div>
            <div v-if="checkTimeout(record.dispatchedTime)" class="test-timeout">
              {{ record.dispatchedTime }}
            </div>
            <div v-else>
              {{ record.dispatchedTime }}
            </div>
          </div>
          <div class="item-line" />
          <div class="item-operate" @click.stop>
            <van-button
              v-p="['admin', 'dispatch-report:reback']"
              type="success"
              size="mini"
              color="#1989fa"
              class="item-btn"
              @click="handleReject(record)"
            >
              退回
            </van-button>
            <van-button
              v-p="['admin', 'dispatch-report:input']"
              type="success"
              size="mini"
              color="#1989fa"
              class="item-btn"
              @click="handleInput(record)"
            >
              填报
            </van-button>
          </div>
        </div>
      </template>
    </ProList>

    <!-- 出动填报 -->
    <ProModal v-model:visible="show.editVisible" :showBack="true" :showHeader="false" title="出动填报">
      <template #default="{ setHandleOk, closeModal }">
        <DispatchForm
          :show-draft="isDraft"
          :is-edit="false"
          :isInput="true"
          :current-row="currentRow"
          :close-modal="closeModal"
          :set-handle-ok="setHandleOk"
          @finish-callback="refreshCallback"
        />
      </template>
    </ProModal>
    <!-- 警情详情 -->
    <ProModal v-model:visible="show.lookVisible" :showBack="true" :showHeader="false" title="警情详情">
      <PoliceEntryDetail :current-row="currentRow" />
    </ProModal>
    <!-- 退回说明 -->
    <ProModal v-model:visible="show.rejectVisible" title="退回说明">
      <template #default="{ setHandleOk }">
        <ApplyReject
          :current-row="currentRow"
          :set-handle-ok="setHandleOk"
          @finish-callback="refreshCallback"
        />
      </template>
    </ProModal>
  </div>
</template>

<style lang="scss" scoped>
.dispatch-report-list {
  height: 100vh;
  background-color: #f6f7f8;
  .list-tabs {
    display: flex;
    padding: 10px 12px 0 12px;
  }
}
</style>
