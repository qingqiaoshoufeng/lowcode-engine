<script setup>
import { ref, onMounted, nextTick } from "vue";
import ProList from "@/component/ProList/index";
import SelectTime from "@/component/SelectTime/index";
import SelectMore from "@/component/SelectMore/index";
import ProModal from "@/component/ProModal/index";
import SelectSingle from "@/component/SelectSingle/index";
import ApplyDetail from './components/applyDetail.vue';
import {
  generateColorByState,
  generateTextByStatus,
  getLastMonth,
  generateColorByType,
} from "@/utils/tools.js";
import { applyRecordType, applyStatus } from '@/utils/constants.js';
import { showLoadingToast, closeToast } from "vant";
import { getApplyRecordList } from "@/apis/index.js";
import { formatYmdHm } from "@/utils/format.js";
import { useModal } from '@/hooks/useModal.js'

const searchOptions = ref([
  {
    title: '选择时间',
    type: 'select-range',
    placeholder: '请选择时间',
    value: 'time',
  },
  {
    title: '申请单位',
    type: 'select-org',
    placeholder: '请选择申请单位',
    params: { permission: true },
    single: true,
    selectLeaf: false,
    headersDisabled: true,
    value: 'applyUnit',
  },
  {
    title: '状态',
    type: 'select-single',
    placeholder: '请选择状态',
    options: [],
    fieldNames: { value: 'value', label: 'label' },
    value: 'applyStatus',
  },
])

const defaultFilterValue = {
  applyType: '1',
  time: getLastMonth(),
  applyUnit: [],
  applyStatus: undefined,
};

const { show } = useModal();

const currentRow = ref(null);

const proListRef = ref(null);

const handleItem = (row) => {
  currentRow.value = row
  show.value.lookVisible = true
};

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

onMounted(() => {
  searchOptions.value[2].options = applyStatus
  nextTick(() => {
    proListRef.value?.filter();
  });
});
</script>

<template>
  <div class="apply-record">
    <ProList
      ref="proListRef"
      title="申请记录"
      :defaultFilterValue="defaultFilterValue"
      :getListFn="getApplyRecordList"
      rowKey="boFireWarningId"
      :showLoad="false"
    >
      <template #search="{ filterFormState, resetForm }">
        <div class="list-tabs">
          <SelectSingle
            v-model:value="filterFormState.applyType"
            :readonly="true"
            name="applyType"
            :options="applyRecordType"
            :field-names="{ value: 'value', label: 'label' }"
            placeholder="请选择申请类型"
            title="请选择申请类型"
            label-width="0px"
            style="margin-right: 10px;"
            :rules="[{ required: true, message: '请选择申请类型' }]"
            @change="onTimeChange"
          />
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
      </template>
      <template #list="{ record }">
        <div class="list-item" @click="handleItem(record)">
          <div class="item-header">
            <div class="item-title">{{ record.warningName }}</div>
            <div class="item-state" :class="generateColorByState(record.status)">
              {{ generateTextByStatus(record.status) }}
            </div>
          </div>
          <div class="item-field">
            <img src="../../assets/images/icon_power@2x.png" alt="" />
            <div style="color: #929398">申请单位：</div>
            <div>{{ record.createOrgName }}</div>
          </div>
          <div class="item-field">
            <img src="../../assets/images/icon-time@2x.png" alt="" />
            <div style="color: #929398">申请时间：</div>
            <div>{{ formatYmdHm(record.createDate) }}</div>
          </div>
          <div class="item-field" v-if="record.applyTypeValue">
            <img src="../../assets/images/icon_menu@2x.png" alt="" />
            <div style="color: #929398">申请类型：</div>
            <span :class="generateColorByType(record.applyTypeValue)" class="text-nowrap">
              {{ record.applyTypeValue }}
            </span>
          </div>
          <div class="item-field">
            <img
              src="../../assets/images/icon-area@2x.png"
              style="width: 13px; height: 15px; margin-right: 8px"
              alt=""
            />
            <div style="color: #929398">申请原因：</div>
            <div>{{ record.recheckReason || record.cancelReasonValue }}</div>
          </div>
        </div>
      </template>
    </ProList>

    <!-- 申请单详情 -->
    <ProModal v-model:visible="show.lookVisible" :showBack="true" :showHeader="false" title="申请单详情">
      <ApplyDetail
        :apply-type="proListRef?.query?.applyType"
        :current-row="currentRow"
      />
    </ProModal>
  </div>
</template>

<style lang="scss" scoped>
.apply-record {
  height: 100%;
  background-color: #f6f7f8;
  .list-tabs {
    display: flex;
    padding: 10px 12px 0 12px;
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
      .item-collect {
        font-size: 20px;
        margin-right: auto;
      }
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
