<template>
  <div class="fire-timeout">
    <ProList
      ref="proListRef"
      :defaultFilterValue="defaultFilterValue"
      :getListFn="getFireTimeout"
      title="火灾超时统计"
      showExplain
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
          <div v-if="record.warningTypeValue" class="item-type">
            <span>{{ record.warningTypeValue }}</span>
          </div>
          <div class="item-field">
            <img 
              style="width: 13px; height: 15px; margin-right: 8px" 
              src="../../assets/images/icon-time@2x.png" alt="" />
            <div class="item-field-label">起火时间：</div>
            <div>{{ formatYmdHm(record.fireDate) }}</div>
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
            <div>{{ record.overTimeType }}</div>
          </div>
          <div class="item-field">
            <img style="width: 13px; height: 15px; margin-right: 8px" src="../../assets/images/icon-time@2x.png" alt="" />
            <div class="item-field-label">超期时长：</div>
            <div class="flex">
              <span class="info">{{ record.overTimeHoursValue }}</span>
              <van-icon @click.stop="handleReason(record)" v-if="record.overTimeReason" name="comment-o" />
            </div>
          </div>
          <div class="item-line" />
          <div class="item-operate" @click.stop>
            <!-- <van-button
              v-p="['admin', 'fire-timeout:look']"
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
          :data-type="3"
          :current-row="currentRow"
          :set-handle-ok="setHandleOk"
          v-if="show.reasonVisible"
        />
      </template>
    </ProModal>
    <!-- 规则查看 -->
    <DialogInfo :showConfirmButton="false" :showCancelButton="false" v-model:visible="show.regularVisible" title="规则说明">
      <RegularLook :type="3" />
    </DialogInfo>
    <!-- 填写超时原因 -->
    <ProModal
      v-model:visible="show.remarkVisible"
      :showConfirmBack="true"
      :showHeader="false"
      title="超时原因"
    >
      <template v-slot="{setHandleOk}">
        <RemarkReason
          :data-type="3"
          :current-row="currentRow"
          :set-handle-ok="setHandleOk"
          @finish-callback="finishCallback"
          v-if="show.remarkVisible"
        />
      </template>
    </ProModal>
    <!-- 警情详情 -->
    <ProModal v-model:visible="show.lookVisible" :showBack="true" :showHeader="false" title="火灾详情">
      <EditorForm
        :is-detail="true"
        :current-row="currentRow"
      />
    </ProModal>
  </div>
</template>
  
<script setup>
import { computed, createVNode, onMounted, ref ,reactive,toRaw} from 'vue'
import RemarkReason from '@/views/police-timeout/remark-reason.vue';
import EditorForm from '@/views/fire-report/components/EditorForm.vue'
import LookReason from '@/views/police-timeout/look-reason.vue';
import { getLastMonth,checkRejectState } from '@/utils/tools.js'
import { MSG_LOCKING_TEXT, isNot } from '@/utils/constants.js';
import { generateColorByState } from "@/utils/tools.js";
import RegularLook from '@/views/police-timeout/regular-look.vue';
import SelectMore from "@/component/SelectMore/index"; 
import { getFireTimeout } from '@/apis/index.js'
import { formatYmdHm } from "@/utils/format.js";
import { showToast,showLoadingToast,closeToast } from 'vant';
import store from '@/store/index.js'
const getSystemDictSync = store.getters['dict/getSystemDictSync']
const options = {}
getSystemDictSync(['JQ_TYPE', 'HZ_TIMEOUT_TYPE'], null, (res) => {
  options.timeOutType = res.HZ_TIMEOUT_TYPE
  options.fireType = res?.JQ_TYPE?.filter(item => item.dictName === '火灾扑救') // 火灾类型
}, true)
onMounted(() => {
})
const showExplainFn = ()=>{
  show.value.regularVisible = true
}
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
    title: '火灾编号',
    type: 'input',
    placeholder: '请输入出动编号',
    value: "fireCode",
  },
  {
    title: '所属队伍',
    type: 'select-org',
    placeholder: '请选择所属队伍',
    params: { permission: true },
    single: true,
    selectLeaf: false,
    headersDisabled: true,
    value: 'unit',
  },
  {
    title: '超时时长',
    type: 'input-range',
    placeholder: ['请输入超时时长（小时）','请输入超时时长（小时）'],
    value: ['timeOutHoursStart','timeOutHoursEnd'],
  },
  {
    title: '火灾类型',
    type: 'cascader',
    placeholder: '请选择警情类型',
    fieldNames: { value: 'boDictId', text: 'dictName' },
    options: options.fireType,
    value: 'fireType',
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
    value: 'warningArea',
  },
  {
    title: '火灾地址',
    type: 'input',
    placeholder: '请输入警情地址',
    value: "fireDirection",
  },
]))
const currentRow = ref({})
const proListRef = ref(null);
const defaultFilterValue = {
  time: getLastMonth(),
  unit: [],
  timeOutHoursStart: '',
  timeOutHoursEnd: '',
  fireType: undefined,
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

const onTimeChange = (value) => {
  showLoadingToast();
  proListRef.value.filter().then((res) => {
    closeToast();
  });
};

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
const selectTagsCallback = (selects) => {
  proListRef.value.query.tags = selects
  onSearchConfirm()
  finishCallback()
}

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
  .fire-timeout {
  }
  .list-tabs1 {
    display: flex;
    padding: 10px 12px 0 12px;
  }
  .item-collect {
    font-size: 20px;
    margin-right: auto;
  }
  .select_tags{
    border-top: 10px solid #fff;
  }
</style>