<script setup>
import { ref, onMounted, nextTick } from "vue";
import ProList from "@/component/ProList/index";
import SelectTime from "@/component/SelectTime/index";
import SelectMore from "@/component/SelectMore/index";
import ProModal from "@/component/ProModal/index";
import PoliceForm from '@/views/policeEntryForm/index.vue';
import PoliceEntryDetail from '@/views/policeEntryDetail/index.vue';
import {
  generateColorByState,
  getLastMonth,
} from "@/utils/tools.js";
import { applyType } from '@/utils/constants.js';
import { showToast, showLoadingToast, closeToast } from "vant";
import { getPoliceConfirmList, getOtherProvince } from "@/apis/index.js";
import { formatYmdHm } from "@/utils/format.js";
import { useModal } from '@/hooks/useModal.js';
import { useStore } from "vuex";

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
    title: '所属队伍',
    type: 'select-org',
    placeholder: '请选择所属队伍',
    params: { permission: true },
    single: false,
    selectLeaf: false,
    headersDisabled: true,
    value: 'orgIds',
  },
  {
    title: '行政区域',
    type: 'select-area',
    placeholder: '请选择行政区域',
    value: 'boAreaId',
  },
  {
    title: '警情类型',
    type: 'cascader',
    placeholder: '请选择警情类型',
    fieldNames: { value: 'boDictId', text: 'dictName' },
    options: [],
    value: 'warningType',
  },
  {
    title: '增援总队',
    type: 'select',
    placeholder: '请选择增援总队',
    options: [],
    fieldNames: { value: 'organizationid', label: 'name' },
    value: 'otherProvince',
  },
  {
    title: '增援支队',
    type: 'select',
    placeholder: '请选择增援支队',
    options: [],
    fieldNames: { value: 'organizationid', label: 'name' },
    value: 'otherCity',
  },
  {
    title: '状态',
    type: 'select',
    placeholder: '请选择状态',
    options: [],
    fieldNames: { value: 'boDictId', label: 'dictName' },
    value: 'warningStatus',
  },
])

const defaultFilterValue = {
  confirmFlag: '1',
  time: [],
  warningType: undefined,
  warningStatus: [],
  boAreaId: [],
  areaLvl: [],
  orgIds: [],
  otherCity: [],
  otherProvince: [],
};

const tabs = ref([
  {
    title: "待确认",
    value: '1',
  },
  {
    title: "已确认",
    value: '2',
  },
]);

const store = useStore();

const { show } = useModal();

const currentRow = ref(null);

const proListRef = ref(null);

const onTabFn = (name, title) => {
  if (title === tabs.value[1].title) {
    proListRef.value.query.confirmFlag = '2';
    showLoadingToast();
    proListRef.value.filter().then(() => {
      closeToast();
    });
  } else if (title === tabs.value[0].title) {
    proListRef.value.query.confirmFlag = '1';
    showLoadingToast();
    proListRef.value.filter().then(() => {
      closeToast();
    });
  }
};

const handleConfirm = (row) => {
  currentRow.value = row
  show.value.confirmVisible = true
};

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
  show.value.confirmVisible = false
  proListRef.value.filter()
}

onMounted(() => {
  const res = store.getters?.["dict/filterDicts"](['JQ_STATUS', 'JQ_TYPE'], null, false);
  searchOptions.value[4].options = res.JQ_TYPE
  searchOptions.value[7].options = res.JQ_STATUS
  // 获取增援总队
  getOtherProvince({ deptType: 1, deptLevel: 2 }).then((res) => {
    if (res.items) {
      searchOptions.value[5].options = res.items
    }
  })
  // 获取增援支队
  getOtherProvince({ deptType: 1, deptLevel: 3 }).then((res) => {
    if (res.items) {
      searchOptions.value[6].options = res.items
    }
  })
  nextTick(() => {
    proListRef.value?.filter();
  });
});
</script>

<template>
  <div class="police-confirm">
    <ProList
      ref="proListRef"
      title="警情确认"
      :defaultFilterValue="defaultFilterValue"
      :getListFn="getPoliceConfirmList"
      :tabs="tabs"
      rowKey="boFireWarningId"
      :showLoad="false"
      :onTabFn="onTabFn"
    >
      <template #search="{ filterFormState, resetForm }">
        <div class="list-tabs">
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
              src="../../assets/images/icon_power@2x.png"
              style="width: 13px; height: 15px; margin-right: 8px"
              alt=""
            />
            <div class="item-field-label">发送单位：</div>
            <div>{{ record.warningAreaValue }}</div>
          </div>
          <div class="item-field">
            <img
              src="../../assets/images/icon-time@2x.png"
              style="width: 13px; height: 15px; margin-right: 8px"
              alt=""
            />
            <div class="item-field-label">发送时间：</div>
            <div>{{ formatYmdHm(record.sendTime) }}</div>
          </div>
          <div class="item-line" />
          <div class="item-operate" @click.stop>
            <van-button
              v-p="['admin', 'police-confirm:look']"
              type="success"
              size="mini"
              color="#1989fa"
              class="item-btn"
              @click="handleItem(record)"
            >
              查看
            </van-button>
            <van-button
              v-p="['admin', 'police-confirm:confirm']"
              type="success"
              size="mini"
              color="#1989fa"
              class="item-btn"
              @click="handleConfirm(record)"
              v-if="proListRef?.query?.confirmFlag === '1'"
            >
              确认
            </van-button>
          </div>
        </div>
      </template>
    </ProList>

    <!-- 警情详情 -->
    <ProModal v-model:visible="show.lookVisible" :showBack="true" :showHeader="false" title="警情详情">
      <PoliceEntryDetail :current-row="currentRow" />
    </ProModal>
    <!-- 警情确认 -->
    <ProModal
      v-model:visible="show.confirmVisible"
      :showBack="true"
      :showHeader="false"
      ok-text="跨省警情确认"
      title="警情确认"
    >
      <template #default="{ setHandleOk }">
        <PoliceForm
          :current-row="currentRow"
          :is-approval="true"
          :is-confirm="true"
          :set-handle-ok="setHandleOk"
          @finish-callback="finishCallback"
        />
      </template>
    </ProModal>
  </div>
</template>

<style lang="scss" scoped>
.police-confirm {
  height: 100%;
  background-color: #f6f7f8;
  .list-tabs {
    display: flex;
    padding: 10px 12px 0 12px;
  }
}
</style>
