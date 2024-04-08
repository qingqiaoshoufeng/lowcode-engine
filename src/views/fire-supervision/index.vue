<template>
  <div class="police-supervision">
    <ProList
      ref="proListRef"
      :defaultFilterValue="defaultFilterValue"
      :getListFn="getFireSupervisionList"
      title="火灾质量监督"
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
            <div class="item-title">{{ record.warningAddr }}</div>
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
            <div class="item-field-label">稽查标签：</div>
            <div>{{ record.auditLabel }}</div>
          </div>
          <div class="item-field">
            <img style="width: 13px; height: 15px; margin-right: 8px" src="../../assets/images/icon_power@2x.png" alt="" />
            <div class="item-field-label">责任区大队：</div>
            <div>{{ record.areaDutyGroupName }}</div>
          </div>
          <!-- <div class="item-field">
            <img style="width: 13px; height: 15px; margin-right: 8px" src="../../assets/images/icon-time@2x.png" alt="" />
            <div class="item-field-label">起火场所：</div>
            <div>{{ record.firePlaceValue }}</div>
          </div> -->
          <div class="item-line" />
          <div class="item-operate" @click.stop>
            <!-- <van-button
              v-p="['admin', 'fire-supervision:look']"
              type="link"
              size="mini"
              color="#1989fa"
              class="item-btn"
              @click="handleLook(record)"
            >
              查看
            </van-button> -->
            <van-button
              v-p="['admin', 'fire-supervision:back']"
              size="mini"
              color="#1989fa"
              class="item-btn"
              :disabled="!checkInputRejectState(record.fireStatusValue)"
              type="link"
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
          type="3"
          :current-row="currentRow"
          :set-handle-ok="setHandleOk"
          :finish-callback="finishCallback"
        />
      </template>
    </ProModal>
    <!-- 查看详情 -->
    <ProModal
      v-model:visible="show.lookVisible"
      title="火灾填报详情"
      :showBack="true" :showHeader="false" 
      :ok-display="false"
      :footer="null"
      pro-card-id="card-wrap"
    >
      <EditorForm :current-row="currentRow" :is-detail="true" />
    </ProModal>
  </div>
</template>
  
<script setup>
import { getFireReviewList } from '@/apis/index.js'
import SelectTags from '@/component/SelectTags/index.vue'
import { computed, createVNode, onMounted, ref ,reactive,toRaw} from 'vue'
import ApplyReject from "@/views/police-supervision/apply-reject.vue";
import { getLastMonth,checkRejectState } from '@/utils/tools.js'
import { MSG_LOCKING_TEXT, isNot } from '@/utils/constants.js';
import { generateColorByState ,checkInputRejectState} from "@/utils/tools.js";
import SelectMore from "@/component/SelectMore/index";
import { getFireSupervisionList } from '@/apis/index.js'
import { formatYmdHm } from "@/utils/format.js";
import EditorForm from '@/views/fire-report/components/EditorForm.vue'
import { showToast,showLoadingToast,closeToast } from 'vant';
import { useModal } from '@/hooks/useModal.js'

const menus = [
  {
    label: '亡人火灾',
    key: 'deadFire',
  },
  {
    label: '重要信息更正火灾',
    key: 'recheckFire',
  },
  {
    label: '驳回过的火灾',
    key: 'rejectFire',
  },
  {
    label: '过火面积超100平方的建构筑轻微火灾',
    key: 'buildingsBurnedArea',
  },
  {
    label: '过火面积超500平方的非建构筑火灾',
    key: 'nonBuildingsBurnedArea',
  },
  {
    label: '到场实施处置但现场处置费用为0的火灾',
    key: 'disposeButCostZero',
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
    title: '行政区域',
    type: 'select-area',
    placeholder: '请选择行政区域',
    value: 'boAreaId',
  },
  {
    title: '火灾地址',
    type: 'input',
    placeholder: '请输入火灾地址',
    value: "fireDirection",
  },
]))

const currentRow = ref({})

const proListRef = ref(null);

const defaultFilterValue = {
  tags: [],
  time: getLastMonth(),
  queryOrd: [],
}

const { show } = useModal();

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
  // finishCallback()
}
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
