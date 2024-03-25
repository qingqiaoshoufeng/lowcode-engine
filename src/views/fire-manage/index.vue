<template>
  <div class="fire-manage">
    <ProList
        ref="proListRef"
        title="火灾管理"
        :defaultFilterValue="defaultFilterValue"
        :getListFn="getFireManageList"
        :tabs="tabs"
        :onTabFn="onTabChangeFn"
      >
      <template #search="{ tabsActive, filterFormState, resetForm }">
        <div class="list-tabs1" v-if="tabsActive === 1 || tabsActive === 2">
          <SelectTime
            v-model:value="filterFormState.time"
            title="选择时间"
            @change="onTimeChange"
          />
          <SelectMore
            v-if="options.fireCause"
            :options="searchOptions"
            :reset-fn="resetForm"
            @confirmCallback="onSearchConfirm"
          />
        </div>
      </template>
        <template #list="{ record }">
          <div class="pro-list-item" @click.stop="handleLook(record)">
            <div class="item-header">
              <div class="item-title">{{ record.warningName }}</div>
              <div class="item-state" :class="generateColorByState(record.fireStatusValue)">
                {{ record.fireStatusValue }}
              </div>
            </div>
            <div v-if="renderFirePlace(record)" class="item-type">
              <span>{{ renderFirePlace(record) }}</span>
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
              <img style="width: 13px; height: 15px; margin-right: 8px" src="../../assets/images/icon_power@2x.png" alt="" />
              <div class="item-field-label">责任区大队：</div>
              <div>{{ record.areaDutyGroupName }}</div>
            </div>
            <div class="item-field">
              <img style="width: 13px; height: 15px; margin-right: 8px" src="../../assets/images/icon_menu@2x.png" alt="" />
              <div class="item-field-label">起火场所：</div>
              <div>{{ record.firePlaceValue }}</div>
            </div>
            <!-- <div class="item-field">
              <img style="width: 13px; height: 15px; margin-right: 8px" src="../../assets/images/icon-time@2x.png" alt="" />
              <div class="item-field-label">起火场所：</div>
              <div>{{ record.firePlaceValue }}</div>
            </div> -->
            <div class="item-line" />
            <div class="item-operate" @click.stop>
              <van-icon
                name="star"
                v-if="record.focusStatus === '1'"
                style="color: #fed547"
                class="item-collect"
                @click="handleCollect(record, false)"
              />
              <van-icon
                name="star-o"
                v-else
                class="item-collect"
                @click="handleCollect(record, true)"
              />
              <!-- <van-button
                v-p="['admin', 'fire-report:look']"
                type="success"
                size="mini"
                color="#1989fa"
                class="item-btn"
                @click.stop="handleLook(record)"
              >
                查看
              </van-button> -->
              <van-button
                v-p="['admin', 'fire-report:look']"
                type="success"
                size="mini"
                color="#1989fa"
                class="item-btn"
                @click.stop="handleRecheck(record)"
                :disabled="!checkFireChangeState(record.fireStatusValue, record.updatePermission)"

              >
               申请更正
              </van-button>
            </div>
          </div>
        </template>
    </ProList>
    <ProModal  v-model:visible="show.editVisible" title="火灾填报">
      <template #default="{ setHandleOk, setHandleExtend }">
          <EditorForm
            :is-edit="isEdit"
            :current-row="currentRow"
            :relevance-draft="relevanceDraft"
            :show-draft="isDraft"
            :set-handle-ok="setHandleOk"
            :set-handle-extend="setHandleExtend"
            @finish-callback="refreshCallback"
          />
        </template>
    </ProModal>
    <ProModal
      v-model:visible="show.lookVisible"
      :showBack="true" :showHeader="false" 
      title="火灾详情"
      :ok-display="false"
      :footer="null"
      pro-card-id="card-wrap"
    >
      <EditorForm :current-row="currentRow" :is-detail="true" />
    </ProModal>
    <!-- 申请更正 -->
    <ProModal v-model:visible="show.recheckVisible" title="申请更正">
      <template #default="{ setHandleOk }">
        <ApplyRecheck
          :recheck-type="3"
          :current-row="currentRow"
          :set-handle-ok="setHandleOk"
          @finish-callback="refreshCallback"
        />
      </template>
    </ProModal>
  </div>
</template>
  
<script setup>
import {  
  // deleteFireReportDraft, 
  getFireWarningTag,
  collectFireWarning,
  getFireManageList } from '@/apis/index.js'
import { computed, createVNode, onMounted, ref ,reactive,toRaw} from 'vue'
import ApplyRecheck from "@/views/policeManageList/apply-recheck.vue";
import { getLastMonth,checkFireChangeState } from '@/utils/tools.js'
import { MSG_LOCKING_TEXT, isNot } from '@/utils/constants.js';
import { generateColorByState } from "@/utils/tools.js";
import SelectMore from "@/component/SelectMore/index";
import { formatYmdHm } from "@/utils/format.js";
import EditorForm from '@/views/fire-report/components/EditorForm.vue'
import { showToast, showLoadingToast, closeToast } from 'vant';
import store from '@/store/index.js'
const getSystemDictSync = store.getters['dict/getSystemDictSync']

const tabs = ref([
  {
    title: "辖区火灾",
    value: 1,
  },
  {
    title: "我的火灾",
    value: 2,
  },
  {
    title: "收藏的火灾",
    value: 3,
  },
]);
const options = ref({})
getSystemDictSync(['HZ_STATUS', 'HZ_INFO_HZDJ', 'HZ_QHYY', 'HZ_INFO_QY', 'HZ_INFO_JJLX', 'HZ_INFO_SGBM'], null, (res) => {
  options.value.fireStatus = res.HZ_STATUS
  options.value.fireLevel = res.HZ_INFO_HZDJ
  options.value.fireCause = toRaw(res.HZ_QHYY)
  options.value.area = res.HZ_INFO_QY
})
onMounted(() => {
  // 获取火灾标签
  getFireWarningTag({ tagType: 3 }).then((res) => {
    options.value.fireTags = res.data || []
    show.value.moreFilter = true
  })
  
})

const searchOptions = computed(()=>([
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
    options: options.value.fireStatus,
    fieldNames: { value: 'boDictId', label: 'dictName' },
    value: 'fireStatus',
  },
  {
    title: '火灾编号',
    type: 'input',
    placeholder: '请输入火灾编号',
    value: "fireCode",
  },
  {
    title: '警情编号',
    type: 'input',
    placeholder: '请输入警情编号',
    value: "warningCode",
  },
  {
    title: '是否轻微火灾',
    type: 'select-single',
    placeholder: '请选择是否轻微火灾',
    fieldNames: { value: 'value', label: 'label' },
    value: 'severity',
    options: isNot,
  },
  {
    title: '是否出动',
    type: 'select-single',
    placeholder: '请选择是否出动',
    fieldNames: { value: 'value', label: 'label' },
    value: 'isDispatch',
    options: isNot,
  },
  {
    title: '行政区域',
    type: 'select-area',
    placeholder: '请选择行政区域',
    value: 'warningArea',
  },
  {
    title: '火灾标签',
    type: 'select', 
    placeholder: '请选择火灾标签',
    fieldNames:{ label: 'tagName', value: 'boFireTagId' },
    value: 'fireInfoTag',
    options: options.value.fireTags,
  },
  {
    title: '所属队伍',
    type: 'select-org',
    placeholder: '请选择所属队伍',
    params: { permission: true },
    single: false,
    selectLeaf: false,
    headersDisabled: true,
    value: 'orgId',
  },
  {
    title: '火灾等级',
    type: 'select',
    placeholder: '请选择火灾等级',
    fieldNames:{ value: 'boDictId', label: 'dictName' },
    value: 'fireLevel',
    options: options.value.fireLevel,
  },
  {
    title: '起火原因',
    type: 'cascader',
    placeholder: '请选择起火原因',
    fieldNames: { value: 'boDictId', text: 'dictName' },
    options: options.value.fireCause,
    value: 'fireCause',
  },
  {
    title: '区域',
    type: 'cascader',
    placeholder: '请选择区域',
    fieldNames: { value: 'boDictId', text: 'dictName' },
    options: options.value.area,
    value: 'area',
  },
  {
    title: '火灾地址',
    type: 'input',
    placeholder: '请输入火灾地址',
    value: "fireDirection",
  },
  {
    title: '是否属于安全生产事故',
    type: 'select-single',
    placeholder: '请选择是否属于安全生产事故',
    fieldNames:{ value: 'value', label: 'label' },
    value: 'isSafetyAccident',
    options: isNot,
  },
  {
    title: '是否正在调查',
    type: 'select-single',
    placeholder: '请选择是否正在调查',
    fieldNames:{ value: 'value', label: 'label' },
    value: 'isResearch',
    options: isNot,
  },
]))
const currentRow = ref({})
const proListRef = ref(null);
const defaultFilterValue = {
  onlyMy: false,
  fireStatus: [],
  fireInfoTag: [],
  warningCode: '',
  warningArea: [],
  orgId: [],
  time: getLastMonth(),
  fireLevel: [],
  fireCause: null,
  area: null,
  warningArea:[],
}

const onTimeChange = (value) => {
  showLoadingToast();
  proListRef.value.filter().then((res) => {
    closeToast();
  });
};
const show = ref({})
const isEdit = ref(false)
const isDraft = ref(false)
const relevanceDraft = ref(null)
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
const handleCollect = async (row, state) => {
  const res = await collectFireWarning({
    focusAppid: row.boFireInfoId,
    focusCode: row.fireCode,
    focusType: '3',
    deleteFlag: state ? '1' : '2',
  })
  showToast(state ? '收藏成功' : '取消收藏成功')
  proListRef.value.filter()
}

// 火灾场所格式化
const renderFirePlace = (record) => {
  let prefix = ''
  if (record.fireTypeValue) {
    const types = record.fireTypeValue?.split('/')
    prefix = `${types[types.length - 1]}${record.firePlaceValue ? '/' : ''}`
  }
  return `${prefix}${record.firePlaceValue}`
}
// 查询辖区火灾
const getPrefectureFire = ()=>{
  proListRef.value.query = defaultFilterValue
  proListRef.value.query.onlyMy = false
  proListRef.value.query.unEditFlag = false
  proListRef.value.query.myCollect = false
  
  proListRef.value.filter()
}
// 查询我的火灾
const handleMyFire = () => {
  proListRef.value.query = {
    onlyMy: true,
    time: getLastMonth(), 
    unEditFlag: false,
    orgId: [],
  }
  proListRef.value.filter()
}
// 查询收藏的火灾
const handleMyCollect = () => {
  proListRef.value.query = {
    onlyMy: false,
    myCollect: true,
    orgId: [],
  }
  proListRef.value.filter()
}
// 申请更正
const handleRecheck = (row) => {
  if (row.isLock === '1') {
    showToast(MSG_LOCKING_TEXT)
    return
  }
  currentRow.value = row
  show.value.recheckVisible = true
}
// tab切换
const onTabChangeFn = (val,val1)=>{
  const getMap = ['',getPrefectureFire,handleMyFire,handleMyCollect]
  getMap[val]()
}
const handleItem = (record)=>{
  // selectVisible
}
</script>

<style lang="scss" scoped>
.fire-manage {
}
.list-tabs1 {
  display: flex;
  padding: 10px 12px 0 12px;
}
.item-collect {
  font-size: 20px;
  margin-right: auto;
}
</style>
