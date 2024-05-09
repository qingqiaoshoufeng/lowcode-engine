<template>
  <div class="police-timeout">
    <ProList
      ref="proListRef"
      :defaultFilterValue="defaultFilterValue"
      :getListFn="getUnworkTimeout"
      title="未填报队站统计"
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
        <div class="pro-list-item">
          <div class="item-header">
            <div class="item-title">{{ record.name }}</div>
            <div class="item-state mw-90" :class="generateColorByState(record.warningStatusValue)">
              {{ record.deptNatureValue }}
            </div>
          </div>
          <!-- <div class="item-type">
            <span>{{ record.warningTypeValue }}</span>
          </div> -->
          <div class="item-field">
            <img 
              style="width: 13px; height: 15px; margin-right: 8px" 
              src="../../assets/images/icon_power@2x.png" alt="" />
            <div class="item-field-label">上级大队：</div>
            <div>{{ record.parentFireBrigadeName }}</div>
          </div>
          <div class="item-field">
            <img style="width: 13px; height: 15px; margin-right: 8px" src="../../assets/images/icon_power@2x.png" alt="" />
            <div class="item-field-label">上级支队：</div>
            <div>{{ record.parentFireDetachmentName }}</div>
          </div>
          <div class="item-field">
            <img style="width: 13px; height: 15px; margin-right: 8px" src="../../assets/images/icon-time@2x.png" alt="" />
            <div class="item-field-label">最近录入报告时间：</div>
            <div>{{ formatYmdHm(record.lastCommitDate) }}</div>
          </div>
        </div>
      </template>
    </ProList>
  </div>
</template>
  
<script setup>
import { getFireReviewList } from '@/apis/index.js'
import SelectTags from '@/component/SelectTags/index.vue'
import { computed, createVNode, onMounted, ref ,reactive,toRaw} from 'vue'
import PoliceEntryDetail from '@/views/policeEntryDetail/index.vue';
// import ApplyReject from "./apply-reject.vue";
import ApplyRecheck from "@/views/policeManageList/apply-recheck.vue";
import { getLastMonth,checkRejectState } from '@/utils/tools.js'
import { MSG_LOCKING_TEXT, isNot } from '@/utils/constants.js';
import { generateColorByState } from "@/utils/tools.js";
import SelectMore from "@/component/SelectMore/index";
import { getUnworkTimeout} from '@/apis/index.js'
import { formatYmdHm } from "@/utils/format.js";
import { showToast,showLoadingToast,closeToast } from 'vant';
import store from '@/store/index.js'
const getSystemDictSync = store.getters['dict/getSystemDictSync']
const options = {}
getSystemDictSync(['JQ_TYPE', 'JQ_TIMEOUT_TYPE'], null, (res) => {
  options.warningType = res.JQ_TYPE
  options.timeOutType = res.JQ_TIMEOUT_TYPE
}, true)
onMounted(() => {
})
const searchOptions = computed(()=>([
  {
    title: '选择时间',
    type: 'select-range',
    placeholder: '请选择时间',
    value: 'time',
  },
  {
    title: '所属队伍',
    type: 'select-org',
    placeholder: '请选择所属队伍',
    params: { permission: true },
    single: true,
    selectLeaf: false,
    headersDisabled: true, 
    value: 'xqOrgId',
  },
]))
const currentRow = ref({})
const proListRef = ref(null);
const defaultFilterValue = {
  statisticsDateType: '2',
  xqOrgId: [],
  time: [],
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

const finishCallback = () => {
  currentRow.value = null
  proListRef.value.filter()
}
</script>

<style lang="scss" scoped>
.police-timeout{
  .mw-90{
    max-width: 90px !important;
    width: 90px !important;
    text-align: right;
    justify-content: flex-end;
  }
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