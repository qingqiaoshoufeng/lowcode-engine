<script setup>
import { ref } from "vue";
import ProList from "@/component/ProList/index";
import ProModal from "@/component/ProModal/index";
import ApplyReject from "./apply-reject.vue";
import { generateColorByState } from "@/utils/tools.js";
import router from "@/router/index.js";
import PoliceForm from '@/views/policeEntryForm/index.vue';
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
  show.value.lookVisible = true
};

const refreshCallback = () => {
  show.value.editVisible = false
  showLoadingToast()
  proListRef.value.filter().then(res => {
    closeToast()
  })
}

const finishCallback = () => {
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
      :defaultFilterValue="defaultFilterValue"
      :getListFn="getReportList"
      :tabs="[]"
      rowKey="boFireDispatchId"
    >
      <template #list="{ record }">
        <div class="list-item" @click="handleItem(record)">
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
            <div style="color: #929398">派发单位：</div>
            <div>{{ record.distributeOrgName }}</div>
          </div>
          <div class="item-field">
            <img src="../../assets/images/icon_menu@2x.png" alt="" />
            <div style="color: #929398">已派时长：</div>
            <div>{{ record.dispatchedTime }}</div>
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
    <ProModal v-model:visible="show.editVisible" :showHeader="false" title="出动填报">
      <template #default="{ setHandleOk }">
        <DispatchForm
          :show-draft="false"
          :is-edit="false"
          :current-row="currentRow"
          :set-handle-ok="setHandleOk"
          @finish-callback="refreshCallback"
        />
      </template>
    </ProModal>
    <!-- 警情详情 -->
    <ProModal v-model:visible="show.lookVisible" :showHeader="false" title="警情详情">
      <PoliceForm
        :current-row="currentRow"
        :show-preview="true"
        :show-steps="true"
      />
    </ProModal>
    <!-- 退回说明 -->
    <ProModal v-model:visible="show.rejectVisible" title="退回说明">
      <template #default="{ setHandleOk }">
        <ApplyReject
          :current-row="currentRow"
          :set-handle-ok="setHandleOk"
          @finish-callback="finishCallback"
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
    padding: 10px 16px 0 16px;
  }
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
</style>
