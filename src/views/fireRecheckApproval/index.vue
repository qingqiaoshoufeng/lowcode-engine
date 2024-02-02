<script setup>
import { ref, onMounted, nextTick } from "vue";
import ProList from "@/component/ProList/index";
import SelectTime from "@/component/SelectTime/index";
import SelectMore from "@/component/SelectMore/index";
import ProModal from "@/component/ProModal/index";
import EditorForm from '@/views/fire-report/components/EditorForm.vue'
import {
  generateColorByState,
  getLastMonth,
  generateColorByType,
} from "@/utils/tools.js";
import { applyType } from '@/utils/constants.js';
import { showToast, showLoadingToast, closeToast } from "vant";
import { getFireWarningEditApproval } from "@/apis/index.js";
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
    title: '火灾编号',
    type: 'input',
    placeholder: '请输入火灾编号',
    value: "fireCode",
  },
  {
    title: '申请单位',
    type: 'select-org',
    placeholder: '请选择申请单位',
    params: { permission: true },
    single: true,
    selectLeaf: false,
    headersDisabled: true,
    value: 'orgIds',
  },
  {
    title: '申请类型',
    type: 'select-single',
    placeholder: '请选择申请类型',
    options: [],
    fieldNames: { value: 'value', label: 'label' },
    value: 'applyType',
  },
])

const defaultFilterValue = {
  recheckType: 3,
  state: 'running',
  time: [],
  applyGroup: [],
};

const tabs = ref([
  {
    title: "待审批",
    value: 'running',
  },
  {
    title: "已审批",
    value: 'completed',
  },
]);

const { show } = useModal();

const currentRow = ref(null);

const proListRef = ref(null);

const onTabFn = (name, title) => {
  if (title === tabs.value[1].title) {
    proListRef.value.query.state = 'completed';
    showLoadingToast();
    proListRef.value.filter().then(() => {
      closeToast();
    });
  } else if (title === tabs.value[0].title) {
    proListRef.value.query.state = 'running';
    showLoadingToast();
    proListRef.value.filter().then(() => {
      closeToast();
    });
  }
};

const handleApproval = (row) => {
  currentRow.value = row
  show.value.reviewVisible = true
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
  show.value.reviewVisible = false
  proListRef.value.filter()
}

onMounted(() => {
  searchOptions.value[3].options = applyType
  nextTick(() => {
    proListRef.value?.filter();
  });
});
</script>

<template>
  <div class="fire-recheck-approval">
    <ProList
      ref="proListRef"
      title="火灾更正审批"
      :defaultFilterValue="defaultFilterValue"
      :getListFn="getFireWarningEditApproval"
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
          <div class="item-field">
            <img src="../../assets/images/icon_power@2x.png" alt="" />
            <div class="item-field-label">申请单位：</div>
            <div>{{ record.createOrg }}</div>
          </div>
          <div class="item-field">
            <img src="../../assets/images/icon-time@2x.png" alt="" />
            <div class="item-field-label">申请时间：</div>
            <div>{{ formatYmdHm(record.createDate) }}</div>
          </div>
          <div class="item-field">
            <img src="../../assets/images/icon_menu@2x.png" alt="" />
            <div class="item-field-label">申请类型：</div>
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
            <div class="item-field-label">申请原因：</div>
            <div>{{ record.recheckReason }}</div>
          </div>
          <template v-if="record.statusValue === '已审批'">
            <div class="item-field">
              <img
                src="../../assets/images/icon-area@2x.png"
                style="width: 13px; height: 15px; margin-right: 8px"
                alt=""
              />
              <div class="item-field-label">审批结果：</div>
              <div>{{ record.suggest }}</div>
            </div>
          </template>
          <template v-else>
            <div class="item-line" />
            <div class="item-operate" @click.stop>
              <van-button
                type="success"
                size="mini"
                color="#1989fa"
                class="item-btn"
                @click="handleApproval(record)"
                v-if="proListRef?.query?.state === 'running'"
              >
                审批
              </van-button>
            </div>
          </template>
        </div>
      </template>
    </ProList>

    <!-- 火灾填报详情 -->
    <ProModal v-model:visible="show.lookVisible" :showBack="true" :showHeader="false" title="火灾填报详情">
      <EditorForm :current-row="currentRow" :is-detail="true" />
    </ProModal>
    <!-- 火灾更正审批 -->
    <ProModal
      v-model:visible="show.reviewVisible"
      :showBack="false"
      :showHeader="true"
      ok-text="审批"
      title="火灾更正审批"
    >
      <template #default="{ setHandleOk }">
        <EditorForm
          :current-row="currentRow"
          :is-detail="true"
          :is-approval="true"
          label-text="审批"
          process-key="applyEditFlow"
          :set-handle-ok="setHandleOk"
          @finish-callback="finishCallback"
        />
      </template>
    </ProModal>
  </div>
</template>

<style lang="scss" scoped>
.fire-recheck-approval {
  height: 100%;
  background-color: #f6f7f8;
  .list-tabs {
    display: flex;
    padding: 10px 12px 0 12px;
  }
}
</style>
