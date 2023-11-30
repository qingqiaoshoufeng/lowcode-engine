<script setup>
import { ref } from "vue";
import ProList from "@/component/ProList/index";
import { generateColorByState } from "@/utils/tools.js";
import PoliceForm from '@/views/policeEntryForm/index.vue';
import PoliceEntryDetail from '@/views/policeEntryDetail/index.vue';
import ProModal from "@/component/ProModal/index";
import { getFireWarningManage } from "@/apis/index.js";
import { formatYmdHm } from "@/utils/format.js";
import { useModal } from '@/hooks/useModal.js'
import { showToast, showLoadingToast, closeToast } from "vant";
import { MSG_LOCKING_TEXT } from '@/utils/constants.js';

const { show } = useModal();

const defaultFilterValue = {
  unEditFlag: true,
};

const proListRef = ref(null);

const currentRow = ref(null);

const handleEdit = (row) => {
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

const finishCallback = () => {
  show.value.editVisible = false
  showLoadingToast();
  proListRef.value.filter().then((res) => {
    closeToast();
  });
}
</script>

<template>
  <div class="police-manage-edit">
    <ProList
      ref="proListRef"
      title="警情修改"
      :defaultFilterValue="defaultFilterValue"
      :getListFn="getFireWarningManage"
      :tabs="[]"
      rowKey="boFireWarningId"
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
          <div class="item-line" />
          <div class="item-operate" @click.stop>
            <van-button
              v-p="['admin', 'police-manage:edit']"
              type="success"
              size="mini"
              color="#1989fa"
              class="item-btn"
              @click="handleEdit(record)"
            >
              修改
            </van-button>
          </div>
        </div>
      </template>
    </ProList>

    <!-- 修改警情 -->
    <ProModal v-model:visible="show.editVisible" :showBack="true" :showHeader="false" title="修改警情">
      <template #default="{ setHandleOk, closeModal }">
        <PoliceForm
          :current-row="currentRow"
          :is-edit="true"
          :close-modal="closeModal"
          :set-handle-ok="setHandleOk"
          @finish-callback="finishCallback"
        />
      </template>
    </ProModal>
    <!-- 警情详情 -->
    <ProModal v-model:visible="show.lookVisible" :showBack="true" :showHeader="false" title="警情详情">
      <PoliceEntryDetail :current-row="currentRow" />
    </ProModal>
  </div>
</template>

<style lang="scss" scoped>
.police-manage-edit {
  height: 100vh;
  background-color: #f6f7f8;
}
</style>
