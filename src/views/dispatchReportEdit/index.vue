<script setup>
import { ref } from "vue";
import ProList from "@/component/ProList/index";
import { generateColorByState } from "@/utils/tools.js";
import ProModal from "@/component/ProModal/index";
import DispatchForm from '@/views/dispatchReportForm/index.vue';
import { getDispatchManageList } from "@/apis/index.js";
import { formatYmdHm } from "@/utils/format.js";
import { useModal } from '@/hooks/useModal.js'
import { showToast, showLoadingToast, closeToast } from "vant";
import { MSG_LOCKING_TEXT } from '@/utils/constants.js';

const { show } = useModal();

const isAgain = ref(false)

const currentRow = ref(null);

const defaultFilterValue = {
  unEditFlag: true,
};

const proListRef = ref(null);

const handleReject = (row) => {
  if (row.isLock === '1') {
    message.warning(MSG_LOCKING_TEXT)
    return
  }
  currentRow.value = row
  if (row.taskId) {
    isAgain.value = true
  }
  show.value.editVisible = true
};

const handleItem = (row) => {
  currentRow.value = row
  show.value.lookVisible = true
};

const refreshCallback = () => {
  isAgain.value = false
  showLoadingToast();
  proListRef.value.filter().then((res) => {
    closeToast();
  });
}
</script>

<template>
  <div class="dispatch-report-edit">
    <ProList
      ref="proListRef"
      :defaultFilterValue="defaultFilterValue"
      :getListFn="getDispatchManageList"
      :tabs="[]"
      rowKey="boFireDispatchId"
    >
      <template #list="{ record }">
        <div class="list-item" @click="handleItem(record)">
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
            <div style="color: #929398">出动队伍：</div>
            <div>{{ record.dispatchGroupName }}</div>
          </div>
          <div class="item-field">
            <img src="../../assets/images/icon_menu@2x.png" alt="" />
            <div style="color: #929398">投入力量：</div>
            <div>{{ record.dispatchInput }}</div>
          </div>
          <div class="item-line" />
          <div class="item-operate" @click.stop>
            <van-button
              v-p="['admin', 'dispatch-manage:edit']"
              type="success"
              size="mini"
              color="#1989fa"
              class="item-btn"
              @click="handleReject(record)"
            >
              修改
            </van-button>
          </div>
        </div>
      </template>
    </ProList>

    <!-- 出动填报详情 -->
    <ProModal v-model:visible="show.lookVisible" :showHeader="false" title="出动填报详情">
      <DispatchForm
        :is-detail="true"
        :current-row="currentRow"
      />
    </ProModal>
    <!-- 出动填报 -->
    <ProModal v-model:visible="show.editVisible" :showHeader="false" title="出动填报">
      <template #default="{ setHandleOk, closeModal }">
        <DispatchForm
          :current-row="currentRow"
          :is-edit="true"
          :is-again="isAgain"
          :close-modal="closeModal"
          :set-handle-ok="setHandleOk"
          @finish-callback="refreshCallback"
        />
      </template>
    </ProModal>
  </div>
</template>

<style lang="scss" scoped>
.dispatch-report-edit {
  height: 100vh;
  background-color: #f6f7f8;
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
