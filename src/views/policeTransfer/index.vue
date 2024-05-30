<script setup>
import { ref, onMounted, nextTick } from "vue";
import ProList from "@/component/ProList/index";
import SelectTime from "@/component/SelectTime/index";
import SelectMore from "@/component/SelectMore/index";
import ProModal from "@/component/ProModal/index";
import PoliceEntryDetail from '@/views/policeEntryDetail/index.vue';
import PoliceBack from "./police-back.vue";
import PoliceTransfer from './police-transfer.vue';
import { generateColorByState } from "@/utils/tools.js";
import { reinforceOptionsList } from '@/utils/constants.js';
import { showToast, showLoadingToast, closeToast } from "vant";
import { getPoliceRedeployList } from "@/apis/index.js";
import { formatYmdHm } from "@/utils/format.js";
import { useModal } from '@/hooks/useModal.js';
import store from '@/store/index.js'

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
    single: true,
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
    type: 'cascader-level',
    placeholder: '请选择警情类型',
    fieldNames: { value: 'boDictId', label: 'dictName' },
    options: [],
    value: 'warningType',
  },
  {
    title: '增援类型',
    type: 'select-single',
    placeholder: '请选择增援类型',
    options: [],
    fieldNames: { value: 'value', label: 'label' },
    value: 'reinforceType',
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
  onlyMy: '2',
  time: [],
  warningType: undefined,
  warningTag: [],
  warningStatus: [],
  mainGroup: [],
  boAreaId: [],
  areaLvl: [],
  orgIds: [],
  naturalDisasterType: [],
};

const tabs = ref([
  {
    title: "待转派",
    value: '2',
  },
  {
    title: "已转派",
    value: '1',
  },
]);

const { show } = useModal();

const currentRow = ref(null);

const proListRef = ref(null);

const onTabFn = (name, title) => {
  if (title === tabs.value[1].title) {
    proListRef.value.query.onlyMy = '1';
    showLoadingToast();
    proListRef.value.filter().then(() => {
      closeToast();
    });
  } else if (title === tabs.value[0].title) {
    proListRef.value.query.onlyMy = '2';
    showLoadingToast();
    proListRef.value.filter().then(() => {
      closeToast();
    });
  }
};

const handleTransfer = (row) => {
  currentRow.value = row
  show.value.transferVisible = true
};

const handleBack = (row) => {
  currentRow.value = row
  show.value.backVisible = true
}

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
  show.value.backVisible = false
  show.value.transferVisible = false
  proListRef.value.filter()
}

onMounted(() => {
  const res = store.getters?.["dict/filterDicts"](['JQ_STATUS', 'JQ_TYPE'], null, 3);
  searchOptions.value[4].options = res.JQ_TYPE
  searchOptions.value[5].options = reinforceOptionsList
  searchOptions.value[6].options = res.JQ_STATUS
  // 初始化
  nextTick(() => {
    const orgLevel = store.state.userInfo?.userInfo?.ORGLEVEL
    if (orgLevel === 2) {
      proListRef.value.query.provinceFlag = '1'
      proListRef.value.query.provinceTransfer = '1'
      proListRef.value.filter()
    }
    else if (orgLevel === 3) {
      proListRef.value.query.cityFlag = '1'
      proListRef.value.query.cityTransfer = '1'
      proListRef.value.filter()
    } else {
      proListRef.value.filter()
    }
  })
});
</script>

<template>
  <div class="police-transfer">
    <ProList
      ref="proListRef"
      title="警情转派"
      :defaultFilterValue="defaultFilterValue"
      :getListFn="getPoliceRedeployList"
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
            <div class="item-state" :class="generateColorByState(record.statusValue)">
              {{ record.statusValue }}
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
            <div>{{ record.distributeOrgName }}</div>
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
              v-p="['admin', 'police-redeploy:look']"
              type="success"
              size="mini"
              color="#1989fa"
              class="item-btn"
              @click="handleItem(record)"
            >
              查看
            </van-button>
            <van-button
              v-p="['admin', 'police-redeploy:transform']"
              type="success"
              size="mini"
              color="#1989fa"
              class="item-btn"
              @click="handleTransfer(record)"
              v-if="proListRef?.query?.onlyMy === '2'"
            >
              转派
            </van-button>
            <van-button
              v-p="['admin', 'police-redeploy:back']"
              type="success"
              size="mini"
              color="#1989fa"
              class="item-btn"
              @click="handleBack(record)"
              v-if="proListRef?.query?.onlyMy === '2'"
            >
              退回
            </van-button>
          </div>
        </div>
      </template>
    </ProList>

    <!-- 警情详情 -->
    <ProModal
      v-model:visible="show.lookVisible"
      :showBack="true"
      :showHeader="false"
      title="警情详情"
    >
      <PoliceEntryDetail :current-row="currentRow" />
    </ProModal>
    <!-- 警情转派 -->
    <ProModal
      v-model:visible="show.transferVisible"
      :showConfirmBack="true"
      :showHeader="false"
      title="警情转派"
    >
      <template #default="{ setHandleOk }">
        <PoliceTransfer
          :current-row="currentRow"
          :set-handle-ok="setHandleOk"
          @finish-callback="finishCallback"
        />
      </template>
    </ProModal>
    <!-- 警情退回 -->
    <ProModal
      v-model:visible="show.backVisible"
      :showConfirmBack="true"
      :showHeader="false"
      title="警情退回"
    >
      <template #default="{ setHandleOk }">
        <PoliceBack
          :current-row="currentRow"
          :set-handle-ok="setHandleOk"
          @finish-callback="finishCallback"
        />
      </template>
    </ProModal>
  </div>
</template>

<style lang="scss" scoped>
.police-transfer {
  height: 100%;
  background-color: #f6f7f8;
  .list-tabs {
    display: flex;
    padding: 10px 12px 0 12px;
  }
}
</style>
