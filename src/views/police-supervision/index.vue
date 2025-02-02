<template>
  <div class="police-supervision">
    <ProList
      ref="proListRef"
      :defaultFilterValue="defaultFilterValue"
      :getListFn="getFireWarningSupervision"
      title="警情质量监督"
    >
      <template #search="{ filterFormState, resetForm }">
        <div class="form">
          <div class="list-tabs1">
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
          <SelectTags class="select_tags" :menus="menus" :selects="proListRef?.query?.tags" :select-callback="selectTagsCallback" />
        </div>
      </template>
        <template #list="{ record }">
          <div class="pro-list-item" @click="handleLook(record)">
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
              <img 
                style="width: 13px; height: 15px; margin-right: 8px" 
                src="../../assets/images/icon-time@2x.png" alt="" />
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
              <img style="width: 13px; height: 15px; margin-right: 8px" src="../../assets/images/icon_menu@2x.png" alt="" />
              <div class="item-field-label">稽查标签：</div> 
              <div>{{ record.auditLabel }}</div>
            </div>
            <!-- <div class="item-field">
              <img style="width: 13px; height: 15px; margin-right: 8px" src="../../assets/images/icon-time@2x.png" alt="" />
              <div class="item-field-label">起火场所：</div>
              <div>{{ record.firePlaceValue }}</div>
            </div> -->
            <div class="item-line" />
            <div class="item-operate" @click.stop>
              <!-- <van-button
                v-p="['admin', 'police-supervision:look']"
                type="primary"
                size="mini"
                class="item-btn"
                @click="handleLook(record)"
              >
                查看
              </van-button> -->
              <van-button
                v-p="['admin', 'police-supervision:back', 'police-supervision:common-back']"
                size="mini"
                class="item-btn"
                :class="{
                  gay: !record.permission
                }"
                type="primary"
                @click="handleReject(record)"
              >
                驳回
              </van-button>
            </div>
          </div>
        </template>
    </ProList>
    <!-- 驳回 -->
    <ProModal
      v-model:visible="show.rejectVisible"
      :showConfirmBack="true"
      :showHeader="false"
      title="发起驳回说明"
    >
      <template v-slot="{setHandleOk}">
        <ApplyReject
          type="1"
          :current-row="currentRow"
          :set-handle-ok="setHandleOk"
          :finish-callback="finishCallback"
          :apply-type-flag="applyTypeFlag"
        />
      </template>
    </ProModal>
    <!-- 警情详情 -->
    <ProModal v-model:visible="show.lookVisible" :showBack="true" :showHeader="false" title="警情详情">
      <PoliceEntryDetail :current-row="currentRow" />
    </ProModal>
  </div>
</template>
  
<script setup>
import { getFireReviewList } from '@/apis/index.js'
import SelectTags from '@/component/SelectTags/index.vue'
import { computed, createVNode, onMounted, ref ,reactive,toRaw} from 'vue'
import PoliceEntryDetail from '@/views/policeEntryDetail/index.vue';
import ApplyReject from "./apply-reject.vue";
import ApplyRecheck from "@/views/policeManageList/apply-recheck.vue";
import { getLastMonth,checkRejectState } from '@/utils/tools.js'
import { MSG_LOCKING_TEXT, isNot } from '@/utils/constants.js';
import { generateColorByState } from "@/utils/tools.js";
import SelectMore from "@/component/SelectMore/index";
import { getFireWarningSupervision } from '@/apis/index.js'
import { formatYmdHm } from "@/utils/format.js";
import { showDialog, showToast, showLoadingToast, closeToast } from 'vant';
import store from '@/store/index.js'

const menus = [
  // {
  //   label: '作废警情',
  //   key: 'cancelFlag',
  // },
  {
    label: '跨省警情',
    key: 'crossProvinceFlag',
  },
  {
    label: '跨市警情',
    key: 'crossCityFlag',
  },
  {
    label: '驳回过的警情',
    key: 'rejectFlag',
  },
  {
    label: '5队及以上出动警情',
    key: 'largeDispatchFlag',
  },
  {
    label: '指挥部出动警情',
    key: 'headFlag',
  },
  {
    label: '重要信息更正警情',
    key: 'importantWarningFlag',
  },
  {
    label: '百人及以上出动警情',
    key: 'largePeopleFlag',
  },
]
const searchOptions = computed(()=>([
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
    value: 'createUserOrg',
  },
  {
    title: '行政区域',
    type: 'select-area',
    placeholder: '请选择行政区域',
    value: 'boAreaId',
  },
  {
    title: '警情地址',
    type: 'input',
    placeholder: '请输入警情地址',
    value: "warningAddr",
  },
]))
const currentRow = ref({})
const proListRef = ref(null);
const defaultFilterValue = {
  tags: [],
  time: getLastMonth(),
  createUserOrg: [],
}

const show = ref({})
const tabType = ref('running')
const refreshCallback = () => {
  proListRef.value.filter()
}
const onSearchConfirm = () => {
  showLoadingToast();
  proListRef.value.filter().then((res) => {
    closeToast();
  });
}
const handleLook = (row) => {
  currentRow.value = row
  show.value.lookVisible = true
}

const handleItem = (row) => {
  currentRow.value = row
  show.value.lookVisible = true
};

const handleReject = (row) => {
  if (!row.permission) {
    showDialog({ message: `警情状态为已发送，且没有申请更正/申请作废，才允许驳回！` })
    return
  }
  if (row.isLock === '1') {
    showToast(MSG_LOCKING_TEXT)
    return
  }
  currentRow.value = row
  show.value.rejectVisible = true
}
const finishCallback = () => {
  currentRow.value = null
  proListRef.value.filter()
}

const onTimeChange = (value) => {
  showLoadingToast();
  proListRef.value.filter().then((res) => {
    closeToast();
  });
};

const selectTagsCallback = (selects) => {
  proListRef.value.query.tags = selects
  onSearchConfirm()
  finishCallback()
}

const permissionMap = store?.getters?.['userInfo/permission'] || {}

const applyTypeFlag = computed(() => {
  const data = []
  if(permissionMap?.['admin'] || permissionMap?.['police-supervision:back']){
    data.push('1')
  }
  if(permissionMap?.['admin'] || permissionMap?.['police-supervision:common-back']){
    data.push('2')
  }
  return data
})
</script>

<style lang="scss" scoped>
.police-supervision {
}
.list-tabs1 {
  display: flex;
  padding: 10px 12px 0 12px;
}
.item-collect {
  font-size: 20px;
  margin-right: auto;
}
.select_tags {
  margin-top: 10px;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
