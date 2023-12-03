<script setup>
import { ref, onMounted, nextTick } from "vue";
import ProList from "@/component/ProList/index";
import SelectTime from "@/component/SelectTime/index";
import SelectMore from "@/component/SelectMore/index";
import ProModal from "@/component/ProModal/index";
import DispatchForm from '@/views/dispatchReportForm/index.vue';
import {
  checkDispatchApproval,
  generateColorByState,
  getLastMonth,
} from "@/utils/tools.js";
import { MSG_LOCKING_TEXT } from '@/utils/constants.js';
import { showToast, showLoadingToast, closeToast } from "vant";
import { getDispatchReviewList } from "@/apis/index.js";
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
    title: '出动编号',
    type: 'input',
    placeholder: '请输入出动编号',
    value: "dispatchCode",
  },
  {
    title: '出动队伍',
    type: 'select-org',
    placeholder: '请选择出动队伍',
    params: { permission: true },
    single: true,
    selectLeaf: true,
    headersDisabled: true,
    value: 'dispatchGroup',
  },
  {
    title: '状态',
    type: 'select',
    placeholder: '请选择状态',
    options: [],
    fieldNames: { value: 'boDictId', label: 'dictName' },
    value: 'dispatchStatus',
  },
])

const defaultFilterValue = {
  state: 'running',
  time: [],
};

const tabs = ref([
  {
    title: "待审核",
    value: 1,
  },
  {
    title: "已审核",
    value: 2,
  },
]);

const store = useStore();

const { show } = useModal();

const currentRow = ref(null);

const proListRef = ref(null);

const onTabFn = (name, title) => {
  if (title === tabs.value[1].title) {
    proListRef.value.query = defaultFilterValue
    proListRef.value.query.state = 'completed';
    showLoadingToast();
    proListRef.value.filter().then(() => {
      closeToast();
    });
  } else if (title === tabs.value[0].title) {
    proListRef.value.query = defaultFilterValue
    proListRef.value.query.state = 'running';
    showLoadingToast();
    proListRef.value.filter().then(() => {
      closeToast();
    });
  }
};

const handleReview = (row) => {
  if (row.isLock === '1') {
    showToast(MSG_LOCKING_TEXT)
    return
  }
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
  const res = store.getters?.["dict/filterDicts"](['CD_STATUS'], null, false);
  searchOptions.value[3].options = res.CD_STATUS
  nextTick(() => {
    proListRef.value?.filter();
  });
});
</script>

<template>
  <div class="dispatch-review-list">
    <ProList
      ref="proListRef"
      title="出动审核"
      :defaultFilterValue="defaultFilterValue"
      :getListFn="getDispatchReviewList"
      :tabs="tabs"
      rowKey="boFireDispatchId"
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
            <div>{{ record.inputForce }}</div>
          </div>
          <div class="item-line" />
          <div class="item-operate" @click.stop>
            <van-button
              v-if="proListRef?.query?.state === 'running' && checkDispatchApproval(record.dispatchStatusValue)"
              type="success"
              size="mini"
              color="#1989fa"
              class="item-btn"
              @click="handleReview(record)"
            >
              审核
            </van-button>
          </div>
        </div>
      </template>
    </ProList>

    <!-- 出动填报详情 -->
    <ProModal v-model:visible="show.lookVisible" :showBack="true" :showHeader="false" title="出动填报详情">
      <DispatchForm
        :current-row="currentRow"
        :is-detail="true"
      />
    </ProModal>
    <!-- 出动审核详情 -->
    <ProModal v-model:visible="show.reviewVisible" :showBack="true" :showHeader="false" title="出动审核详情">
      <template #default="{ setHandleOk }">
        <DispatchForm
          :current-row="currentRow"
          :is-edit="true"
          :is-approval="true"
          process-key="fireDispatchFlow"
          :set-handle-ok="setHandleOk"
          @finish-callback="finishCallback"
        />
      </template>
    </ProModal>
  </div>
</template>

<style lang="scss" scoped>
.dispatch-review-list {
  height: 100vh;
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
      max-width: calc(100% - 20px);
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
