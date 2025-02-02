<script setup>
import { ref, onMounted, nextTick } from "vue";
import ProList from "@/component/ProList/index";
import SelectTime from "@/component/SelectTime/index";
import SelectMore from "@/component/SelectMore/index";
import ProModal from "@/component/ProModal/index";
import ApplyRecheck from "@/views/policeManageList/apply-recheck.vue";
import DispatchForm from '@/views/dispatchReportForm/index.vue';
import {
  checkDispatchChangeState,
  generateColorByState,
  getLastMonth,
} from "@/utils/tools.js";
import { MSG_LOCKING_TEXT, dispatchType, isNot } from '@/utils/constants.js';
import { showToast, showLoadingToast, closeToast } from "vant";
import { getDispatchManageList, collectFireWarning, getHeaderOrg } from "@/apis/index.js";
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
    value: 'dispatchStatus',
  },
  {
    title: '出动编号',
    type: 'input',
    placeholder: '请输入出动编号',
    value: "dispatchCode",
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
    title: '参战形式',
    type: 'select-single',
    placeholder: '请选择参战形式',
    fieldNames: { value: 'value', label: 'label' },
    value: 'dispatchType',
    options: dispatchType,
  },
  {
    title: '警情地址',
    type: 'input',
    placeholder: '请输入警情地址',
    value: "warningAddr",
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
    title: '所属队伍',
    type: 'select-org',
    placeholder: '请选择所属队伍',
    params: { permission: true },
    single: true,
    selectLeaf: false,
    headersDisabled: true,
    value: 'orgList',
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
    title: '处置情况',
    type: 'select',
    placeholder: '请选择处置情况',
    fieldNames: { value: 'boDictId', label: 'dictName' },
    value: 'dealSituation',
    options: [],
  },
  {
    title: '全勤指挥部名称',
    type: 'select',
    placeholder: '请选择全勤指挥部名称',
    fieldNames: { value: 'organizationid', label: 'name' },
    value: 'headNameList',
    options: [],
  },
])

const defaultFilterValue = {
  onlyMy: false,
  time: getLastMonth(),
  headNameList: [],
};

const tabs = ref([
  {
    title: "辖区出动",
    value: 1,
  },
  {
    title: "我的出动",
    value: 2,
  },
  {
    title: "收藏的出动",
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
    focusAppid: row.boFireDispatchId,
    focusCode: row.dispatchCode,
    focusType: "2",
    deleteFlag: state ? "1" : "2",
  });
  proListRef.value.filter().then(() => {
    showToast(state ? "收藏成功" : "取消收藏成功");
    closeToast();
  });
};

const handleChange = (row) => {
  if (row.isLock === '1') {
    showToast(MSG_LOCKING_TEXT)
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
  const res = store.getters?.["dict/filterDicts"](['CD_STATUS', 'JQ_TYPE', 'CD_JYQK_CZ'], null, 3);
  searchOptions.value[1].options = res.CD_STATUS
  searchOptions.value[4].options = res.JQ_TYPE
  searchOptions.value[12].options = res.CD_JYQK_CZ
  getHeaderOrg().then((res) => {
    if (res) {
      searchOptions.value[13].options = res
    }
  })
  nextTick(() => {
    proListRef.value?.filter();
  });
});
</script>

<template>
  <div class="dispatch-manage-list">
    <ProList
      ref="proListRef"
      title="出动管理"
      :defaultFilterValue="defaultFilterValue"
      :getListFn="getDispatchManageList"
      :tabs="tabs"
      rowKey="boFireDispatchId"
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
            <div class="item-state" :class="generateColorByState(record.dispatchStatusValue)">
              {{ record.dispatchStatusValue }}
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
            <img src="../../assets/images/icon_power@2x.png" alt="" />
            <div class="item-field-label">出动队伍：</div>
            <div>{{ record.dispatchGroupName }}</div>
          </div>
          <div class="item-field">
            <img src="../../assets/images/icon_menu@2x.png" alt="" />
            <div class="item-field-label">投入力量：</div>
            <div>{{ record.dispatchInput }}</div>
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
              v-p="['admin', 'dispatch-manage:change']"
              type="primary"
              size="mini"
              class="item-btn"
              @click="handleChange(record)"
              :disabled="!checkDispatchChangeState(record.dispatchStatusValue, record.updatePermission)"
            >
              更正
            </van-button>
          </div>
        </div>
      </template>
    </ProList>

    <!-- 出动详情 -->
    <ProModal v-model:visible="show.lookVisible" :showBack="true" :showHeader="false" title="出动详情">
      <DispatchForm
        :current-row="currentRow"
        :is-detail="true"
      />
    </ProModal>
    <!-- 申请更正 -->
    <ProModal
      v-model:visible="show.recheckVisible"
      title="申请更正"
      :showConfirmBack="true"
      :showHeader="false"
    >
      <template #default="{ setHandleOk }">
        <ApplyRecheck
          :recheck-type="2"
          :current-row="currentRow"
          :set-handle-ok="setHandleOk"
          @finish-callback="finishCallback"
        />
      </template>
    </ProModal>
  </div>
</template>

<style lang="scss" scoped>
.dispatch-manage-list {
  height: 100vh;
  background-color: #f6f7f8;
  .list-tabs {
    display: flex;
    padding: 10px 12px 0 12px;
  }
}
</style>
