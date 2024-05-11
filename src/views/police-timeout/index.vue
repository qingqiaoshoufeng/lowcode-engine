<template>
  <div class="police-timeout">
    <ProList
      showExplain
      ref="proListRef"
      :defaultFilterValue="defaultFilterValue"
      :getListFn="getPoliceTimeout"
      title="警情超时统计"
      :showExplainFn="showExplainFn"
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
            <div class="item-field-label">超时类型：</div>
            <div>{{ record.timeoutType }}</div>
          </div>
          <div class="item-field">
            <img style="width: 13px; height: 15px; margin-right: 8px" src="../../assets/images/icon-time@2x.png" alt="" />
            <div class="item-field-label">超期时长：</div>
            <div class="flex">
              <span class="info">{{ record.timeoutTimeValue }}</span>
              <van-icon @click.stop="handleReason(record)" v-if="record.timeoutReason" name="comment-o" />
            </div>
          </div>
          <div class="item-line" />
          <div class="item-operate" @click.stop>
            <!-- <van-button
              v-p="['admin', 'police-timeout:look']"
              type="link"
              size="mini"
              color="#1989fa"
              class="item-btn"
              @click="handleLook(record)"
            >
              查看
            </van-button> -->
            <van-button
              size="mini"
              color="#1989fa"
              class="item-btn"
              type="link"
              @click="handleRemark(record)"
            >
              备注
            </van-button>
          </div>
        </div>
      </template>
    </ProList>
    <!-- 超时原因 -->
    <ProModal
      v-model:visible="show.reasonVisible"
      :showBack="true"
      :showHeader="false"
      title="超时原因详情"
    >
      <template v-slot="{setHandleOk}">
        <LookReason
          :data-type="1"
          :current-row="currentRow"
          :set-handle-ok="setHandleOk"
          v-if="show.reasonVisible"
        />
      </template>
    </ProModal>
    <!-- 填写超时原因 -->
    <ProModal
      v-model:visible="show.remarkVisible"
      :showConfirmBack="true"
      :showHeader="false"
      title="超时原因"
    >
      <template v-slot="{setHandleOk}">
        <RemarkReason
          :data-type="1"
          :current-row="currentRow"
          :set-handle-ok="setHandleOk"
          @finish-callback="finishCallback"
          v-if="show.remarkVisible"
        />
      </template>
    </ProModal>
    <!-- 规则查看 -->
    <DialogInfo :showConfirmButton="false" :showCancelButton="false" v-model:visible="show.regularVisible" title="规则说明">
      <RegularLook :type="1" />
    </DialogInfo>
    <!-- 警情详情 -->
    <ProModal v-model:visible="show.lookVisible" :showBack="true" :showHeader="false" title="警情详情">
      <PoliceEntryDetail :current-row="currentRow" />
    </ProModal>
  </div>
</template>
  
<script setup>
import SelectTags from '@/component/SelectTags/index.vue'
import { computed, createVNode, onMounted, ref ,reactive,toRaw} from 'vue'
import PoliceEntryDetail from '@/views/policeEntryDetail/index.vue';
import RegularLook from '@/views/police-timeout/regular-look.vue';
import RemarkReason from '@/views/police-timeout/remark-reason.vue';
import LookReason from '@/views/police-timeout/look-reason.vue';
import ApplyRecheck from "@/views/policeManageList/apply-recheck.vue";
import { getLastMonth,checkRejectState } from '@/utils/tools.js'
import { MSG_LOCKING_TEXT, isNot } from '@/utils/constants.js';
import { generateColorByState } from "@/utils/tools.js";
import SelectMore from "@/component/SelectMore/index";
import { getPoliceTimeout } from '@/apis/index.js'
import { formatYmdHm } from "@/utils/format.js"; 
import { showToast,showLoadingToast,closeToast } from 'vant';
import store from '@/store/index.js'

const getSystemDictSync = store.getters['dict/getSystemDictSync']

const options = {}

getSystemDictSync(['JQ_TYPE', 'JQ_TIMEOUT_TYPE'], null, (res) => {
  options.warningType = res.JQ_TYPE
  options.timeOutType = res.JQ_TIMEOUT_TYPE
}, 3)

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
    title: '超时时长',
    type: 'input-range',
    placeholder: ['请输入超时时长（小时）','请输入超时时长（小时）'],
    value: ['timeoutStart','timeoutEnd'],
  },
  {
    title: '警情类型',
    type: 'cascader',
    placeholder: '请选择警情类型',
    fieldNames: { value: 'boDictId', text: 'dictName' },
    options: options.warningType,
    value: 'warningType',
  },
  {
    title: '超时类型',
    type: 'select-single',
    placeholder: '请选择超时类型',
    options: options.timeOutType,
    fieldNames:{ value: 'dictName', label: 'dictName' },
    value: 'timeOutType',
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
  onlyMy: false,
  time: getLastMonth(),
  createUserOrg: [],
  timeoutStart: '',
  timeoutEnd: '',
  timeout:[],
  warningType: undefined,
  timeOutType: undefined,
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

const showExplainFn = ()=>{
  show.value.regularVisible = true
}
const selectTagsCallback = (selects) => {
  proListRef.value.query.tags = selects
  onSearchConfirm()
  finishCallback()
}

const onTimeChange = (value) => {
  showLoadingToast();
  proListRef.value.filter().then((res) => {
    closeToast();
  });
};

const handleRemark = (row) => {
  currentRow.value = row
  show.value.remarkVisible = true
}

const handleReason = (row) => {
  currentRow.value = row
  show.value.reasonVisible = true
}
</script>

<style lang="scss" scoped>
.police-timeout {
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
  border-top: 10px solid #fff;
}
</style>
