<script setup>
import { ref, onMounted, nextTick } from "vue";
import ProList from "@/component/ProList/index";
import SelectTime from "@/component/SelectTime/index";
import SelectMore from "@/component/SelectMore/index";
import ProModal from "@/component/ProModal/index";
import ApplyAbolish from "./apply-abolish.vue";
import ApplyRecheck from "./apply-recheck.vue";
import PoliceEntryDetail from '@/views/policeEntryDetail/index.vue';
import {
  checkAbolishState,
  checkPoliceChangeState,
  generateColorByState,
  getLastMonth,
} from "@/utils/tools.js";
import router from "@/router/index.js";
import { MSG_LOCKING_TEXT, isDispatch, isNot } from '@/utils/constants.js';
import { showToast, showLoadingToast, closeToast } from "vant";
import { getFireWarningManage, collectFireWarning, getTagList } from "@/apis/index.js";
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
    title: '状态',
    type: 'select',
    placeholder: '请选择状态',
    options: [],
    fieldNames: { value: 'boDictId', label: 'dictName' },
    value: 'warningStatus',
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
    title: '警情等级',
    type: 'select-single',
    placeholder: '请选择警情等级',
    options: [],
    fieldNames: { value: 'boDictId', label: 'dictName' },
    value: 'warningLevel',
  },
  {
    title: '主战队伍',
    type: 'select-org',
    placeholder: '请选择主战队伍',
    params: { permission: true },
    single: true,
    selectLeaf: true,
    headersDisabled: true,
    value: 'mainGroup',
  },
  {
    title: '行政区域',
    type: 'select-area',
    placeholder: '请选择行政区域',
    value: 'boAreaId',
  },
  {
    title: '警情标签',
    type: 'select',
    placeholder: '请输入警情标签',
    fieldNames: { value: 'boFireTagId', label: 'tagName' },
    value: 'warningTag',
  },
  {
    title: '警情地址',
    type: 'input',
    placeholder: '请输入警情地址',
    value: "warningAddr",
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
    title: '自然灾害类型',
    type: 'cascader-level',
    placeholder: '请选择自然灾害类型',
    fieldNames: { value: 'boDictId', label: 'dictName' },
    options: [],
    value: 'naturalDisasterType',
  },
  {
    title: '是否跨市',
    type: 'select-single',
    placeholder: '请选择是否跨市',
    fieldNames: { value: 'value', label: 'label' },
    options: isNot,
    value: 'isOtherCity',
  },
  {
    title: '是否跨省',
    type: 'select-single',
    placeholder: '请选择是否跨省',
    fieldNames: { value: 'value', label: 'label' },
    options: isNot,
    value: 'isOtherProvince',
  },
  {
    title: '全勤指挥部是否出动',
    type: 'select-single',
    placeholder: '请选择全勤指挥部是否出动',
    fieldNames: { value: 'value', label: 'label' },
    options: isDispatch,
    value: 'isHeadquarters',
  },
])

const defaultFilterValue = {
  onlyMy: false,
  time: getLastMonth(),
};

const tabs = ref([
  {
    title: "辖区警情",
    value: 1,
  },
  {
    title: "我的警情",
    value: 2,
  },
  {
    title: "收藏的警情",
    value: 3,
  },
]);

const store = useStore();

const { show } = useModal();

const currentRow = ref(null);

const proListRef = ref(null);

const onTabFn = (name, title) => {
  if (title === tabs.value[1].title) {
    proListRef.value.query = defaultFilterValue
    proListRef.value.query.onlyMy = true;
    proListRef.value.query.myCollect = false;
    showLoadingToast();
    proListRef.value.filter().then(() => {
      closeToast();
    });
  } else if (title === tabs.value[2].title) {
    proListRef.value.query = {}
    proListRef.value.query.onlyMy = false;
    proListRef.value.query.myCollect = true;
    showLoadingToast();
    proListRef.value.filter().then(() => {
      closeToast();
    });
  } else if (title === tabs.value[0].title) {
    proListRef.value.query = defaultFilterValue
    proListRef.value.query.onlyMy = false;
    proListRef.value.query.myCollect = false;
    showLoadingToast();
    proListRef.value.filter().then(() => {
      closeToast();
    });
  }
};

const handleCollect = async (row, state) => {
  showLoadingToast();
  const res = await collectFireWarning({
    focusAppid: row.boFireWarningId,
    focusCode: row.warningCode,
    focusType: "1",
    deleteFlag: state ? "1" : "2",
  });
  proListRef.value.filter().then(() => {
    showToast(state ? "收藏成功" : "取消收藏成功");
    closeToast();
  });
};

const handleAbolish = (row) => {
  if (row.isLock === '1') {
    showToast(MSG_LOCKING_TEXT)
    return
  }
  currentRow.value = row
  show.value.abolishVisible = true
};

const handleChange = (row) => {
  if (row.isLock === '1') {
    showToast(MSG_LOCKING_TEXT)
    return
  }
  if (row.isOtherCity === '1') {
    showToast('跨市警情不支持【申请更正】操作，请联系管理员处理！')
    return
  }
  if (row.isOtherProvince === '1') {
    showToast('跨省警情不支持【申请更正】操作，请联系管理员处理！')
    return
  }
  currentRow.value = row
  show.value.recheckVisible = true
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
  proListRef.value.filter()
}

onMounted(() => {
  const res = store.getters?.["dict/filterDicts"](['JQ_STATUS', 'JQ_TYPE', 'JQ_LEVEL', 'NATURAL_DISASTER_TYPE'], null, 3);
  searchOptions.value[1].options = res.JQ_STATUS
  searchOptions.value[3].options = res.JQ_TYPE
  searchOptions.value[4].options = res.JQ_LEVEL
  searchOptions.value[10].options = res.NATURAL_DISASTER_TYPE
  // 获取警情标签
  getTagList({ tagType: 1, page: 1, limit: 10000 }).then((res) => {
    searchOptions.value[7].options = res.data;
  });
  nextTick(() => {
    proListRef.value?.filter();
  });
});
</script>

<template>
  <div class="police-manage-list">
    <ProList
      ref="proListRef"
      title="警情管理"
      :defaultFilterValue="defaultFilterValue"
      :getListFn="getFireWarningManage"
      :tabs="tabs"
      rowKey="boFireWarningId"
      :showLoad="false"
      :onTabFn="onTabFn"
    >
      <template #search="{ tabsActive, filterFormState, resetForm }">
        <div class="list-tabs" v-if="tabsActive === 1 || tabsActive === 2">
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
          <div class="item-line" />
          <div class="item-operate" @click.stop>
            <van-icon
              name="star"
              v-if="record.focusStatus === '1'"
              style="color: #ffbc15"
              class="item-collect"
              @click="handleCollect(record, false)"
            />
            <van-icon
              name="star-o"
              v-else
              class="item-collect"
              @click="handleCollect(record, true)"
            />
            <van-button
              v-p="['admin', 'police-manage:abolish']"
              type="primary"
              size="mini"
              class="item-btn"
              @click="handleAbolish(record)"
              :disabled="!checkAbolishState(record.warningStatusValue, record.updatePermission)"
            >
              作废
            </van-button>
            <van-button
              v-p="['admin', 'police-manage:change']"
              type="primary"
              size="mini"
              class="item-btn"
              @click="handleChange(record)"
              :disabled="!checkPoliceChangeState(record.warningStatusValue, record.updatePermission)"
            >
              更正
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
    <!-- 申请更正 -->
    <ProModal
      v-model:visible="show.recheckVisible"
      :showConfirmBack="true"
      :showHeader="false"
      title="申请更正"
    >
      <template #default="{ setHandleOk }">
        <ApplyRecheck
          :recheck-type="1"
          :current-row="currentRow"
          :set-handle-ok="setHandleOk"
          @finish-callback="finishCallback"
        />
      </template>
    </ProModal>
    <!-- 申请作废 -->
    <ProModal
      v-model:visible="show.abolishVisible"
      :showConfirmBack="true"
      :showHeader="false"
      title="申请作废"
    >
      <template #default="{ setHandleOk }">
        <ApplyAbolish
          :current-row="currentRow"
          :set-handle-ok="setHandleOk"
          @finish-callback="finishCallback"
        />
      </template>
    </ProModal>
  </div>
</template>

<style lang="scss" scoped>
.police-manage-list {
  height: 100%;
  background-color: #f6f7f8;
  .list-tabs {
    display: flex;
    padding: 10px 12px 0 12px;
  }
}
</style>
