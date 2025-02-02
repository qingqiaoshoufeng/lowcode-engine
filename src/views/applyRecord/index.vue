<script setup>
import { ref, onMounted, nextTick } from "vue";
import ProList from "@/component/ProList/index";
import SelectTime from "@/component/SelectTime/index";
import SelectMore from "@/component/SelectMore/index";
import ProModal from "@/component/ProModal/index";
import SelectSingle from "@/component/SelectSingle/index";
import ApplyDetail from "./components/applyDetail.vue";
import {
  generateColorByState,
  generateTextByStatus,
  getLastMonth,
  generateColorByType,
} from "@/utils/tools.js";
import { applyRecordType, applyStatus } from "@/utils/constants.js";
import { showLoadingToast, closeToast } from "vant";
import { getApplyRecordList } from "@/apis/index.js";
import { formatYmdHm } from "@/utils/format.js";
import { useModal } from "@/hooks/useModal.js";

const searchOptions = ref([
  {
    title: "选择时间",
    type: "select-range",
    placeholder: "请选择时间",
    value: "time",
  },
  {
    title: "申请单位",
    type: "select-org",
    placeholder: "请选择申请单位",
    params: { permission: true },
    single: true,
    selectLeaf: false,
    headersDisabled: true,
    value: "applyUnit",
  },
  {
    title: "状态",
    type: "select-single",
    placeholder: "请选择状态",
    options: [],
    fieldNames: { value: "value", label: "label" },
    value: "applyStatus",
  },
]);

const selects = ref([
  {
    checked: '1',
    hidden: false,
    key: '1',
    label:'警情更正申请',
  }
])

const defaultFilterValue = {
  applyType: "1",
  time: getLastMonth(),
  applyUnit: [],
  applyStatus: undefined,
};

const { show } = useModal();

const currentRow = ref(null);

const proListRef = ref(null);

const handleItem = (row) => {
  currentRow.value = row;
  show.value.lookVisible = true;
};

const onTimeChange = (value) => {
  showLoadingToast();
  proListRef.value.filter().then((res) => {
    closeToast();
  });
};

const selectTagsCallback = (val)=>{
  proListRef.value.query.applyType = val.value[0].key
  proListRef.value?.filter();
}
const onSearchConfirm = () => {
  showLoadingToast();
  proListRef.value.filter().then((res) => {
    closeToast();
  });
};

const getRowKey = (row) => {
  if (proListRef.value.query?.applyType === '1' || proListRef.value.query?.applyType === '4') {
    return row.boFireWarningId
  } else if (proListRef.value.query?.applyType === '2') {
    return row.boFireDispatchId
  } else if (proListRef.value.query?.applyType === '3') {
    return row.boFireInfoId
  }
}

onMounted(() => {
  searchOptions.value[2].options = applyStatus;
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
      :rowKey="getRowKey"
      :showLoad="false"
    >
      <template #search="{ filterFormState, resetForm }">
        <div class="list-tabs">
          <!-- <SelectSingle
            v-model:value="filterFormState.applyType"
            :readonly="true"
            name="applyType"
            :options="applyRecordType"
            :field-names="{ value: 'value', label: 'label' }"
            placeholder="请选择申请类型"
            title="请选择申请类型"
            label-width="0px"
            style="margin-right: 10px"
            :rules="[{ required: true, message: '请选择申请类型' }]"
            @change="onTimeChange"
          /> -->
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
        <SelectTags class="select_tags" :multiple="false" :menus="applyRecordType.map(item=>({key:item.value,label:item.label}))" :selects="selects" :select-callback="selectTagsCallback" />
      </template>
      <template #list="{ record }">
        <div class="pro-list-item" @click="handleItem(record)">
          <div class="item-header">
            <div class="item-title">{{ record.warningName }}</div>
            <div class="item-state" :class="generateColorByState(record.status)">
              {{ generateTextByStatus(record.status) }}
            </div>
          </div>
          <div class="item-field">
            <img src="../../assets/images/icon_power@2x.png" alt="" />
            <div class="item-field-label">申请单位：</div>
            <div>{{ record.createOrgName }}</div>
          </div>
          <div class="item-field">
            <img src="../../assets/images/icon-time@2x.png" alt="" />
            <div class="item-field-label">申请时间：</div>
            <div>{{ formatYmdHm(record.createDate) }}</div>
          </div>
          <div class="item-field" v-if="record.applyTypeValue">
            <img src="../../assets/images/icon_menu@2x.png" alt="" />
            <div class="item-field-label">申请类型：</div>
            <span :class="generateColorByType(record.applyTypeValue)" class="text-nowrap">
              {{ record.applyTypeValue }}
            </span>
          </div>
          <div class="item-field">
            <img src="../../assets/images/icon-area@2x.png" style="width: 13px; height: 15px;" alt="" />
            <div class="item-field-label">申请原因：</div>
            <div>{{ record.recheckReason || record.cancelReasonValue }}</div>
          </div>
        </div>
      </template>
    </ProList>

    <!-- 申请单详情 -->
    <ProModal
      v-model:visible="show.lookVisible"
      :showBack="true"
      :showHeader="false"
      title="申请单详情"
    >
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
}
.select_tags {
  margin-top: 10px;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
