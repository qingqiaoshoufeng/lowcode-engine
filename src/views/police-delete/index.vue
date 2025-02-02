<script setup>
import { ref, onMounted, nextTick } from "vue";
import ProList from "@/component/ProList/index";
import SelectTime from "@/component/SelectTime/index";
import SelectMore from "@/component/SelectMore/index"; 
import ProModal from "@/component/ProModal/index";
import PoliceEntryDetail from '@/views/policeEntryDetail/index.vue';
import {
  generateColorByState,
  getLastMonth,
} from "@/utils/tools.js";
import { showToast, showLoadingToast, closeToast } from "vant";
import { getDeleteFireWarningLists} from "@/apis/index.js";
import { formatYmdHm } from "@/utils/format.js";
import { useStore } from "vuex";
import { useModal } from '@/hooks/useModal.js'

const searchOptions = ref([
  {
    title: '选择时间',
    type: 'select-range',
    placeholder: '请选择时间',
    value: 'time',
  },
  {
    title: '警情编号',
    type: 'input',
    placeholder: '请输入警情编号',
    value: "warningCode",
  },
  {
    title: '警情类型',
    type: 'cascader-level',
    placeholder: '请选择警情类型',
    fieldNames: { value: 'boDictId', label: 'dictName' },
    options: [],
    value: 'warningType',
  },
  {
    title: '申请单位',
    type: 'select-org',
    placeholder: '请选择申请单位',
    params: { permission: true },
    single: true,
    selectLeaf: false,
    headersDisabled: true,
    value: 'applyGroup',
  },
  {
    title: '作废原因',
    type: 'select-single',
    placeholder: '请选择作废原因',
    fieldNames: { value: 'value', label: 'label' },
    options: [
      {
        label: '警情重复派发',
        value: '1',
      },
      {
        label: '警情信息错误',
        value: '2',
      },
      {
        label: '指派队伍错误',
        value: '3',
      },
      {
        label: '其他',
        value: '4',
      },
    ],
    value: 'cancelReason',
  },
])

const defaultFilterValue = {
  onlyMy: false,
  time: getLastMonth(),
  applyGroup: [],
  warningTag: [],
  cancelReason: null,
};

const store = useStore();

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

const finishCallback = () => {
  proListRef.value.filter()
}

onMounted(() => {
  const res = store.getters?.["dict/filterDicts"](['JQ_TYPE'], null, 3);
  searchOptions.value[2].options = res.JQ_TYPE

  nextTick(() => {
    proListRef.value?.filter();
  });
});
</script>

<template>
  <div class="police-delete-list">
    <ProList
      ref="proListRef"
      title="作废警情"
      :defaultFilterValue="defaultFilterValue"
      :getListFn="getDeleteFireWarningLists"
      rowKey="boFireWarningId"
      :showLoad="false"
    >
      <template #search="{ tabsActive, filterFormState,resetForm }">
        <div class="list-tabs" v-if="tabsActive === 1 || tabsActive === 2">
          <SelectTime
            v-model:value="filterFormState.time"
            title="选择时间"
            @change="onTimeChange"
          />
          <SelectMore
            :options="searchOptions"
            :resetFn="resetForm"
            @confirmCallback="onSearchConfirm"
          />
        </div>
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
            <div class="item-field-label">接警时间：</div>
            <div>{{ formatYmdHm(record.warningDate) }}</div>
          </div>
          <div class="item-field">
            <img
              src="../../assets/images/icon-area@2x.png"
              style="width: 13px; height: 15px; margin-right: 8px"
              alt=""
            />
            <div class="item-field-label">行政区域：</div>
            <div>{{ record.warningAreaValue }}</div>
          </div>
          <div class="item-field">
            <img
              src="../../assets/images/icon-area@2x.png"
              style="width: 13px; height: 15px; margin-right: 8px"
              alt=""
            />
            <div class="item-field-label">警情地址：</div>
            <div>{{ record.warningAddr }}</div>
          </div>
          <div class="item-field">
            <img
              src="../../assets/images/icon_power@2x.png"
              style="width: 13px; height: 15px; margin-right: 8px"
              alt=""
            />
            <div class="item-field-label">备注：</div>
            <div>{{ record.cancelRemark }}</div>
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
.police-delete-list {
  height: 100%;
  background-color: #f6f7f8;
  .list-tabs {
    display: flex;
    padding: 10px 16px 0 16px;
  }
}
</style>
